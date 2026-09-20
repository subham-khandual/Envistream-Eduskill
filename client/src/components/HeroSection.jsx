import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiX, FiSearch } from "react-icons/fi";
import LocalFilm from "./LocalFilm";
import heroVideo from "../assets/hero_video.mp4";

export default function HeroSection({ onEnquire }) {
  const [videoModal, setVideoModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative text-white pt-2 sm:pt-3 pb-10 sm:pb-14 lg:pb-16 overflow-hidden select-none min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] flex flex-col justify-start">

      {/* ── Full-section background video (anchored to center & scaled so top-right watermark is removed) ── */}
      <video
        ref={videoRef}
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        onLoadedMetadata={(e) => {
          e.target.muted = true;
          e.target.play().catch(() => {});
        }}
        className="absolute inset-0 w-full h-full object-cover object-center scale-110 origin-bottom z-0 pointer-events-none"
      />

      {/* ── Dark Mode gradient overlay (left to right) ── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#030712]/95 via-[#030712]/80 lg:via-[#030712]/50 to-transparent pointer-events-none" />

      {/* ── Soft top ambient fade & seamless top-right blend (no harsh dark shadow) ── */}
      <div className="absolute inset-x-0 top-0 h-20 sm:h-24 z-[1] bg-gradient-to-b from-[#030712]/40 via-[#030712]/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 sm:w-96 md:w-[480px] h-36 sm:h-48 md:h-60 z-[1] bg-gradient-to-bl from-[#030712]/30 via-[#030712]/10 to-transparent pointer-events-none" />

      {/* ── Subtle bottom edge blend into next section ── */}
      <div className="absolute inset-x-0 bottom-0 h-28 z-[1] bg-gradient-to-t from-[#030712]/70 via-[#030712]/30 to-transparent pointer-events-none" />

      {/* ── Ambient Dark Mode glow accents ── */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none z-[2]" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[130px] pointer-events-none z-[2]" />

      {/* ── Content ── */}
      <div className="relative z-[3] w-full px-4 sm:px-8 lg:px-14 xl:px-20 pt-1 sm:pt-2">
        {/* Search Bar: Placed Just Below the Nav Bar (Top Right on desktop, top on mobile) */}
        <div className="w-full flex justify-end mb-5 sm:mb-7 lg:mb-8">
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="relative p-[1.5px] sm:p-[2px] rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 shadow-2xl shadow-sky-950/60 hover:shadow-sky-500/25 transition-all duration-300 group">
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-[#070e24]/90 hover:bg-[#070e24]/95 backdrop-blur-2xl rounded-[14px] p-2 pl-3.5 sm:pl-4 gap-2.5 sm:gap-3 border border-white/10 transition-colors"
              >
                <FiSearch size={18} className="text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses, skills (e.g. Python, AI, Testing...)"
                  className="w-full text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 outline-none bg-transparent font-medium"
                />
                <button
                  type="submit"
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-extrabold shrink-0 shadow-lg shadow-sky-950 flex items-center gap-1.5 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                >
                  <span>Search</span>
                  <FiArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Hero Headline + Subtitle + Action Buttons */}
        <div className="max-w-3xl text-left">
          {/* Vibrant Monumental Headline */}
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-[1.15] tracking-tight drop-shadow-md">
            <span className="text-white">Transform </span>
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent font-black">
              Your Skills
            </span>{" "}
            <span className="text-slate-200 font-light">and </span>
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent font-black">
              Elevate Your Future!
            </span>
          </h1>

          {/* Spacious Subtitle */}
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg mt-3.5 max-w-2xl leading-relaxed font-normal">
            Industry-ready courses in{" "}
            <span className="text-sky-300 font-semibold">AI, Full Stack, Data &amp; Cloud</span>{" "}
            with live projects, internships &amp; career support.
          </p>

          {/* Eye-Catchy Action Buttons */}
          <div className="flex flex-wrap items-center justify-start gap-4 mt-6">
            <Link
              to="/courses"
              className="px-7 py-3.5 rounded-full bg-white text-[#0A1A4A] text-sm font-extrabold shadow-[0_4px_20px_rgba(255,255,255,0.35)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.55)] inline-flex items-center gap-2 transition-all hover:scale-105 hover:bg-sky-50"
            >
              <span>Browse Courses</span>
              <FiArrowRight size={16} />
            </Link>

            <Link
              to="/internships"
              className="px-7 py-3.5 rounded-full bg-sky-500/20 hover:bg-sky-500/35 border-2 border-sky-400/60 text-white text-sm font-extrabold shadow-lg shadow-sky-950/40 inline-flex items-center gap-2 transition-all hover:scale-105 backdrop-blur-md"
            >
              Join Internship
            </Link>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoModal && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/20">
            <button
              onClick={() => setVideoModal(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-white hover:text-black flex items-center justify-center transition-colors"
              aria-label="Close video"
            >
              <FiX size={20} />
            </button>
            <LocalFilm />
          </div>
        </div>
      )}
    </section>
  );
}
