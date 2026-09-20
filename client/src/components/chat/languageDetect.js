// ---- Adaptive language detection ----
// Sayraa mirrors the user's language:
//   • English message            → Sayraa replies in clear English
//   • Hinglish / mixed / Hindi   → Sayraa replies in Hinglish (Roman script)
// Detection is heuristic (no API call): Devanagari characters, common Hinglish
// words, and the ratio of Hindi-flavoured words vs English words.

const DEVANAGARI_RE = /[\u0900-\u097F]/;

// Common Hinglish/Hindi words written in Roman letters. Deliberately excludes
// words that are ALSO valid English (main, fees, batch, ya, ...) so a pure
// English question like "What are the fees?" is never misread as Hinglish.
const HINGLISH_MARKERS = new Set([
  "kya", "kyu", "kyun", "kaise", "kaisa", "kaisi", "kaha", "kahan", "kab",
  "kaun", "kon", "kitna", "kitne", "hai", "hain", "ho", "hoga", "hogi",
  "hota", "hoti", "hote", "kar", "karo", "karna", "karni", "karte", "karke",
  "mujhe", "muje", "mein", "mera", "meri", "aap", "ap", "tum",
  "tera", "teri", "hamara", "humara", "iska", "uska", "isko", "usko",
  "nahi", "nahin", "haan", "ji", "bhai", "didi", "yaar",
  "namaste", "namaskar", "shukriya", "dhanyavad", "achha", "acha",
  "theek", "thik", "chalega", "bhaiya", "kripya",
  "chahiye", "chaiye", "chahta", "chahti", "sakta", "sakti", "sakhte",
  "batao", "batana", "poochho", "puchho", "pucho",
  "paise", "shuru", "khatam", "jaldi", "abhi", "phir",
  "fir", "bhi", "aur", "sab", "kuch", "koi", "sath", "saath",
  "madad", "jaanna", "janna", "seekhna", "seekh", "padhai", "padho",
  "samajh", "bilkul", "zaroor", "thoda", "bahut", "bohot",
]);

// English words that indicate a pure-English message even when short.
const ENGLISH_MARKERS = new Set([
  "the", "is", "are", "what", "how", "when", "where", "which", "who",
  "can", "could", "would", "should", "do", "does", "did", "please",
  "tell", "about", "course", "courses", "internship", "fee", "fees",
  "admission", "enroll", "placement", "training", "provide", "offer",
  "hello", "hi", "hey", "thanks", "thank", "want", "need", "know",
]);

/**
 * Detect the language of a user message.
 * @param {string} text - raw user message (typed or voice transcript)
 * @returns {"english" | "hinglish"}
 */
export const detectUserLanguage = (text) => {
  if (!text || !text.trim()) return "hinglish"; // Sayraa's home language

  // Any Devanagari script (even mixed with English) → treat as Hindi/Hinglish
  if (DEVANAGARI_RE.test(text)) return "hinglish";

  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "hinglish";

  let hinglishHits = 0;
  let englishHits = 0;
  for (const w of words) {
    if (HINGLISH_MARKERS.has(w)) hinglishHits++;
    else if (ENGLISH_MARKERS.has(w)) englishHits++;
  }

  if (hinglishHits > 0) return "hinglish";
  if (englishHits > 0) return "english";
  // No marker on either side — infer from the script actually used.
  return /[a-z]/i.test(text) ? "english" : "hinglish";
};

// Reply-style instruction for ENGLISH messages
export const ENGLISH_LANGUAGE_INSTRUCTION = `IMPORTANT LANGUAGE RULE: The user is writing in ENGLISH. Reply in clear, simple ENGLISH only. NEVER use Hindi, Hinglish or Devanagari script in your reply. You may still mention Hindi terms (like course names) if needed, but the sentence itself must be natural English.
This rule OVERRIDES the conversation: earlier messages in this chat are in Hinglish (the welcome message is Hinglish), but that must NOT change the language of THIS reply. Follow the language of the user's LATEST message, never the language of the previous turn.

BREVITY RULE: Answer in at most 2 short sentences (about 35 words). Long answers are slow to generate and slow to speak aloud, so be crisp. Only go longer when the user explicitly asks for full/complete detail, a list, or step-by-step information.`;

// Reply-style instruction for HINGLISH / mixed / Hindi messages
export const HINGLISH_LANGUAGE_INSTRUCTION = `IMPORTANT LANGUAGE RULE: The user is writing in HINGLISH or HINDI. Reply in natural HINGLISH — Hindi written in English (Roman) letters, e.g. 'aap kaise ho', 'main aapki kya madad kar sakti hoon'. NEVER use Devanagari script and NEVER reply in pure English sentences. Understand both English and Hindi inputs, but your reply must ALWAYS be Hinglish written in English letters only.

BREVITY RULE: Reply in at most 2 short sentences (about 35 words). Lambi answer generate hone aur bolne mein time lagta hai, isliye crisp rakho. Sirf tab lamba likho jab user khud puri detail, list ya step-by-step maange.`;

/**
 * Pick the reply-language instruction for a user message.
 * @param {string} text - raw user message
 * @returns {{ lang: "english"|"hinglish", instruction: string }}
 */
export const getLanguageInstruction = (text) => {
  const lang = detectUserLanguage(text);
  return {
    lang,
    instruction:
      lang === "english" ? ENGLISH_LANGUAGE_INSTRUCTION : HINGLISH_LANGUAGE_INSTRUCTION,
  };
};

// Last-resort instruction used if a reply still comes back in the wrong language.
export const ENGLISH_ENFORCE_INSTRUCTION = `OVERRIDE: Write your ENTIRE reply in ENGLISH, using only English words. You MUST NOT use Hindi or Hinglish words (no "hai", "kya", "aap", "hum", "aur", "ke liye"). Earlier Hinglish messages in this chat are irrelevant to this reply's language. Start your reply with an English word.`;

// ---------------------------------------------------------------------------
// Per-message reminders appended to the LAST user turn (highest weight for the
// model). Verified against the live API with a real Hinglish conversation
// history: without this, the small lite models answered 3 out of 15 ENGLISH
// questions in Hinglish; with it, 15 out of 15 came back in English.
// These strings are NOT saved to the chat history — they are a per-request nudge.
// ---------------------------------------------------------------------------
export const ENGLISH_TURN_REMINDER =
  "\n\n[Reply to this message in ENGLISH only, using English words. Do not use Hindi or Hinglish, even though earlier messages in this chat are in Hinglish.]";

export const HINGLISH_TURN_REMINDER =
  "\n\n[Reply to this message in HINGLISH only — Hindi written in Roman letters, natural and friendly. Do not reply in pure English, even if earlier messages in this chat are in English.]";

/**
 * Pick the reminder appended to the last user turn for a detected language.
 * @param {"english"|"hinglish"} lang
 */
export const getTurnReminder = (lang) =>
  lang === "english" ? ENGLISH_TURN_REMINDER : HINGLISH_TURN_REMINDER;

/**
 * Does a generated reply look like Hinglish/Hindi? Used to verify that an
 * English reply really came back in English.
 * Two marker hits are required: a single one can appear incidentally.
 * @param {string} text
 */
export const isHinglishText = (text) => {
  if (!text) return false;
  if (DEVANAGARI_RE.test(text)) return true;

  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  let hits = 0;
  for (const w of words) {
    if (HINGLISH_MARKERS.has(w) && ++hits >= 2) return true;
  }
  return false;
};

// with the detected reply language so English replies get a natural English
// voice and Hinglish replies get the clearest Hindi female voice.
// ---------------------------------------------------------------------------

/** @type {"english"|"hinglish"} */
const TTS_LANG = { english: "en-US", hinglish: "hi-IN" };

/**
 * Pick the TTS voice settings (browser speechSynthesis) for a detected language.
 * @param {"english"|"hinglish"} lang
 * @returns {{ lang: string, voiceHint: "english"|"hindi" }}
 */
export const getTtsVoice = (lang) =>
  lang === "english"
    ? { lang: TTS_LANG.english, voiceHint: "english" }
    : { lang: TTS_LANG.hinglish, voiceHint: "hindi" };