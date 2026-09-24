// ---- Gemini Speech-to-Text (AI mic) ----
// Chrome's free Web Speech recognizer cannot learn custom words, so it keeps
// mishearing the brand "Envistream EduSkill" differently on every try (fast,
// slow, odd pace...). When a Gemini API key is configured, we record the
// mic audio with the modern MediaRecorder and send it to Google's Gemini
// multimodal API, which transcribes Hindi/Hinglish accurately
// and keeps English brand words correct.

const GEMINI_API_KEY =
  import.meta.env?.VITE_GEMINI_API_KEY ||
  import.meta.env?.REACT_APP_GEMINI_API_KEY ||
  (typeof process !== "undefined" && (process.env?.VITE_GEMINI_API_KEY || process.env?.REACT_APP_GEMINI_API_KEY)) ||
  "";

// Preferred STT model (overridable via VITE_GEMINI_STT_MODEL)
const GEMINI_MODEL = import.meta.env?.VITE_GEMINI_STT_MODEL || "gemini-3.5-flash";

export const isGeminiSTTAvailable = () => Boolean(GEMINI_API_KEY);

// The modern mic APIs (MediaRecorder / FileReader) only exist in new browsers
export const cloudMediaSupported = () =>
  typeof navigator !== "undefined" &&
  !!navigator.mediaDevices?.getUserMedia &&
  typeof MediaRecorder !== "undefined" &&
  typeof FileReader !== "undefined";

// ---- Recording helpers ----

// Open the mic and start recording. Returns the recorder + collected chunks.
export const startCloudRecording = async () => {
  let stream;
  try {
    // Mono, 48 kHz, 16-bit — better word capture than the browser default
    // (soft word endings and English words spoken with a Hindi accent survive).
    // Noise suppression / AGC / echo cancellation keep room noise out so the
    // model hears the speaker's words and nothing else.
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 48000,
        sampleSize: 16,
        echoCancellation: true,
        noiseSuppression: true,
        automaticGainControl: true,
      },
      video: false,
    });
  } catch (_) {
    // Some browsers reject advanced constraints — retry with the basics only.
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        automaticGainControl: true,
      },
      video: false,
    });
  }

  // Probe MediaRecorder.isTypeSupported to pick the best available codec.
  // Prefer audio/mp4 (AAC) — Gemini handles it most reliably — then fall
  // back to Opus in a WebM container.
  const MIME_PREFERENCE = [
    "audio/mp4;codecs=aac",
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ];
  const pickMimeType = () => {
    if (typeof MediaRecorder?.isTypeSupported === "function") {
      for (const m of MIME_PREFERENCE) {
        if (MediaRecorder.isTypeSupported(m)) return m;
      }
    }
    return "";
  };

  const chosenMime = pickMimeType();
  const recorderOptions = {
    audioBitsPerSecond: 64000,
  };
  if (chosenMime) recorderOptions.mimeType = chosenMime;

  let recorder;
  try {
    recorder = new MediaRecorder(stream, recorderOptions);
  } catch (_) {
    // Constructor options can fail on old versions — let browser pick default.
    recorder = new MediaRecorder(stream);
  }

  const chunks = [];
  recorder.addEventListener("dataavailable", (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  });
  // Collect in frequent 200ms intervals so no words are dropped at the end
  recorder.start(200);
  return { stream, recorder, chunks };
};

// Stop recording and assemble the audio file (Blob).
export const stopCloudRecording = async ({ recorder, chunks, stream }) => {
  return new Promise((resolve) => {
    const handleStop = () => {
      try {
        stream?.getTracks()?.forEach((t) => t.stop());
      } catch (_) {}
      if (!chunks.length) {
        resolve(null);
      } else {
        resolve(new Blob(chunks, { type: recorder.mimeType }));
      }
    };

    if (recorder.state === "inactive") {
      handleStop();
      return;
    }

    recorder.addEventListener("stop", handleStop, { once: true });
    try {
      recorder.stop();
    } catch (_) {
      handleStop();
    }
  });
};

// ---- Transcription ----

// Gemini accepts these plain (codec-stripped) MIME types.
const GEMINI_ACCEPTED_MIME = ["audio/mp4", "audio/webm", "audio/wav", "audio/ogg"];

const normalizeBlobMime = (raw) => {
  if (!raw || typeof raw !== "string") return "audio/webm";
  // Strip codec parameters (e.g. "audio/webm;codecs=opus" -> "audio/webm")
  const clean = raw.split(";")[0].trim().toLowerCase();
  if (GEMINI_ACCEPTED_MIME.includes(clean)) return clean;
  // Map other containers onto the closest accepted type
  if (clean.includes("mp4") || clean.includes("aac") || clean.includes("m4a")) return "audio/mp4";
  if (clean.includes("ogg")) return "audio/ogg";
  if (clean.includes("wav") || clean.includes("wave")) return "audio/wav";
  if (clean.includes("webm") || clean.includes("opus")) return "audio/webm";
  return "audio/webm";
};

// Strip wrapper quotes / labels the model may add and treat the EMPTY
// sentinel (any casing) as "no speech", so formatting noise never eats words.
const cleanTranscript = (raw) => {
  const text = (raw || "")
    .replace(/^\s*(transcript|transcription|output|audio)\s*[:\-]\s*/i, "")
    .replace(/^[`"'\u201c\u2018]+|[`"'\u201c\u2019]+$/g, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return /^empty$/i.test(text) ? "" : text;
};

const blobToBase64 = async (blob) => {
  let buffer;
  if (typeof blob.arrayBuffer === "function") {
    buffer = await blob.arrayBuffer();
  } else {
    buffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }
  const bytes = new Uint8Array(buffer);
  const CHUNK = 0x8000; // 32 KB — safely under string limits
  let binary = "";
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
};

// Instructed very explicitly so the model acts as a transcriptor, not a chatbot.
// Bilingual: handles English, Hindi, and Hinglish in Roman script.
const TRANSCRIBE_PROMPT = `You are a bilingual speech-to-text transcriber. The audio may contain English, Hindi (spoken in Devanagari), and/or Hinglish (Hindi written in Roman letters).
Transcribe the audio word-for-word exactly as spoken.

STRICT RULES:
- ALWAYS write the transcript in ROMAN (English) letters. NEVER output Devanagari script. Hindi must be written the way people type Hinglish, e.g. "courses kya hai", "internship karna hai".
- If the speaker uses English, keep it in English.
- Keep Hindi words AS SPOKEN, in Roman letters (kya, hai, aur, karna, karni, chahiye, kitna, kahan, kaise, milega, batado, nahi, bhi, sab, mujhe, aap).
- Capture EVERY spoken word. Never skip, merge or shorten words.
- Write numbers as digits (3 months, 5000 rupees, 10th) and keep names and dates exactly as spoken.
- If a word is unclear, write your best phonetic guess in Roman letters — never leave a blank.
- Do NOT summarize, rephrase, explain, or answer the question. Only output the spoken words. If no speech is detected, reply with EMPTY.
- The brand name is "Envistream EduSkill".`;

/**
 * Transcribe a recorded Blob via Google's Gemini multimodal API.
 * Uses free Gemini models with automatic candidate fallback:
 * gemini-3.5-flash, gemini-3.5-flash-lite, gemini-3.1-flash-lite, etc.
 *
 * @param {Blob} blob - audio recording from startCloudRecording()
 * @returns {Promise<string>} - the transcribed text (Roman characters)
 */
export const transcribeWithGemini = async (blob) => {
  const data = await blobToBase64(blob);
  const mimeType = normalizeBlobMime(blob.type);

  const call = async (model) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: TRANSCRIBE_PROMPT },
                { inlineData: { mimeType, data } },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 2048,
          },
        }),
      });
      const body = await response.text();
      return { ok: response.ok, status: response.status, body };
    } catch (e) {
      return {
        ok: false,
        status: 0,
        body: e?.name === "AbortError" ? "request timed out after 12s" : String(e?.message || e),
      };
    } finally {
      clearTimeout(timer);
    }
  };

  // Free Gemini models for STT transcription, ordered with user-requested models
  const candidateModels = [
    GEMINI_MODEL,
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
  ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

  let lastStatus = 0;
  let lastBody = "";
  let heardOnce = false;

  for (const model of candidateModels) {
    try {
      const { ok, status, body } = await call(model);
      if (ok) {
        heardOnce = true;
        const json = JSON.parse(body);
        const rawText = (json.candidates?.[0]?.content?.parts ?? [])
          .filter((p) => !p.thought)
          .map((p) => p.text || "")
          .join("");
        const text = cleanTranscript(rawText);
        if (text) return text;
        console.warn(`Gemini STT "${model}" returned no words — trying next candidate...`);
        continue;
      }
      lastStatus = status;
      lastBody = body;
      console.warn(`Gemini STT with model "${model}" failed (${status}) — trying next candidate...`);
    } catch (e) {
      console.warn(`Gemini STT network error on "${model}":`, e);
    }
  }

  if (heardOnce) return "";
  throw new Error(`Gemini STT error ${lastStatus}: ${lastBody.slice(0, 300)}`);
};
