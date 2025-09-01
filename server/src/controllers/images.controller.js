import { z } from 'zod';
import { hfGenerateImage } from '../lib/huggingface.js';
import cloudinary from '../lib/cloudinary.js';

const GenSchema = z.object({
  prompt: z.string().min(5, 'Prompt too short'),
  model: z.string().optional()  // allow switching models if you want
});

export async function generateAndUpload(req, res) {
  try {
    const { prompt, model } = GenSchema.parse(req.body);

    // 1) Generate image (Data URI)
    const dataUri = await hfGenerateImage(prompt, model);

    // 2) Upload to Cloudinary → get CDN URL
    const upload = await cloudinary.uploader.upload(dataUri, {
      folder: 'gemai',
      overwrite: true
    });

    return res.json({ imageUrl: upload.secure_url });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to generate' });
  }
}
