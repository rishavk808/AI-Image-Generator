import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import postsRoutes from './routes/posts.js';
import imagesRoutes from './routes/images.js';
import { connectDB } from './lib/db.js';

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-image-generator-one-cyan.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/posts', postsRoutes);
app.use('/api/images', imagesRoutes);

// ✅ Connect DB first, then start server
connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`✅ API ready at http://localhost:${process.env.PORT || 5000}`)
  );
});
