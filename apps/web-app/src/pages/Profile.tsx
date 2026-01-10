import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { USERS_API_URL } from '../config/api';
import UserListModal from '../components/UserListModal';

export default function Profile() {
  const { username } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    list: string[];
  }>({
    isOpen: false,
    title: '',
    list: [],
  });

  const openFollowers = () => {
    setModalConfig({ isOpen: true, title: 'Followers', list: profile.followers });
  };

  const openFollowing = () => {
    setModalConfig({ isOpen: true, title: 'Following', list: profile.following });
  };

  useEffect(() => {
    axios.get(`${USERS_API_URL}/profiles/${username}`).then((res) => setProfile(res.data));
  }, [username]);

  if (!profile) return <div>Loading Profile...</div>;

  const isMyProfile = me?.username === username;

  return (
    <div className="p-4">
      <div className="flex items-center gap-8 border-b pb-8">
        <div className="w-32 h-32 bg-gray-300 rounded-full" />
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            {isMyProfile ? (
              <Link to="/edit-profile" className="border px-4 py-1 rounded">
                Edit Profile
              </Link>
            ) : (
              <button className="bg-blue-500 text-white px-4 py-1 rounded">Follow</button>
            )}
          </div>
          <div className="flex gap-6 mt-4">
            <span>
              <strong>{profile.postsCount || 0}</strong> posts
            </span>
            <button onClick={openFollowers} className="hover:opacity-60">
              <strong>{profile.followers?.length || 0}</strong> followers
            </button>
            <button onClick={openFollowing} className="hover:opacity-60">
              <strong>{profile.following?.length || 0}</strong> following
            </button>
          </div>
          <p className="mt-4">{profile.bio || 'No bio yet.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 mt-6">
        <div className="aspect-square bg-gray-200"></div>
        <div className="aspect-square bg-gray-200"></div>
        <div className="aspect-square bg-gray-200"></div>
      </div>

      <UserListModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        userIds={modalConfig.list}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  );
}
