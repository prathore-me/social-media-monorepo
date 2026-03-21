import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth.api';
import toast from 'react-hot-toast';

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.access_token);
      setUser(res.user);
      navigate('/');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-4xl font-bold italic font-serif text-center mb-8">Instagram</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-sm p-2.5 text-sm outline-none focus:border-gray-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-sm p-2.5 text-sm outline-none focus:border-gray-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white font-semibold py-2 rounded-lg mt-2 hover:bg-blue-600 disabled:opacity-60 transition"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
      <div className="bg-white border border-gray-200 p-4 w-full max-w-sm mt-2 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-500 font-semibold">
          Sign up
        </Link>
      </div>
    </div>
  );
}
