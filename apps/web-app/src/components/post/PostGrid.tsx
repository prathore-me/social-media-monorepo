import { Post } from '../../types';

interface PostGridProps {
  posts: Post[];
}

export default function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-semibold">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5">
      {posts.map((post) => (
        <div key={post._id} className="aspect-square overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-full object-cover hover:opacity-90 transition cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
}
