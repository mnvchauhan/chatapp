import { create } from 'zustand';
import api from '../lib/api';

export const useChatStore = create((set, get) => ({
  rooms: [],
  activeRoom: null,
  messages: [],
  typingUsers: {}, // Set of user_ids per room { room_id: [user_id] }
  onlineUsers: {}, // { user_id: 'online' | 'offline' }

  fetchRooms: async () => {
    const res = await api.get('chat/rooms/');
    set({ rooms: res.data });
  },

  setActiveRoom: async (room) => {
    set({ activeRoom: room, messages: [] });
    if (room) {
      const res = await api.get(`chat/rooms/${room.id}/messages/`);
      set({ messages: res.data.reverse() });
    }
  },

  createRoom: async (name, userIds, isGroup = false) => {
    const res = await api.post('chat/rooms/', { name, user_ids: userIds, is_group: isGroup });
    set((state) => ({ rooms: [res.data, ...state.rooms] }));
    return res.data;
  },

  uploadFileMessage: async (roomId, file, content = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('message_type', file.type.startsWith('image/') ? 'image' : 'file');
    if (content) formData.append('content', content);
    
    // Upload via REST
    const res = await api.post(`chat/rooms/${roomId}/messages/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  addMessage: (message) => {
    set((state) => {
      // Check if message already exists to prevent duplication
      const exists = state.messages.find(m => m.id && m.id === message.id);
      if (exists) return state;
      return { messages: [...state.messages, message] };
    });
  },

  setTyping: (userId, isTyping) => {
    set((state) => {
      const current = state.typingUsers[state.activeRoom?.id] || [];
      const updated = isTyping 
        ? [...new Set([...current, userId])]
        : current.filter(id => id !== userId);
      return { 
        typingUsers: { ...state.typingUsers, [state.activeRoom?.id]: updated } 
      };
    });
  },

  setUserStatus: (userId, status) => {
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [userId]: status }
    }));
  }
}));
