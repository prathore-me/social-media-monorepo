import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { USERS_API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.patch(`${USERS_API_URL}/profiles/${user.id}`, { bio });

      setUser({ ...user, bio: res.data.bio });

      alert('Profile updated!');
      navigate(`/profile/${user.username}`);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white border p-8">
      <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Username</label>
          <input
            type="text"
            value={user?.username}
            disabled
            className="w-full bg-gray-100 p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border p-2 h-24 outline-none focus:border-gray-400"
            placeholder="Write something about yourself..."
          />
        </div>
        <button
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded font-semibold disabled:bg-blue-300"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
