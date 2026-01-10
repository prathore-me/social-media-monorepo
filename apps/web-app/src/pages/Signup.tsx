import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AUTH_API_URL } from '../config/api';

export default function Signup() {
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${AUTH_API_URL}/signup`, formData);
      alert('Account created! Please login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 border border-gray-300 w-96 rounded-sm">
        <h1 className="text-3xl font-serif text-center mb-8">Instagram</h1>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="bg-gray-50 border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-gray-400"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="bg-gray-50 border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-gray-400"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-gray-50 border border-gray-300 p-2 text-sm rounded-sm outline-none focus:border-gray-400"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-1.5 rounded-md mt-2 hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      </div>

      <div className="bg-white p-6 border border-gray-300 w-96 mt-4 text-center text-sm">
        Have an account?{' '}
        <Link to="/login" className="text-blue-500 font-semibold">
          Log In
        </Link>
      </div>
    </div>
  );
}
