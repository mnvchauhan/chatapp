import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  const { checkAuth, isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--whatsapp-bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--whatsapp-dark)]"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
