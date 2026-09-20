import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

/**
 * Full-height hero photo. Drop the real photograph at
 * `public/hero-photo.jpg` — until then a branded cover shows
 * so the hero never looks broken.
 */
export default function HeroPhoto() {
  const [missing, setMissing] = useState(false);

  return (
    <div className="relative h-full min-h-[480px] lg:min-h-[620px] rounded-[22px] overflow-hidden border border-white/40 bg-slate-900/50 backdrop-blur-xl shadow-[0_32px_80px_-28px_rgba(236,72,153,.4)]">
      {!missing ? (
        <img
          src="/hero-photo.jpg"
          alt="Students learning industry-ready technology skills at Envistream Eduskill"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setMissing(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-950/70 via-slate-900/60 to-slate-700/60 backdrop-blur-xl">
          <div className="absolute inset-0 hero-grid opacity-40" aria-hidden />
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-pink-500/25 blur-[100px]" aria-hidden />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-slate-300/20 blur-[100px]" aria-hidden />
          <div className="relative h-full grid place-items-center px-8 text-center">
            <div>
              <svg viewBox="0 0 48 48" className="w-16 h-16 mx-auto" fill="none" aria-hidden>
                <path d="M6 10 C13 16 18 25 20 38 C22 25 27 16 42 9 C31 14 26 17 24 19 C22 17 14 13 6 10Z" fill="#EC4899" />
                <path d="M26 14 C32 18 33 28 32 40 C34 30 34 20 39 12 C35 12 29 12 26 14Z" fill="#C4B5FD" />
              </svg>
              <p className="font-display font-extrabold text-white text-2xl mt-4">
                Envistream <span className="text-pink-300">EduSkill</span>
              </p>
              <p className="text-[13px] italic text-white/55 mt-1">To earn more, you must learn more</p>
              <p className="text-[11.5px] text-white/35 mt-4">
                Photo slot — add <code className="text-white/60">hero-photo.jpg</code> to <code className="text-white/60">public/</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* soft bottom shade for legibility */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" aria-hidden />

      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-slate-900/55 backdrop-blur px-3.5 py-1.5 text-[11.5px] font-bold text-white border border-white/20">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" /> Admissions Open · 2026
      </span>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl bg-white/15 backdrop-blur-2xl border border-white/25 px-5 py-4">
        <div>
          <p className="font-display font-bold text-white text-[15px] leading-snug">15,000+ learners · 120+ partners</p>
          <p className="text-[12px] text-white/65">Courses · Internships · Placements</p>
        </div>
        <Link
          to="/courses"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-pink-500/90 hover:bg-pink-500 backdrop-blur border border-white/20 text-white text-[13px] font-bold px-4 py-2.5 transition"
        >
          Explore <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}
