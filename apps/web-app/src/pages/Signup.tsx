import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/auth.api';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form.email, form.username, form.password);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-4xl font-bold italic font-serif text-center mb-2">Instagram</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Sign up to see photos from your friends.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-gray-50 border border-gray-300 rounded-sm p-2.5 text-sm outline-none focus:border-gray-400"
            required
          />
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="bg-gray-50 border border-gray-300 rounded-sm p-2.5 text-sm outline-none focus:border-gray-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="bg-gray-50 border border-gray-300 rounded-sm p-2.5 text-sm outline-none focus:border-gray-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white font-semibold py-2 rounded-lg mt-2 hover:bg-blue-600 disabled:opacity-60 transition"
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
      </div>
      <div className="bg-white border border-gray-200 p-4 w-full max-w-sm mt-2 text-center text-sm">
        Have an account?{' '}
        <Link to="/login" className="text-blue-500 font-semibold">Log in</Link>
      </div>
    </div>
  );
}
