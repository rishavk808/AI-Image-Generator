// server/src/lib/huggingface.js
import axios from "axios";
import FormData from "form-data";

const apiKey = process.env.STABILITY_API_KEY;
const apiUrl = "https://api.stability.ai/v2beta/stable-image/generate/core";

export async function hfGenerateImage(prompt) {
  if (!apiKey) throw new Error("Missing STABILITY_API_KEY in environment");

  try {
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("width", "512");
    form.append("height", "512");
    form.append("samples", "1");
    form.append("steps", "30");
    form.append("cfg_scale", "7");
    form.append("output_format", "png"); // or "webp", etc.

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
       ...form.getHeaders(),
    };

    const response = await axios.post(apiUrl, form, {
      headers,
      timeout: 300000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const data = response.data;
    if (data?.image) {
       return `data:image/png;base64,${data.image}`;
    }
    if (data?.artifacts && data.artifacts.length > 0) {
        const b64 = data.artifacts[0].base64 ?? data.artifacts[0].b64 ?? data.artifacts[0].data;
      if (b64) return `data:image/png;base64,${b64}`;
    }

    throw new Error("No image data found in Stability response.");
  } catch (err) {
    if (err.response) {
      console.error("Stability API error:", err.response.status, err.response.statusText, err.response.data || err.response);
    } else {
      console.error("Stability request error:", err.message);
    }
    throw new Error("Image generation failed. See server logs for details.");
  }
}
