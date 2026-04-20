import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import asyncio
import websockets

User = get_user_model()
u1, _ = User.objects.get_or_create(username='tester1')
token = str(RefreshToken.for_user(u1).access_token)

async def test_ws():
    uri = f"ws://localhost:8005/ws/chat/1/?token={token}"
    async with websockets.connect(uri) as websocket:
        print("Connected!")
        # First message is usually the 'online' status.
        print("Recv 1:", await websocket.recv())
        
        await websocket.send('{"action":"send_message", "message":"hello", "user_id":%s}' % u1.id)
        
        # Second should be the chat message itself
        print("Recv 2:", await websocket.recv())

asyncio.run(test_ws())
