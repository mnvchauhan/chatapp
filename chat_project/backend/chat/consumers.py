import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Room, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Broadcast user online status
        await self.channel_layer.group_send(
            self.room_group_name,
            {'type': 'user_status', 'status': 'online', 'user_id': self.scope['user'].id}
        )

    async def disconnect(self, close_code):
        # Broadcast user offline
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_send(
                self.room_group_name,
                {'type': 'user_status', 'status': 'offline', 'user_id': self.scope['user'].id}
            )
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'send_message':
            message = data['message']
            user_id = data['user_id']
            
            # Save message asynchronously
            msg_obj = await self.save_message(user_id, self.room_id, message)
            
            # Broadcast message
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'user_id': user_id,
                    'msg_id': msg_obj.id,
                    'timestamp': str(msg_obj.timestamp)
                }
            )
        elif action == 'typing':
            await self.channel_layer.group_send(
                self.room_group_name,
                {'type': 'user_typing', 'user_id': data['user_id'], 'is_typing': data['is_typing']}
            )

    # Handlers
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event.get('message', ''),
            'user_id': event['user_id'],
            'msg_id': event.get('msg_id', None),
            'timestamp': event['timestamp'],
            'file_url': event.get('file_url', None),
            'message_type': event.get('message_type', 'text')
        }))

    async def user_typing(self, event):
        await self.send(text_data=json.dumps({
            'type': 'typing',
            'user_id': event['user_id'],
            'is_typing': event['is_typing']
        }))

    async def user_status(self, event):
        await self.send(text_data=json.dumps({
            'type': 'status',
            'user_id': event['user_id'],
            'status': event['status']
        }))

    @database_sync_to_async
    def save_message(self, user_id, room_id, content):
        user = User.objects.get(id=user_id)
        room = Room.objects.get(id=room_id)
        return Message.objects.create(user=user, room=room, content=content)