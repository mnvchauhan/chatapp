from rest_framework import serializers
from .models import Room, Message
from users.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ('id', 'room', 'user', 'content', 'file', 'message_type', 'timestamp', 'is_read')
        read_only_fields = ('id', 'timestamp')

class RoomSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ('id', 'name', 'is_group', 'users', 'created_at', 'last_message')

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-timestamp').first()
        if last_msg:
            return MessageSerializer(last_msg).data
        return None
