import { useState, useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { createPost } from '../../api/posts.api';
import { uploadFile } from '../../api/media.api';
import { Post } from '../../types';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const { url } = await uploadFile(file, 'posts-images');
      const post = await createPost({ imageUrl: url, caption });
      onPostCreated(post);
      setPreview(null);
      setFile(null);
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
        {/* Image area */}
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full aspect-square object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center aspect-square bg-gray-50 text-gray-400 cursor-pointer hover:bg-gray-100 transition"
          >
            <ImagePlus size={48} strokeWidth={1} />
            <p className="mt-2 text-sm">Click to select a photo</p>
            <p className="text-xs mt-1 text-gray-300">JPEG, PNG, WebP, GIF up to 10MB</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="p-4 flex flex-col gap-3">
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none resize-none h-20"
          />
          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {loading ? 'Uploading...' : 'Share'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
