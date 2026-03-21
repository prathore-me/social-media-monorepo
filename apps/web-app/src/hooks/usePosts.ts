import { useState, useEffect } from 'react';
import { Post } from '../types';
import { getFeed } from '../api/posts.api';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFeed()
      .then(setPosts)
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false));
  }, []);

  const addPost = (post: Post) => setPosts((prev) => [post, ...prev]);

  const removePost = (postId: string) =>
    setPosts((prev) => prev.filter((p) => p._id !== postId));

  const updatePost = (updated: Post) =>
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

  return { posts, loading, error, addPost, removePost, updatePost };
};
