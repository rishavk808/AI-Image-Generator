export default function PostCard({ post }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
      <img src={post.imageUrl} alt={post.prompt} className="w-full h-64 object-cover" />
      <div className="p-3">
        <div className="text-sm text-white/60">{post.author}</div>
        <div className="text-sm mt-1">{post.prompt}</div>
      </div>
    </div>
  );
}
