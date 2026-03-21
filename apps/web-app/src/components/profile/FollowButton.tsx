import { useState } from 'react';
import { toggleFollow } from '../../api/users.api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
  onToggle: (following: boolean) => void;
}

export default function FollowButton({ targetUserId, isFollowing, onToggle }: FollowButtonProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (user?.id === targetUserId) return null;

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await toggleFollow(targetUserId);
      onToggle(res.following);
    } catch {
      toast.error('Failed to follow/unfollow');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition ${
        isFollowing
          ? 'bg-gray-100 text-black hover:bg-gray-200'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } disabled:opacity-50`}
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
