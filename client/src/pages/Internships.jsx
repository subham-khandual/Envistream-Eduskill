import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCode,
  FiUsers,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiMonitor,
  FiFolder,
  FiTerminal,
  FiTarget,
  FiTrendingUp,
  FiBriefcase,
  FiCheckSquare,
  FiCheck,
} from "react-icons/fi";
import Reveal from "../components/Reveal";
import FaqSection from "../components/FaqSection";
import CollaborationsSection from "../components/CollaborationsSection";

export default function Internships({ onEnquire }) {
  // =========================================================================
  // 1. INTERNSHIP & PROJECT TRACKS (3 Flagship Tracks)
  // =========================================================================
  const INTERNSHIP_PROJECT_TRACKS = [
    {
      id: "semester-major-project",
      name: "Final-Year Major & Capstone Project",
      badge: "BPUT / AICTE Compliant",
      duration: "16 – 24 Weeks (Semester)",
      mode: "Hybrid / Campus Labs",
      points: [
        "Dedicated Senior Guide & Weekly PR Audits",
        "Complete IEEE & BPUT Synopsis / SRS Thesis",
        "External University Viva Defense Coaching",
        "Live Production Cloud Deployment on AWS",
        "University MoU Credit Alignment & Stipend",
      ],
      applyText: "Apply for Major Project",
    },
    {
      id: "summer-industrial-training",
      name: "Summer Industrial Training & Internship",
      badge: "Summer Break Intensive",
      duration: "4 – 8 Weeks (Fast-Track)",
      mode: "Classroom Labs / Live Virtual",
      points: [
        "Hands-On Full-Stack Application Sprints",
        "Daily Lab Drills & Git Version Control",
        "Verified College Submission Certificate",
        "Milestone Evaluation & Examiner Demos",
        "Subsidized Student Tier & Merit Waivers",
      ],
      applyText: "Apply for Summer Batch",
    },
    {
      id: "corporate-client-apprenticeship",
      name: "Corporate Client Apprenticeship",
      badge: "PPO & Hiring Pipeline",
      duration: "3 – 6 Months (Paid)",
      mode: "Hybrid Tech Hub / Cloud",
      points: [
        "Embedded in Active Client Product Squads",
        "Production Bug Fixes & Code Contributions",
        "Sprint Ceremonies & Enterprise Code Reviews",
        "Paid Project Stipend (₹8k – ₹15k / Month)",
        "Direct Pre-Placement Offer (PPO) Pathway",
      ],
      applyText: "Apply for Apprenticeship",
    },
  ];

  // =========================================================================
  // 2. PROJECTS & PRACTICAL EXPERIENCE (5 Required Elements)
  // =========================================================================
  const PRACTICAL_EXPERIENCE_ITEMS = [
    {
      icon: FiTerminal,
      num: "01",
      title: "Real-World Projects",
      desc: "Build production systems for actual business use cases rather than basic toy scripts.",
      bulletPoints: [
        "Scalable multi-tier architectures",
        "Enterprise edge cases & clean code",
      ],
      tag: "Production Codebases",
    },
    {
      icon: FiCode,
      num: "02",
      title: "Hands-On Practice",
      desc: "Daily lab drills translating engineering theory directly into Git commits and tests.",
      bulletPoints: [
        "Daily coding sprints & version control",
        "Automated CI/CD test pipelines",
      ],
      tag: "Daily Lab Drills",
    },
    {
      icon: FiUsers,
      num: "03",
      title: "Mentor Guidance",
      desc: "1-on-1 code reviews, architectural advice, and debugging support from senior engineers.",
      bulletPoints: [
        "Weekly line-by-line PR code audits",
        "Live system design & troubleshooting",
      ],
      tag: "Industry Mentors",
    },
  ];

  // =========================================================================
  // 3. CAREER & CERTIFICATION (5 Required Elements)
  // =========================================================================
  const CAREER_CERTIFICATION_ITEMS = [
    {
      icon: FiTarget,
      num: "03",
      title: "Interview Preparation",
      subtitle: "Mock Technical & Coding Rounds",
      desc: "Simulate corporate technical interviews with real architects—covering coding assessments, data structures, system design fundamentals, and behavioral HR interview questions.",
      feature: "1-on-1 Mock Interview Drills",
    },
    {
      icon: FiTrendingUp,
      num: "04",
      title: "Career Guidance",
      subtitle: "Personalized Roadmap & Mentorship",
      desc: "Sit down for 1-on-1 career mapping with industry veterans to navigate tech trends, select high-demand specializations, and plan realistic 1 to 3-year career and compensation targets.",
      feature: "Tailored Career Roadmap Planning",
    },
    {
      icon: FiBriefcase,
      num: "05",
      title: "Placement Support",
      subtitle: "Direct Hiring Drives with 120+ Partners",
      desc: "Access exclusive campus and off-campus recruitment drives. We connect top performers directly with corporate partners, IT MNCs, and growing startups across India.",
      feature: "120+ Corporate Hiring Networks",
    },
  ];

  return (
    <main className="bg-white text-[#080808] min-h-screen font-sans">
      {/* =========================================================================
          HERO HEADER: Full-bleed Background Image with Students on Right (Resources Style)
          ========================================================================= */}
      <section className="relative overflow-hidden py-14 sm:py-18 lg:py-24 select-none border-b border-sky-300/80 bg-[#071120] text-white">
        {/* Full-bleed Background Image pinned right and centered */}
        <div
          className="absolute inset-0 bg-no-repeat pointer-events-none bg-cover bg-[position:right_center] md:bg-[position:calc(100%+40px)_center] lg:bg-[position:right_center]"
          style={{ backgroundImage: "url('/images/internship_hero_bg.jpg')" }}
        />

        {/* Directional Shading: heavily shades the left for crisp text, transparent over the students on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060F1E]/95 via-[#060F1E]/85 via-50% to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060F1E]/80 via-transparent to-[#060F1E]/30 pointer-events-none" />

        <div className="container-x relative z-10">
          {/* Confined to left column so text NEVER covers the students on the right */}
          <div className="max-w-lg lg:max-w-2xl">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-[1.15] drop-shadow-lg">
              Training &amp; Internship{" "}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-amber-300 bg-clip-text text-transparent drop-shadow-md">
                Live Projects
              </span>
            </h1>

            <p className="mt-4 text-slate-200 text-xs sm:text-base leading-relaxed font-medium drop-shadow-sm max-w-xl">
              Build production-grade projects under 1-on-1 industry mentorship and earn verifiable credentials recognized by 120+ corporate hiring partners.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mt-5 text-xs font-semibold text-slate-200">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md shadow-xs">
                <FiClock className="text-amber-400" size={13} /> 4 to 12 Weeks
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md shadow-xs">
                <FiCode className="text-cyan-400" size={13} /> Live Repositories
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md shadow-xs">
                <FiCheckCircle className="text-emerald-400" size={13} /> AICTE &amp; BPUT Aligned
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <button
                type="button"
                onClick={() => onEnquire?.("Internship Batch Application")}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#EA580C] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/35 hover:scale-[1.02] transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Apply for Internship</span>
                <FiArrowRight size={14} />
              </button>

              <Link
                to="/courses"
                className="px-6 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs sm:text-sm font-bold shadow-xs backdrop-blur-md transition-all hover:scale-[1.02] inline-flex items-center gap-2"
              >
                <span>Explore Courses</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1 — INTERNSHIP & PROJECT TRACKS (SKY BLUE, SLATE GREY & ORANGE MIX)
          ========================================================================= */}
      <section className="relative overflow-hidden py-8 lg:py-10 bg-gradient-to-r from-[#E0F2FE]/90 via-[#F8FAFC] to-[#BAE6FD]/90 border-b border-sky-200">
        {/* Subtle Orange & Sky Blue Ambient Glows */}
        <div className="absolute top-0 right-10 w-[300px] h-[200px] bg-orange-400/15 rounded-full blur-[70px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[200px] bg-sky-400/20 rounded-full blur-[70px] pointer-events-none" />
        <div className="container-x">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-6">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#071952] tracking-tight">
              Internship &amp; Project Tracks
            </h2>
            <p className="text-slate-800 text-xs sm:text-sm mt-1 leading-relaxed font-semibold">
              University semester credits, final-year capstones, and corporate client apprenticeships with verified credentials.
            </p>
          </div>

          {/* Programs Grid (3 Cards) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
            {INTERNSHIP_PROJECT_TRACKS.map((prog, idx) => (
              <Reveal key={prog.id} delay={idx * 0.05}>
                <div className="p-5 rounded-xl bg-white border border-blue-200/70 hover:border-blue-500 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/70 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer">
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/70 rounded-md px-2 py-0.5 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                        {prog.badge}
                      </span>
                    </div>

                    {/* Track Name */}
                    <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                      {prog.name}
                    </h3>

                    {/* Quick Specs */}
                    <div className="flex flex-wrap gap-1.5 mt-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] group-hover:bg-white group-hover:border-blue-200 transition-colors">
                        <FiClock className="text-blue-600" size={11} /> {prog.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-medium text-[11px] group-hover:bg-white group-hover:border-blue-200 transition-colors">
                        <FiMonitor className="text-blue-600" size={11} /> {prog.mode}
                      </span>
                    </div>

                    {/* Attractive & Accurate Points */}
                    <ul className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                      {prog.points.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center shrink-0 mt-0.5 border border-emerald-200 group-hover:bg-emerald-100 transition-colors">
                            <FiCheck size={9} strokeWidth={3} />
                          </span>
                          <span className="leading-snug font-medium text-slate-700 text-[11.5px]">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Apply CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onEnquire?.(`Apply: ${prog.name}`)}
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{prog.applyText}</span>
                      <FiArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — PROJECTS & PRACTICAL EXPERIENCE (GREY BACKGROUND)
          5 Elements: Real-world projects, Hands-on practice, Mentor guidance, Assignments, Project portfolio
          ========================================================================= */}
      <section className="py-8 lg:py-10 bg-slate-100 border-b border-slate-200">
        <div className="container-x">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-6">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Projects &amp; Practical Experience
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
              Hands-on sprints, mentor reviews, and production deployments for real-world mastery.
            </p>
          </div>

          {/* Visual Showcase Banner: Hands-on Project Implementation */}
          <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
            <div className="grid md:grid-cols-12 items-center">
              <div className="md:col-span-7 h-56 sm:h-64 md:h-72 overflow-hidden relative group">
                <img
                  src="/images/indian_projects_students.jpg"
                  alt="Students Working on Live Software Engineering Projects"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="md:col-span-5 p-6 sm:p-8">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Live Project Curriculum
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mt-1">
                  Industry-Standard Capstone Projects
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Work on enterprise-grade software applications built with modern frameworks, automated test suites, and microservice architectures under continuous mentor guidance.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1 text-emerald-600">✓ Production Codebases</span>
                  <span className="flex items-center gap-1 text-emerald-600">✓ Weekly Code Reviews</span>
                  <span className="flex items-center gap-1 text-emerald-600">✓ Cloud Deployment</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Practical Experience Cards (Pure White Cards on Grey) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
            {PRACTICAL_EXPERIENCE_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.num} delay={idx * 0.05}>
                  <div className="p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-gradient-to-b hover:from-white hover:to-sky-50/60 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer">
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                          0{item.num}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 grid place-items-center group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all">
                          <Icon size={16} />
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                        {item.desc}
                      </p>

                      {/* Bullet Highlights */}
                      <ul className="mt-3 pt-2.5 border-t border-slate-100 space-y-1">
                        {item.bulletPoints.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-center gap-1.5 text-[11.5px] text-slate-600">
                            <FiCheckSquare className="text-blue-600 shrink-0" size={12} />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3.5 pt-2 border-t border-slate-100">
                      <span className="text-[10.5px] font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — CAREER & CERTIFICATION (LIGHT SKY BLUE BACKGROUND)
          5 Elements: Certificate, Resume building, Interview preparation, Career guidance, Placement support
          ========================================================================= */}
      <section className="py-8 lg:py-10 bg-[#F0F7FF] border-b border-sky-100">
        <div className="container-x">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-6">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Career &amp; Placement Support
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
              Transform technical project milestones into interviews, offers, and recognized credentials.
            </p>
          </div>

          {/* Placement Showcase Banner */}
          <Reveal>
            <div className="mb-6 rounded-2xl overflow-hidden bg-white border border-sky-200/80 shadow-md hover:shadow-xl transition-shadow duration-300 grid lg:grid-cols-12">
              <div className="lg:col-span-7 relative min-h-[240px] sm:min-h-[280px] lg:min-h-[320px] overflow-hidden group">
                <img
                  src="/images/career_placement_banner.jpg"
                  alt="Students and career mentors celebrating campus placement offers at Envistream SmarTech"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/40" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-slate-900 font-bold text-[11px] shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    2025–2026 Cohort Drives
                  </span>
                  <span className="text-[11px] text-white/90 font-medium drop-shadow-md">
                    120+ Corporate Hiring Partners
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 sm:p-6 lg:p-7 flex flex-col justify-between bg-gradient-to-br from-white via-sky-50/40 to-orange-50/30">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-700 font-bold text-[11px] uppercase tracking-wider mb-2.5">
                    Dedicated Placement Cell
                  </div>
                  <h3 className="font-display font-extrabold text-slate-900 text-lg sm:text-xl leading-snug">
                    Direct Corporate Access &amp; Guaranteed Interview Drives
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                    We bridge the gap between academic projects and tier-1 tech careers with rigorous mock interviews, ATS resume audits, and pre-placement recruitment pipeline access.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-slate-100">
                  <div className="p-2.5 rounded-lg bg-white border border-sky-100 shadow-2xs">
                    <div className="font-display font-bold text-sky-700 text-base sm:text-lg">94.8%</div>
                    <div className="text-[10.5px] text-slate-500 font-medium">Placement Assistance Rate</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-orange-100 shadow-2xs">
                    <div className="font-display font-bold text-orange-600 text-base sm:text-lg">120+</div>
                    <div className="text-[10.5px] text-slate-500 font-medium">Active Hiring Partners</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Career & Placement Support Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {CAREER_CERTIFICATION_ITEMS.map((cItem, idx) => {
              const Icon = cItem.icon;
              return (
                <Reveal key={cItem.num} delay={idx * 0.05}>
                  <div className="p-4 rounded-xl bg-white border border-sky-100/90 hover:border-orange-500 hover:bg-gradient-to-b hover:from-white hover:to-orange-50/80 shadow-xs hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 grid place-items-center mb-3 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-orange-500/20 transition-all">
                        <Icon size={16} />
                      </div>

                      <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base group-hover:text-orange-600 transition-colors">
                        {cItem.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-orange-600 mt-0.5 group-hover:text-orange-700 transition-colors">
                        {cItem.subtitle}
                      </p>
                      <p className="text-slate-600 text-[11.5px] mt-1.5 leading-relaxed">
                        {cItem.desc}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-2 border-t border-slate-100">
                      <span className="text-[10.5px] font-bold text-slate-700 group-hover:text-orange-800 flex items-center gap-1 transition-colors">
                        <FiCheck className="text-orange-500" size={11} />
                        <span>{cItem.feature}</span>
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — FAQ (GREY BACKGROUND) & SECTION 5 — COLLABORATIONS (WHITE)
          ========================================================================= */}
      <FaqSection
        onEnquire={onEnquire}
        eyebrow="Internship & Projects FAQ"
        title="Frequently Asked Questions About Internships"
        subtitle="Everything you need to know about college MoU credits, live project deliverables, mentor reviews, and digital certificates."
        ctaText="Apply for Internship"
        className="bg-slate-100 !py-8 sm:!py-10 border-b border-slate-200"
      />
      <CollaborationsSection title="OUR HIRING PARTNERS &amp; INSTITUTIONAL ASSOCIATES" className="bg-white" />
    </main>
  );
}
