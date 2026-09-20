// ---- Voice transcript clean-up (phonetic fixes) ----
// Two things mangle a mic transcript before Sayraa sees it:
//   1. Chrome's hi-IN recognizer mishears ENGLISH words spoken with a Hindi accent —
//      especially the brand name "Envistream EduSkill". Examples: "Where is the
// location of Envistream EduSkill" may come back as "veyar is d lokeshan oph
// inglish medisin" (normal pace), as "edaministreshan ka location..." (fast),
// or as "sarita oto skil ka location..." (slow).
//   2. Devanagari output was converted to Roman letters character by character,
//      which destroys Hinglish words: "कोर्सेस" -> "korsesa", "इंटरनशिप" ->
//      "internaship". (The STT prompt now asks for Roman output directly, and
//      the rules below repair it if Devanagari still slips through.)
// These fuzzy regex fixes run on the mic transcript BEFORE it is sent, so Sayraa
// understands the intended words. (Typed text is NOT touched — only mic
// transcripts go through this.)

// Ways "internship" gets mangled. Shared by the split-merged-words rule and the
// single-word rule below so the two can never drift apart. Covers English
// mishearings (inturnship, enternship) and Devanagari converted to Roman letters
// one character at a time (इंटरनशिप -> "intaranaship").
const INTERNSHIP_STEM =
  "(?:intern\\s?ship|inturnship|enternship|intarnship|intaranaship|intarnaship|intarnasip)";

const PHONETIC_FIXES = [
  // Brand name spoken as one phrase: "inglish medisin", "envistram eduskil",
  // "in vhich strim hedar skil", "in witch stream heder skill"...
  [/\b(en?vi?str?[aemuy]*m?|ingl[ei]sh|inb[ei]str[aemuy]*|in (v?hich|which|witch) str[ei]?a?m)\s+(medisin|medicin|edu?sk?il+|udiskil|aduskil|yudiskil|sk?il+|hed[ae]r skil|hed[ae]r skill|hed[ae]rskil|hed[ae] skil|ed[ae]r skil)\b/gi,
    "Envistream EduSkill"],
  // Brand name halves heard separately
  [/\b(en?vi?str?[aemuy]*m?|ingl[ei]sh|inb[ei]str[aemuy]*|in (v?hich|which|witch) str[ei]?a?m)\b/gi, "Envistream"],
  [/\b(medisin|medicin|edu?sk?il+|udiskil|aduskil|yudiskil|hed[ae]r skil|hed[ae]r skill|hed[ae]rskil|hed[ae] skil|ed[ae]r skil)\b/gi, "EduSkill"],
  // Brand name heard as ONE jumbled word when spoken fast
  // (Chrome hears it like "administration"): edaministreshan...
  [/\b(e?daministreshan|e?dministreshan|a?daministreshan|administreshan|admenistreshan|edmenistreshan)\b/gi,
    "Envistream EduSkill"],
  // Brand name heard as THREE odd words when spoken slowly: "sarita oto skil"
  [/\b(s[ae]?rita|sareeta|saritha|serita)\s+(o?t+[oa]?|auto)\s+(sk?il+)\b/gi,
    "Envistream EduSkill"],
  // ---- Merged words (the model sometimes joins two words into one) ----
  [new RegExp(`\\b(${INTERNSHIP_STEM})(karna|karana|karni|karne|chahiye|kaise|kya|hai)\\b`, "gi"),
    "$1 $2"],
  [/\b(courses?|cources?)(kya|kaun|kitne|hai|hain|chahiye|batao)\b/gi, "$1 $2"],
  [/\b(kya|kitna|kitne|kahan|kaise|kaun)(hai|hain|hey|he|ho)\b/gi, "$1 $2"],
  [/\b(batao|batado|batana|bata)(do|kya|hai)\b/gi, "$1 $2"],
  [/\b(karna|karni|karne)(hey|hy|he|hai)\b/gi, "$1 hai"],
  [/\b(envistream|envistram|envistrim|inglish)(eduskill|eduskil|eduskull|medisin)\b/gi, "$1 $2"],
  // Common question & domain words
  [/\b(veyar|vehar|vahar|vhere|wehar|wher|vher)\b/gi, "where"],
  [/\b(loka?sh?an|lokeshan|lokesan|lokashan|lokasion|lokasan)\b/gi, "location"],
  // "courses" misheard as "courcesa" / "korsesa" / "korses" (Devanagari "कोर्सेस")
  [/\b(courcesa|cources|cource|courcea|courcses|coursas|coursa|corses|corsesa|coursesa|korses|korsesa|korsas|korsa|korss|kors|korsij|korsej)\b/gi,
    "courses"],
  [new RegExp(`\\b${INTERNSHIP_STEM}\\b`, "gi"), "internship"],
  [/\b(plas?ment|plesment|placemant|placementa)\b/gi, "placement"],
  [/\b(tre?ning|tren?ing|traning)\b/gi, "training"],
  [/\b(prova?id|provaaid|pravaaid|pravaid|parvaid)\b/gi, "provide"],
  [/\b(kya\s+pravaaid|kya\s+provaaid)\b/gi, "kya provide"],
  [/\b(karate|karte|karta|karti)\s+ho\b/gi, "karte ho"],
  [/\b(admi?ss?ion|admis?ion|edmission)\b/gi, "admission"],
  [/\b(duretion|durasion|duras?ion)\b/gi, "duration"],
  [/\b(fes|feez|phis|fiss)\b/gi, "fees"],
];

// Words that prove a sentence is Hinglish. Used to guard the corrections that
// would otherwise damage genuine English (e.g. the greeting "Hey, tell me...").
const HINGLISH_HINT_RE =
  /\b(kya|kyu|kyun|kaise|kaisa|kaisi|kahan|kab|kaun|kitna|kitne|hai|hain|hota|hoti|karte|karta|karna|karni|chahiye|batao|batado|milega|nahi|bhi|aur|sab|mujhe|mera|meri|aap|tum|log)\b/i;

// "hey" / "he" / "au" are valid English words too, so they are only corrected
// to their Hindi counterparts when the rest of the sentence is clearly Hinglish.
const fixHindiWords = (text) => {
  // "kya hey" / "courses kya he" -> "kya hai"
  let out = text.replace(
    /\b(kya|kitna|kitne|kaise|kahan|kab|kaun|courses?|internship|fees|placement|location|duration|sab)\s+(hey|hy|he)\b/gi,
    "$1 hai"
  );
  // A standalone "hey" is almost always "hai" misheard — but leave a genuine
  // English greeting at the very start ("Hey, ..." / "Hey!") untouched.
  out = out.replace(/\b(hey|hy)\b/gi, (match, _word, offset) => {
    if (offset === 0 && /^[,.!?]/.test(out.slice(match.length).trimStart())) {
      return match;
    }
    return "hai";
  });
  return out
    .replace(/\bau\b/gi, "aur") // "au internship" -> "aur internship"
    .replace(/\bkarana\b/gi, "karna")
    .replace(/\s{2,}/g, " ")
    .trim();
};

// Apply the phonetic fixes to a mic transcript (word-boundary safe)
export const fixPhonetics = (text) => {
  if (!text) return text;
  let out = text;

  // Pass 1 — split merged words first, then repair the individual words
  for (const [pattern, replacement] of PHONETIC_FIXES) {
    out = out.replace(pattern, replacement);
  }

  // Pass 2 — Hindi-only corrections, skipped for pure-English transcripts so
  // "Hey, tell me about the courses" is never rewritten.
  if (HINGLISH_HINT_RE.test(out)) out = fixHindiWords(out);

  return out.replace(/\s{2,}/g, " ").trim();
};
