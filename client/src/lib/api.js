import axios from 'axios';

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

export const getPosts = (params) => API.get('/posts', { params });
export const addPost = (payload) => API.post('/posts', payload);
export const generateImage = (payload) => API.post('/images', payload);
