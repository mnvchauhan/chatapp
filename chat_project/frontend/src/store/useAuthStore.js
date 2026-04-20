import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  checkAuth: async () => {
    try {
      if (!localStorage.getItem('access')) {
        set({ user: null, isAuthenticated: false, loading: false });
        return;
      }
      const res = await api.get('users/me/');
      set({ user: res.data, isAuthenticated: true, loading: false });
    } catch (err) {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  updateProfile: async (data) => {
    const res = await api.patch('users/me/', data);
    set({ user: res.data });
  },

  login: async (username, password) => {
    const res = await api.post('users/login/', { username, password });
    localStorage.setItem('access', res.data.access);
    localStorage.setItem('refresh', res.data.refresh);
    set({ isAuthenticated: true });
    
    const userRes = await api.get('users/me/');
    set({ user: userRes.data });
  },

  logout: () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    set({ user: null, isAuthenticated: false });
  },

  register: async (userData) => {
    await api.post('users/register/', userData);
    const res = await api.post('users/login/', { 
        username: userData.username, 
        password: userData.password 
    });
    localStorage.setItem('access', res.data.access);
    localStorage.setItem('refresh', res.data.refresh);
    set({ isAuthenticated: true });

    const userRes = await api.get('users/me/');
    set({ user: userRes.data });
  }
}));
