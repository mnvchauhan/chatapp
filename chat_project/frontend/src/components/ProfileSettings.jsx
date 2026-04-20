import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { X } from 'lucide-react';

export default function ProfileSettings({ onClose }) {
  const { user, updateProfile } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await updateProfile({ first_name: firstName, last_name: lastName });
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-[var(--discord-bg-primary)] animate-fade-in w-full h-full overflow-hidden">
      
      {/* Left Sidebar Pane */}
      <div className="w-[30%] lg:w-[25%] bg-[var(--discord-bg-secondary)] h-full overflow-y-auto no-scrollbar flex flex-col items-end pr-3 py-16">
        <div className="w-full max-w-[200px] flex flex-col space-y-2">
          <div className="px-2 pb-1 text-xs font-bold text-[var(--discord-text-muted)] uppercase cursor-default">User Settings</div>
          <button className="px-2 py-1.5 rounded bg-[var(--discord-bg-modifier-active)] text-white text-left text-sm font-medium transition cursor-pointer">
            My Account
          </button>
          <div className="px-2 py-1.5 rounded text-[var(--discord-text-normal)] hover:bg-[var(--discord-bg-modifier-hover)] text-left text-sm font-medium transition cursor-pointer">
            Profiles
          </div>
          <div className="px-2 py-1.5 rounded text-[var(--discord-text-normal)] hover:bg-[var(--discord-bg-modifier-hover)] text-left text-sm font-medium transition cursor-pointer">
            Privacy & Safety
          </div>
          <div className="my-2 border-t border-[var(--discord-divider)] w-full"></div>
          <div className="px-2 pb-1 text-xs font-bold text-[var(--discord-text-muted)] uppercase cursor-default">App Settings</div>
          <div className="px-2 py-1.5 rounded text-[var(--discord-text-normal)] hover:bg-[var(--discord-bg-modifier-hover)] text-left text-sm font-medium transition cursor-pointer">
            Appearance
          </div>
          <div className="px-2 py-1.5 rounded text-[var(--discord-text-normal)] hover:bg-[var(--discord-bg-modifier-hover)] text-left text-sm font-medium transition cursor-pointer">
            Notifications
          </div>
        </div>
      </div>

      {/* Right Content Pane */}
      <div className="w-[70%] lg:w-[75%] bg-[var(--discord-bg-primary)] h-full relative overflow-y-auto flex">
        <div className="w-full max-w-[750px] pl-10 pr-[100px] py-16">
          <h2 className="text-xl font-bold text-[var(--discord-text-header)] mb-6">My Account</h2>
          
          <div className="bg-[var(--discord-bg-tertiary)] rounded-lg overflow-hidden relative shadow-lg">
            {/* Banner */}
            <div className="h-28 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            {/* Action Row & Info Card */}
            <div className="p-4 pt-16 relative bg-[#2B2D31] m-4 mt-12 rounded flex flex-col">
              {/* Floating Avatar */}
              <div className="absolute -top-12 left-4 p-1.5 bg-[var(--discord-bg-tertiary)] rounded-full">
                <div className="w-[84px] h-[84px] rounded-full bg-[var(--discord-accent)] flex items-center justify-center text-white text-3xl font-bold border-1 overflow-hidden shadow-xl">
                  {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
                </div>
              </div>

              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-[var(--discord-text-header)] tracking-wide">
                    {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
                  </span>
                  <span className="text-sm text-[var(--discord-text-muted)]">
                    {user?.username}
                  </span>
                </div>
              </div>

              {/* Form Box */}
              <div className="mt-8 bg-[#1e1f22] p-4 rounded-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-md text-sm text-center">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-[var(--discord-text-muted)] uppercase mb-2">Display Name (First)</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-[#111214] text-[var(--discord-text-normal)] px-3 py-2.5 rounded focus:ring-2 focus:ring-[var(--discord-accent)] outline-none transition"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-[var(--discord-text-muted)] uppercase mb-2">Display Name (Last)</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-[#111214] text-[var(--discord-text-normal)] px-3 py-2.5 rounded focus:ring-2 focus:ring-[var(--discord-accent)] outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col mt-4">
                    <label className="text-xs font-bold text-[var(--discord-text-muted)] uppercase mb-2">Username</label>
                    <input
                      type="text"
                      disabled
                      value={user?.username || ''}
                      className="bg-[#111214] border-none text-[var(--discord-text-muted)] px-3 py-2.5 rounded opacity-70 cursor-not-allowed outline-none"
                    />
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-[var(--discord-divider)] mt-6 pt-4 flex justify-end gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[var(--discord-accent)] hover:bg-[var(--discord-accent-hover)] text-white px-6 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-[var(--discord-divider)] pt-8">
             <h3 className="text-[var(--discord-text-header)] font-semibold text-lg mb-2">Account Removal</h3>
             <p className="text-[var(--discord-text-muted)] text-sm mb-4">Disabling your account means you can recover it at any time after taking this action.</p>
             <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium text-sm rounded transition border border-red-500/50 hover:border-red-500/80">
               Disable Account
             </button>
          </div>
        </div>

        {/* Discord Floating Close Button */}
        <div className="fixed top-12 right-12 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition z-50 group">
          <button 
            onClick={onClose}
            className="w-[36px] h-[36px] rounded-full border-2 border-[var(--discord-text-muted)] group-hover:bg-[var(--discord-text-muted)] flex items-center justify-center text-[var(--discord-text-muted)] group-hover:text-[var(--discord-bg-primary)] transition"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
          <span className="text-[var(--discord-text-muted)] text-xs font-bold mt-2">ESC</span>
        </div>
      </div>
    </div>
  );
}
