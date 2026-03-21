import { useState, useEffect } from 'react';
import { Profile, Post } from '../types';
import { getProfileByUsername } from '../api/users.api';
import { getPostsByUser } from '../api/posts.api';

export const useProfile = (username: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setProfile(null);
    setPosts([]);

    getProfileByUsername(username)
      .then((profile) => {
        setProfile(profile);
        return getPostsByUser(profile.userId);
      })
      .then(setPosts)
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [username]);

  return { profile, setProfile, posts, loading, error };
};
