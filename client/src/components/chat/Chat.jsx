import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./chat.module.css";
import Picker from "emoji-picker-react";
import eduskillLogo from "../../assets/img/sayraa-logo.jpg";
import chatBg from "../../assets/img/sayraa-bg.jpg";
import { fixPhonetics } from "./phoneticFixes";
import { isGeminiSTTAvailable, cloudMediaSupported, startCloudRecording, stopCloudRecording, transcribeWithGemini } from "./geminiStt";
import { stopGeminiTTS, playWithGeminiTTS, isGeminiTTSAvailable } from "./geminiTts";
import {
  getLanguageInstruction,
  getTurnReminder,
  getTtsVoice,
  isHinglishText,
  ENGLISH_ENFORCE_INSTRUCTION,
  ENGLISH_TURN_REMINDER,
} from "./languageDetect";
import { findBestQaMatch } from "../../data/chatbotQa";

// Heuristic check for common off-topic queries outside Envistream EduSkill's training scope
const isOffTopicQuery = (text) => {
  const t = String(text || "").toLowerCase().trim();
  if (!t) return false;

  // Space/astronomy/satellite terms (excluding IT uses like 'whitespace', 'complexity', 'storage space', 'disk space')
  const hasSpace = /\bspace\b/.test(t) && !/\b(white\s*space|complexity|disk|memory|storage|bar)\b/.test(t);

  const offTopicPatterns = [
    /\b(satellite|satellites|chandrayaan|isro|nasa|astronomy|solar system|black hole|astronaut|meteor|asteroid|galaxy|galaxies|telescope|rocket|rockets)\b/,
    /\b(blockchain|crypto|cryptocurrency|bitcoin|ethereum|web3|solidity|smart contract)\b/,
    /\b(graphic design|photoshop|illustrator|coreldraw|video editing|premiere pro|after effects|animation|vfx|3d max|blender|maya)\b/,
    /\b(autocad|solidworks|catia|civil engineering|mechanical engineering|electrical engineering|robotics|hardware networking)\b/,
    /\b(nursing|bpharma|dpharma|pharmacy|mbbs|medical|doctor|hospital|hotel management|aviation|cabin crew|pilot)\b/,
    /\b(cricket|football|ipl|fifa|messi|ronaldo|virat kohli|dhoni|rohit sharma)\b/,
    /\b(recipe|biryani|paneer recipe|pizza recipe|burger recipe|dinner idea|lunch idea|how to cook)\b/,
    /\b(weather today|mausam kaisa|rain tomorrow|temperature today|barish hogi)\b/,
    /\b(capital of|rajdhani kya|president of usa|president of america)\b/,
    /\b(film recommend|movie recommend|favorite actor|favorite heroine|joke sunao|tell me a joke)\b/,
  ];

  return hasSpace || offTopicPatterns.some((pattern) => pattern.test(t));
};

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
  import.meta.env?.VITE_GEMINI_API_KEY ||
  import.meta.env?.REACT_APP_GEMINI_API_KEY ||
  (typeof process !== "undefined" && (process.env?.VITE_GEMINI_API_KEY || process.env?.REACT_APP_GEMINI_API_KEY)) ||
  "";

// Preferred chat model (overridable via VITE_GEMINI_CHAT_MODEL)
const GEMINI_MODEL =
  import.meta.env?.VITE_GEMINI_CHAT_MODEL || "gemini-3.1-flash-lite";

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
  // Guards the one-time English-retry inside sendMessage()
  const didHinglishRetryRef = useRef(false);

  
  const speakText = useCallback((text, lang = "hinglish") => {
    if (typeof window === 'undefined') return;

    // Keep emojis on screen, but NEVER read them aloud ("smiling face" etc.)
    const spokenText = text
      .replace(/Sayraa/gi, "Sigh-raa")
      .replace(
        /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu,
        ""
      )
      .replace(/[*#_~`>]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (!spokenText) return;

    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn("Speech synthesis not available.");
      return;
    }

    try {
      synth.cancel();
    } catch (_) {}

    const wantsHindi = lang !== "english";
    const choice = chooseSayraaVoice(synth, lang);
    const hasHindiVoice =
      !!choice.voice && (choice.lang || "").toLowerCase().startsWith("hi");

    let speakable = spokenText;
    if (wantsHindi && !hasHindiVoice && /[\u0900-\u097F]/.test(speakable)) {
      speakable = toEnglishLetters(speakable).replace(/\s{2,}/g, " ").trim();
      console.warn("No Hindi voice found — speaking Hinglish in Roman letters.");
    }

    const utterance = new SpeechSynthesisUtterance(speakable);
    applyVoiceChoice(utterance, choice);

    utterance.onerror = (e) => {
      const err = e?.error || "";
      if (err === "not-allowed" || err === "not_allowed") {
        console.warn("Speech blocked before user interaction — will retry on first gesture.");
        armSpeechRetryOnFirstGesture(() => synth.speak(utterance));
      }
    };

    setTimeout(() => {
      try {
        synth.speak(utterance);
      } catch (e) {
        console.warn("TTS speak failed:", e);
      }
    }, 40);
  }, []);

  // Reset chat back to clean initial greetings state
  const resetToGreeting = useCallback(() => {
    const welcomeText = SAYRAA_WELCOME;
    const initialMessages = [{
      text: welcomeText,
      sender: "ai",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }];
    setMessages(initialMessages);
    setConversationHistory([
      {
        role: "model",
        parts: [{ text: welcomeText }],
      },
    ]);
    setUserInput("");
    setInterimText("");
    setIsTyping(false);
    setIsListening(false);
    isListeningRef.current = false;
    stopGeminiTTS();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }
    try {
      localStorage.removeItem("sayraaMessages");
    } catch (_) {}
  }, []);

  // Clear any legacy saved messages on mount
  useEffect(() => {
    resetToGreeting();

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

  }, [resetToGreeting]);

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

      PRIMARY SCOPE OF ENVISTREAM EDUSKILL (CRITICAL):
      You are EXCLUSIVELY an assistant for Envistream EduSkill. Your primary scope is strictly limited to:
      - Envistream EduSkill courses, training, internships, curriculum, batch timings, fees, certifications, and placement assistance.
      - Institute location (Bhubaneswar, Odisha), contact details, 24x7 lab access, and daily doubt clearing.
      - Software and IT training topics taught at Envistream EduSkill: Web Development (HTML, CSS, JavaScript, React.js, Node.js), Software Testing (Manual & Automation Testing with Cypress), Programming Languages (Python, Java, PHP/Laravel), SAP/ERP (SAP SD, SAP FICO, SAP MM, SAP PP, SAP HR, SAP ABAP), AI, ML, GenAI, Data Science (NumPy, Pandas, SQL), and Digital Marketing/SEO.

      STRICT OFF-TOPIC REFUSAL RULE (HIGHEST PRIORITY):
      - ANY topic that is NOT an Envistream EduSkill course or IT training program is STRICTLY OUT OF YOUR PRIMARY SCOPE!
      - SATELLITES & SPACE ARE STRICTLY OUT OF SCOPE! Envistream EduSkill DOES NOT offer space, astronomy, or satellite courses. When asked "satellite kya hey", "satellite kya hai", "what is a satellite", "tell me about space", "solar system", etc., NEVER explain what a satellite or space object is!
      - Other off-topic subjects include:
        * General science, astronomy, physics, chemistry, biology, space, satellites, rockets, ISRO, NASA
        * General knowledge, world leaders, country capitals, history, geography, oceans
        * Entertainment, movies, actors, songs, jokes, storytelling
        * Sports, cricket scores, players, football
        * Weather forecasts, news, cooking recipes, food
        * Personal questions (relationship, marriage, personal life)
      - FOR ANY OFF-TOPIC QUESTION:
        NEVER answer the question. NEVER explain the concept. NEVER give definitions or facts about off-topic subjects.
        You MUST respond stating it is out of your primary scope:
        * English: "This is outside my primary scope. I'm Sayraa, the Envistream EduSkill AI assistant. I can only assist with topics related to Envistream EduSkill courses, training, internships, live projects, and career guidance. 😊"
        * Hinglish: "Ye question mere primary scope se bahar hai. 😊 Main Sayraa hoon, Envistream EduSkill ki AI assistant, aur main mainly Envistream EduSkill ke courses, training, internships, live projects aur career guidance mein help karti hoon."

      CORE BEHAVIOR RULES:
      1. LANGUAGE: Mirror the user's language — reply in English when they write in English, and Hinglish (Hindi in Roman alphabet) when they write in Hinglish/Hindi. Never use Devanagari script. A specific per-message language instruction is appended to this system prompt each time.
      2. BRANDING & NATURAL TONE:
         - In the FIRST reply/interaction of the chat, mention "Envistream EduSkill" naturally (e.g., "Envistream EduSkill mein..." or "Welcome to Envistream EduSkill!").
         - In SUBSEQUENT chat messages, it is NOT necessary to repeat "Envistream EduSkill" in every chat! Speak naturally using "hum", "hamare yahan", or answer directly without repeating the brand name every time.
         - NEVER add call-to-action (CTA) slogans like "detail ke liye Enquire Now dabayein! 🚀", "Enroll Now pe click karein", "Apply Now dabayein", etc. Do NOT tell the user to click buttons or enquire.
         - DO NOT append phone numbers (+91 7873489364), website links (www.envistream.org), or sales pitches to everyday answers. Mention phone numbers or website ONLY when the user explicitly asks for contact info, calling, registration, or admission.
      3. COURSE QUERIES & TECH CONCEPTS ("X kya hai", "What is X", "X course hai kya?"):
         - When asked about ANY course or technology:
           * CASE A — IF THE COURSE IS OFFERED AT ENVISTREAM EDUSKILL (Web Development, React, Node.js, Software Testing, Cypress, Python, Java, PHP/Laravel, SAP/ERP, AI/ML, Data Science, Digital Marketing):
             Give strictly a 2-LINE ANSWER (never more than 2 lines, no marketing paragraphs):
             - Line 1: Simple 1-line explanation of what that course/technology is.
             - Line 2: In 1 short line, mention that hands-on practical training with live project internship is available (use "Envistream EduSkill" in the first chat, and "hamare yahan" in subsequent chats).
           * CASE B — IF THE TECH CONCEPT/SERVICE IS NOT IN OUR CURRENT CURRICULUM (e.g., CI/CD, EC2, AWS, Docker, Kubernetes, Blockchain, Flutter, Kotlin, etc.):
             Strictly give an EXACT 2-LINE ANSWER:
             - Line 1: A clear 1-line explanation of what that technology/service is.
             - Line 2: State that this topic is not part of our current curriculum and invite the user to explore other domains:
               * English: "This topic is not a part of our current curriculum. You can explore our other domains like Web Development, Software Testing, Python, Java, SAP/ERP, AI/ML, Data Science, or Digital Marketing — which domain would you like to know about? 😊"
               * Hinglish: "Ye topic hamare current curriculum ka part nahi hai. Aap hamare doosre domains jaise Web Development, Software Testing, Python, Java, SAP/ERP, AI/ML, Data Science ya Digital Marketing explore kar sakte hain — aap kis domain ke baare mein jaanna chahenge? 😊"
           * CASE C — IF THE SUBJECT IS NOT AN IT COURSE AT ALL (e.g., satellite, space, general science, medical, etc.):
             Directly state that this is not in our courses in 2 lines:
             - English: "This course is not in our courses. We offer programs in Web Development, Software Testing, Python, Java, PHP, SAP/ERP, AI/ML, Data Science, and Digital Marketing. 😊"
             - Hinglish: "Ye course hamare courses mein nahi hai. 😊 Hum Web Development, Software Testing, Python, Java, PHP, SAP/ERP, AI/ML, Data Science aur Digital Marketing provide karte hain."
      4. PROGRAMMING & TECHNICAL QUESTIONS (WITHIN IT CURRICULUM):
         - Answer coding/technical queries ONLY if they are part of Envistream's software courses (Python code, JavaScript promises, React hooks, Cypress tests, SQL queries, ML algorithms).
         - Non-software engineering/science questions (satellite orbits, astrophysics, hardware electronics) are strictly OFF-TOPIC.
      5. KEEP ANSWERS SHORT & NATURAL: Maximum 2 short lines. Never write marketing pitches, CTA slogans, or big paragraphs.
      6. For "courses kya hai" type questions, reply with just the course names in 1-2 lines (comma separated). Give full details ONLY when the user asks about ONE specific course.
      7. For location questions, reply ONLY with the address in 1-2 lines. Do NOT include phone number or call instructions unless specifically asked for contact/calling details.
      8. VOICE INPUT: user messages often come from a speech recognizer and contain PHONETIC spelling mistakes (e.g. 'korsej kya provaaid karte ho' = 'Courses kya provide karte ho'; 'lokeshan kahan hai' = 'Location kahan hai'). Silently understand the intended meaning and answer normally.
      9. When asked "tumhe kon banaya hai" / "who made you" respond: "Mujhe Envistream EduSkill ki team ne banaya hai 🧑💻" / "I was built by the Envistream EduSkill team 🧑💻".

      KNOWLEDGE BASE:
      - Institute: Envistream EduSkill is an IT software training and internship institute located in Bhubaneswar, Odisha.
      - Office & Location: Plot-N6/454, 2nd Floor, Saffire Building, opposite Crown Hotel, IRC Village, Nayapalli, Bhubaneswar, Odisha.
      - Operating Hours: Monday through Saturday from 9:00 AM to 8:00 PM. (Operating schedule is Monday to Saturday, 9 AM to 8 PM).
      - Training Modes: Virtual / Online (attend live training from home) and Classroom / Offline (at Bhubaneswar institute). Both modes offer practical learning; online offers flexibility, classroom offers in-person trainer/student interaction.
      - Programs & Courses:
        * IT & Software: Web Development (HTML, CSS, JavaScript), Full-Stack Node.js & React.js, Software Testing (Manual Testing & Automation Testing), Cypress Automation, Python, Java, PHP (Laravel).
        * SAP / ERP: SAP SD (Sales and Distribution), SAP FICO (Financial Accounting & Controlling), SAP MM (Materials Management), SAP PP (Production Planning), SAP HR, and SAP ABAP (programming & customizations). Includes real-time implementation guidance.
        * Management & Business: Digital Marketing, SEO Training, Social Media Marketing, Market Research, Business Development, Lead Generation.
        * AI, ML, GenAI & Data Science: Artificial Intelligence, Machine Learning, Generative AI (LLMs, prompt engineering, building AI chatbots), Data Science (Python, NumPy, Pandas, statistics, SQL, visualization).
      - Course Eligibility: Open to CS, IT, non-CS students, beginners with zero coding experience (start with HTML, CSS, JS fundamentals), college graduates, postgraduates, and final-year students.
      - Internships: 4, 8, and 12-week mentor-led internships combining training with practical learning and project-oriented exposure. Designed to align with the new AICTE and BPUT model syllabus for final-year students fulfilling mandatory university internship requirements.
      - Live Projects: Practical project exposure including PHP Chatbots, Java Airline Reservation Systems, Python Mad Libs Generators, Web Development landing pages. Projects can be added to resumes. Trainers provide guidance during projects.
      - Lab & Student Support: 24x7 lab facilities allowing students to practice beyond regular training sessions, plus Daily Doubt Clearing Classes.
      - Placement & Career Support: Dedicated Technical Placement Assistance and Campus Placement Program. Technical workshops, coding interview prep, intensive HR & job preparation training, and mock interviews with external panels and real-time HR professionals. Job guarantee policy: Placement assistance is provided, but a job cannot be guaranteed as selection depends on candidate skills, interview performance, eligibility, and employer requirements.
      - Career Guidance: Helping students choose technologies based on background, and role paths (Frontend Developer, React Developer, Backend Developer, Full-Stack Developer, Web Developer, Data Analyst, Junior Data Scientist, ML Engineer).
      - Contact Details (give ONLY when asked): Phone: +91 7873489364 / +91 9078419012. Email: training@envistream.org. Website: www.envistream.org`,
  };

  // Handle chatbot opening/closing:
  // - On close: clear past messages, cancel ongoing speech & listening so previous chat never persists
  // - On open: speak welcome greeting
  useEffect(() => {
    if (!isOpen) {
      welcomeSpokenRef.current = false;
      resetToGreeting();
      return;
    }

    if (welcomeSpokenRef.current) return;
    welcomeSpokenRef.current = true;
    speakOnceVoicesReady(() => speakText(SAYRAA_WELCOME, "hinglish"));
  }, [isOpen, resetToGreeting, speakText]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


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

    // Keep the listening state ON while audio finalizes
    setInterimText("Processing... 🎙️");

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

        const silenceThreshold = hasSpoken ? 800 : 3500;
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

    // If browser does not have native SpeechRecognition, fall back to cloud Gemini STT
    if (!SpeechRecognition) {
      if (isGeminiSTTAvailable() && cloudMediaSupported()) {
        beginCloudRecognition();
        return;
      }

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

      // Keep listening while you talk; wait ~800ms of silence before
      // auto-sending so the speaker is never cut off mid-thought. (The user can also tap
      // the mic icon again to send immediately.)
      const resetSilenceTimer = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(sendTranscript, 800);
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
        if (liveText) {
          setInterimText(liveText);
          setUserInput(liveText);
        }
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

    
    beginRecognition();
  };

  const onEmojiClick = (emojiObject) => {
    setUserInput((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const deleteAllMessages = () => {
    if (window.confirm("Kya aap sach mein saare messages delete karna chahte ho?")) {
      resetToGreeting();
      speakText(SAYRAA_WELCOME, "hinglish");
    }
  };

  const handleQuickReply = (query) => {
    setUserInput(query);
    sendMessage(query);
  };

  const sendMessage = async (input = userInput) => {
    if (!input.trim()) return;
    didHinglishRetryRef.current = false;

    // Immediately stop any prior speech (e.g. welcome message still playing)
    stopGeminiTTS();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessages = [...messages, { text: input, sender: "user", timestamp }];
    setMessages(newMessages);
    setUserInput("");
    setIsTyping(true);

    let detectedLang = "hinglish";

    try {

       // Adaptive language: detect whether the user wrote in English or
       // Hinglish/Hindi, then pick the matching reply instruction + TTS voice.
       // Because the first message of every chat is a Hinglish welcome, the small
       // lite models sometimes copy that language for an English question (measured
       // 3 out of 15 times). Append a reminder to the LAST user turn so the reply
       // actually matches the user's last message. This reminder is per-request only
       // and is never saved to the chat history.
       const langResult = getLanguageInstruction(input);
       detectedLang = langResult.lang;
       const languageInstruction = langResult.instruction;
       const replyVoice = getTtsVoice(detectedLang);
       const turnReminder = getTurnReminder(detectedLang);

       // ⚡ FAST PATH: Instant response from grounded Q&A dataset (0ms latency!)
       const instantMatch = findBestQaMatch(input, detectedLang);
       if (instantMatch) {
         const displayText = instantMatch.answer;
         setConversationHistory((prev) => [
           ...prev,
           { role: "user", parts: [{ text: input }] },
           { role: "model", parts: [{ text: displayText }] },
         ]);
         setMessages((prev) => [
           ...prev,
           { text: displayText, sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
         ]);
         speakText(displayText, replyVoice.voiceHint);
         setIsTyping(false);
         return;
       }

        // 🛑 OFF-TOPIC FAST GUARD: Questions strictly outside Envistream EduSkill scope
        if (isOffTopicQuery(input)) {
          const isCourseQuestion = /\b(course|courses|training|seekhna|padhate|karwate|offer|provide|learn)\b/i.test(input) || /kya hai|kya hey|kya hota|what is/i.test(input);
          const offTopicText = isCourseQuestion
            ? (detectedLang === "english"
                ? "This course is not in our courses. We offer courses like Web Development, Software Testing (Cypress), Python, Java, PHP, SAP/ERP, AI/ML, Data Science, and Digital Marketing. 😊"
                : "Ye course hamare courses mein nahi hai. 😊 Hum Web Development, Software Testing, Python, Java, PHP, SAP/ERP, AI/ML, Data Science aur Digital Marketing provide karte hain.")
            : (detectedLang === "english"
                ? "This is outside my primary scope. I'm Sayraa, the Envistream EduSkill AI assistant. I can only assist with topics related to Envistream EduSkill courses, training, internships, live projects, and career guidance. 😊"
                : "Ye question mere primary scope se bahar hai. 😊 Main Sayraa hoon, Envistream EduSkill ki AI assistant, aur main mainly Envistream EduSkill ke courses, training, internships, live projects aur career guidance mein help karti hoon.");

          setConversationHistory((prev) => [
            ...prev,
            { role: "user", parts: [{ text: input }] },
            { role: "model", parts: [{ text: offTopicText }] },
          ]);
          setMessages((prev) => [
            ...prev,
            { text: offTopicText, sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
          ]);
          speakText(offTopicText, replyVoice.voiceHint);
          setIsTyping(false);
          return;
        }

      // Build messages array for Google Gemini API
      // Only the most recent exchanges are sent — latency grows with prompt size
      const HISTORY_LIMIT = 8;
      const geminiContents = [
        ...conversationHistory.slice(-HISTORY_LIMIT).map((msg) => ({
          role: msg.role === "model" ? "model" : "user",
          parts: (msg.parts || [{ text: msg.text || "" }]).map((p) => typeof p === "string" ? { text: p } : p),
        })),
        { role: "user", parts: [{ text: `${input}${turnReminder}` }] },
      ];

      // Shared request body for both the streaming and plain Gemini endpoints.
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

      // Thinking models also emit "thought" parts — filter them out
      const partsToText = (candidate) =>
        (candidate?.content?.parts ?? [])
          .filter((p) => p.text && !p.thought)
          .map((p) => p.text)
          .join("");

      // Progressive display: the reply bubble appears as soon as the first words arrive.
      const aiMsgId = `ai-${Date.now()}`;
      let streamingStarted = false;

      const showStreamed = (txt) => {
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

      // Streaming call — first words render almost immediately
      const streamChat = async (model, body = chatBody) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        let res;
        try {
          res = await fetch(`${chatUrl(model, "streamGenerateContent")}&alt=sse`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal,
          });
        } catch (err) {
          clearTimeout(timeoutId);
          return { ok: false, status: 0, body: err?.message || "timeout" };
        }
        clearTimeout(timeoutId);
        if (!res.ok) return { ok: false, status: res.status, body: await res.text() };
        if (!res.body || typeof res.body.getReader !== "function") {
          return plainChat(model, body);
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
              // Ignore partial json chunk
            }
          }
        }
        return { ok: true, text: text.trim() };
      };

      let aiText = "";
      let lastChatError = "";

      if (!GEMINI_API_KEY) {
        lastChatError = "VITE_GEMINI_API_KEY is missing from client/.env";
      }
      if (GEMINI_API_KEY) {
        // Free & fast Gemini models:
        // Prioritizes gemini-3.1-flash-lite, gemini-3.5-flash-lite, gemini-2.5-flash, gemini-2.0-flash, gemini-1.5-flash, gemini-3.5-flash
        const chatCandidateModels = [
          GEMINI_MODEL,
          "gemini-3.1-flash-lite",
          "gemini-3.5-flash-lite",
          "gemini-2.5-flash-lite",
          "gemini-2.5-flash",
          "gemini-2.0-flash-lite",
          "gemini-2.0-flash",
          "gemini-1.5-flash",
          "gemini-3.5-flash",
        ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

        for (const model of chatCandidateModels) {
          try {
            const { ok, status, body: respBody, text } = await streamChat(model);
            if (ok && text) {
              if (
                detectedLang === "english" &&
                isHinglishText(text) &&
                !didHinglishRetryRef.current
              ) {
                didHinglishRetryRef.current = true;
                const retryBody = {
                  ...chatBody,
                  systemInstruction: {
                    parts: [{ text: `${medConfig.systemMessage}\n\n${languageInstruction}\n\n${ENGLISH_ENFORCE_INSTRUCTION}` }],
                  },
                  contents: [
                    ...geminiContents.slice(0, -1),
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
                continue;
              }
              aiText = text;
              break;
            }
            if (ok) {
              lastChatError = `${model} returned an empty reply (out of tokens)`;
              console.warn(`Chat model "${model}" returned no text — trying next model...`);
              continue;
            }
            lastChatError = `${status} - ${String(respBody || "").slice(0, 300)}`;
            console.warn(`Chat model "${model}" returned ${status} — trying next model...`);
          } catch (e) {
            lastChatError = `network error - ${e?.message || String(e)}`;
            console.warn(`Network error with model "${model}":`, e);
          }
        }
      }

      if (!aiText) {
        // Fallback: Check if we have a matching answer in our official QA dataset
        const localMatch = findBestQaMatch(input, detectedLang);
        if (localMatch) {
          aiText = localMatch.answer;
        } else {
          throw new Error(`Gemini API Error: ${lastChatError}`);
        }
      }


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

      // Speak the complete, natural response from start to finish in exact order
      speakText(aiText, replyVoice.voiceHint);
    } catch (error) {
      console.error("API Error:", error);
      const localMatch = findBestQaMatch(input, detectedLang);
      if (localMatch) {
        const displayText = localMatch.answer;
        setMessages((prev) => [
          ...prev,
          { text: displayText, sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ]);
        speakText(displayText, detectedLang === "english" ? "english" : "hinglish");
      } else {
        const errorMessage = detectedLang === "english"
          ? "Oops! I couldn't reply right now 😅 Please try again in a moment..."
          : `Oops! Main abhi reply nahi kar payi 😅 Ek baar phir se try karo na...`;
        setMessages((prev) => [
          ...prev,
          { text: errorMessage, sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ]);
        speakText(errorMessage, detectedLang === "english" ? "english" : "hinglish");
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <button
          className={styles.closeButton}
          onClick={() => {
            resetToGreeting();
            if (onClose) onClose();
          }}
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
        {isListening && <div className={styles.typing}>🎙️ {interimText || "Listening..."}</div>}
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
            placeholder={isListening ? "Listening..." : "Apna message likho..."}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className={styles.inputField}
          />
          {userInput.trim() && !isListening ? (
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
              title={isListening ? "Listening... Click karke turant send karo 🎙️" : "Voice input ke liye click karo 🎤"}
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
