import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  author: { type: String, required: true, trim: true },
  prompt: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

// For search
PostSchema.index({ author: 'text', prompt: 'text' });

export default mongoose.model('Post', PostSchema);
