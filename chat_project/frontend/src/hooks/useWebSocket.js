import { useEffect, useRef, useCallback } from 'react';
import reactUseWebSocket from 'react-use-websocket';
const useWebSocket = reactUseWebSocket.default || reactUseWebSocket;
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

export const useChatWebSocket = (roomId) => {
  const { user } = useAuthStore();
  const token = localStorage.getItem('access');
  const { addMessage, setTyping, setUserStatus } = useChatStore();
  
  const socketUrl = roomId && token ? `ws://localhost:8005/ws/chat/${roomId}/?token=${token}` : null;

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 3000,
    reconnectAttempts: 10,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === 'message') {
        // Construct message object
        addMessage({
          id: data.msg_id || Math.random(),
          content: data.message || '',
          user: { id: data.user_id },
          file: data.file_url,
          message_type: data.message_type || 'text',
          timestamp: data.timestamp || new Date().toISOString(),
          is_read: false
        });
      } else if (data.type === 'typing') {
        setTyping(data.user_id, data.is_typing);
      } else if (data.type === 'status') {
        setUserStatus(data.user_id, data.status);
      }
    }
  }, [lastMessage, addMessage, setTyping, setUserStatus]);

  const sendChatMessage = useCallback((message) => {
    if (readyState === 1) {
      sendMessage(JSON.stringify({
        action: 'send_message',
        message,
        user_id: user?.id
      }));
    }
  }, [readyState, sendMessage, user]);

  const sendTypingStatus = useCallback((isTyping) => {
    if (readyState === 1) {
      sendMessage(JSON.stringify({
        action: 'typing',
        is_typing: isTyping,
        user_id: user?.id
      }));
    }
  }, [readyState, sendMessage, user]);

  return { sendChatMessage, sendTypingStatus, readyState };
};
