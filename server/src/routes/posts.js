import { Router } from 'express';
import { createPost, listPosts } from '../controllers/posts.controller.js';

const router = Router();

router.get('/', listPosts);
router.post('/', createPost);

export default router;
