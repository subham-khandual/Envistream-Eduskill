/**
 * geminiTts.js
 * Text-to-Speech (TTS) module using Google's Gemini 3.1 Flash TTS model.
 *
 * Primary model: gemini-3.1-flash-tts-preview
 * Fallback models: gemini-2.5-flash-preview-tts, gemini-2.5-pro-preview-tts
 *
 * Supports direct raw L16 PCM / WAV audio decoding and playback with automatic 
 * fallback to browser speech synthesis when offline or quota is exceeded.
 */

// ---------------------------------------------------------------------------
// Env key resolution
// ---------------------------------------------------------------------------
const getApiKey = () => {
  try {
    if (import.meta?.env?.VITE_GEMINI_API_KEY) return import.meta.env.VITE_GEMINI_API_KEY;
  } catch (_) {}
  try {
    if (process?.env?.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY;
    if (process?.env?.REACT_APP_GEMINI_API_KEY) return process.env.REACT_APP_GEMINI_API_KEY;
  } catch (_) {}
  return "";
};

export const isGeminiTTSAvailable = () => {
  const key = getApiKey();
  return Boolean(key && key.length > 10);
};

// ---------------------------------------------------------------------------
// Audio Context & Playback State
// ---------------------------------------------------------------------------
let globalAudioCtx = null;
let currentSourceNode = null;
let currentAudioElement = null;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!globalAudioCtx || globalAudioCtx.state === "closed") {
    globalAudioCtx = new AudioCtx();
  }
  return globalAudioCtx;
};

/**
 * Stop any active TTS audio playback (Gemini or browser).
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
 * Create a WAV file (ArrayBuffer) from raw 16-bit PCM little-endian bytes.
 */
const rawPcmBytesToWavBuffer = (bytes, sampleRate = 24000, numChannels = 1) => {
  const dataSize = bytes.length;
  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF chunk descriptor
  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");

  // fmt sub-chunk
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format = 1
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // 16 bits per sample

  // data sub-chunk
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  // High-performance copy of raw PCM samples directly into WAV body
  new Uint8Array(wavBuffer, 44).set(bytes);

  return wavBuffer;
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
 * Request Gemini 3.1 Flash TTS model to synthesize speech from text.
 *
 * @param {string} text - text to synthesize
 * @param {Object} options
 * @param {string} [options.voiceName="Kore"] - Prebuilt voice (e.g. Kore, Aoede, Puck)
 * @param {Function} [options.onFallback] - Callback if Gemini TTS fails
 * @returns {Promise<boolean>} - True if synthesized and played successfully
 */
export const playWithGeminiTTS = async (text, options = {}) => {
  const spokenText = cleanTextForTTS(text);
  if (!spokenText) return false;

  stopGeminiTTS();

  const apiKey = getApiKey();
  if (!apiKey) {
    if (options.onFallback) options.onFallback(spokenText);
    return false;
  }

  // Exact model names verified with Gemini API
  const ttsModels = [
    "gemini-3.1-flash-tts-preview",
    "gemini-2.5-flash-preview-tts",
    "gemini-2.5-pro-preview-tts",
  ];

  const voiceName = options.voiceName || "Kore";
  let lastError = "";

  for (const model of ttsModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: spokenText }],
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceName,
              },
            },
          },
        },
      };

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        lastError = `${resp.status} - ${errText}`;
        console.warn(`Gemini TTS model "${model}" failed with status ${resp.status}`);
        continue;
      }

      const json = await resp.json();
      const parts = json.candidates?.[0]?.content?.parts || [];
      const audioPart = parts.find(
        (p) => p.inlineData?.data || p.inline_data?.data
      );

      if (!audioPart) {
        console.warn(`Model "${model}" returned no audio parts.`);
        continue;
      }

      const inline = audioPart.inlineData || audioPart.inline_data;
      const base64Data = inline.data;
      const mimeType = inline.mimeType || "audio/l16; rate=24000; channels=1";

      // Convert base64 to binary Uint8Array
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioCtx = getAudioContext();
      if (!audioCtx) throw new Error("AudioContext not supported");

      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      // Check if it's raw PCM / L16
      if (
        mimeType.includes("pcm") ||
        mimeType.includes("l16") ||
        mimeType.includes("rate=")
      ) {
        const rateMatch = mimeType.match(/rate=(\d+)/);
        const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;

        const wavBuffer = rawPcmBytesToWavBuffer(bytes, sampleRate, 1);
        const audioBuffer = await audioCtx.decodeAudioData(wavBuffer);

        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        currentSourceNode = source;
        source.onended = () => {
          if (currentSourceNode === source) currentSourceNode = null;
        };
        source.start();
        return true;
      } else {
        // Standard audio container (WAV, MP3, etc.)
        const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer.slice(0));
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        currentSourceNode = source;
        source.onended = () => {
          if (currentSourceNode === source) currentSourceNode = null;
        };
        source.start();
        return true;
      }
    } catch (err) {
      lastError = String(err?.message || err);
      console.warn(`Gemini TTS "${model}" encountered error:`, err);
    }
  }

  // If Gemini TTS was unavailable or quota failed, fallback to browser speech
  console.warn("Gemini 3.1 Flash TTS fallback triggered:", lastError);
  if (options.onFallback) {
    options.onFallback(spokenText);
  }
  return false;
};
