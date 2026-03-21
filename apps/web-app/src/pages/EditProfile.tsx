import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/users.api';
import Navbar from '../components/layout/Navbar';
import Avatar from '../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ bio, profilePic });
      toast.success('Profile updated!');
      navigate(`/profile/${user?.username}`);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-14 max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Edit profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Avatar src={profilePic} username={user?.username} size="lg" />
            <div className="flex-1">
              <p className="font-semibold">{user?.username}</p>
              <input
                type="url"
                placeholder="Profile picture URL"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
                className="mt-1 text-sm text-blue-500 outline-none w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
              placeholder="Write something about yourself..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none resize-none h-24 focus:border-gray-400"
            />
            <p className="text-xs text-gray-400 text-right">{bio.length}/150</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 disabled:opacity-60 transition"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </main>
    </>
  );
}
