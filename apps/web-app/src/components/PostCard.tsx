import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { POSTS_API_URL } from '../config/api';
import { Trash2, Edit3, X, Check } from 'lucide-react';

export default function PostCard({ post, onDelete, onUpdate }: any) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption);

  const isMyPost = user?.userId === post.userId;

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      await api.delete(`${POSTS_API_URL}/posts/${post._id}`);
      onDelete(post._id);
    }
  };

  const handleUpdate = async () => {
    const res = await api.patch(`${POSTS_API_URL}/posts/${post._id}`, {
      caption: editCaption,
    });
    onUpdate(res.data);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-sm mb-6 max-w-md mx-auto">
      <div className="flex items-center justify-between p-3">
        <span className="font-semibold text-sm">{post.username}</span>
        {isMyPost && (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(!isEditing)}>
              <Edit3 size={18} />
            </button>
            <button onClick={handleDelete} className="text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <img src={post.imageUrl} alt="Post content" className="w-full object-cover aspect-square" />

      <div className="p-3 text-sm">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              className="border p-1 flex-grow outline-none"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
            />
            <button onClick={handleUpdate} className="text-green-600">
              <Check size={20} />
            </button>
            <button onClick={() => setIsEditing(false)}>
              <X size={20} />
            </button>
          </div>
        ) : (
          <p>
            <span className="font-semibold mr-2">{post.username}</span>
            {post.caption}
          </p>
        )}
      </div>
    </div>
  );
}
