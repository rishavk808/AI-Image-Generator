import { useState } from 'react';
import { generateImage, addPost } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Create() {
  const [author, setAuthor] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [genLoading, setGenLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const navigate = useNavigate();

  async function handleGenerate() {
    if (!prompt) return;
    setGenLoading(true);
    try {
      const { data } = await generateImage({ prompt });
      setImageUrl(data.imageUrl);
    } catch (e) {
      alert(e?.response?.data?.error || 'Failed to generate image');
    } finally {
      setGenLoading(false);
    }
  }

  async function handlePost() {
    if (!author || !prompt || !imageUrl) return alert('Fill all fields and generate an image first.');
    setPostLoading(true);
    try {
      await addPost({ author, prompt, imageUrl });
      navigate('/');
    } catch (e) {
      alert(e?.response?.data?.error || 'Failed to create post');
    } finally {
      setPostLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-semibold">Generate Image with prompt</h1>
        <Link to="/" className="px-3 py-2 rounded-xl bg-white/10 border border-white/10">
          Explore Posts
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm opacity-80">AUTHOR</label>
            <input
              className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              placeholder="Enter your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm opacity-80">IMAGE PROMPT</label>
            <textarea
              className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-28"
              placeholder="Write a detailed prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={genLoading}
              className="bg-blue-500 hover:bg-blue-600 rounded-xl px-4 py-2 font-medium"
            >
              {genLoading ? 'Generating...' : 'Generate image'}
            </button>

            <button
              onClick={handlePost}
              disabled={postLoading || !imageUrl}
              className="bg-purple-500 hover:bg-purple-600 rounded-xl px-4 py-2 font-medium"
            >
              {postLoading ? 'Posting...' : 'Post Image'}
            </button>
          </div>

          <p className="text-xs opacity-60">* The generated image will be uploaded to Cloudinary.</p>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-yellow-400/40 min-h-80 flex items-center justify-center">
          {imageUrl
            ? <img src={imageUrl} alt="preview" className="rounded-xl max-h-[480px]" />
            : <span className="opacity-60">Write a prompt to generate image</span>
          }
        </div>
      </div>
    </div>
  );
}
