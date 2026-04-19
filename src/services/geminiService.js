import { GoogleGenAI } from '@google/genai';

// Initialize with environment variable if available
let ai = import.meta.env.VITE_GEMINI_API_KEY 
  ? new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })
  : null;

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

  const modelName = 'gemini-2.5-flash';
  
  const langInstruction = language === 'hi' 
    ? 'Respond entirely in simple Hindi (Devanagari script) that a low-literacy person can understand.' 
    : 'Respond in very simple, plain English that a low-literacy person can easily understand.';

  const prompt = `
You are MedMitra, a medical assistant that helps people understand their medicines.
A user has scanned a medical document. It could be a medicine label, a box, or a doctor's prescription.

YOUR TASK:
1. Read the image carefully.
2. Identify the document type: "label" (single medicine) or "prescription" (doctor's list).
3. For EACH medicine you find, provide:
   - name: The brand name exactly as written
   - genericName: The chemical/generic name (e.g., "Paracetamol" for Crocin, "Metformin" for Glycomet). USE YOUR MEDICAL KNOWLEDGE.
   - usage: What this medicine is commonly prescribed for. USE YOUR MEDICAL KNOWLEDGE even if not written on the label. Be specific (e.g., "Reduces fever and relieves headache, body pain").
   - condition: EXACTLY ONE keyword from this list that best describes what the medicine treats: "fever", "pain", "heart", "diabetes", "stomach", "infection", "blood_pressure", "brain", "lungs", "skin", "bones", "eyes", "liver", "kidney", "allergy", "thyroid", "blood", "muscle", "ear", "dental", "vitamin", "general"
   - dosage: How much to take in simple terms (e.g., "One tablet" not "500mg")
   - sideEffects: Common side effects from YOUR MEDICAL KNOWLEDGE (e.g., "May cause drowsiness or upset stomach")
   - instructions: When/how to take (e.g., "Take after eating food, morning and night")
   - timeOfDay: Array of when to take: "morning", "afternoon", "evening", "night"
   - beforeOrAfterFood: ONE of: "before", "after", "with", "any" — when to take relative to meals
4. Give a simple summary of what the user should do.

${langInstruction}

CRITICAL RULES:
- USE YOUR OWN MEDICAL KNOWLEDGE for usage, side effects, and generic names. Do NOT rely only on what's written on the label.
- Explain like you're talking to your grandmother. No medical jargon.
- Output ONLY a JSON object (no markdown, no backticks).
- JSON keys: "documentType", "patientName" (null if not visible), "medicines" (array), "actionableInstructions"
- Medicine keys: "name", "genericName", "usage", "condition", "dosage", "sideEffects", "instructions", "timeOfDay", "beforeOrAfterFood"
`;

  const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
  const base64Data = imageBase64.split(',')[1];

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
    console.error('Gemini error:', error);
    
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw new Error(`Model not available. Check your API key permissions.`);
    }
    if (error.message?.includes('401') || error.message?.includes('API key')) {
      throw new Error('Invalid API key. Check your .env file.');
    }
    throw new Error(error.message || 'Failed to analyze. Please try again.');
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
