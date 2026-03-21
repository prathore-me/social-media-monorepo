import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Trash2, MoreHorizontal, Check, X } from 'lucide-react';
import { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { toggleLike, addComment, deleteComment, deletePost, updatePost } from '../../api/posts.api';
import Avatar from '../ui/Avatar';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
  onUpdate: (post: Post) => void;
}

export default function PostCard({ post, onDelete, onUpdate }: PostCardProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  // Local like state for instant UI feedback
  const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user.userId) : false);
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const isMyPost = user?.userId === post.userId;

  const handleLike = async () => {
    // Optimistic update — change UI immediately
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const res = await toggleLike(post._id);
      setIsLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch {
      // Revert on failure
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      toast.error('Failed to like post');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      const updated = await addComment(post._id, commentText);
      onUpdate(updated);
      setCommentText('');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const updated = await deleteComment(post._id, commentId);
      onUpdate(updated);
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const handleDelete = async () => {
    setShowMenu(false);
    try {
      await deletePost(post._id);
      onDelete(post._id);
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await updatePost(post._id, editCaption);
      onUpdate(updated);
      setIsEditing(false);
      toast.success('Caption updated');
    } catch {
      toast.error('Failed to update post');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <Link to={`/profile/${post.username}`} className="flex items-center gap-2">
          <Avatar username={post.username} size="sm" />
          <span className="font-semibold text-sm">{post.username}</span>
        </Link>
        {isMyPost && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-500 hover:text-black"
            >
              <MoreHorizontal size={20} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                >
                  Edit caption
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-gray-50"
                >
                  Delete post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image */}
      <img src={post.imageUrl} alt="Post" className="w-full aspect-square object-cover" />

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={handleLike} className="transition active:scale-110">
            <Heart size={24} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-800'} />
          </button>
          <button onClick={() => setShowComments(!showComments)}>
            <MessageCircle size={24} className="text-gray-800" />
          </button>
        </div>

        {/* Likes */}
        {likesCount > 0 && (
          <p className="text-sm font-semibold mb-1">
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </p>
        )}

        {/* Caption */}
        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              className="flex-1 border rounded p-1 text-sm outline-none"
            />
            <button onClick={handleUpdate} className="text-green-600">
              <Check size={18} />
            </button>
            <button onClick={() => setIsEditing(false)} className="text-gray-500">
              <X size={18} />
            </button>
          </div>
        ) : (
          post.caption && (
            <p className="text-sm">
              <Link to={`/profile/${post.username}`} className="font-semibold mr-2">
                {post.username}
              </Link>
              {post.caption}
            </p>
          )
        )}

        {/* Comments */}
        {post.comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-400 mt-1"
          >
            {showComments ? 'Hide' : `View all ${post.comments.length} comments`}
          </button>
        )}

        {showComments && (
          <div className="mt-2 space-y-1">
            {post.comments.map((comment) => (
              <div key={comment._id} className="flex items-center justify-between group">
                <p className="text-sm">
                  <Link to={`/profile/${comment.username}`} className="font-semibold mr-2">
                    {comment.username}
                  </Link>
                  {comment.text}
                </p>
                {user?.userId === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add comment */}
        <form onSubmit={handleAddComment} className="flex items-center gap-2 mt-3 border-t pt-3">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm outline-none"
          />
          {commentText.trim() && (
            <button
              type="submit"
              disabled={loading}
              className="text-blue-500 text-sm font-semibold disabled:opacity-50"
            >
              Post
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
