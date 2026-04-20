import traceback
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
import jwt

User = get_user_model()

@database_sync_to_async
def get_user_from_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get('user_id')
        if user_id:
            return User.objects.get(id=user_id)
        return AnonymousUser()
    except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist) as e:
        print("JWT Auth Error:", str(e))
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            # Token from query string: ws://localhost:8000/ws/chat/1/?token=<jwt>
            query_string = scope.get('query_string', b'').decode('utf-8')
            token = None
            if 'token=' in query_string:
                token = query_string.split('token=')[1].split('&')[0]
            
            if token:
                scope['user'] = await get_user_from_token(token)
            else:
                scope['user'] = AnonymousUser()
        except Exception as e:
            traceback.print_exc()
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)

def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(inner)
