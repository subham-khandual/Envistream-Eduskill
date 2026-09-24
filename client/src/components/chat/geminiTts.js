/**
 * geminiTts.js
 * Text-to-Speech module for Sayraa.
 * Always delegates to the browser's speechSynthesis (Web Speech API) which
 * has been meticulously tuned with custom sweet female prosody (pitch: 1.15-1.2,
 * rate: 0.96-0.97) and ranked female voices (Swara, Kalpana, Google हिन्दी).
 */

export const isGeminiTTSAvailable = () => false;

// ---------------------------------------------------------------------------
// Audio Playback & Cancellation State
// ---------------------------------------------------------------------------
let currentSourceNode = null;
let currentAudioElement = null;

/**
 * Stop any active TTS audio playback (Web Audio or browser speechSynthesis).
 */
export const stopGeminiTTS = () => {
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
      currentSourceNode.disconnect();
    } catch (_) {}
    currentSourceNode = null;
  }
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch (_) {}
    currentAudioElement = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
};

/**
 * Clean spoken text (remove emojis, markdown bullets, normalize pronunciation).
 */
export const cleanTextForTTS = (text) => {
  if (!text) return "";
  return text
    .replace(/Sayraa/gi, "Sigh-raa")
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu,
      ""
    )
    .replace(/[*#_~`>]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
};

/**
 * Request speech synthesis. Delegates to the browser's sweet female voice.
 */
export const playWithGeminiTTS = async (text, options = {}) => {
  const spokenText = cleanTextForTTS(text);
  if (!spokenText) return false;

  stopGeminiTTS();

  if (options.onFallback) {
    options.onFallback(spokenText);
  }
  return false;
};
