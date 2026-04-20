import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--whatsapp-bg)] p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[var(--whatsapp-light)] p-3 rounded-full text-white mb-4 shadow-md">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome to ChatApp</h2>
          <p className="text-gray-500 mt-2">Sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--whatsapp-light)] focus:border-transparent outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--whatsapp-light)] focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--whatsapp-dark)] text-white py-2 rounded shadow hover:bg-[var(--whatsapp-darker)] transition-colors font-semibold"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[var(--whatsapp-dark)] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
