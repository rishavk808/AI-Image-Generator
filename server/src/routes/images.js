import { Router } from 'express';
import { generateAndUpload } from '../controllers/images.controller.js';

const router = Router();
router.post('/', generateAndUpload);
export default router;
