import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { AUTH_API_URL } from '../config/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${AUTH_API_URL}/login`, { email, password });

      localStorage.setItem('token', res.data.access_token);

      setUser(res.data.user);

      navigate('/');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 border border-gray-300 w-96 rounded-sm">
        <h1 className="text-3xl font-serif text-center mb-8">Instagram</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="bg-gray-50 border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-gray-50 border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-1.5 rounded-md mt-2"
          >
            Log In
          </button>
        </form>
      </div>

      <div className="bg-white p-6 border border-gray-300 w-96 mt-4 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-500 font-semibold">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
