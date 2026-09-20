// ---- Gemini Speech-to-Text (AI mic) ----
// Chrome's free Web Speech recognizer cannot learn custom words, so it keeps
// mishearing the brand "Envistream EduSkill" differently on every try (fast,
// slow, odd pace...). When VITE_GEMINI_API_KEY is configured, we record the
// mic audio with the modern MediaRecorder and send it to the Gemini API, which
// transcribes Hindi/Hinglish accurately and keeps English brand words correct.

const GEMINI_API_KEY =
  typeof process !== "undefined" && process.env
    ? process.env.VITE_GEMINI_API_KEY || ""
    : import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY || "" : "";

const GEMINI_MODEL =
  typeof process !== "undefined" && process.env
    ? process.env.VITE_GEMINI_MODEL || "gemini-3.5-flash"
    : import.meta.env ? import.meta.env.VITE_GEMINI_MODEL || "gemini-3.5-flash" : "gemini-3.5-flash";

// Current active STT model
const FALLBACK_MODEL = "gemini-3.5-flash";

// Instructed very explicitly so the model acts as a transcriptor, not a chatbot.
// Bilingual: handles English, Hindi (Devanagari), and Hinglish (Hindi in Roman)
// so the transcript preserves whatever script the speaker actually used.
const TRANSCRIBE_PROMPT = `
You are a bilingual speech-to-text transcriber. The audio may contain English,
Hindi (spoken in Devanagari), and/or Hinglish (Hindi written in Roman letters).
Transcribe the audio word-for-word exactly as spoken.

STRICT RULES:
- ALWAYS write the transcript in ROMAN (English) letters. NEVER output
  Devanagari script, not even for one word. Hindi must be written the way people
  type Hinglish, e.g. "courses kya hai", "internship karna hai". (The app needs
  Roman Hinglish — Devanagari gets converted afterwards and mangles words like
  "courses" into "korsesa", so never produce Devanagari at all.)
- If the speaker uses English, keep it in English.
- Keep Hindi words AS SPOKEN, in Roman letters (kya, hai, aur, karna, karni,
  chahiye, kitna, kahan, kaise, milega, batado, nahi, bhi, sab, mujhe, aap).
- Capture EVERY spoken word, including short ones (a, hai, ko, the, to, is,
  bhi, kya). Never skip, merge or shorten words — keep a space between every
  word: write "internship karna hai", never "internshipkarna".
- Write numbers as digits (3 months, 5000 rupees, 10th) and keep names and
  dates exactly as spoken.
- If a word is unclear, write your best phonetic guess in Roman letters —
  never drop it, never leave a blank or a placeholder.
- Do NOT summarize, rephrase, skip words, or add words. No quotes, no
  explanations, no markdown, no leading/trailing whitespace beyond what
  naturally belongs in the sentence.
- The brand name is "Envistream EduSkill". Spell it that way ONLY when the speaker
  actually says the brand name (however garbled it sounds) — NEVER invent it.
- "SAP" is a REAL course topic (ERP/SAP). When the speaker says "sap", write
  "SAP". Never rewrite "sap" as the brand name, and never as "sab".
- Keep English words correctly spelled: courses, internship, placement,
  training, provide, location, admission, website, email, fees, duration.
- If there is no clear human speech, output exactly: EMPTY

- NEVER invent, complete, pad or guess a sentence. Do not add a question the
  speaker did not ask and do not add words they did not say. If the clip has only
  two words, return ONLY those two words. A short transcript is always better
  than a made-up longer one.
- Never add the brand name, "courses available hain", or any similar phrase
  unless you clearly hear it in the audio.
`;

export const isGeminiSTTAvailable = () => true;

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
  // back to Opus in a WebM container. This is more robust than reading
  // track.audioFormat (a very new, poorly-supported property).
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
    return null; // let the browser pick its default
  };

  const chosenMime = pickMimeType();
  // 128 kbps keeps consonants crisp — a measurable accuracy win for Hinglish
  // STT (the browser default bitrate smears soft word endings).
  const recorderOptions = { audioBitsPerSecond: 128000 };
  if (chosenMime) recorderOptions.mimeType = chosenMime;

  let recorder;
  try {
    recorder = new MediaRecorder(stream, recorderOptions);
  } catch (_) {
    // Constructor options can fail on old versions — let Chrome pick its default.
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

// Gemini accepts these plain (codec-stripped) MIME types. Any other or
// missing type is normalised to audio/mp4 (our preferred recording format
// and the most reliably transcribed container for Gemini).
const GEMINI_ACCEPTED_MIME = ["audio/mp4", "audio/webm", "audio/wav", "audio/ogg"];

const normalizeBlobMime = (raw) => {
  if (!raw || typeof raw !== "string") return "audio/webm";
  // Strip codec parameters (e.g. "audio/webm;codecs=opus" → "audio/webm")
  const clean = raw.split(";")[0].trim().toLowerCase();
  if (GEMINI_ACCEPTED_MIME.includes(clean)) return clean;
  // Map other containers onto the closest accepted type instead of defaulting
  // to audio/mp4 — a wrong MIME makes Gemini fail to DECODE the audio and
  // silently drop words, which is exactly what we must avoid.
  if (clean.includes("mp4") || clean.includes("aac") || clean.includes("m4a")) return "audio/mp4";
  if (clean.includes("ogg")) return "audio/ogg";
  if (clean.includes("wav") || clean.includes("wave")) return "audio/wav";
  if (clean.includes("webm") || clean.includes("opus")) return "audio/webm";
  // Unknown/browser-default blob type — trust the browser's own default.
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

export const transcribeWithGemini = async (blob) => {
  const data = await blobToBase64(blob);
  // Gemini requires clean MIME types without codec parameters.
  // Validate and normalise whatever the MediaRecorder produced.
  const mimeType = normalizeBlobMime(blob.type);

  const call = async (model) => {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    // A stalled request used to hang the mic indefinitely (the user just waited).
    // Bound every attempt so a slow model is abandoned and the next one tried.
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
            // 2048 so a thinking model (gemini-3.5-flash) can never eat the whole
            // budget with reasoning tokens and cut the transcript short — a
            // truncated transcript silently dropped the user's last words.
            maxOutputTokens: 2048,
          },
        }),
      });
      const body = await response.text();
      return { ok: response.ok, status: response.status, body };
    } catch (e) {
      // Timeout / offline — report it like an HTTP failure so the loop moves on.
      return {
        ok: false,
        status: 0,
        body: e?.name === "AbortError" ? "request timed out after 12s" : String(e?.message || e),
      };
    } finally {
      clearTimeout(timer);
    }
  };

  // If the initial model fails, retry with verified active models.
  // Ordered FASTEST-FIRST using measured latency (same models, real request):
  //   gemini-flash-lite-latest  ~1.6s   (no thinking tokens)
  //   gemini-3.5-flash-lite     ~2.0s   (no thinking tokens)
  //   gemini-3.1-flash-lite     ~2.8s
  //   gemini-3.5-flash          ~7.4s   (burns ~750 thinking tokens — last resort)
  // A long sentence used to wait on the slowest model whenever an earlier one
  // answered badly, which made transcription feel very slow.
  const candidateModels = [
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
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
          .map((p) => p.text || "")
          .join("");
        const text = cleanTranscript(rawText);
        // Real words → done. A spurious EMPTY (or an empty/truncated response)
        // is retried on the next model instead of giving up, so a one-off model
        // hiccup never silently swallows the user's sentence.
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

  // Every model answered successfully → the audio really was silence/noise.
  if (heardOnce) return "";
  throw new Error(`Gemini STT error ${lastStatus}: ${lastBody.slice(0, 300)}`);
};
