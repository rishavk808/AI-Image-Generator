import { useEffect, useState } from 'react';
import { getPosts } from '../lib/api';
import PostCard from '../components/PostCard';
import Grid from '../components/Grid';

export default function Home() {
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 400);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getPosts({ q: debounced, page: 1, limit: 12 });
        setItems(data.items);
        setPage(1);
        setPages(data.pages);
      } finally { setLoading(false); }
    })();
  }, [debounced]);

  async function loadMore() {
    if (page >= pages) return;
    const next = page + 1;
    const { data } = await getPosts({ q: debounced, page: next, limit: 12 });
    setItems((prev) => [...prev, ...data.items]);
    setPage(next);
    setPages(data.pages);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center">
        Explore popular posts in the Community!
      </h1>
      <p className="text-center text-indigo-300 mt-1">Generated with Stable Diffusion</p>

      <div className="mt-6 flex justify-center">
        <input
          className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
          placeholder="Search posts..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="mt-8">
        {loading && <div className="opacity-70">Loading...</div>}
        {!loading && items.length === 0 && <div className="opacity-70">No posts found.</div>}

        <Grid>
          {items.map((p) => <PostCard key={p._id} post={p} />)}
        </Grid>

        {page < pages && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/10"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
