let synthesis = window.speechSynthesis;

/**
 * Speak text using the Web Speech API.
 * @param {string} text - The text to speak.
 * @param {string} language - 'en' or 'hi'
 * @param {Function} [onEnd] - Callback fired when speech finishes or errors.
 * @returns {SpeechSynthesisUtterance|false} The utterance, or false if not supported.
 */
export const speakText = (text, language = 'en', onEnd) => {
  if (!synthesis) {
    console.warn("Text-to-Speech not supported in this browser.");
    return false;
  }

  // Cancel any ongoing speech
  synthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Map language code to TTS language code
  const langCode = language === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.lang = langCode;

  // Attempt to find a native voice
  const voices = synthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.includes(langCode) && v.localService);
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.rate = 0.9; // Slightly slower for low-literacy comprehension

  // Wire up end/error callbacks so callers get accurate completion notifications
  if (typeof onEnd === 'function') {
    utterance.onend = onEnd;
    utterance.onerror = onEnd; // also reset state on error
  }

  synthesis.speak(utterance);
  return utterance;
};

export const stopSpeaking = () => {
  if (synthesis) {
    synthesis.cancel();
  }
};

export const isSpeaking = () => {
  return synthesis && synthesis.speaking;
};
