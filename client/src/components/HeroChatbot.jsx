import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiSend, FiMessageCircle } from "react-icons/fi";

const QUICK = ["Explore courses", "Internships", "Fees & EMI", "Talk to counsellor"];

function answer(input) {
  const q = input.toLowerCase();
  const has = (...ws) => ws.some((w) => q.includes(w));
  if (has("counsell", "call back", "callback", "talk", "human", "advisor"))
    return { text: "A counsellor will call you back within 24 hours with a personalised roadmap.", action: "counsellor" };
  if (has("fee", "emi", "price", "cost", "payment"))
    return { text: "Most career programs offer no-cost EMI via UPI, cards and net-banking. Open any course page for exact fees." };
  if (has("intern"))
    return { text: "4–12 week mentor-led internships across AI, Full Stack, Data, Security, Cloud and Marketing — with projects and certification.", link: ["/internships", "View internships"] };
  if (has("place", "job", "career", "salary", "hiring"))
    return { text: "You get resume + LinkedIn reviews, mock interviews and referral drives. No false guarantees — real preparation.", link: ["/placement", "Career programs"] };
  if (has("certificate", "verify", "verification"))
    return { text: "Every certificate carries a unique ID employers can verify instantly on our verification page.", link: ["/verify", "Verify a certificate"] };
  if (has("corporate", "company", "b2b", "hr", "training for"))
    return { text: "We run AI, data, security and cloud workshops for HR/L&D teams — fully customised.", link: ["/corporate", "Corporate training"] };
  if (has("partner", "college", "mou", "university", "institute"))
    return { text: "We sign MoUs for internships, FDPs, workshops and placement-oriented training.", link: ["/partner", "Partner with us"] };
  if (has("contact", "phone", "email", "address", "location"))
    return { text: "Reach us at hello@envistream.org or +91 99999 99999 — or request a callback below.", action: "counsellor" };
  if (has("course", "program", "learn", "training", "track"))
    return { text: "8 tracks, 50+ programs: AI, Full Stack, Data, Security, Cloud & DevOps, Programming, Marketing, Emerging Tech.", link: ["/courses", "Browse all courses"] };
  if (has("ai", "ml", "machine", "genai", "llm")) return { text: "Start with Artificial Intelligence or Generative AI — both include projects and internship.", link: ["/courses/artificial-intelligence", "Explore AI"] };
  if (has("mern", "full stack", "web", "react", "mern"))
    return { text: "Full Stack has 6 paths: MERN, MEAN, Java, Python, PHP and .NET.", link: ["/courses/mern-stack", "Explore MERN"] };
  if (has("data", "sql", "power bi", "excel", "analytics"))
    return { text: "Data Science & Analytics covers SQL, Power BI, Python and business storytelling.", link: ["/courses/data-science-analytics", "Explore Data"] };
  if (has("cyber", "hack", "security", "soc"))
    return { text: "Cybersecurity spans fundamentals, ethical hacking, pentesting and SOC — with live labs.", link: ["/courses/cybersecurity", "Explore Security"] };
  if (has("cloud", "aws", "azure", "devops", "docker"))
    return { text: "Cloud & DevOps covers AWS, Azure, GCP, Docker, Kubernetes and CI/CD.", link: ["/courses/aws", "Explore AWS"] };
  if (has("hi", "hello", "hey", "namaste")) return { text: "Hello! Ask me about courses, internships, fees or placements." };
  return { text: "I can help with courses, internships, fees, placements, certificates and partnerships — try one of the shortcuts below." };
}

/**
 * Compact hero assistant — sits directly under the
 * "Admissions open · 2026 batches" chip.
 */
export default function HeroChatbot({ onEnquire }) {
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi! I'm the Eduskill assistant. Ask about courses, internships, fees or placements." },
  ]);
  const [val, setVal] = useState("");
  const box = useRef(null);

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = (text) => {
    const clean = text.trim();
    if (!clean) return;
    const a = answer(clean);
    setMsgs((m) => [...m, { from: "user", text: clean }, { from: "bot", ...a }]);
    setVal("");
  };

  return (
    <div className="rounded-2xl border border-white/60 bg-white/65 backdrop-blur-2xl shadow-[0_18px_50px_-24px_rgba(236,72,153,.35)] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900/75 backdrop-blur-xl text-white border-b border-white/10">
        <span className="w-8 h-8 grid place-items-center rounded-lg bg-pink-500/20 text-pink-200 border border-white/15 shrink-0">
          <FiMessageCircle size={16} />
        </span>
        <span className="flex-1">
          <span className="block text-[13.5px] font-bold leading-tight">Eduskill Assistant</span>
          <span className="flex items-center gap-1.5 text-[11px] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" /> Online — replies instantly
          </span>
        </span>
      </div>

      <div ref={box} data-lenis-prevent className="max-h-44 overflow-y-auto px-4 py-3 space-y-2.5 bg-white/40 backdrop-blur">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${m.from === "user" ? "bg-pink-500/90 backdrop-blur text-white rounded-br-md" : "bg-white/75 backdrop-blur border border-white/60 text-slate-700 rounded-bl-md shadow-sm"}`}>
              {m.text}
              {m.link && (
                <Link to={m.link[0]} className="block mt-1.5 text-[12.5px] font-bold text-pink-600 hover:underline">
                  {m.link[1]} →
                </Link>
              )}
              {m.action === "counsellor" && (
                <button onClick={() => onEnquire?.("Chatbot enquiry")} className="block mt-1.5 text-[12.5px] font-bold text-pink-600 hover:underline">
                  Request a callback →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 pt-2.5 flex flex-wrap gap-1.5 bg-white/50 backdrop-blur border-t border-white/60">
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="rounded-full border border-white/60 bg-white/60 backdrop-blur px-3 py-1.5 text-[12px] font-semibold text-slate-600 hover:border-pink-400 hover:text-pink-600 transition"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        className="flex items-center gap-2 p-3 bg-white/50 backdrop-blur"
        onSubmit={(e) => {
          e.preventDefault();
          send(val);
        }}
      >
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Ask about a course, fees…"
          className="flex-1 min-w-0 rounded-xl border border-white/60 bg-white/70 backdrop-blur px-3.5 py-2.5 text-[13.5px] outline-none focus:border-pink-500 focus:bg-white/90 transition placeholder:text-slate-400"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="w-10 h-10 shrink-0 grid place-items-center rounded-xl bg-pink-500/90 hover:bg-pink-500 backdrop-blur border border-white/20 text-white transition"
        >
          <FiSend size={15} />
        </button>
      </form>
    </div>
  );
}
