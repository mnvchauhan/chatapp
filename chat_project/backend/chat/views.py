from rest_framework import generics, permissions
from .models import Room, Message
from .serializers import RoomSerializer, MessageSerializer
from django.db.models import Count

class RoomListView(generics.ListCreateAPIView):
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.rooms.all().order_by('-created_at')

    def perform_create(self, serializer):
        # Create a new room
        room = serializer.save()
        # Add the creator
        room.users.add(self.request.user)
        # Add other users passed in request
        user_ids = self.request.data.get('user_ids', [])
        for user_id in user_ids:
            room.users.add(user_id)

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class RoomMessagesView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_id = self.kwargs['room_id']
        return Message.objects.filter(room_id=room_id).order_by('-timestamp')

    def perform_create(self, serializer):
        room_id = self.kwargs['room_id']
        msg = serializer.save(user=self.request.user, room_id=room_id)
        
        # Broadcast the new message via Channels
        channel_layer = get_channel_layer()
        # Prepare file URL fully resolving media
        file_url = self.request.build_absolute_uri(msg.file.url) if msg.file else None
        
        async_to_sync(channel_layer.group_send)(
            f"chat_{room_id}",
            {
                'type': 'chat_message',
                'message': msg.content or '',
                'user_id': msg.user.id,
                'msg_id': msg.id,
                'file_url': file_url,
                'message_type': msg.message_type,
                'timestamp': str(msg.timestamp)
            }
        )
