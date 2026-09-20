import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight, FiBriefcase, FiTrendingUp,
  FiUsers, FiStar, FiFileText, FiTarget, FiCheckCircle,
  FiCompass, FiBookOpen, FiSun, FiLayers, FiCode, FiAward, FiCheck
} from "react-icons/fi";
import Reveal from "../components/Reveal";
import FaqSection from "../components/FaqSection";
import CollaborationsSection from "../components/CollaborationsSection";

export default function Placement({ onEnquire }) {
  const [activeMode, setActiveMode] = useState("dashboard"); // "dashboard" or "path"

  // 5 Signature Steps from the requested design
  const TIMELINE_STEPS = [
    {
      num: "01",
      badge: "START SMART / CURATED",
      title: "Career Programs",
      desc: "Structured tracks engineered around high-growth tech domains, full-stack pipelines, and industry capstones.",
      companionTitle: "Built into your journey",
      companionDesc: "Get the support and direct access you need from day one through mentors, projects, and sprint validations.",
      companionTag: "Mentorship & Direct Guidance",
      icon: FiBookOpen,
    },
    {
      num: "02",
      badge: "PLACEMENT ACCELERATOR",
      title: "Placement Assistance",
      desc: "Dedicated interview drives, 1-on-1 resume reviews, hiring pipeline coaching, and salary negotiation prep.",
      companionTitle: "Built into your journey",
      companionDesc: "Direct referrals to 120+ vetted MNC hiring partners and high-growth technology product firms.",
      companionTag: "Exclusive Corporate Network",
      icon: FiBriefcase,
    },
    {
      num: "03",
      badge: "STEP-BY-STEP BLUEPRINT",
      title: "Career Roadmap",
      desc: "A personalized milestone-driven roadmap customized to your background, engineering goals, and target roles.",
      companionTitle: "Built into your journey",
      companionDesc: "Continuous PR audits, live GitHub commits, and measurable milestones to prove your practical capability.",
      companionTag: "ATS & GitHub Overhaul",
      icon: FiCompass,
    },
    {
      num: "04",
      badge: "PRODUCTION VALUE",
      title: "Job-Oriented Training",
      desc: "Hands-on coding drills, live production architectures, agile sprint ceremonies, and cloud deployments.",
      companionTitle: "Built into your journey",
      companionDesc: "No toy codebases. Real cloud pipelines on AWS with automated CI/CD and production debugging.",
      companionTag: "Enterprise Cloud Sprints",
      icon: FiCode,
    },
    {
      num: "05",
      badge: "HIRING PARTNER BENCHMARK",
      title: "Industry Skills",
      desc: "Skills validated by working engineering architects—ranging from AI pipelines to full-stack QA frameworks.",
      companionTitle: "Built into your journey",
      companionDesc: "Verifiable digital credential registry with tamper-proof ID verification trusted by HR recruiters.",
      companionTag: "Verifiable Digital Credential",
      icon: FiAward,
    },
  ];

  return (
    <main className="bg-slate-50 text-slate-900 min-h-screen">
      {/* =========================================================================
          HERO HEADER: Eye-Catchy Sky Blue, Slate Grey & Warm Orange Mix
          ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#E0F2FE] via-[#F1F5F9] to-[#BAE6FD] text-slate-900 py-10 lg:py-14 select-none border-b border-sky-300 shadow-xs">
        {/* Eye-Catchy Multi-Color Ambient Glows: Orange, Slate-Grey & Sky Blue Mesh */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[380px] bg-gradient-to-bl from-orange-400/25 via-amber-300/20 to-transparent rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-5 w-[450px] h-[320px] bg-gradient-to-tr from-sky-400/35 via-cyan-300/25 to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[350px] h-[250px] bg-slate-300/30 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.12)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-80" />

        <div className="container-x relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content Column (6 cols) */}
            <div className="lg:col-span-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-extrabold tracking-widest uppercase mb-3 shadow-xs">
                <span>CAREER OUTCOMES &amp; PLACEMENT</span>
              </div>

              {/* Headline with vibrant, high-contrast color accents */}
              <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-[42px] tracking-tight text-[#071952] leading-tight">
                Placement is{" "}
                <span className="text-[#EA580C] font-black">
                  preparation
                </span>{" "}
                with a <br className="hidden sm:block" />
                <span className="text-[#0369A1] font-black">
                  point of view
                </span>.
              </h1>

              {/* Subtitle */}
              <p className="mt-3 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-medium">
                Build the practical proof of work, interview readiness, and verified capstone credentials that help top tech employers recognize you.
              </p>

              {/* Quick Feature Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mt-5 text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-sky-200 shadow-xs">
                  <FiCheckCircle className="text-emerald-600" size={13} /> 120+ Hiring Partners
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-sky-200 shadow-xs">
                  <FiBriefcase className="text-sky-600" size={13} /> Live Project Portfolio
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-sky-200 shadow-xs">
                  <FiFileText className="text-orange-600" size={13} /> ATS Resume Overhaul
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => onEnquire?.("Build My Career Plan")}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#EA580C] hover:opacity-95 text-white font-black text-xs sm:text-sm tracking-tight shadow-lg shadow-orange-500/25 hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Build my plan</span>
                  <FiArrowRight size={14} />
                </button>

                <Link
                  to="/courses"
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-sky-50/80 border border-sky-300 text-[#0A1A4A] font-bold text-xs sm:text-sm tracking-tight shadow-xs transition-all hover:scale-105 inline-flex items-center gap-2"
                >
                  <span>Find a course</span>
                  <FiArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Image Card (6 cols) — Significantly Enlarged */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Luminous Multi-hue glow frame */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-400/40 via-cyan-400/40 to-orange-400/35 rounded-3xl blur-xl opacity-85 group-hover:opacity-100 transition duration-500" />

                {/* Large Image Container */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white/90 shadow-2xl bg-white aspect-[16/10] sm:aspect-[16/10] lg:h-[350px] xl:h-[380px] w-full group">
                  <img
                    src="/images/placement_prep_hero.jpg"
                    alt="Envistream Placement Preparation Hub - Indian College Students Mock Interview"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/hero_collaboration.jpg";
                    }}
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE 2: THE PLACEMENT ARCHITECTURE (CONNECTED PIPELINE SYSTEM)
          - Removed 'Five-Pillar System' text
          - Visual central connecting track linking every step together
          ========================================================================= */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-[#F8FAFC] via-[#EFF6FF]/60 to-[#F1F5F9] text-slate-900 border-b border-slate-200">
        {/* Eye-Catchy Ambient Mesh Glows */}
        <div className="absolute top-10 left-1/4 w-[550px] h-[400px] bg-gradient-to-tr from-sky-400/15 via-blue-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[400px] bg-gradient-to-bl from-orange-400/15 via-amber-300/10 to-transparent rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-cyan-400/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-80" />

        <div className="container-x max-w-5xl relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[42px] tracking-tight text-[#071952] leading-tight">
              The Placement{" "}
              <span className="bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#F97316] bg-clip-text text-transparent">
                Architecture
              </span>
            </h2>
            <p className="text-slate-600 mt-2.5 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
              An interconnected milestone pipeline engineered so you graduate with verified production capabilities.
            </p>
          </div>

          {/* Connected Steps Pipeline with Central Spine */}
          <div className="relative">
            {/* Center Vertical Connecting Line with glowing gradient spine */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-1.5 bg-gradient-to-b from-sky-400 via-blue-600 to-purple-600 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.5)] z-0" />

            <div className="space-y-12 sm:space-y-16 relative z-10">
              {TIMELINE_STEPS.map((step, index) => {
                const isEven = index % 2 === 1; // Alternates left/right orientation
                const Icon = step.icon;

                return (
                  <Reveal key={step.num} delay={index * 0.08}>
                    <div className="relative">
                      {/* Horizontal Connector bridge lines joining cards to the center spine */}
                      <div className="hidden md:block absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-sky-300 to-sky-500 z-0" />
                      <div className="hidden md:block absolute left-1/2 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-sky-500 via-sky-300 to-transparent z-0" />

                      {/* Central Connecting Node Pulse (Center between cards) */}
                      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border-2 border-sky-500 shadow-lg shadow-sky-500/40 items-center justify-center text-xs font-black text-sky-700 ring-4 ring-sky-100">
                        {step.num}
                      </div>

                      <div className="grid md:grid-cols-2 gap-7 sm:gap-14 items-stretch">
                        {/* Primary Feature Card */}
                        <div
                          className={`p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:shadow-sky-500/15 hover:border-sky-400 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden ${
                            isEven ? "md:order-2" : "md:order-1"
                          }`}
                        >
                          {/* Top Accent Line */}
                          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div>
                            {/* Top Number & Badge */}
                            <div className="flex items-center justify-between mb-4">
                              <span className="font-display font-black text-3xl sm:text-4xl text-[#071952] tracking-tight group-hover:text-sky-600 transition-colors">
                                {step.num}
                              </span>
                              <span className="text-[10.5px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-md">
                                {step.badge}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-sky-700 group-hover:to-orange-600 group-hover:bg-clip-text transition-all">
                              {step.title}
                            </h3>

                            {/* Description */}
                            <p className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed">
                              {step.desc}
                            </p>
                          </div>

                          {/* Bottom Micro Action */}
                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
                            <span className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                              <span>Explore {step.title}</span>
                              <FiArrowRight size={13} />
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white grid place-items-center transition-all">
                              <Icon size={16} />
                            </div>
                          </div>
                        </div>

                        {/* Companion "Built into your journey" Card */}
                        <div
                          className={`p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-white via-sky-50/50 to-blue-50/30 border border-sky-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                            isEven ? "md:order-1" : "md:order-2"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-xs" />
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                {step.companionTitle}
                              </span>
                            </div>

                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2 font-medium">
                              {step.companionDesc}
                            </p>
                          </div>

                          <div className="mt-6 pt-3.5 border-t border-sky-100/90 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                              <FiCheck className="text-emerald-600" size={14} strokeWidth={2.5} />
                              <span>{step.companionTag}</span>
                            </span>
                            <span className="text-[10px] font-mono text-sky-700 font-bold bg-sky-100/70 px-2 py-0.5 rounded">
                              Built-In
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Bottom Summary Callout Box: Styled with Rich Purple & Navy Blue Theme */}
          <div className="mt-16 sm:mt-20 p-7 sm:p-9 rounded-2xl bg-gradient-to-r from-[#071952] via-[#1E1B4B] to-[#3B0764] text-white border border-purple-500/30 shadow-2xl shadow-indigo-950/40 grid md:grid-cols-12 gap-6 items-center relative overflow-hidden">
            {/* Ambient Purple & Blue Glow orbs inside card */}
            <div className="absolute top-0 right-1/4 w-[350px] h-[250px] bg-purple-500/20 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-[300px] h-[200px] bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="md:col-span-8 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-widest text-purple-300 bg-white/10 border border-purple-400/30 backdrop-blur-md mb-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                PROVEN MENTOR-DRIVEN MODEL
              </span>

              <h4 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-2 leading-tight">
                A practical process, with{" "}
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                  people close by.
                </span>
              </h4>

              <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed font-normal max-w-xl">
                1-on-1 code reviews, live viva coaching, and direct employer introductions every week.
              </p>

              <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-4 text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-100 backdrop-blur-md shadow-xs">
                  <FiCheckCircle className="text-cyan-400" size={14} /> Resume &amp; PR Audits
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-100 backdrop-blur-md shadow-xs">
                  <FiCheckCircle className="text-purple-300" size={14} /> Mock HR Rounds
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-100 backdrop-blur-md shadow-xs">
                  <FiCheckCircle className="text-emerald-400" size={14} /> 120+ Hiring Partners
                </span>
              </div>
            </div>

            <div className="md:col-span-4 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-center md:text-left flex flex-col justify-between gap-3.5 relative z-10 shadow-lg">
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-white">Ready for your next step?</p>
                <p className="text-[11px] text-purple-200/90 mt-1 font-medium">Talk with an expert career counsellor about your target direction.</p>
              </div>
              <button
                onClick={() => onEnquire?.("Placement Counselling Consultation")}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FB923C] to-[#F59E0B] hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>Talk to a counsellor</span>
                <FiArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — PLACEMENT FAQS */}
      <FaqSection
        onEnquire={onEnquire}
        eyebrow="Placement & Hiring FAQ"
        title="Frequently Asked Questions About Career Drives"
        subtitle="Learn more about our hiring network, salary packages, mock technical rounds, and interview scheduling process."
        ctaText="Register for Placement Drive"
      />

      {/* 4 — HIRING PARTNERS & COLLABORATIONS (Marquee) */}
      <CollaborationsSection title="OUR HIRING PARTNERS & CORPORATE RECRUITERS" />
    </main>
  );
}
