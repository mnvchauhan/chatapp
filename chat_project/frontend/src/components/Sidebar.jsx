import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { LogOut, Search, Settings, Hash } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import api from '../lib/api';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { rooms, activeRoom, setActiveRoom, createRoom } = useChatStore();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (search) {
      const delay = setTimeout(async () => {
        const res = await api.get(`users/search/?q=${search}`);
        setSearchResults(res.data);
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setSearchResults([]);
    }
  }, [search]);

  const handleCreateRoom = async (selectedUser) => {
    try {
      const existingRoom = rooms.find(
        (r) => !r.is_group && r.users.some((u) => u.id === selectedUser.id)
      );
      if (existingRoom) {
        setActiveRoom(existingRoom);
      } else {
        const newRoom = await createRoom('', [selectedUser.id], false);
        setActiveRoom(newRoom);
      }
      setSearch('');
      setSearchResults([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={`w-full md:w-[320px] flex-shrink-0 flex flex-col bg-[var(--discord-bg-secondary)] h-full ${activeRoom ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Search Header */}
        <div className="h-12 border-b border-[var(--discord-bg-tertiary)] flex items-center px-4 shadow-sm shrink-0">
          <div className="w-full bg-[var(--discord-bg-tertiary)] rounded flex items-center px-2 py-1">
            <Search size={14} className="text-[var(--discord-text-muted)] mr-2" />
            <input
              type="text"
              placeholder="Find or start a conversation"
              className="bg-transparent w-full outline-none text-sm text-[var(--discord-text-normal)] placeholder-[var(--discord-text-muted)] h-5"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List of Channels/Chats */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          {searchResults.length > 0 ? (
            <div>
              <div className="px-4 py-1 text-xs font-semibold text-[var(--discord-text-muted)] uppercase tracking-wider">Search Results</div>
              {searchResults.map((su) => (
                <div
                  key={su.id}
                  onClick={() => handleCreateRoom(su)}
                  className="mx-2 px-2 py-[6px] rounded flex items-center hover:bg-[var(--discord-bg-modifier-hover)] cursor-pointer group transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--discord-accent)] flex items-center justify-center text-white text-sm flex-shrink-0">
                    {su.username ? su.username.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="ml-3 truncate">
                    <span className="text-[var(--discord-text-normal)] group-hover:text-[var(--discord-text-header)] font-medium text-base">
                      {su.first_name ? `${su.first_name} ${su.last_name}` : su.username}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="px-4 pt-4 pb-1 text-[11px] font-bold text-[var(--discord-text-muted)] hover:text-[#dbdee1] transition uppercase tracking-wider">Direct Messages</div>
              {rooms.map((room) => {
                const otherUser = room.is_group ? null : room.users.find(u => u.id !== user?.id);
                const roomName = room.is_group ? room.name : (otherUser?.first_name ? `${otherUser.first_name} ${otherUser.last_name}` : otherUser?.username);
                const isActive = activeRoom?.id === room.id;

                return (
                  <div
                    key={room.id}
                    onClick={() => setActiveRoom(room)}
                    className={`mx-2 px-2 py-[6px] rounded flex items-center cursor-pointer group transition-colors mb-[2px] ${isActive ? 'bg-[var(--discord-bg-modifier-active)] text-white' : 'hover:bg-[var(--discord-bg-modifier-hover)] text-[var(--discord-text-muted)]'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--discord-bg-tertiary)] flex items-center justify-center text-[var(--discord-text-normal)] flex-shrink-0 relative overflow-hidden">
                       <Hash size={16} />
                    </div>
                    <div className="ml-3 flex-1 min-w-0 pr-1">
                      <div className={`font-medium text-base truncate ${isActive ? 'text-[#fff]' : 'group-hover:text-[var(--discord-text-normal)]'}`}>
                        {roomName || 'Unnamed'}
                      </div>
                      <div className="text-[13px] truncate text-[var(--discord-text-muted)] opacity-80 mt-[-2px]">
                        {room.last_message ? room.last_message.content : 'No messages'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* User Anchor Profile Bottom */}
        <div className="h-[52px] bg-[var(--discord-bg-tertiary)] shrink-0 flex items-center px-2 justify-between">
          <div className="flex items-center space-x-2 pl-1 cursor-pointer hover:bg-[var(--discord-bg-modifier-hover)] py-1 px-1 rounded transition max-w-[170px]">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white flex-shrink-0 text-sm font-semibold relative">
              {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
              <div className="absolute bottom-[-1px] right-[-1px] w-[11px] h-[11px] bg-green-500 rounded-full border-2 border-[var(--discord-bg-tertiary)]"></div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white tracking-tight truncate leading-tight">
                {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
              </span>
              <span className="text-[11px] text-[var(--discord-text-muted)] truncate leading-tight">Online</span>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <button 
              onClick={() => setShowProfileModal(true)} 
              className="p-1.5 text-[var(--discord-text-muted)] hover:text-[var(--discord-text-normal)] hover:bg-[var(--discord-bg-modifier-hover)] rounded"
              title="User Settings"
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={logout} 
              className="p-1.5 text-[var(--discord-text-muted)] hover:text-red-400 hover:bg-[var(--discord-bg-modifier-hover)] rounded"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {showProfileModal && (
        <ProfileSettings onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
}
