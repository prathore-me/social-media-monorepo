import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import Profile from './pages/profile/profile';
import { AUTH_API_URL } from '../config/api';

export function App() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${AUTH_API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        if (window.location.pathname === '/') {
          navigate(`/profile/${response.data.username}`);
        }
      } catch (error) {
        console.error('Authentication check failed', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route path="/profile/:username" element={user ? <Profile /> : <Navigate to="/login" />} />

      <Route
        path="/"
        element={user ? <Navigate to={`/profile/${user.username}`} /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

export default App;
