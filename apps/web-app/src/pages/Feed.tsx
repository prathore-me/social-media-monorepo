import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/post/PostCard';
import Navbar from '../components/layout/Navbar';
import Spinner from '../components/ui/Spinner';

export default function Feed() {
  const { posts, loading, addPost, removePost, updatePost } = usePosts();

  return (
    <>
      <Navbar onPostCreated={addPost} />
      <main className="pt-14 max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="font-semibold text-lg">No posts yet</p>
            <p className="text-sm mt-1">Follow people to see their posts here</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={removePost}
              onUpdate={updatePost}
            />
          ))
        )}
      </main>
    </>
  );
}
