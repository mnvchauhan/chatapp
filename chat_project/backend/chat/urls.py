from django.urls import path
from .views import RoomListView, RoomMessagesView

urlpatterns = [
    path('rooms/', RoomListView.as_view(), name='room_list'),
    path('rooms/<int:room_id>/messages/', RoomMessagesView.as_view(), name='room_messages'),
]
