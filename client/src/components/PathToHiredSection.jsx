import { useRef, useState, useEffect } from "react";
import {
  FiCompass,
  FiVideo,
  FiBox,
  FiTrendingUp,
  FiArrowRight
} from "react-icons/fi";

const STEPS = [
  {
    step: "01",
    title: "Discover",
    desc: "Talk to a counsellor and pick the track that fits your goal — no guesswork.",
    icon: FiCompass,
    gradient: "from-[#F97316] to-[#EA580C]",
    shadow: "shadow-orange-500/30",
    badgeBg: "bg-orange-500/20 text-orange-300 border-orange-400/30",
    accent: "#F97316",
    tag: "Stage 01",
  },
  {
    step: "02",
    title: "Learn live",
    desc: "Mentor-led sessions with labs, reviews and doubt support every week.",
    icon: FiVideo,
    gradient: "from-[#38BDF8] to-[#0284C7]",
    shadow: "shadow-sky-500/30",
    badgeBg: "bg-sky-500/20 text-sky-300 border-sky-400/30",
    accent: "#38BDF8",
    tag: "Stage 02",
  },
  {
    step: "03",
    title: "Build + intern",
    desc: "Ship real projects in a 4–12 week internship with certification.",
    icon: FiBox,
    gradient: "from-[#10B981] to-[#0D9488]",
    shadow: "shadow-emerald-500/30",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    accent: "#10B981",
    tag: "Stage 03",
  },
  {
    step: "04",
    title: "Get hired",
    desc: "Resume reviews, mock interviews and referral drives that convert.",
    icon: FiTrendingUp,
    gradient: "from-[#8B5CF6] to-[#6366F1]",
    shadow: "shadow-purple-500/30",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    accent: "#8B5CF6",
    tag: "Stage 04",
  },
];

export default function PathToHiredSection({ onEnquire }) {
  const scrollRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll loop: advances cards smoothly every 2.8s, pauses on hover or user drag
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      const maxScroll = container.scrollWidth - container.clientWidth;
      const card = container.firstElementChild;
      const stepWidth = card ? card.offsetWidth + 20 : 320;

      if (container.scrollLeft >= maxScroll - 25) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: stepWidth, behavior: "smooth" });
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Update current active card index based on scroll position
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.firstElementChild;
    const stepWidth = card ? card.offsetWidth + 20 : 320;
    const index = Math.round(container.scrollLeft / stepWidth);
    setActiveStep(Math.min(Math.max(index, 0), STEPS.length));
  };

  const scrollToStep = (index) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.firstElementChild;
    const stepWidth = card ? card.offsetWidth + 20 : 320;
    container.scrollTo({ left: index * stepWidth, behavior: "smooth" });
    setActiveStep(index);
  };

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#F8FAFC] text-slate-900 overflow-hidden select-none border-t border-b border-slate-200">
      {/* Subtle ambient glows for depth */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-sky-400/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-x relative z-10">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#EA580C] mb-2 flex items-center gap-2">
            <span className="w-5 h-[2px] bg-[#EA580C] inline-block" />
            HOW IT WORKS
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#08153D] tracking-tight">
            Your path to hired
          </h2>
          {/* Secondary body text using Muted Gray #64748B */}
          <p className="text-[#64748B] text-xs sm:text-sm md:text-base mt-2.5 max-w-xl leading-relaxed font-normal">
            A proven 4-stage career acceleration roadmap engineered to take you from foundational concepts to high-impact live projects and recruiter interviews.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#0284C7] rounded-full mt-4 shadow-xs" />
        </div>

        {/* Horizontal Steps Track with Auto Scroll (Navy Blue Cards) */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-5 overflow-x-auto pb-6 pt-2 px-1 pr-6 sm:pr-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <div
                key={step.step}
                className={`snap-start shrink-0 w-[280px] sm:w-[305px] lg:w-[315px] rounded-2xl bg-gradient-to-br from-[#0B1E48] to-[#07112D] text-white border p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 cursor-pointer group shadow-xl shadow-blue-950/20 hover:shadow-2xl hover:shadow-blue-900/30 ${
                  isActive
                    ? "border-sky-400 ring-2 ring-sky-400/30"
                    : "border-blue-900/60 hover:border-sky-400/70"
                }`}
              >
                <div>
                  {/* Top Header: Badge + Step Number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${step.badgeBg}`}>
                      {step.tag}
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-blue-900/60 group-hover:text-blue-700/60 transition-colors font-mono">
                      {step.step}
                    </span>
                  </div>

                  {/* Gradient Icon Box */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} text-white flex items-center justify-center shadow-lg ${step.shadow} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={22} strokeWidth={2.3} />
                  </div>

                  {/* Step Title */}
                  <h3 className="font-display font-bold text-white text-lg sm:text-xl mt-5 group-hover:text-sky-300 transition-colors">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-slate-300/90 text-xs sm:text-sm mt-2.5 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Accent Bar in Step Accent Color */}
                <div
                  className="h-1 rounded-full mt-6 transition-all duration-300 group-hover:w-16"
                  style={{ width: "2.2rem", backgroundColor: step.accent }}
                />
              </div>
            );
          })}

          {/* 5th Card: Radiant Navy Blue & Orange CTA Card */}
          <div className="snap-start shrink-0 w-[280px] sm:w-[310px] lg:w-[320px] rounded-2xl bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#08153D] p-6 sm:p-8 text-white border border-sky-400/40 shadow-xl shadow-blue-950/40 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 group">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/20 border border-white/30 text-white inline-block mb-4">
                Launch Career
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white leading-snug">
                Ready when you are.
              </h3>
              <p className="text-sky-100/90 text-xs sm:text-sm mt-3 leading-relaxed font-medium">
                Get a personalised roadmap & scholarship assessment in one free counselling call.
              </p>
            </div>

            <button
              onClick={() => onEnquire?.("Path to Hired — Start Now")}
              className="w-full mt-6 py-3 px-5 rounded-full bg-[#080E23] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-lg border border-sky-400/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Start now</span>
              <FiArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* End spacing spacer to ensure equal padding coverage at scroll end */}
          <div className="shrink-0 w-2 sm:w-4" aria-hidden="true" />
        </div>

        {/* Dynamic Pagination Dots */}
        <div className="flex justify-center items-center mt-6 pt-2">
          <div className="flex items-center gap-2">
            {[...Array(STEPS.length + 1)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToStep(i)}
                aria-label={`Go to card ${i + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeStep === i
                    ? "w-7 h-2 bg-[#08153D]"
                    : "w-2 h-2 bg-slate-300 hover:bg-[#64748B]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

