import { useState } from 'react';
import api from '../api/axios';
import { POSTS_API_URL } from '../config/api';

export default function CreatePost({ onPostCreated }: any) {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`${POSTS_API_URL}/posts`, { imageUrl, caption });
      onPostCreated(res.data);
      setImageUrl('');
      setCaption('');
    } catch (err) {
      alert('Failed to create post');
    }
  };

  return (
    <div className="w-full">
      <h3 className="font-semibold text-center text-lg mb-4 border-b pb-2">Create New Post</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          placeholder="Paste Image URL here..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="bg-gray-50 border p-3 text-sm rounded outline-none focus:ring-1 focus:ring-blue-400"
          required
        />
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="bg-gray-50 border p-3 text-sm rounded outline-none h-32 resize-none"
        />
        <button className="bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition">
          Share Post
        </button>
      </form>
    </div>
  );
}
