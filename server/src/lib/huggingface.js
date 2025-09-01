import axios from 'axios';

const hf = axios.create({
  baseURL: 'https://api-inference.huggingface.co/models',
  headers: {
    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`
  },
  timeout: 120000
});
// Generate image with Stable Diffusion (returns Data URI)
export async function hfGenerateImage(prompt, model = 'runwayml/stable-diffusion-v1-5') {
  try {
    const res = await hf.post(
      `/${model}`,
      { inputs: prompt },
      {
        // HF returns raw image bytes
        responseType: 'arraybuffer',
        headers: {
          'x-wait-for-model': 'true',   // if the model is not loaded yet the model will wait until the image is ready
          'x-use-cache': 'false'    //If already a image is present it will still force it to generate a new image  
        },
        params: {
        }
      }
    );
    const base64 = Buffer.from(res.data, 'binary').toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    const detail =
      err.response?.data?.error || err.response?.statusText || err.message;
    console.error('HuggingFace error:', detail);
    throw new Error('Image generation failed: ' + detail);
  }
}
