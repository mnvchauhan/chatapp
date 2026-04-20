import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', password: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const { register } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
    } catch (err) {
      setError(err.response?.data?.username?.[0] || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--whatsapp-bg)] p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[var(--whatsapp-light)] p-3 rounded-full text-white mb-4 shadow-md">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">Join ChatApp today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--whatsapp-light)] outline-none"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--whatsapp-light)] outline-none"
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--whatsapp-light)] outline-none"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--whatsapp-light)] outline-none"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--whatsapp-dark)] text-white py-2 rounded shadow hover:bg-[var(--whatsapp-darker)] transition-colors font-semibold mt-6"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--whatsapp-dark)] hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
