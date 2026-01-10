import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, SquarePlus, User, LogOut, X } from 'lucide-react';
import CreatePost from './CreatePost';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 z-50 h-16">
        <div className="max-w-5xl mx-auto h-full px-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold italic">
            Instagram
          </Link>

          <div className="hidden sm:block">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 rounded-lg px-4 py-1.5 w-64 outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div className="flex items-center gap-6">
            <Link title="Home" to="/">
              <Home size={24} />
            </Link>
            <button onClick={() => setIsModalOpen(true)}>
              <SquarePlus size={24} />
            </button>
            <Link title="Profile" to={`/profile/${user?.username}`}>
              <User size={24} />
            </Link>
            <button title="Logout" onClick={handleLogout} className="text-red-500">
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </nav>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>

            <div className="p-4">
              <CreatePost
                onPostCreated={() => {
                  setIsModalOpen(false);
                  navigate('/');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
