import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { createPost } from '../../api/posts.api';
import { Post } from '../../types';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const post = await createPost({ imageUrl, caption });
      onPostCreated(post);
      setImageUrl('');
      setCaption('');
      onClose();
      toast.success('Post shared!');
    } catch {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create new post">
      <form onSubmit={handleSubmit} className="flex flex-col">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full aspect-square object-cover"
            onError={() => setImageUrl('')}
          />
        ) : (
          <div className="flex flex-col items-center justify-center aspect-square bg-gray-50 text-gray-400">
            <ImagePlus size={48} strokeWidth={1} />
            <p className="mt-2 text-sm">Enter an image URL below</p>
          </div>
        )}

        <div className="p-4 flex flex-col gap-3">
          <input
            type="url"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:border-gray-400"
            required
          />
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none resize-none h-20"
          />
          <button
            type="submit"
            disabled={loading || !imageUrl}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {loading ? 'Sharing...' : 'Share'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
