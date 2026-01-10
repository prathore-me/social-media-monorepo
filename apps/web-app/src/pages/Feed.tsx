import { useEffect, useState } from 'react';
import api from '../api/axios';
import { POSTS_API_URL } from '../config/api';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    api.get(`${POSTS_API_URL}/posts`).then((res) => setPosts(res.data));
  }, []);

  const handlePostCreated = (newPost: any) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (id: string) => {
    setPosts(posts.filter((p) => p._id !== id));
  };

  const handlePostUpdated = (updatedPost: any) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  return (
    <div className="max-w-xl mx-auto">
      <CreatePost onPostCreated={handlePostCreated} />

      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onDelete={handlePostDeleted}
          onUpdate={handlePostUpdated}
        />
      ))}
    </div>
  );
}
