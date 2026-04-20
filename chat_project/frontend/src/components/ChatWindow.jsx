import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { useChatWebSocket } from '../hooks/useWebSocket';
import { Hash, PlusCircle, Send, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function ChatWindow() {
  const { user } = useAuthStore();
  const { activeRoom, messages, typingUsers, onlineUsers, uploadFileMessage } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const { sendChatMessage, sendTypingStatus } = useChatWebSocket(activeRoom?.id);

  const activeTypers = (typingUsers[activeRoom?.id] || []).filter(id => id !== user.id);
  const otherUser = activeRoom && !activeRoom.is_group ? activeRoom.users.find(u => u.id !== user.id) : null;
  const roomName = activeRoom?.is_group ? activeRoom.name : (otherUser?.first_name ? `${otherUser.first_name} ${otherUser.last_name}` : otherUser?.username);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTypers, isUploading]);

  let typingTimeout = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    sendTypingStatus(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      sendTypingStatus(false);
    }, 2000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    sendChatMessage(inputValue);
    setInputValue('');
    sendTypingStatus(false);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeRoom) return;

    setIsUploading(true);
    try {
      await uploadFileMessage(activeRoom.id, file);
    } catch (error) {
      console.error("File upload failed", error);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderMessageContent = (msg) => {
    if (msg.file) {
      if (msg.message_type === 'image') {
        return (
          <div className="mt-2 max-w-sm rounded overflow-hidden">
            <img src={msg.file} alt="attachment" className="max-w-full h-auto object-cover rounded shadow-md border border-[var(--discord-bg-tertiary)]" />
          </div>
        );
      } else {
        return (
          <div className="mt-2 flex items-center bg-[#2B2D31] border border-[var(--discord-divider)] rounded p-3 w-max max-w-sm hover:bg-[#313338] transition cursor-pointer">
            <div className="w-10 h-10 bg-[var(--discord-bg-tertiary)] flex items-center justify-center rounded shrink-0">
              <FileText size={24} className="text-[var(--discord-text-normal)]" />
            </div>
            <div className="ml-3 min-w-0 pr-4 flex-col flex">
              <a href={msg.file} target="_blank" rel="noopener noreferrer" className="text-[var(--discord-accent)] hover:underline truncate text-sm font-medium">
                {msg.file.split('/').pop() || 'Download Attachment'}
              </a>
              <span className="text-xs text-[var(--discord-text-muted)] mt-0.5">Click to view or download</span>
            </div>
          </div>
        );
      }
    }
    
    return (
      <div className="text-[15px] text-[var(--discord-text-normal)] leading-tight whitespace-pre-wrap mt-1">
        {msg.content}
      </div>
    );
  };

  return (
    <div className={`flex flex-col flex-1 h-full w-full bg-[var(--discord-bg-primary)] ${!activeRoom ? 'hidden md:flex' : 'flex'}`}>
      
      {/* Header */}
      <div className="h-12 border-b border-[var(--discord-bg-tertiary)] flex items-center px-4 shrink-0 shadow-sm z-10 w-full bg-[var(--discord-bg-primary)]">
        <Hash size={24} className="text-[var(--discord-text-muted)] mr-2" />
        <h3 className="font-bold text-[var(--discord-text-header)] text-[15px]">{roomName || 'unnamed'}</h3>
        {activeTypers.length > 0 && (
          <span className="text-xs text-[var(--discord-text-muted)] ml-4 italic">typing...</span>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-6 pb-4">
        {messages.map((msg, index) => {
          const isSameUserAsPrev = index > 0 && messages[index - 1].user.id === msg.user.id;
          
          return (
            <div key={msg.id || index} className={`group flex hover:bg-[var(--discord-bg-modifier-hover)] rounded -mx-4 px-4 py-[2px] ${!isSameUserAsPrev ? 'mt-[16px]' : 'mt-0'}`}>
              
              {!isSameUserAsPrev ? (
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0 mt-1 cursor-pointer">
                  {msg.user.id === user.id ? 'ME' : 'U'}
                </div>
              ) : (
                <div className="w-10 flex-shrink-0 text-center opacity-0 group-hover:opacity-100 flex items-center justify-center mt-1">
                   <span className="text-[10px] text-[var(--discord-text-muted)] mt-[2px]">{msg.timestamp ? format(new Date(msg.timestamp), 'HH:mm') : ''}</span>
                </div>
              )}

              <div className="flex-1 ml-4 min-w-0 flex flex-col justify-center">
                {!isSameUserAsPrev && (
                  <div className="flex items-baseline space-x-2">
                    <span className="text-base font-medium text-[var(--discord-text-header)] hover:underline cursor-pointer">
                      {msg.user.id === user.id ? (user.first_name || user.username) : (otherUser?.first_name || otherUser?.username || 'User')}
                    </span>
                    <span className="text-xs font-medium text-[var(--discord-text-muted)]">
                      {msg.timestamp ? format(new Date(msg.timestamp), 'MM/dd/yyyy HH:mm') : '..'}
                    </span>
                  </div>
                )}
                {/* Render Text or Component */}
                {renderMessageContent(msg)}
              </div>
            </div>
          );
        })}
        {isUploading && (
           <div className="mt-4 flex items-center mb-2 px-2">
             <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             <span className="ml-3 text-sm text-[var(--discord-text-muted)]">Uploading attachment...</span>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="px-4 pb-6 pt-1 shrink-0 bg-[var(--discord-bg-primary)]">
        <form onSubmit={handleSend} className="bg-[var(--discord-bg-tertiary)] rounded-lg px-4 py-2.5 flex items-center w-full">
          {/* File Upload Trigger */}
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="text-[var(--discord-text-muted)] hover:text-[#dbdee1] transition shrink-0 bg-[var(--discord-bg-primary)] p-1 rounded-full flex items-center justify-center disabled:opacity-50"
            disabled={isUploading}
          >
            <PlusCircle size={22} />
          </button>
          
          {/* Hidden Input Component */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            className="hidden" 
          />
          
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-[var(--discord-text-normal)] px-4 placeholder-[var(--discord-text-muted)]"
            placeholder={`Message #${roomName || 'unnamed'}`}
            value={inputValue}
            onChange={handleInputChange}
            disabled={isUploading}
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isUploading}
            className="text-[var(--discord-text-muted)] hover:text-[var(--discord-accent)] disabled:opacity-50 transition shrink-0"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
