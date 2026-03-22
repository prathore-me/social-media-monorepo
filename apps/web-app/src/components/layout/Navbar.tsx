import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, PlusSquare, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { searchProfiles } from '../../api/users.api';
import { Profile } from '../../types';
import Avatar from '../ui/Avatar';
import CreatePostModal from '../post/CreatePostModal';
import { Post } from '../../types';
import toast from 'react-hot-toast';

interface NavbarProps {
  onPostCreated?: (post: Post) => void;
}

export default function Navbar({ onPostCreated }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const results = await searchProfiles(searchQuery);
        setSearchResults(results);
        setShowSearch(true);
      } catch {
        toast.error('Search failed');
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 h-14">
        <div className="max-w-4xl mx-auto h-full px-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold italic font-serif">
            Social Media Platform
          </Link>

          {/* Search */}
          <div ref={searchRef} className="relative hidden sm:block">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5 gap-2">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearch(true)}
                className="bg-transparent outline-none text-sm w-48"
              />
            </div>
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-10 left-0 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {searchResults.map((profile) => (
                  <Link
                    key={profile._id}
                    to={`/profile/${profile.username}`}
                    onClick={() => {
                      setShowSearch(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                  >
                    <Avatar src={profile.profilePic} username={profile.username} size="sm" />
                    <div>
                      <p className="text-sm font-semibold">{profile.username}</p>
                      {profile.bio && (
                        <p className="text-xs text-gray-400 truncate w-44">{profile.bio}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <Link to="/">
              <Home size={22} />
            </Link>
            <button onClick={() => setShowCreatePost(true)}>
              <PlusSquare size={22} />
            </button>
            <Link to={`/profile/${user?.username}`}>
              <Avatar username={user?.username} size="sm" />
            </Link>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition">
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </nav>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={(post) => {
          onPostCreated?.(post);
          setShowCreatePost(false);
        }}
      />
    </>
  );
}
