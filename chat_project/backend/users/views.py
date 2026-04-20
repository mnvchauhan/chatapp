from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Q
from .serializers import UserSerializer, RegisterSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class UserSearchView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if query:
            return User.objects.filter(
                Q(username__icontains=query) | 
                Q(first_name__icontains=query)
            ).exclude(id=self.request.user.id)[:10]
        return User.objects.none()
