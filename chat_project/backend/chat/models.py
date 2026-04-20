from django.db import models
from django.conf import settings

class Room(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    is_group = models.BooleanField(default=False)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='rooms')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name or f"Room {self.id}"

class Message(models.Model):
    MESSAGE_TYPES = (
        ('text', 'Text'),
        ('image', 'Image'),
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='chat_files/', blank=True, null=True)
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES, default='text')
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp'] # Optimize queries by ordering at DB level