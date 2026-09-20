import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiTarget,
  FiEye,
  FiAward,
  FiBriefcase,
  FiTrendingUp,
  FiGlobe,
  FiLayers,
  FiCpu,
  FiMonitor,
  FiUsers,
  FiCheckSquare,
} from "react-icons/fi";
import FaqSection from "../components/FaqSection";
import CollaborationsSection from "../components/CollaborationsSection";

export default function About({ onEnquire }) {
  const heroRef = useRef(null);

  // The 3 Key Focus Pillars from the original Envistream EduSkill platform
  const FOCUS_PILLARS = [
    {
      num: "01",
      icon: FiTarget,
      title: "Achieving Ample Exposure",
      desc: "Providing students with real enterprise-grade exposure to modern production toolchains, live capstone codebases, and agile corporate sprints.",
      highlight: "Enterprise Toolchains",
    },
    {
      num: "02",
      icon: FiTrendingUp,
      title: "Revolutionizing Learning & Development",
      desc: "Transforming traditional passive textbook memorization into active, project-driven engineering, code reviews, and analytical problem-solving.",
      highlight: "Practical Pedagogy",
    },
    {
      num: "03",
      icon: FiBriefcase,
      title: "Addressing On-the-Job Challenges",
      desc: "Equipping learners to handle real corporate tasks, production debugging, strict milestones, and client deliverables with confidence.",
      highlight: "Job-Ready Readiness",
    },
  ];


  // Authentic FAQs from the original envistream.org platform
  const ABOUT_FAQS = [
    {
      q: "What is an Online Project at Envistream EduSkill?",
      a: "Online Project is an initiative by Envistream EduSkill where students can complete their Pre-Final and Final year academic and capstone projects under expert guidance. We support students at every stage—from Synopsis preparation, Software Installation, and Architecture Design to Coding, Unit Testing, and Live Implementation—allowing learners to build and deploy projects from home or our campus.",
    },
    {
      q: "Why are internships so important for engineering and management students?",
      a: "Internships are no longer optional—they are a critical necessity. Major universities across India mandate internship credits. With corporate employers prioritizing candidates with verifiable hands-on experience, internships provide the practical bridge needed to understand corporate culture, modern tech stacks, and team workflows.",
    },
    {
      q: "How does Envistream EduSkill help with internships?",
      a: "At Envistream EduSkill, students master in-demand technologies through structured mentor sessions and immediately apply their skills to real client projects. Learners gain experience collaborating with distributed teams using modern industry tools (Git, Jira, Slack, CI/CD). This genuine practical exposure sets our graduates apart in campus and off-campus placements.",
    },
    {
      q: "What is an Internship at Envistream?",
      a: "An internship at Envistream is a time-tested apprenticeship model where aspiring engineers train directly under senior industry architects. Interns work on production-grade software applications, automated test suites, and enterprise workflows, developing both hard technical capabilities and essential professional soft skills.",
    },
    {
      q: "Why should I choose an Online or Hybrid Internship?",
      a: "Online and hybrid internships offer maximum schedule flexibility without compromising project quality. Students gain global exposure, collaborate across remote teams, and build proof of work in cloud environments. Leading multinational companies now actively recruit candidates who have proven success in remote and hybrid tech setups.",
    },
    {
      q: "Are the training certificates and project credentials verified?",
      a: "Yes. Every completed internship and professional training program at Envistream EduSkill includes a verified digital certificate with unique credential IDs aligned with AICTE, BPUT, and corporate partner standards, directly verifiable by HRs and academic evaluators worldwide.",
    },
  ];

  return (
    <main className="bg-white text-[#080808] overflow-hidden">
      {/* =========================================================================
          HERO BANNER: Sky Bluish & White Minimalist Header
          ========================================================================= */}
      <section
        ref={heroRef}
        className="relative overflow-hidden text-white py-14 lg:py-20 min-h-[400px] flex flex-col justify-center border-b border-sky-900/40"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/about_hero_bg.jpg')" }}
        />

        {/* Layered Overlays: dark tint + sky-blue gradient for brand feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#03101f]/80 via-[#0a2a50]/70 to-[#020d1a]/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/40 via-transparent to-transparent pointer-events-none" />

        {/* Ambient Glows on top of image */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-sky-400/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-10 right-12 w-[350px] h-[220px] bg-cyan-300/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="container-x relative z-10 text-center max-w-2xl mx-auto">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-white via-slate-100 to-sky-100 bg-clip-text text-transparent">
              Transforming Ambition Into
            </span>{" "}
            <span className="bg-gradient-to-r from-[#FF6B35] via-[#FFD700] to-[#00E5FF] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,200,0,0.5)]">
              IT Careers
            </span>
          </h1>

          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Industry-aligned technology training, live capstone internships, and job-ready skills.
          </p>

          {/* Clean Action Buttons / CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-7">
            <button
              type="button"
              onClick={() => onEnquire?.("About Us Application")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#EA580C] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/35 hover:shadow-orange-500/50 hover:scale-[1.03] transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Apply for Training &amp; Internships</span>
              <FiArrowRight size={15} />
            </button>
            <Link
              to="/courses"
              className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs sm:text-sm font-bold backdrop-blur-md hover:scale-[1.03] transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <span>Explore Courses</span>
            </Link>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 1 — OVERVIEW (WHITE BACKGROUND)
          ========================================================================= */}
      <section className="py-8 lg:py-10 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-6">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Overview &amp; Value Proposition
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
              Transforming ambitious students into industry-ready engineers through live enterprise projects.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-5 lg:gap-6 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-2.5">
              <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-white border border-blue-200/80 hover:border-blue-500 hover:from-blue-100/60 hover:via-white hover:to-blue-50/40 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <h3 className="font-display font-bold text-base text-slate-900 mb-1 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 grid place-items-center text-sm group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all">
                    <FiGlobe />
                  </span>
                  <span>Understanding of Student Requirements</span>
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-10">
                  In today&apos;s hyper-competitive technology market, mastering theory alone is no longer enough. Students require hands-on adoption of cutting-edge frameworks, version control pipelines, and end-to-end deployment architectures.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-orange-50/70 via-slate-50 to-white border border-orange-200/80 hover:border-orange-500 hover:from-orange-100/60 hover:via-white hover:to-orange-50/40 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <h3 className="font-display font-bold text-base text-slate-900 mb-1 flex items-center gap-2 group-hover:text-orange-600 transition-colors">
                  <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 grid place-items-center text-sm group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 transition-all">
                    <FiLayers />
                  </span>
                  <span>Standardized One-Stop Learning Platform</span>
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-10">
                  Envistream EduSkill drives standardization in training and reporting through a unified learning ecosystem, lowering training friction and ensuring every student is thoroughly prepared for corporate requirements.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-50/70 via-slate-50 to-white border border-emerald-200/80 hover:border-emerald-500 hover:from-emerald-100/60 hover:via-white hover:to-emerald-50/40 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <h3 className="font-display font-bold text-base text-slate-900 mb-1 flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 grid place-items-center text-sm group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all">
                    <FiAward />
                  </span>
                  <span>Comprehensive IT Services &amp; SAP Excellence</span>
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-10">
                  Engaged in premier IT training, consultancy, and recruitment in high-demand segments including <strong>Artificial Intelligence &amp; GenAI, ERP/SAP, Cypress QA Automation, MERN Full Stack, and AEO Digital Marketing</strong>.
                </p>
              </div>
            </div>

            {/* Right Column: High Quality Image Showcase */}
            <div className="lg:col-span-5 h-full flex flex-col justify-center">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-md group bg-slate-100">
                <img
                  src="/images/hero_male_student.jpg"
                  alt="Envistream EduSkill IT Training and Internship"
                  className="w-full h-[320px] sm:h-[360px] lg:h-[380px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/25 to-transparent pointer-events-none" />

                {/* Floating Hub Badge */}
                <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-xs text-[11px] font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Bhubaneswar Tech Hub</span>
                </div>

                {/* Bottom Glassmorphism Overlay Card */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3.5 sm:p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/60 shadow-md text-slate-900">
                  <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                    Real-World IT Training &amp; Live Internships
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    MNC mentor guidance, enterprise projects &amp; 100% placement assistance.
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10.5px] font-semibold text-slate-700">
                    <span className="text-blue-600 font-bold">120+ Hiring Partners</span>
                    <span className="text-orange-500 font-bold">AICTE / BPUT Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — WHO WE ARE (GREY BACKGROUND)
          ========================================================================= */}
      <section className="py-8 lg:py-10 bg-gradient-to-b from-slate-100 to-white border-b border-slate-200">
        <div className="container-x">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">About Envistream</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Who{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">We Are</span>
            </h2>
            <div className="w-14 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mt-3" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-stretch">
            {/* Story Cards */}
            <div className="space-y-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mb-2 flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white grid place-items-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <FiGlobe size={18} />
                  </span>
                  Professionalism & Quality
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed pl-[52px]">
                  <strong className="text-slate-800">Envistream EduSkill</strong> delivers high-quality IT training, internships, and recruitment across India, US, Mexico & UK — at affordable fees with expert IT professionals.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-violet-100 hover:border-violet-400 shadow-sm hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mb-2 flex items-center gap-3 group-hover:text-violet-600 transition-colors">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white grid place-items-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <FiBriefcase size={18} />
                  </span>
                  Holistic Career Foundation
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed pl-[52px]">
                  We bridge the gap between education and industry — meeting long-term needs of employers and candidates, building careers through innovation, excellence, and real-world readiness.
                </p>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "120+",  label: "Hiring Partners",   color: "text-blue-400" },
                  { value: "5000+", label: "Students Trained",  color: "text-cyan-400" },
                  { value: "100%",  label: "Placement Support", color: "text-emerald-400" },
                  { value: "10+",   label: "Years Experience",  color: "text-amber-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className={`font-display font-black text-3xl sm:text-4xl ${stat.color}`}>{stat.value}</div>
                    <div className="text-slate-400 text-sm font-medium mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-sm mt-5 leading-relaxed">
                Trusted by students across India and abroad for industry-aligned training and verified credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — MISSION & VISION (WHITE BACKGROUND)
          ========================================================================= */}
      <section className="py-8 lg:py-10 bg-white border-b border-slate-200">
        <div className="container-x">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">Our Purpose</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Mission{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-amber-500 bg-clip-text text-transparent">&amp; Vision</span>
            </h2>
            <div className="w-14 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-amber-400 mt-3" />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Our Mission */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white grid place-items-center mb-4 shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <FiTarget size={22} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Strategic Purpose</span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1.5 mb-3 group-hover:text-blue-700 transition-colors">
                Our Mission
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                To be a trusted partner in recruitment — combining developmental training for employees with quality IT &amp; engineering placement, driven by a result-oriented approach.
              </p>
              <div className="mt-5 pt-3 border-t border-blue-100 flex items-center gap-2 text-sm font-bold text-blue-700 uppercase tracking-wider">
                <FiCheckSquare className="text-blue-500" size={13} />
                <span>Result-Oriented Thought Process</span>
              </div>
            </div>

            {/* Our Vision */}
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50/50 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100 to-transparent rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white grid place-items-center mb-4 shadow-md shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <FiEye size={22} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Long-Term Aspiration</span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1.5 mb-3 group-hover:text-amber-700 transition-colors">
                Our Vision
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                To build lasting trust with clients through strong partnerships — adding value by optimizing recruitment, minimizing friction, and delivering the best possible talent resource.
              </p>
              <div className="mt-5 pt-3 border-t border-amber-100 flex items-center gap-2 text-sm font-bold text-amber-700 uppercase tracking-wider">
                <FiCheckSquare className="text-amber-500" size={13} />
                <span>Client Trust &amp; Optimized Hiring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — OUR APPROACH (GREY BACKGROUND)
          ========================================================================= */}
      <section className="py-8 lg:py-10 bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-200">
        <div className="container-x">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">Our Methodology</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Our Approach &amp;{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">What We Focus On</span>
            </h2>
            <div className="w-14 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 mt-3" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FOCUS_PILLARS.map((focus, idx) => {
              const Icon = focus.icon;
              const colors = [
                { ring: "border-blue-200",   icon: "from-blue-500 to-indigo-500",   num: "text-blue-600 bg-blue-50",   hover: "hover:border-blue-400 hover:shadow-blue-500/10",   title: "group-hover:text-blue-600" },
                { ring: "border-emerald-200", icon: "from-emerald-500 to-teal-500",  num: "text-emerald-600 bg-emerald-50", hover: "hover:border-emerald-400 hover:shadow-emerald-500/10", title: "group-hover:text-emerald-600" },
                { ring: "border-violet-200",  icon: "from-violet-500 to-purple-500", num: "text-violet-600 bg-violet-50",  hover: "hover:border-violet-400 hover:shadow-violet-500/10",  title: "group-hover:text-violet-600" },
              ][idx % 3];
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl bg-white border ${colors.ring} ${colors.hover} shadow-xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.icon} text-white grid place-items-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={20} />
                      </div>
                      <span className={`font-mono font-bold text-[11px] ${colors.num} px-2.5 py-0.5 rounded-full border border-current/20`}>
                        {focus.num}
                      </span>
                    </div>

                    <h3 className={`font-display font-bold text-lg sm:text-xl text-slate-900 mb-1.5 ${colors.title} transition-colors`}>
                      {focus.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {focus.desc.length > 110 ? focus.desc.slice(0, 108) + "…" : focus.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10.5px] font-semibold text-slate-400">{focus.highlight}</span>
                    <FiArrowRight className="text-slate-400 group-hover:text-current group-hover:translate-x-1 transition-all" size={13} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — CALL TO ACTION (CTA BANNER)
          ========================================================================= */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-[#071952] via-[#0B2447] to-[#19376D] text-white relative overflow-hidden select-none border-t border-b border-sky-900/50">
        {/* Glow & Backdrop Ambience */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-x relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold tracking-wider uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              Accelerate Your Career
            </span>

            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Ready to Build Production Skills with{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Senior Mentors?
              </span>
            </h2>

            <p className="mt-3.5 text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
              Join 15,000+ engineers and management graduates who transitioned into high-growth IT careers with our verified project credentials.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mt-8">
              <button
                type="button"
                onClick={() => onEnquire?.("About Us Bottom CTA - Enrolment")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#EA580C] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Enroll in a Program</span>
                <FiArrowRight size={15} />
              </button>

              <Link
                to="/courses"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-md hover:scale-105 transition-all inline-flex items-center gap-2 shadow-sm"
              >
                <span>Browse All Courses</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — FAQ (WHITE BACKGROUND) & SECTION 7 — COLLABORATIONS (SLATE)
          ========================================================================= */}
      <FaqSection
        faqs={ABOUT_FAQS}
        onEnquire={onEnquire}
        eyebrow="Got Questions?"
        title="Frequently Asked Questions (FAQ)"
        subtitle="Find answers to common questions regarding our training programs, online projects, and internship credentials."
        ctaText="Talk to a Counsellor"
        className="bg-white !py-8 sm:!py-10 border-b border-slate-200"
      />
      <CollaborationsSection title="OUR HIRING PARTNERS &amp; INSTITUTIONAL ASSOCIATES" className="bg-slate-100" />
      {/* End of About content */}
    </main>
  );
}
