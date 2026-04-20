import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useChatStore } from '../store/useChatStore';

export default function Dashboard() {
  const { fetchRooms, activeRoom } = useChatStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div className="flex h-screen bg-[var(--discord-bg-primary)] p-0 m-0 overflow-hidden w-full relative">
      <Sidebar />
      {activeRoom ? (
        <ErrorBoundary>
          <ChatWindow />
        </ErrorBoundary>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[var(--discord-bg-primary)]">
          <div className="text-center max-w-md animate-fade-in">
            <div className="bg-[var(--discord-bg-tertiary)] p-6 rounded-full inline-block mb-6 shadow-md border border-[var(--discord-divider)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--discord-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <h2 className="text-3xl text-[var(--discord-text-header)] font-bold mb-4">No Channel Selected</h2>
            <p className="text-[var(--discord-text-muted)] mb-8">Select a conversation from the sidebar to start chatting or search for a user to begin a new direct message.</p>
          </div>
        </div>
      )}
    </div>
  );
}
