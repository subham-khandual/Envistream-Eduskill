import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Chat from "./chat/Chat";
import { reduced } from "../anim/ui";
import sayraaLogo from "../assets/img/sayraa-logo.jpg";

export default function ChatbotPopup({ onEnquire }) {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [seen, setSeen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  // Auto-show teaser bubble after 5 seconds
  useEffect(() => {
    if (reduced() || seen) return undefined;
    const t1 = setTimeout(() => setTeaser(true), 5000);
    const t2 = setTimeout(() => {
      if (btnRef.current && !seen) {
        gsap.fromTo(
          btnRef.current,
          { scale: 1 },
          { scale: 1.08, duration: 0.2, yoyo: true, repeat: 2, ease: "power2.inOut" }
        );
      }
    }, 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [seen]);

  // Animate panel in/out
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return undefined;
    if (reduced()) {
      gsap.set(el, { clearProps: "all" });
      el.style.display = open ? "flex" : "none";
      return undefined;
    }
    if (open) {
      el.style.display = "flex";
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 20, scale: 0.97, transformOrigin: "bottom right" },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: "expo.out", overwrite: "auto" }
      );
    } else if (el.style.display !== "none") {
      gsap.to(el, {
        autoAlpha: 0,
        y: 14,
        scale: 0.97,
        duration: 0.22,
        ease: "power3.in",
        overwrite: "auto",
        onComplete: () => { el.style.display = "none"; },
      });
    }
    return undefined;
  }, [open]);

  // Escape key to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = () => {
    setSeen(true);
    setTeaser(false);
    setOpen((prev) => {
      if (prev && typeof window !== "undefined" && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch (_) {}
      }
      return !prev;
    });
  };

  return (
    <>
      {/* ── Teaser bubble ── */}
      {teaser && !open && (
        <div className="fixed bottom-36 right-6 z-[70] max-w-[260px] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl text-[13px] text-slate-900">
            <button
              onClick={() => setTeaser(false)}
              aria-label="Dismiss"
              className="absolute -top-2 -right-2 w-6 h-6 grid place-items-center rounded-full bg-[#0A1A4A] text-white text-xs shadow-sm hover:scale-110 transition-transform"
            >
              <FiX size={12} />
            </button>
            <button onClick={toggle} className="text-left w-full group flex items-center gap-3">
              <img
                src={sayraaLogo}
                alt="Sayraa AI"
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-indigo-400/50 shadow-md"
              />
              <div className="min-w-0">
                <span className="font-bold text-slate-900 block text-xs">
                  Kya help chahiye? 😊
                </span>
                <span className="block mt-0.5 text-[#0F2468] group-hover:text-blue-600 font-semibold text-xs truncate">
                  Sayraa se baat karo →
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── Sayraa Chat Panel ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Sayraa AI chatbot"
        aria-hidden={!open}
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="fixed bottom-24 right-5 z-[70] w-[min(92vw,380px)] h-[560px] max-h-[72vh] flex-col overflow-hidden rounded-2xl border border-[#c8d8f0] shadow-[0_20px_60px_-15px_rgba(10,26,74,0.35)]"
        style={{ display: "none", overscrollBehavior: "contain" }}
      >
        <Chat isOpen={open} onClose={toggle} onEnquire={onEnquire} />
      </div>

      {/* ── Floating action buttons — completely hidden when chat is open so no cross overlaps the mic ── */}
      <div
        className={`fixed bottom-6 right-6 z-[70] flex flex-col items-center gap-3 transition-all duration-200 ${
          open ? "opacity-0 scale-75 pointer-events-none invisible" : "opacity-100 scale-100 visible"
        }`}
      >
        {/* Sayraa chat opening button with logo */}
        <button
          ref={btnRef}
          onClick={toggle}
          aria-label={open ? "Close Sayraa chat" : "Open Sayraa chat"}
          aria-expanded={open}
          className="w-[58px] h-[58px] rounded-full p-[2.5px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 shadow-2xl shadow-blue-950/40 hover:scale-110 transition-all relative cursor-pointer group flex items-center justify-center"
        >
          <img
            src={sayraaLogo}
            alt="Sayraa AI Logo"
            className="w-full h-full rounded-full object-cover bg-[#0A1A4A]"
          />
          {/* Notification dot — only when chat is closed & unseen */}
          {!seen && !open && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#38BDF8] border-2 border-white animate-pulse"
              aria-hidden
            />
          )}
        </button>

        {/* Business WhatsApp Button */}
        <a
          href="https://wa.me/917873489364"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp with Envistream"
          className="w-[52px] h-[52px] rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white grid place-items-center shadow-xl shadow-green-600/35 hover:scale-110 transition-all duration-200"
        >
          <FaWhatsapp size={28} />
        </a>
      </div>
    </>
  );
}
