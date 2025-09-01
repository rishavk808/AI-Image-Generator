import { z } from 'zod';
import Post from '../models/Post.js';

const CreateSchema = z.object({
  author: z.string().min(1),
  prompt: z.string().min(5),
  imageUrl: z.string().url()
});

export async function listPosts(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '12', 10), 1), 48);

    const filter = q ? { $text: { $search: q } } : {};

    const [items, total] = await Promise.all([
      Post.find(filter)
        .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Post.countDocuments(filter)
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}

export async function createPost(req, res) {
  try {
    const { author, prompt, imageUrl } = CreateSchema.parse(req.body);
    const post = await Post.create({ author, prompt, imageUrl });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create post' });
  }
}
