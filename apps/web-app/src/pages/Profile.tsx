import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import Navbar from '../components/layout/Navbar';
import Avatar from '../components/ui/Avatar';
import PostGrid from '../components/post/PostGrid';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import FollowButton from '../components/profile/FollowButton';
import { getProfileByUserId } from '../api/users.api';
import type { Profile as ProfileType } from '../types';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { profile, setProfile, posts, loading } = useProfile(username!);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-14 flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="pt-14 text-center py-20 text-gray-400">User not found</div>
      </>
    );
  }

  const isMyProfile = user?.userId === profile.userId;
  const isFollowing = user ? profile.followers.includes(user.userId) : false;

  const handleFollowToggle = (following: boolean) => {
    if (!user) return;
    setProfile({
      ...profile,
      followers: following
        ? [...profile.followers, user.userId]
        : profile.followers.filter((id) => id !== user.userId),
    });
  };

  return (
    <>
      <Navbar />
      <main className="pt-14 max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-16 py-10 border-b border-gray-200">
          <Avatar src={profile.profilePic} username={profile.username} size="xl" />
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-light">{profile.username}</h1>
              {isMyProfile ? (
                <Link
                  to="/edit-profile"
                  className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50"
                >
                  Edit profile
                </Link>
              ) : (
                <FollowButton
                  targetUserId={profile.userId}
                  isFollowing={isFollowing}
                  onToggle={handleFollowToggle}
                />
              )}
            </div>
            <div className="flex gap-8 mb-4">
              <span className="text-sm">
                <strong>{posts.length}</strong> posts
              </span>
              <button onClick={() => setShowFollowers(true)} className="text-sm hover:opacity-60">
                <strong>{profile.followers.length}</strong> followers
              </button>
              <button onClick={() => setShowFollowing(true)} className="text-sm hover:opacity-60">
                <strong>{profile.following.length}</strong> following
              </button>
            </div>
            {profile.bio && <p className="text-sm">{profile.bio}</p>}
          </div>
        </div>

        <div className="mt-6">
          <PostGrid posts={posts} />
        </div>
      </main>

      <Modal isOpen={showFollowers} onClose={() => setShowFollowers(false)} title="Followers">
        <UserList userIds={profile.followers} onClose={() => setShowFollowers(false)} />
      </Modal>

      <Modal isOpen={showFollowing} onClose={() => setShowFollowing(false)} title="Following">
        <UserList userIds={profile.following} onClose={() => setShowFollowing(false)} />
      </Modal>
    </>
  );
}

function UserList({ userIds, onClose }: { userIds: string[]; onClose: () => void }) {
  if (userIds.length === 0) {
    return <div className="p-10 text-center text-gray-400 text-sm">No users yet</div>;
  }
  return (
    <div>
      {userIds.map((id) => (
        <UserListItem key={id} userId={id} onClose={onClose} />
      ))}
    </div>
  );
}

function UserListItem({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    getProfileByUserId(userId)
      .then(setProfile)
      .catch(() => {});
  }, [userId]);

  if (!profile) return <div className="px-4 py-3 text-sm text-gray-300">Loading...</div>;

  return (
    <Link
      to={`/profile/${profile.username}`}
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
    >
      <Avatar src={profile.profilePic} username={profile.username} size="sm" />
      <span className="text-sm font-semibold">{profile.username}</span>
    </Link>
  );
}
