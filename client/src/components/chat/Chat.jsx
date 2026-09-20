import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./chat.module.css";
import Picker from "emoji-picker-react";
import eduskillLogo from "../../assets/img/sayraa-logo.jpg";
import chatBg from "../../assets/img/sayraa-bg.jpg";
import { fixPhonetics } from "./phoneticFixes";
import { isGeminiSTTAvailable, cloudMediaSupported, startCloudRecording, stopCloudRecording, transcribeWithGemini } from "./geminiStt";
import {
  getLanguageInstruction,
  getTurnReminder,
  getTtsVoice,
  isHinglishText,
  ENGLISH_ENFORCE_INSTRUCTION,
} from "./languageDetect";

// ---- Sweet female voice selection ----
// Sayraa always speaks with a cute, sweet FEMALE voice — in English AND in
// Hinglish. Browsers expose many English voices and often rank a male one
// first (Microsoft David, Google UK English Male, ...), which is why the reply
// could sound like a man. Every candidate is now scored and male voices are
// pushed to the very bottom of the list.
// NOTE: check order matters — "male" is a substring of "female", so a voice is
// only treated as male when it did NOT already match the female list.
const FEMALE_VOICE_NAMES = [
  // English
  "zira", "aria", "jenny", "michelle", "samantha", "victoria", "karen", "moira",
  "tessa", "fiona", "emma", "ava", "allison", "susan", "joanna", "salli",
  "kimberly", "ivy", "kendra", "female",
  // Warm/soft English voices that sound sweet rather than robotic
  "hazel", "libby", "sonia", "ana", "clara", "nancy", "amber", "ashley", "cora",
  "elizabeth", "monica", "sara", "denise", "jane", "amy", "nicole", "olivia",
  "mia", "linda", "heather", "emily", "serena", "allie", "kate", "stephanie",
  "catherine", "paula", "jessa", "ruth", "danielle",
  // Hindi / Indian English
  "swara", "kalpana", "neerja", "heera", "raveena", "ananya", "aarohi",
];
const MALE_VOICE_NAMES = [
  // English
  "david", "mark", "guy", "george", "james", "ryan", "alex", "daniel", "fred",
  "oliver", "thomas", "male",
  // Hindi / Indian
  "hemant", "madhur", "prabhat", "ravi", "rishi",
];

// Legacy SAPI "Desktop" voices are the flattest, most robotic ones a machine can
// have (Microsoft Zira/David Desktop, ...). They make Sayraa sound like a
// narration box instead of a sweet assistant, so they are penalised — never
// banned, because on some machines they are the only voices available.
const FLAT_VOICE_NAMES = [
  "zira", "desktop", "david", "mark", "hemant", "madhur", "ravi", "prabhat",
];

// True for voices that are clearly female (name tag or the voice's own gender).
const isFemaleVoice = (v, name) =>
  v.gender === "female" || FEMALE_VOICE_NAMES.some((f) => name.includes(f));

// True only for voices that are clearly male.
const isMaleVoice = (v, name) =>
  v.gender === "male" ||
  (!isFemaleVoice(v, name) && MALE_VOICE_NAMES.some((m) => name.includes(m)));

// Pick the clearest available Hindi voice (female preferred) for TTS.
// Ranked so high-quality "Natural"/"Online"/Google voices win over the
// legacy robotic SAPI voices (e.g. Microsoft Hemant) that Chrome/Edge
// otherwise return first — that legacy fallback is what made the female
// voice sound unclear.
const getSweetHindiVoice = (synth) => {
  const voices = synth.getVoices().filter(
    (v) =>
      v.lang === "hi-IN" ||
      (v.lang && v.lang.startsWith("hi")) ||
      v.name.includes("हिन्दी")
  );
  if (!voices.length) return null;

  const score = (v) => {
    const n = v.name.toLowerCase();
    let s = 0;
    // High-quality neural/online voices are far clearer than legacy SAPI ones
    if (n.includes("natural") || n.includes("online")) s += 8;
    if (n.includes("google")) s += 6;
    // Chrome's Hindi voice is listed as "Google हिन्दी" (female) — the name has
    // no gender word, so give the Indian-Hindi voices an explicit bonus.
    if (n.includes("हिन्दी") || n.includes("hindi")) s += 5;
    // Known female Hindi voices (Microsoft Swara, Microsoft Kalpana, Google हिन्दी)
    // Slightly stronger than a generic female tag so an explicitly-named sweet
    // voice always wins a tie against an unlabelled one.
    if (n.includes("swara") || n.includes("kalpana") || n.includes("neerja")) s += 6;
    // Sayraa is a sweet female character — always prefer a female voice
    if (isFemaleVoice(v, n)) s += 7;
    // Male voices — last resort only (they made Sayraa sound like a man)
    if (isMaleVoice(v, n)) s -= 10;
    // Flat legacy "Desktop" voices sound like a narration box
    if (FLAT_VOICE_NAMES.some((f) => n.includes(f))) s -= 5;
    return s;
  };

  return voices.sort((a, b) => score(b) - score(a))[0];
};

// Pick the clearest available English voice for TTS (used when the user writes
// in English so Sayraa replies in kind with a natural English voice).
const getSweetEnglishVoice = (synth) => {
  const voices = synth.getVoices().filter(
    (v) =>
      v.lang === "en-US" ||
      (v.lang && v.lang.startsWith("en"))
  );
  if (!voices.length) return null;

  const score = (v) => {
    const n = v.name.toLowerCase();
    let s = 0;
    // High-quality neural/online/WaveNet voices are the clearest
    if (n.includes("wavenet") || n.includes("neural") || n.includes("online")) s += 8;
    if (n.includes("natural")) s += 6;
    if (n.includes("google") || n.includes("azure") || n.includes("amazon")) s += 5;
    // A sweet FEMALE English voice is what Sayraa should always sound like
    if (isFemaleVoice(v, n)) s += 7;
    // Chrome's "Google US English" is a female voice even though its name does
    // not say so — give it the female-tier bonus by exact name (an exact match
    // can never accidentally tag a "... Male" voice as female).
    if (n === "google us english") s += 7;
    // ...and a male voice must never win, even if it is technically higher quality
    if (isMaleVoice(v, n)) s -= 10;
    // A plain en-US voice pronounces English replies most naturally and keeps
    // voice + utterance.lang consistent
    if (v.lang === "en-US") s += 6;
    // Basic SAPI "Microsoft [Name]" voices without quality tags are robotic
    if (n.includes("microsoft") && !n.includes("wavenet") && !n.includes("neural") && !n.includes("natural") && !n.includes("online")) s -= 3;
    // Flat legacy "Desktop" voices sound like a narration box — avoid unless
    // there is nothing sweeter on the machine
    if (FLAT_VOICE_NAMES.some((f) => n.includes(f))) s -= 5;
    return s;
  };

  return voices.sort((a, b) => score(b) - score(a))[0];
};

// Indian-English voices pronounce Hinglish (Hindi written in Roman letters) far
// more naturally than a US/UK voice, so this is the first fallback to use when
// the machine has no Hindi voice installed.
// Returns null (rather than a male voice) when no FEMALE Indian-English voice
// exists — Sayraa must stay female, so the caller then falls back to a female
// English voice instead of e.g. Microsoft Ravi (male).
const getSweetIndianEnglishVoice = (synth) => {
  const femaleVoices = synth.getVoices().filter((v) => {
    const isIndian = v.lang === "en-IN" || (v.name && v.name.toLowerCase().includes("en-in"));
    return isIndian && !isMaleVoice(v, v.name.toLowerCase());
  });
  if (!femaleVoices.length) return null;

  const score = (v) => {
    const n = v.name.toLowerCase();
    let s = 0;
    if (n.includes("natural") || n.includes("online") || n.includes("neural")) s += 8;
    if (n.includes("google") || n.includes("microsoft")) s += 4;
    if (isFemaleVoice(v, n)) s += 7;
    return s;
  };

  return femaleVoices.sort((a, b) => score(b) - score(a))[0];
};

// Optional manual override, so the sweetest voice on a given machine can be
// pinned without a rebuild:
//   sayraaUseVoice("Hazel")   → use the voice whose name contains "Hazel"
//   sayraaUseVoice()          → go back to automatic selection
// Stored in localStorage, so it survives refreshes.
const getForcedVoice = (synth) => {
  try {
    const wanted = localStorage.getItem("sayraaVoice");
    if (!wanted) return null;
    const match = synth
      .getVoices()
      .find((v) => v.name.toLowerCase().includes(wanted.toLowerCase()));
    if (!match) {
      console.warn(`Pinned voice "${wanted}" not found — using automatic selection.`);
      return null;
    }
    return match;
  } catch {
    return null;
  }
};

// Sweet delivery settings. Using the SAME voice with the SAME prosody in both
// languages is what makes an English reply sound as sweet as a Hinglish one.
const SWEET_ENGLISH_PROSODY = { rate: 0.96, pitch: 1.2 };
const SWEET_HINGLISH_PROSODY = { rate: 0.97, pitch: 1.15 };

// True for Hindi / Indian-English voices — they share the same soft timbre, so
// they get the identical (sweetest) delivery in either language.
const isIndianVoice = (v) => {
  if (!v) return false;
  const lang = (v.lang || "").toLowerCase();
  const name = (v.name || "").toLowerCase();
  return (
    lang.startsWith("hi") ||
    lang.startsWith("en-in") ||
    /hindi|हिन्दी|swara|kalpana|neerja|heera|raveena/.test(name)
  );
};

// Voice mode (localStorage "sayraaVoiceMode"):
//   "match"  (default) → English speaks with the same sweet Indian/Hindi voice
//                        family as Hinglish, so both sound like one person
//   "native"           → English uses a native (US/UK) female voice instead
const getVoiceMode = () => {
  try {
    return localStorage.getItem("sayraaVoiceMode") === "native" ? "native" : "match";
  } catch {
    return "match";
  }
};

/**
 * Single decision point for Sayraa's voice, so English and Hinglish can never
 * drift apart in tone.
 * Returns { voice, lang, rate, pitch, note }.
 */
const chooseSayraaVoice = (synth, lang = "hinglish") => {
  const wantsHindi = lang !== "english";
  const hindiVoice = getSweetHindiVoice(synth);
  const indianVoice = getSweetIndianEnglishVoice(synth);
  const englishVoice = getSweetEnglishVoice(synth);
  const pinned = getForcedVoice(synth);

  // 1. An explicit pin (sayraaUseVoice) overrides everything.
  if (pinned) {
    const isIndian = isIndianVoice(pinned);
    const prosody =
      !wantsHindi && !isIndian ? SWEET_ENGLISH_PROSODY : SWEET_HINGLISH_PROSODY;
    return { voice: pinned, lang: pinned.lang || "en-US", ...prosody, note: "pinned" };
  }

  // 2. Hinglish → Hindi female voice when installed, else Indian-English female.
  if (wantsHindi) {
    if (hindiVoice) {
      return {
        voice: hindiVoice,
        lang: hindiVoice.lang || "hi-IN",
        ...SWEET_HINGLISH_PROSODY,
        note: "hindi",
      };
    }
    if (indianVoice) {
      return {
        voice: indianVoice,
        lang: indianVoice.lang || "en-IN",
        ...SWEET_HINGLISH_PROSODY,
        note: "indian-english",
      };
    }
    return {
      voice: englishVoice,
      lang: "en-US",
      ...SWEET_HINGLISH_PROSODY,
      note: "english-fallback",
    };
  }

  // 3. English replies. Default "match" mode REUSES the very same sweet voice
  //    Hinglish uses, so an English answer sounds identical in tone instead of
  //    dropping to a flatter native voice.
  if (getVoiceMode() === "match") {
    if (hindiVoice) {
      return {
        voice: hindiVoice,
        lang: hindiVoice.lang || "hi-IN",
        ...SWEET_HINGLISH_PROSODY,
        note: "match-hindi",
      };
    }
    if (indianVoice) {
      return {
        voice: indianVoice,
        lang: indianVoice.lang || "en-IN",
        ...SWEET_HINGLISH_PROSODY,
        note: "match-indian-english",
      };
    }
  }

  return {
    voice: englishVoice,
    lang: "en-US",
    ...SWEET_ENGLISH_PROSODY,
    note: "native-english",
  };
};

const applyVoiceChoice = (utterance, choice) => {
  if (choice.voice) utterance.voice = choice.voice;
  if (choice.lang) utterance.lang = choice.lang;
  utterance.rate = choice.rate;
  utterance.pitch = choice.pitch;
  return choice;
};

const speakOnceVoicesReady = (speak, { attempts = 8, delay = 250 } = {}) => {
  if (typeof window === "undefined") return;
  let done = false;
  let tries = 0;

  const attempt = () => {
    if (done) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const ready =
      typeof synth.getVoices === "function" && synth.getVoices().length > 0;
    if (ready || tries >= attempts) {
      done = true;
      speak();
      return;
    }
    tries++;
    setTimeout(attempt, delay);
  };

  attempt();
};

// Chrome's autoplay policy can reject speech that starts before the user has
// interacted with the page (the utterance errors with "not-allowed"), and the
// greeting is spoken the moment the chat opens. The first tap/click/keypress is
// enough to be allowed — so re-try once, then.
const armSpeechRetryOnFirstGesture = (speak) => {
  if (typeof window === "undefined") return;
  let armed = true;

  const fire = () => {
    if (!armed) return;
    armed = false;
    window.removeEventListener("pointerdown", fire, true);
    window.removeEventListener("keydown", fire, true);
    window.removeEventListener("touchstart", fire, true);
    speak();
  };

  window.addEventListener("pointerdown", fire, true);
  window.addEventListener("keydown", fire, true);
  window.addEventListener("touchstart", fire, true);
};

// ---- Audio feedback tone when mic opens ----
// Plays a tiny subtle chime so the user knows the mic is listening,
// replacing the old spoken "Sun rahi hoon" which collided with the mic.
const playListenTone = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);
    setTimeout(() => { try { ctx.close(); } catch (_) {} }, 250);
  } catch (_) {
    // AudioContext blocked or not supported — silent fail
  }
};

// ---- Devanagari → English letters (Hinglish) transliteration ----
// The browser recognizer ("hi-IN") writes Hinglish speech in Devanagari
// (e.g. "कोर्सेज क्या प्रोवाइड करते हो"). The chat should show/send it in
// English letters ("korsej kya provaaid karte ho"), so we transliterate it
// ourselves. This keeps recognition accurate while always displaying
// Hinglish text.
const INDIC_CONSONANTS = {
  // Devanagari (Hindi)
  "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "n",
  "च": "ch", "छ": "chh", "ज": "j", "झ": "jh", "ञ": "n",
  "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n",
  "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
  "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m",
  "य": "y", "र": "r", "ल": "l", "व": "v", "श": "sh",
  "ष": "sh", "स": "s", "ह": "h", "ळ": "l", "़": "",
};
const INDIC_VOWELS = {
  "अ": "a", "आ": "aa", "इ": "i", "ई": "i", "उ": "u", "ऊ": "u",
  "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au", "ऋ": "ri",
  "ऑ": "o", "ऍ": "e",
};
const INDIC_MATRAS = {
  "ा": "a", "ि": "i", "ी": "i", "ु": "u", "ू": "u", "ृ": "ri",
  "े": "e", "ै": "ai", "ो": "o", "ौ": "au",
  "ॉ": "o", "ॅ": "e",
};
const INDIC_VIRAMAS = ["्"];
const INDIC_ANUSVARAS = ["ं", "ँ"];

const toEnglishLetters = (text) => {
  if (!text) return text;
  // Normalise nukta clusters first (ज़→ज, ड़→ड, ...) so they map cleanly
  const src = text
    .replace(/क़/g, "क").replace(/ख़/g, "ख").replace(/ग़/g, "ग")
    .replace(/ज़/g, "ज").replace(/ड़/g, "ड").replace(/ढ़/g, "ढ")
    .replace(/फ़/g, "फ").replace(/य़/g, "य");

  let out = "";
  let inherentAIndex = -1; // position of the implicit "a" after a consonant

  const dropInherentA = () => {
    if (inherentAIndex === out.length - 1) out = out.slice(0, -1);
    inherentAIndex = -1;
  };

  for (const ch of src) {
    if (INDIC_CONSONANTS[ch] !== undefined) {
      out += INDIC_CONSONANTS[ch] + "a";
      inherentAIndex = out.length - 1;
    } else if (INDIC_VIRAMAS.includes(ch)) {
      // Halant kills the implicit "a" (क् = "k" not "ka")
      dropInherentA();
    } else if (INDIC_MATRAS[ch]) {
      // Vowel sign replaces the implicit "a" (का = "ka" not "kaa"... etc.)
      dropInherentA();
      out += INDIC_MATRAS[ch];
    } else if (INDIC_VOWELS[ch]) {
      out += INDIC_VOWELS[ch];
      inherentAIndex = -1;
    } else if (INDIC_ANUSVARAS.includes(ch)) {
      out += "n";
      inherentAIndex = -1;
    } else if (ch === "ः") {
      out += "h";
      inherentAIndex = -1;
    } else if (ch === "।" || ch === "॥") {
      dropInherentA();
      out += ".";
    } else {
      
      dropInherentA();
      out += ch;
    }
  }
  dropInherentA(); 
  return out;
};
// ---- End transliteration ----

// ---- Adaptive language rule ----
// Sayraa mirrors the user's language: English messages get an English reply,
// Hinglish/Hindi messages get a Hinglish (Roman-script) reply.
// The actual instruction + TTS voice are chosen per-message via languageDetect.js
// inside sendMessage().

// Sayraa's opening line. It is shown in the chat the moment the component
// mounts, but it is SPOKEN only when the visitor actually opens the chatbot.
const SAYRAA_WELCOME = "Namaste! Mein hoon Sayraa, Envistream EduSkill ka chatbot. Courses, training aur internships ke baare mein poochho! 😊";

const GEMINI_API_KEY =
  typeof process !== "undefined" && process.env
    ? process.env.VITE_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY || ""
    : import.meta.env
    ? import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.REACT_APP_GEMINI_API_KEY || ""
    : "";

const Chat = ({ isOpen = false, onClose }) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [interimText, setInterimText] = useState("");

  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const isListeningRef = useRef(false);
  // While listening, this holds a function that finalises & sends early
  const stopEarlyRef = useRef(null);
  // Ensures the welcome message is spoken only once even in StrictMode dev
  const welcomeSpokenRef = useRef(false);
  // Cloud (Gemini) mic session + silence-watch interval
  const cloudRecRef = useRef(null);
  const sensingTimerRef = useRef(null);

  // NOTE: A FRESH SpeechRecognition instance is created on EVERY mic press
  // inside startListening(). Reusing a single instance created on mount is
  // unreliable in Chrome — after the first use it often silently stops
  // recognizing speech (this was the bug where the mic heard nothing).
  // Speak a reply — picks the matching voice for the reply language:
  //   "english" → natural English female voice
  //   "hinglish" → clearest Hindi female voice (Sayraa's home language)
  // `opts.append` = queue this utterance AFTER whatever is already speaking
  // instead of cancelling it. Used for progressive speech: the first sentence of
  // a long reply starts playing while the rest is still being generated.
  const speakText = useCallback((text, lang = "hinglish", opts = {}) => {
    const append = opts.append === true;

    if (typeof window === 'undefined') return;

    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn("Speech synthesis not available.");
      return;
    }
    // Cancel any ongoing speech immediately to avoid delays — but when the
    // caller asked to APPEND (progressive speech), leave the current sentence
    // playing and simply queue this one behind it.
    const wasSpeaking = synth.speaking || synth.pending;
    if (!append) synth.cancel();

    // Keep emojis on screen, but NEVER read them aloud ("smiling face" etc.)
    const spokenText = text
      .replace(/Sayraa/gi, "Sigh-raa")
      .replace(
        /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu,
        ""
      )
      .replace(/\s{2,}/g, " ")
      .trim();

    if (!spokenText) return;

    const wantsHindi = lang !== "english";
    // ONE decision point picks both the voice and its prosody, so English and
    // Hinglish always share the same sweet tone.
    const choice = chooseSayraaVoice(synth, lang);
    const hasHindiVoice =
      !!choice.voice && (choice.lang || "").toLowerCase().startsWith("hi");

    // Devanagari can ONLY be voiced by a Hindi voice. Sent to an English voice
    // Chrome reads it as literally nothing — which is why Sayraa's Devanagari
    // greeting used to be completely silent. So when no Hindi voice exists,
    // transliterate the Devanagari into Roman Hinglish, which every voice can
    // pronounce.
    let speakable = spokenText;
    if (wantsHindi && !hasHindiVoice && /[\u0900-\u097F]/.test(speakable)) {
      speakable = toEnglishLetters(speakable).replace(/\s{2,}/g, " ").trim();
      console.warn("No Hindi voice found — speaking Hinglish in Roman letters.");
    }

    const utterance = new SpeechSynthesisUtterance(speakable);
    // Applies voice + lang + sweet rate/pitch in one go.
    applyVoiceChoice(utterance, choice);

    // Voice + language + sweet prosody were all applied by applyVoiceChoice()
    // above — there is no separate English/Hinglish branch anymore, which is
    // exactly what stops English from sounding flatter than Hinglish.

    // If Chrome blocks speech until the user interacts (autoplay policy), retry
    // once on the very first click / key press / tap.
    utterance.onerror = (e) => {
      const err = e?.error || "";
      if (err === "not-allowed" || err === "not_allowed") {
        console.warn("Speech blocked before user interaction — will retry on first gesture.");
        armSpeechRetryOnFirstGesture(() => synth.speak(utterance));
      }
    };

    if (append) {
      // Nothing was cancelled, so the speech engine queues this utterance
      // natively right behind the sentence that is currently playing.
      synth.speak(utterance);
    } else if (wasSpeaking) {
      // Chrome sometimes swallows an utterance that starts in the same tick as
      // cancel(), so give the engine a moment to flush the previous speech.
      setTimeout(() => synth.speak(utterance), 80);
    } else {
      synth.speak(utterance);
    }
  }, []);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("sayraaMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const synth = window.speechSynthesis;
    if (synth) {
      synth.onvoiceschanged = () => {};
      window.sayraaVoices = () =>
        synth.getVoices().map((v) => `${v.name} (${v.lang})`);
      window.sayraaUseVoice = (name) => {
        try {
          if (name) localStorage.setItem("sayraaVoice", name);
          else localStorage.removeItem("sayraaVoice");
        } catch (_) {
          return "localStorage unavailable";
        }
        return `Sayraa voice = ${name || "auto (sweetest female voice)"}`;
      };
      window.sayraaVoiceMode = (mode) => {
        try {
          if (mode === "native" || mode === "match") {
            localStorage.setItem("sayraaVoiceMode", mode);
          } else {
            localStorage.removeItem("sayraaVoiceMode");
          }
        } catch (_) {
          return "localStorage unavailable";
        }
        return `English voice mode = ${getVoiceMode()} (match = same sweet voice as Hinglish)`;
      };
    }

  }, []);

  const medConfig = {
    identity: {
      name: "Sayraa",
      creator: "Envistream EduSkill",
      gender: "female",
      language: "Hinglish",
      age: 20,
      location: "Bhubaneswar, India",
      traits: ["knowledgeable", "friendly", "professional", "helpful", "playful"],
      capabilities: [
        "Course & training information 📚",
        "Internship program guidance 💼",
        "Enrollment help ✍️",
        "Placement & career support 🎯",
        "Project guidance 🛠️",
        "Contact & location info 📍",
      ],
    },
    systemMessage: `Act as Sayraa, a smart and friendly AI learning guide at Envistream EduSkill (an IT training and internship institute in Bhubaneswar, Odisha).

      CORE BEHAVIOR RULES:
       1. LANGUAGE: Mirror the user's language — reply in English when they write in English, and Hinglish (Hindi in Roman alphabet) when they write in Hinglish/Hindi. Never use Devanagari script. A specific per-message language instruction is appended to this system prompt each time.
      2. BRANDING & NO SALES CTAs (CRITICAL):
         - In the FIRST reply/interaction of the chat, mention "Envistream EduSkill" naturally (e.g., "Envistream EduSkill mein...").
         - In SUBSEQUENT chat messages, it is NOT necessary to repeat "Envistream EduSkill" in every chat! Speak naturally using "hum", "hamare yahan", or answer directly without repeating the brand name every time.
         - NEVER add call-to-action (CTA) slogans like "detail ke liye Enquire Now dabayein! 🚀", "Enroll Now pe click karein", "Apply Now dabayein", etc. Do NOT tell the user to click buttons or enquire.
         - DO NOT append phone numbers (+91 7873489364), website links (www.envistream.org), or sales pitches ("call karein...", "visit karein...") to everyday answers. Mention phone numbers or website ONLY when the user explicitly asks for contact info, calling, registration, or admission.
      3. EXPLAINING TECH CONCEPTS ("X kya hai"):
         - When the user asks what a technology or course topic is (e.g. "PHP kya hai", "Python kya hota hai", "Software testing kya hai", "React kya hai"):
           * Step 1: Explain simply and clearly in 1-2 lines what that technology is and where it is used.
           * Step 2: In 1 short line, mention that practical training and live project internship is available (use "Envistream EduSkill" in the first chat, and "hamare yahan" in subsequent chats).
           * Example for first chat "PHP kya hai": "PHP ek popular server-side scripting language hai jo dynamic websites aur web apps banane ke liye use hoti hai. Envistream EduSkill mein iska Laravel ke sath practical training aur live project internship available hai. Iske baare mein aur jaanna hai? 😊"
           * Example for follow-up "Python kya hai": "Python ek versatile programming language hai jo AI, data science aur web development mein use hoti hai. Hamare yahan iska bhi complete practical training aur live project internship available hai. 😊"
      4. KEEP ANSWERS SHORT & NATURAL: Maximum 2-3 short lines. Never write marketing pitches, CTA slogans, or big paragraphs.
      5. For "courses kya hai" type questions, reply with just the course names in 1-2 lines (comma separated). Give full details ONLY when the user asks about ONE specific course.
      6. For location questions, reply ONLY with the address in 1-2 lines. Do NOT include phone number or call instructions unless specifically asked for contact/calling details.
      7. VOICE INPUT: user messages often come from a speech recognizer and contain PHONETIC spelling mistakes (e.g. 'korsej kya provaaid karte ho' = 'Courses kya provide karte ho'; 'lokeshan kahan hai' = 'Location kahan hai'). Silently understand the intended meaning and answer normally.
      8. OFF-TOPIC: If the user asks completely unrelated topics (movies, politics, cricket, jokes, cooking), politely refuse: "Main courses, training aur internships ke baare mein guide karti hoon! Iske related kuchh poochhna hai? 😊"
      9. When asked "tumhe kon banaya hai" respond: "Mujhe Envistream EduSkill ki team ne banaya hai 🧑💻"

      KNOWLEDGE BASE:
      - IT Training / CSE Programs: Software Testing (manual + automation testing for QA), Cypress Automation (web automation with Cypress and JavaScript), ERP/SAP Training, SAP Testing, Web Development (HTML, CSS, JavaScript, jQuery, Bootstrap), Node.js & React.js (full-stack web apps), Digital Marketing (AI SEO, SEM, social media), Artificial Intelligence, PHP (with Laravel), Python, Java.
      - BBA/MBA Programs: Digital Marketing, SEO Training, Social Media Marketing, Market Research, Business Development, Lead Generation.
      - Projects offered: PHP projects (e.g., Chatbot for Students, College Admission Prediction System), Web Development projects (e.g., One-Page Layout, Product Landing Page), Python projects (e.g., Games, Automation apps), Java projects (e.g., Airline Reservation System, Course Management System).
      - Benefits: Technical workshops, 24x7 lab facility, experienced trainers from top MNCs, live project experience, placement assistance, mock interviews.
      - Location: Plot-N6/454, 2nd floor, Saffire Building, Opposite- Crown Hotel, IRC Village, Nayapalli, Bhubaneswar, Odisha.
      - Contact (give ONLY when asked): Phone: +91 7873489364 / +91 9078419012. Email: training@envistream.org. Website: www.envistream.org

      Examples:
      User (First chat): "PHP kya hai?"
      Response: "PHP ek popular server-side scripting language hai jo dynamic websites aur web applications banane ke liye use hoti hai. Envistream EduSkill mein iska Laravel ke sath live project training aur internship available hai. Iske baare mein aur jaanna hai? 😊"

      User: "Courses kya hai?"
      Response: "Software Testing, Cypress Automation, Web Development, PHP (Laravel), Python, Java, Node.js & React.js, Digital Marketing & AI, aur ERP/SAP. Kisi ek course ki detail chahiye? 😊"

      User: "Location kya hai?"
      Response: "Plot-N6/454, 2nd floor, Saffire Building, Opposite- Crown Hotel, IRC Village, Nayapalli, Bhubaneswar, Odisha. 😊"

      User: "Internship kaise paun?"
      Response: "Aap humari website www.envistream.org par enroll kar sakte hain ya call karein +91 7873489364 pe! 😊"`,
  };

  useEffect(() => {
    const welcomeText = SAYRAA_WELCOME;
    const initialMessages = [{
      text: welcomeText,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }];
    setMessages(initialMessages);

    const initialHistory = [
      {
        role: "model",
        parts: [{ text: welcomeText }],
      },
    ];
    setConversationHistory(initialHistory);
  }, []);

  // Speak the greeting ONLY when the visitor actually OPENS the chatbot.
  // ChatbotPopup keeps <Chat> mounted (hidden via display:none) even while the
  // panel is closed, so speaking on mount made Sayraa greet people the instant
  // the website loaded — before anyone opened the chat. Opening is also a real
  // user gesture, which satisfies Chrome's autoplay policy for speech.
  useEffect(() => {
    if (!isOpen) return;
    if (welcomeSpokenRef.current) return; // never greet twice
    welcomeSpokenRef.current = true;
    // Speak the welcome in Roman Hinglish: a Devanagari string is silent on
    // machines without a Hindi voice, so this keeps the greeting audible
    // everywhere (and matches the bubble text on screen).
    speakOnceVoicesReady(() => speakText(SAYRAA_WELCOME, "hinglish"));
  }, [isOpen, speakText]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("sayraaMessages", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

// ================== AI mic (Gemini cloud speech-to-text) ==================
  // Stops the recorder, sends the audio to Gemini and sends the transcript.
  // Used both by the auto-silence detector and by pressing the mic again.
  const releaseCloudListen = () => {
    isListeningRef.current = false;
    setIsListening(false);
    setInterimText("");
  };

  const finalizeCloud = async () => {
    const session = cloudRecRef.current;
    if (!session) return;
    cloudRecRef.current = null;

    if (sensingTimerRef.current) {
      clearInterval(sensingTimerRef.current);
      sensingTimerRef.current = null;
    }
    stopEarlyRef.current = null;

    // Keep the listening state ON so the "mein samajh rahi hoon..." bubble shows
    setInterimText(" mein samajh rahi hoon... 🤖");

    let blob;
    try {
      blob = await stopCloudRecording(session);
    } catch (_) {
      releaseCloudListen();
      return;
    }

    if (!blob || blob.size < 1000) {
      releaseCloudListen();
      setMessages((prev) => [
        ...prev,
        { text: "Kuch sunai nahi diya... mic ke paas aake thoda aur clearly bolo na! 🎙️", sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
      return;
    }

    let transcript = "";
    try {
      transcript = await transcribeWithGemini(blob);
    } catch (err) {
      console.error("Gemini STT error:", err);
      releaseCloudListen();
      let errorText = "AI mic me problem aayi! Dobara try karo ya message likh do. ⌨️😊";
      const details = String(err?.message || "");
      if (/401|403|400/.test(details)) {
        errorText = "Gemini API key problem hai! .env mein VITE_GEMINI_API_KEY check karo. 🔑";
      } else if (/429/.test(details)) {
        errorText = "Thodi der ruko! Gemini free limit full ho gayi, 1 min baad try karo. ⏳";
      }
      setMessages((prev) => [
        ...prev,
        { text: errorText, sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
      return;
    }

    releaseCloudListen();

    // Romanize (in case the model returned Devanagari for Hindi speech) and
    // apply the same phonetic safety net as the browser mic.
    const text = fixPhonetics(toEnglishLetters(transcript));
    if (text && text.trim()) sendMessage(text.trim());
  };

  const beginCloudRecognition = async () => {
    isListeningRef.current = true;
    setIsListening(true);
    setInterimText("");

    let session;
    try {
      session = await startCloudRecording();
    } catch (err) {
      console.error("Cloud mic error:", err);
      isListeningRef.current = false;
      setIsListening(false);
      setInterimText("");
      setMessages((prev) => [
        ...prev,
        { text: "Mic start nahi ho paya! Browser mic permission do aur fir se try karo. 🎙️", sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
      return;
    }

    cloudRecRef.current = session;
    playListenTone();
    stopEarlyRef.current = finalizeCloud;

    // Fast Voice Activity Detection (VAD) with standard Web Audio API
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) throw new Error("AudioContext not supported");

      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(session.stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.2;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let lastSound = Date.now();
      let hasSpoken = false;

      sensingTimerRef.current = setInterval(() => {
        if (!cloudRecRef.current) {
          if (sensingTimerRef.current) clearInterval(sensingTimerRef.current);
          try { audioCtx.close(); } catch (_) {}
          return;
        }

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;

        // Human voice detection threshold (sensitive to soft speech and end of words)
        if (avg > 10) {
          hasSpoken = true;
          lastSound = Date.now();
        }

        // Full sentence pause threshold: 1.1s silence after speaking, or 6s
        // before the first word. (Was 2.0s — a full second of dead time added to
        // EVERY voice question before transcription even started.)
        const silenceThreshold = hasSpoken ? 1100 : 6000;
        if (Date.now() - lastSound > silenceThreshold) {
          if (sensingTimerRef.current) clearInterval(sensingTimerRef.current);
          try { audioCtx.close(); } catch (_) {}
          finalizeCloud();
        }
      }, 100);

      // Max recording cap for long queries: 25 seconds
      setTimeout(() => {
        if (cloudRecRef.current) finalizeCloud();
      }, 25000);
    } catch (_) {
      // Fallback timer if AudioContext blocked: 8 seconds
      setTimeout(() => {
        if (cloudRecRef.current) finalizeCloud();
      }, 8000);
    }
  };

  const startListening = () => {
    // Pressing the mic AGAIN while listening stops early & sends what was heard
    if (isListeningRef.current) {
      if (stopEarlyRef.current) stopEarlyRef.current();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // IMPORTANT: Stop any ongoing speech BEFORE opening the mic,
    // otherwise the bot's own voice gets picked up by recognition
    // and it fails to understand the user.
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // ---- AI (Gemini) live transcription — the accurate path ----
    // When an API key is configured and the modern mic APIs exist, we record
    // the audio and let Gemini transcribe it. This keeps the "Envistream
    // EduSkill" brand name and other English words correct no matter how fast
    // or slow the user speaks.
    if (isGeminiSTTAvailable() && cloudMediaSupported()) {
      beginCloudRecognition();
      return;
    }

    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        { text: "Is browser me speech recognition supported nahi hai! Chrome ya Edge browser use karo. 🎙️", sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
      return;
    }

    isListeningRef.current = true;
    setIsListening(true);
    setInterimText("");

    // Single-pass Hinglish recognition with the Hindi (hi-IN) engine.
    const beginRecognition = (isRetry = false) => {
      // Create a FRESH instance every time — reusing an old instance after
      // it has ended is unreliable in Chrome (mic stops recognizing words).
      const recognition = new SpeechRecognition();
      // continuous = true keeps the mic open for the WHOLE sentence.
      // With continuous = false Chrome finalised the FIRST word at the first
      // small pause and the bot answered immediately — that was the bug.
      recognition.continuous = true;
      recognition.interimResults = true; // live transcription while speaking
      recognition.lang = "hi-IN";
      // Ask for alternatives so we can keep the MOST CONFIDENT transcription
      // of each chunk — noticeably better accuracy for Hinglish words.
      recognition.maxAlternatives = 3;

      let gotResult = false;
      let hadError = false;
      let audioStarted = false;
      let finalTranscript = ""; // everything recognised so far (whole sentence)
      let silenceTimer = null;
      let sent = false;

      // Finalise: stop the mic and send the complete sentence
      const sendTranscript = () => {
        if (sent) return;
        sent = true;
        if (silenceTimer) clearTimeout(silenceTimer);
        stopEarlyRef.current = null;
        isListeningRef.current = false;
        setIsListening(false);
        setInterimText("");
        try { recognition.stop(); } catch (_) { /* already stopped */ }
        // Transliterate to Roman letters, then fix common phonetic mishearings
        // (e.g. "inglish medisin" -> "Envistream EduSkill") before sending.
        const raw = toEnglishLetters(finalTranscript.replace(/\s+/g, " ").trim());
        const text = fixPhonetics(raw);
        if (text) sendMessage(text);
      };

      // Keep listening while you talk; wait ~1.2 seconds of silence before
      // auto-sending so the speaker is never cut off mid-thought. (Was 2000ms —
      // that was pure dead time on every single question. The user can also tap
      // the mic icon again to send immediately.)
      const resetSilenceTimer = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(sendTranscript, 1200);
      };
      stopEarlyRef.current = sendTranscript;

      recognition.onaudiostart = () => {
        audioStarted = true;
      };

      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            gotResult = true;
            // Among the alternatives, keep the one Chrome is MOST confident
            // about (falls back to the first when no confidence is given).
            let best = result[0];
            for (let j = 1; j < result.length; j++) {
              if ((result[j].confidence || 0) > (best.confidence || 0)) {
                best = result[j];
              }
            }
            // Accumulate — do NOT send yet, the sentence may continue
            finalTranscript += best.transcript + " ";
          } else {
            interim += result[0].transcript;
          }
        }
        // Show live transcription (in English letters) of everything heard so far
        const liveText = toEnglishLetters(
          (finalTranscript + " " + interim).replace(/\s+/g, " ").trim()
        );
        if (liveText) setInterimText(liveText);
        // Still hearing speech → keep waiting for the rest of the sentence
        resetSilenceTimer();
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        hadError = true;
        sent = true; // don't auto-send after an error
        if (silenceTimer) clearTimeout(silenceTimer);
        stopEarlyRef.current = null;

        isListeningRef.current = false;
        setIsListening(false);
        setInterimText("");

        // Ignore 'aborted' — it happens when we cancel recognition ourselves
        if (event.error === "aborted") return;

        let errorText = "Oops! Speech samajh nahi aaya, fir se bolo na...";
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          errorText = "Mic permission blocked hai! Address bar ke 🔒 icon pe click karke microphone ALLOW karo, page reload karo. 🎙️";
        } else if (event.error === "no-speech") {
          errorText = "Kuch sunai nahi diya... mic ke paas aake thoda aur clearly bolo na! 🎙️";
        } else if (event.error === "network") {
          errorText = "Network problem hai! Speech recognition ke liye internet chahiye. 📶";
        } else if (event.error === "audio-capture") {
          errorText = "Mic detect nahi hua! Microphone connect karo aur fir se try karo. 🎙️";
        } else if (event.error === "language-not-supported") {
          errorText = "Ye browser ye language recognize nahi kar pa raha! Chrome ka naya version try karo. 🎙️";
        }

        setMessages((prev) => [
          ...prev,
          { text: errorText, sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ]);
      };

      recognition.onend = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        // Chrome sometimes ends the session by itself (silence cut-off) —
        // send whatever full sentence we managed to hear
        if (!sent && gotResult && finalTranscript.trim()) {
          sendTranscript();
          return;
        }
        stopEarlyRef.current = null;
        isListeningRef.current = false;
        setIsListening(false);
        setInterimText("");

        if (gotResult || hadError) return;

        if (!audioStarted) {
          // Recognition ended BEFORE the mic even opened. This happens when
          // the bot's text-to-speech was still holding the audio channel.
          // Retry once silently instead of showing an error to the user.
          if (!isRetry) {
            console.warn("Recognition ended before audio start — retrying...");
            isListeningRef.current = true; // block new presses while retrying
            setTimeout(() => beginRecognition(true), 400);
          } else {
            setMessages((prev) => [
              ...prev,
              { text: "Mic start nahi ho paya! Ek baar fir se 🎤 dabao.", sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
            ]);
          }
        }
        // Heard silence → stay quiet, no message
      };

      recognition.start();
      isListeningRef.current = true;
      setIsListening(true);
      playListenTone();
    };

    // Open the mic immediately with a gentle chime tone.
    // We NO LONGER speak "Sun rahi hoon! Bol na" first because:
    //  1. The bot speaking delayed the mic, making users talk too early
    //     (their first words were cut off or not recorded).
    //  2. Chrome's TTS audio channel collided with the mic recognizer,
    //     causing missed words and distorted transcripts.
    //  3. A quick chime tone provides instant feedback that the mic is ON.
    beginRecognition();
  };

  const onEmojiClick = (emojiObject) => {
    setUserInput((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const deleteAllMessages = () => {
    if (window.confirm("Kya aap sach mein saare messages delete karna chahte ho?")) {
      setMessages([]);
      setConversationHistory([]);
      localStorage.removeItem("sayraaMessages");
      const clearMessage = `Saare messages delete ho gaye! Main nayi shuruaat ke liye taiyaar hoon! 😊`;
      setMessages([{ text: clearMessage, sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      speakText(clearMessage, "hinglish");
    }
  };

  const handleQuickReply = (query) => {
    setUserInput(query);
    sendMessage(query);
  };

  const sendMessage = async (input = userInput) => {
    if (!input.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessages = [...messages, { text: input, sender: "user", timestamp }];
    setMessages(newMessages);
    setUserInput("");
    setIsTyping(true);

    try {

       // Adaptive language: detect whether the user wrote in English or
       // Hinglish/Hindi, then pick the matching reply instruction + TTS voice.
       // Because the first message of every chat is a Hinglish welcome, the small
       // lite models sometimes copy that language for an English question (measured
       // 3 out of 15 times). Append a reminder to the LAST user turn so the reply
       // actually matches the user's last message. This reminder is per-request only
       // and is never saved to the chat history.
       const { lang: detectedLang, instruction: languageInstruction } =
         getLanguageInstruction(input);
       const replyVoice = getTtsVoice(detectedLang);
       const turnReminder = getTurnReminder(detectedLang);

      // Build contents array for Gemini API.
      // Only the most recent exchanges are sent — latency (and cost) grow with
      // prompt size, so a long conversation no longer drags the entire history
      // into every request. 8 messages = the last 4 exchanges.
      const HISTORY_LIMIT = 8;
      const geminiContents = [
        ...conversationHistory.slice(-HISTORY_LIMIT).map((msg) => ({
          role: msg.role === "model" ? "model" : "user",
          parts: msg.parts,
        })),
        {
          role: "user",
          parts: [{ text: `${input}${turnReminder}` }],
        },
      ];

      // Shared request body for both the streaming and plain endpoints.
      // NOTE ON maxOutputTokens: Gemini 3.x are THINKING models — they spend
      // output tokens on internal reasoning (thoughtsTokenCount) BEFORE writing
      // the answer. A small budget (the old 350) was entirely eaten by that
      // reasoning and returned finishReason=MAX_TOKENS with empty text, which is
      // what made Sayraa show "Typing..." and then never reply. 2048 leaves room
      // for the thoughts plus the whole answer.
      // (thinkingConfig.thinkingBudget = 0 is NOT an option: the API rejects it
      // with HTTP 400 INVALID_ARGUMENT on gemini-3.5-flash-lite /
      // gemini-flash-lite-latest — verified against the live API.)
      const chatBody = {
        systemInstruction: {
          parts: [{ text: `${medConfig.systemMessage}\n\n${languageInstruction}` }],
        },
        contents: geminiContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      };

      // Thinking models also emit "thought" parts — never show or speak those.
      const partsToText = (candidate) =>
        (candidate?.content?.parts ?? [])
          .filter((p) => p.text && !p.thought)
          .map((p) => p.text)
          .join("");

      // Progressive display: the reply bubble appears as soon as the first words
      // arrive. Before this, the user stared at "Typing..." for the full ~2s and
      // long answers felt like they had hung.
      const aiMsgId = `ai-${Date.now()}`;
      let streamingStarted = false;

      // ---- Progressive speech ----
      // A long reply used to stay COMPLETELY silent until the whole answer had
      // finished generating, because speakText only ran after the stream closed.
      // Now each finished sentence is spoken as soon as it arrives, so Sayraa
      // starts talking while the rest of the answer is still being written.
      let spokenUpTo = 0;        // chars of the reply already given to the voice
      let spokenAny = false;     // has any speech been queued for this reply?
      const MIN_SPEAK_CHUNK = 24; // never speak fragments like "Hi."

      // Index just past the LAST sentence terminator that is followed by
      // whitespace or the end of the text (-1 when no sentence has finished).
      const lastSentenceCut = (s) => {
        const re = /[.?!।]/g;
        let cut = -1;
        let m;
        while ((m = re.exec(s)) !== null) {
          const next = s[m.index + 1];
          if (next === undefined || /\s/.test(next)) cut = m.index + 1;
        }
        return cut;
      };

      const speakCompletedSentences = (fullText) => {
        // Drain every sentence that has completed (a single chunk can contain
        // more than one).
        for (;;) {
          const rest = fullText.slice(spokenUpTo);
          const cut = lastSentenceCut(rest);
          if (cut === -1) return;
          const piece = rest.slice(0, cut).trim();
          // Hold short fragments back so the next sentence joins them.
          if (piece.length < MIN_SPEAK_CHUNK) return;
          spokenUpTo += cut;
          // The first chunk replaces any previous reply still being spoken; the
          // following ones queue behind it instead of cutting it off.
          speakText(piece, replyVoice.voiceHint, { append: spokenAny });
          spokenAny = true;
        }
      };

      const showStreamed = (txt) => {
        // Speak every sentence that has completed so far (no-op until one has).
        try {
          speakCompletedSentences(txt);
        } catch (_) {
          /* speech must never break the reply */
        }
        if (!streamingStarted) {
          streamingStarted = true;
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: aiMsgId,
              text: txt,
              sender: "ai",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          return;
        }
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: txt } : m))
        );
      };

      const chatUrl = (model, method) =>
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:${method}?key=${encodeURIComponent(GEMINI_API_KEY)}`;

      // Plain (non-streaming) call — used only if the browser cannot stream.
      const plainChat = async (model, body = chatBody) => {
        const res = await fetch(chatUrl(model, "generateContent"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) return { ok: false, status: res.status, body: await res.text() };
        const data = await res.json();
        return { ok: true, text: partsToText(data.candidates?.[0]).trim() };
      };

      // Streaming call — first words render almost immediately instead of after
      // the whole answer is generated.
      const streamChat = async (model) => {
        const res = await fetch(`${chatUrl(model, "streamGenerateContent")}&alt=sse`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatBody),
        });
        if (!res.ok) return { ok: false, status: res.status, body: await res.text() };
        if (!res.body || typeof res.body.getReader !== "function") {
          return plainChat(model); // no ReadableStream support → fall back
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let text = "";

        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let nl;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const chunk = partsToText(json.candidates?.[0]);
              if (chunk) {
                text += chunk;
                showStreamed(text);
              }
            } catch (_) {
              // Ignore a partial JSON line — the rest arrives in the next chunk.
            }
          }
        }
        return { ok: true, text: text.trim() };
      };

      let aiText = "";
      let lastChatError = "";

      if (!GEMINI_API_KEY) {
        // No local key — say so clearly instead of throwing an empty error message.
        lastChatError = "VITE_GEMINI_API_KEY is missing from client/.env";
      }
      if (GEMINI_API_KEY) {
        // Fastest-first, from measured latency with the real system prompt:
        //   gemini-flash-lite-latest ~1.6s (no thinking tokens)
        //   gemini-3.5-flash-lite    ~2.0s (no thinking tokens)
        //   gemini-3.1-flash-lite    ~2.8s
        //   gemini-3.5-flash         ~7.4s (thinking — last resort only)
        // A lite model sometimes ignores the language instruction when there is a
        // Hinglish welcome in the history — so every client-side attempt also has
        // a per-turn reminder appended to the last user turn.
        const chatCandidateModels = [
          "gemini-flash-lite-latest",
          "gemini-3.5-flash-lite",
          "gemini-3.1-flash-lite",
          "gemini-3.5-flash",
        ];

        for (const model of chatCandidateModels) {
          try {
            const { ok, status, body: respBody, text } = await streamChat(model);
            if (ok) {
              if (text) {
                aiText = text;
                break;
              }
              // A 200 with empty text means the model burned its whole output
              // budget on thinking — try the next candidate instead of giving up.
              lastChatError = `${model} returned an empty reply (out of tokens)`;
              console.warn(`Chat model "${model}" returned no text — trying next model...`);
              continue;
            }
            lastChatError = `${status} - ${String(respBody || "").slice(0, 300)}`;

            // If this is an English request and the first lite model came back in
            // Hinglish, retry it with a stronger per-turn reminder before falling
            // back to the slow thinking model. Keep the turn reminder in the history
            // so the reply is real English — even if the next model sees the failed
            // Hinglish reply as part of the conversation.
            if (
              detectedLang === "english" &&
              isHinglishText(aiText) &&
              !didHinglishRetryRef.current
            ) {
              didHinglishRetryRef.current = true;
              // Regex-substitute the reminder in case the cache still has the old
              // version; the rest of the body stays the same.
              const retryBody = {
                ...chatBody,
                systemInstruction: { parts: [{ text: `${medConfig.systemMessage}\n\n${languageInstruction}\n\n${ENGLISH_ENFORCE_INSTRUCTION}` }] },
                contents: [
                  ...conversationHistory.slice(-HISTORY_LIMIT).map((msg) => ({
                    role: msg.role === "model" ? "model" : "user",
                    parts: msg.parts,
                  })),
                  { role: "user", parts: [{ text: `${input}${ENGLISH_TURN_REMINDER}` }] },
                ],
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
              };
              const { ok: r2, text: t2 } = await streamChat(model, retryBody);
              if (r2 && t2) {
                aiText = t2;
                break;
              }
              lastChatError = `${model} returned a Hinglish reply for an English message, then empty on retry`;
              console.warn(`Chat model "${model}" returned Hinglish for an English message — retried with stronger reminder, then empty`);
            }
            console.warn(`Chat model "${model}" returned ${status} — trying next model...`);
          } catch (e) {
            lastChatError = `network error - ${e?.message || String(e)}`;
            console.warn(`Network error with model "${model}":`, e);
          }
        }
      }

      if (!aiText) throw new Error(`Gemini API Error: ${lastChatError}`);

      // Display the AI reply as-is (English or Hinglish, matching the user's language)
      const displayText = aiText;

      setConversationHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ text: input }] },
        { role: "model", parts: [{ text: aiText }] },
      ]);

      if (streamingStarted) {
        // The reply bubble already exists — just finalise it with the complete,
        // trimmed text (no duplicate message).
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: displayText } : m))
        );
      } else {
        setMessages((prev) => [
          ...prev,
          { text: displayText, sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ]);
      }

      // Speak whatever is left that progressive speech did not already speak:
      // the trailing sentence (when streaming ran), or the whole reply (when
      // streaming was unavailable). Never re-speak what is already queued.
      const leftover = aiText.slice(spokenUpTo).trim();
      if (leftover) {
        speakText(leftover, replyVoice.voiceHint, { append: spokenAny });
      } else if (!spokenAny) {
        speakText(aiText, replyVoice.voiceHint);
      }
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = `Oops! Main abhi reply nahi kar payi 😅 Ek baar phir se try karo na...`;
      setMessages((prev) => [
        ...prev,
        { text: errorMessage, sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
      speakText(errorMessage, "hinglish");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          title="Close Chat"
          aria-label="Close chat"
        >
          ✕
        </button>
        <img src={eduskillLogo} alt="Envistream EduSkill" className={styles.avatar} />
        <div className={styles.headerInfo} onClick={() => navigate('/')} style={{ cursor: 'pointer', flex: 1 }}>
          <span className={styles.headerTitle}>Sayraa</span>
          <span className={styles.headerSubtitle}>Your AI Guide to Learning, Internships & Careers</span>
        </div>
        <button onClick={deleteAllMessages} className={styles.deleteButton} title="Clear Chat">
          🗑️
        </button>
      </div>
      <div 
        id="chatBox" 
        className={styles.chatBox}
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 27, 75, 0.85)), url(${chatBg})`
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={styles[`${msg.sender}-message`]}
            data-timestamp={msg.timestamp}
          >
            {msg.text}
            <span className={styles.timestamp}>{msg.timestamp}</span>
          </div>
        ))}
        {isTyping && <div className={styles.typing}>Typing...</div>}
        {isListening && <div className={styles.typing}>🎙️ {interimText || "sun rahi hoon, bolte jao..."}</div>}
        <div ref={chatEndRef} />
      </div>

      <div className={styles.footer}>
        <div className={styles.inputWrapper}>
          <span
            className={styles.smileyIcon}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊
          </span>
          {showEmojiPicker && (
            <div className={styles.emojiPicker}>
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
          <input
            id="userInput"
            type="text"
            placeholder="Apna message likho..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className={styles.inputField}
          />
          {userInput.trim() ? (
            <button
              id="sendButton"
              onClick={() => sendMessage()}
              className={styles.sendButton}
            >
              <span role="img" aria-label="send">➡️</span>
            </button>
          ) : (
            <button
              id="micButton"
              onClick={startListening}
              className={`${styles.micButton} ${isListening ? styles.micButtonListening : ""}`}
              title={isListening ? "Sun rahi hoon! Click karke turant send karo 🎙️" : "Voice input ke liye click karo 🎤"}
            >
              {isListening ? "🎙️" : "🎤"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
