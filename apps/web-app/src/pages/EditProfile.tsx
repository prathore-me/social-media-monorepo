import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/users.api';
import { uploadFile } from '../api/media.api';
import Navbar from '../components/layout/Navbar';
import Avatar from '../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalProfilePic = profilePic;

      if (file) {
        const { url } = await uploadFile(file, 'profile-pictures');
        finalProfilePic = url;
      }

      await updateProfile({ bio, profilePic: finalProfilePic });
      toast.success('Profile updated!');
      navigate(`/profile/${user?.username}`);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-14 max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Edit profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Profile picture */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer relative group"
            >
              <Avatar src={preview || profilePic} username={user?.username} size="lg" />
              <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-xs font-semibold">Change</span>
              </div>
            </div>
            <div>
              <p className="font-semibold">{user?.username}</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-sm text-blue-500 hover:underline mt-1"
              >
                Change profile photo
              </button>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
              placeholder="Write something about yourself..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none resize-none h-24 focus:border-gray-400"
            />
            <p className="text-xs text-gray-400 text-right">{bio.length}/150</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 disabled:opacity-60 transition"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </main>
    </>
  );
}
