import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from chat.serializers import RoomSerializer
from rest_framework.test import APIRequestFactory
from django.contrib.auth import get_user_model
from chat.views import RoomListView
User = get_user_model()
u1, _ = User.objects.get_or_create(username='tester1')
u2, _ = User.objects.get_or_create(username='tester2')

factory = APIRequestFactory()
request = factory.post('/api/chat/rooms/', {'name': '', 'user_ids': [u2.id], 'is_group': False}, format='json')
request.user = u1

view = RoomListView.as_view()
response = view(request)
print("Create Room Status:", response.status_code)
print("Create Room Data:", response.data)
