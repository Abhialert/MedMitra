import { GoogleGenAI } from '@google/genai';

// API key is loaded from environment variables (set in Vercel dashboard for production, .env for local dev)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

/**
 * Re-initialize the Gemini client with a new API key
 */
export const initGemini = (apiKey) => {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
    return true;
  }
  return false;
};

/**
 * Check if the Gemini client is initialized
 */
export const hasApiKey = () => {
  return ai !== null;
};

/**
 * Analyze a medical document (label or prescription) using Gemini Vision
 */
export const analyzeMedicalDocument = async (imageBase64, language = 'en') => {
  if (!ai) {
    throw new Error('Gemini API key not configured.');
  }

  const modelName = 'gemini-2.5-flash-lite';
  
  const langInstruction = language === 'hi' 
    ? 'Respond entirely in simple Hindi (Devanagari script) that a low-literacy person can understand.' 
    : 'Respond in very simple, plain English that a low-literacy person can easily understand.';

  const prompt = `
Role: You are MedMitra, a highly empathetic and simple-spoken medical AI.
Task: Inspect image. Reject if not a physical medicine (box/bottle/strip/prescription). Reject computer screens, code, animals, objects.

If invalid, output strictly:
{"documentType": "invalid", "patientName": null, "medicines": [], "actionableInstructions": "${language === 'hi' ? 'यह दवा या प्रिस्क्रिप्शन नहीं लग रहा है। कृपया असली दवा का बॉक्स, पत्ता (strip) या प्रिस्क्रिप्शन की स्पष्ट फोटो खींचें।' : 'This does not appear to be a physical medicine or prescription. Please capture a clear photo of a real medicine box, strip, or prescription.'}"}

If valid, extract strictly as JSON:
- documentType: "label" or "prescription"
- patientName: string | null
- actionableInstructions: warm, simple summary of next steps
- medicines: array of objects containing:
  * name: brand name
  * genericName: from medical knowledge (e.g. "Paracetamol")
  * usage: specific use from medical knowledge (e.g. "Reduces fever and body pain")
  * condition: ONE keyword: fever, pain, heart, diabetes, stomach, infection, blood_pressure, brain, lungs, skin, bones, eyes, liver, kidney, allergy, thyroid, blood, muscle, ear, dental, vitamin, general
  * dosage: Explain in physical quantities (e.g. "One tablet", "Two spoons", "Half a pill"). NEVER output weights like "500mg" or "500 gm". Explain it so an elderly grandmother knows exactly what to swallow.
  * sideEffects: known side effects (e.g. "May cause drowsiness")
  * instructions: when/how to take (e.g. "Take after eating food, morning and night")
  * timeOfDay: array of: "morning", "afternoon", "evening", "night"
  * beforeOrAfterFood: "before" | "after" | "with" | "any"

${langInstruction}

RULES:
- Apply medical knowledge: Do not rely solely on the image for usage, generic names, or side effects.
- Tone: ABSOLUTELY NO medical jargon. Explain simply, clearly, and compassionately, like talking to an elderly grandmother.
- Output ONLY raw JSON. No markdown or backticks.
`;

  const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
  const base64Data = imageBase64.split(',')[1];

  const maxRetries = 2;
  const retryDelayMs = 1500;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt }
        ]
      });

      const text = response.text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error(`Could not parse AI response.`);
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      const errorString = error?.message || String(error);
      const isOverloaded = errorString.includes('503') || error?.status === 503 || errorString.includes('high demand');
      
      if (attempt < maxRetries && isOverloaded) {
        console.warn(`Google Servers busy (503). Retrying attempt ${attempt}...`);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
        continue;
      }

      console.error('Gemini error:', error);
      
      if (errorString.includes('404') || errorString.includes('not found')) {
        throw new Error(`Model not available. Check your API key permissions.`);
      }
      if (errorString.includes('401') || errorString.includes('API key')) {
        throw new Error('Invalid API key. Check your .env file.');
      }
      
      if (isOverloaded) {
        throw new Error('Google AI servers are slightly overloaded. Please wait 10 seconds and try again.');
      }
      
      throw new Error(error.message || 'Failed to analyze. Please try again.');
    }
  }
};

/**
 * Pre-cache translation: analyze the same image in another language (background call)
 * Returns null on any error (non-blocking)
 */
export const analyzeMedicalDocumentQuiet = async (imageBase64, language = 'hi') => {
  try {
    return await analyzeMedicalDocument(imageBase64, language);
  } catch (error) {
    console.warn('Background translation pre-cache failed:', error.message);
    return null;
  }
};

/** Backward compatible alias */
export const analyzeMedicineLabel = analyzeMedicalDocument;
