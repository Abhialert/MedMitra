import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: 'AIzaSyCiy2E_k7L6HZkg0UqiLm2_CQUfwBp8ZiE' });

async function list() {
  try {
    const request = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCiy2E_k7L6HZkg0UqiLm2_CQUfwBp8ZiE`);
    const data = await request.json();
    console.log(data.models.map(m => m.name));
  } catch(e) {
    console.error(e);
  }
}
list();
