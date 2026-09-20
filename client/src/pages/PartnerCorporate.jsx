import { useState } from "react";
import {
  FiBriefcase, FiAward, FiArrowRight, FiCheckCircle,
  FiBookOpen, FiLayers, FiUsers, FiTrendingUp, FiCpu
} from "react-icons/fi";
import Reveal from "../components/Reveal";
import FaqSection from "../components/FaqSection";
import CollaborationsSection from "../components/CollaborationsSection";

export default function PartnerCorporate({ onEnquire }) {
  const CORPORATE_OFFERINGS = [
    {
      title: "Generative AI & Productivity Upskilling",
      desc: "Empower engineering teams to build with LLMs, RAG architectures, prompt engineering, and intelligent agents.",
      icon: FiAward,
      image: "/images/corporate_ai_upskilling.jpg",
      badge: "AI & Automation",
    },
    {
      title: "Enterprise Software QA & Testing",
      desc: "Transform manual testers into automated SDETs mastering Selenium, Cypress, Playwright, and CI/CD pipelines.",
      icon: FiLayers,
      image: "/images/corporate_qa_testing.jpg",
      badge: "QA & Automation",
    },
    {
      title: "HR Talent & Workforce Recruitment",
      desc: "Deploy pre-vetted junior developers and analysts trained on your exact tech stack with zero onboarding lag.",
      icon: FiBriefcase,
      image: "/images/corporate_workforce_upskilling.jpg",
      badge: "Pre-Trained Talent",
    },
  ];

  return (
    <main className="font-poppins bg-slate-50 min-h-screen">
      {/* 1 — HERO */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-14 sm:py-18 lg:py-24 min-h-[380px] sm:min-h-[440px] flex flex-col justify-center border-b border-slate-700">
        {/* Crisp high-clarity background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
          style={{ backgroundImage: "url('/images/corporate_hero_bg.jpg')" }}
        />

        {/* Clean, crystal-clear neutral gradient overlay (replaces heavy blue/dark cast) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/65 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />

        <div className="container-x relative z-10">
          <div className="max-w-3xl backdrop-blur-[2px] p-2 rounded-2xl">
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight drop-shadow-md">
              Partner with Envistream to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-sky-300">
                Scale Technical Excellence
              </span>
            </h1>
            <p className="mt-4 text-slate-100 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-normal drop-shadow">
              Empowering enterprise engineering teams and technology workforces with high-impact corporate upskilling, practitioner-led IT bootcamps, and pre-screened technical recruitment.
            </p>
          </div>
        </div>
      </section>

      {/* 2 — CORPORATE WORKFORCE OFFERINGS */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2.5">
              Enterprise Ready · Measurable ROI
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
              Corporate Workforce Upskilling
            </h2>
            <p className="text-slate-600 mt-2 text-xs sm:text-sm md:text-base font-medium">
              High-impact tech bootcamps, AI modernization, and talent pipelines tailored to your business goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {CORPORATE_OFFERINGS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={idx * 0.1}>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/70 overflow-hidden h-full flex flex-col justify-between hover:bg-white hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
                    <div>
                      {/* Image Header with Badge and Icon */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                        
                        {/* Top Category Badge */}
                        <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-[11px] font-bold text-sky-300">
                          {item.badge}
                        </span>

                        {/* Floating Icon */}
                        <div className="absolute -bottom-4 right-5 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-600 text-white grid place-items-center text-lg shadow-lg border-2 border-white group-hover:scale-110 group-hover:bg-blue-700 transition-all duration-300">
                          <Icon />
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-6 sm:p-7 pt-5 sm:pt-6">
                        <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-[11px] sm:text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                        Explore Custom Roadmap →
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2.1 — CORE CORPORATE TRAINING PILLARS (LIGHT SKY BLUISH THEME) */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-sky-50 via-sky-50/70 to-slate-50 text-slate-900 relative overflow-hidden border-b border-sky-100">
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-sky-200/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-x relative">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-5xl text-slate-900 tracking-tight">
              Specialized Corporate Training Solutions
            </h2>
            <p className="mt-3 sm:mt-4 text-slate-600 text-xs sm:text-sm md:text-base">
              Empower your enterprise workforce with targeted curricula engineered to accelerate digital maturity, engineering velocity, and leadership capabilities.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {/* SECTION 1: EMPLOYEE UPSKILLING */}
            <div id="employee-upskilling" className="rounded-3xl border border-sky-100 bg-white/95 backdrop-blur p-6 sm:p-10 lg:p-12 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-md">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-sky-200">
                    <FiTrendingUp className="text-sm text-sky-600" /> High-Velocity Engineering
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900">
                    Employee Upskilling
                  </h3>
                  <p className="mt-3 sm:mt-4 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                    Transform engineering and product teams with real-world, sprint-driven modules. We replace legacy workflows with cloud-native practices, GenAI automation, and clean architecture.
                  </p>
                  <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-2.5">
                    {["Skills Gap Diagnostics", "Modular Sprints", "Live Sandboxes", "Progress Analytics"].map((tag) => (
                      <span key={tag} className="px-2.5 sm:px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-[11px] sm:text-xs text-sky-900 font-semibold">
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onEnquire("Employee Upskilling Corporate Program")}
                    className="mt-6 sm:mt-8 btn-accent text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-orange-500/20"
                  >
                    Design Custom Curriculum <FiArrowRight />
                  </button>
                </div>

                {/* Right Column: Visual Showcase + Metrics */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Image Card */}
                  <div className="rounded-2xl overflow-hidden border border-sky-200/80 shadow-md relative h-48 sm:h-56 group">
                    <img
                      src="/images/corp_upskilling_banner.jpg"
                      alt="Corporate Workforce Upskilling in modern engineering lab"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center text-white">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-sky-600/90 backdrop-blur-md">
                        Workforce Cohort Labs
                      </span>
                    </div>
                  </div>

                  {/* 4 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      {
                        title: "Cross-Skilling & Reskilling",
                        desc: "Fast-track developers into Full-Stack, Cloud & DevOps roles in weeks.",
                        metric: "3.5x",
                        label: "Faster Project Onboarding",
                      },
                      {
                        title: "AI & Productivity Automation",
                        desc: "Master LLMs, Copilot tools, and AI agents for rapid feature delivery.",
                        metric: "40%",
                        label: "Productivity Improvement",
                      },
                      {
                        title: "Role-Based Skill Matrices",
                        desc: "Custom milestones tied directly to business deliverables & KPIs.",
                        metric: "100%",
                        label: "Measurable Competency",
                      },
                      {
                        title: "Mentored Sandbox Labs",
                        desc: "Hands-on projects solving real business hurdles with mentor code reviews.",
                        metric: "24/7",
                        label: "Lab & Cloud Access",
                      },
                    ].map((card, i) => (
                      <div key={i} className="p-3.5 sm:p-4 rounded-2xl bg-sky-50/70 border border-sky-100 hover:border-sky-300 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <div className="text-xl font-black text-sky-600">
                          {card.metric}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          {card.label}
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{card.title}</h4>
                        <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed">{card.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: TECHNICAL & IT TRAINING */}
            <div id="technical-it-training" className="rounded-3xl border border-sky-100 bg-white/95 backdrop-blur p-6 sm:p-10 lg:p-12 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-md">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column: Visual Showcase + Tracks */}
                <div className="lg:col-span-6 space-y-4 order-last lg:order-first">
                  {/* Image Card */}
                  <div className="rounded-2xl overflow-hidden border border-sky-200/80 shadow-md relative h-52 sm:h-60 group">
                    <img
                      src="/images/corp_technical_banner.jpg"
                      alt="Technical and Cloud DevOps Corporate Training"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-600/90 backdrop-blur-md">
                        Enterprise Architecture Stack
                      </span>
                      <span className="text-[11px] font-medium text-slate-200">
                        AWS, Microservices &amp; CI/CD
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      {
                        title: "Full Stack & Microservices",
                        tech: "React, Node.js, Next.js, Docker, Kubernetes, REST & GraphQL",
                      },
                      {
                        title: "Modern QA & SDET Automation",
                        tech: "Selenium WebDriver, Cypress, RestAssured, Playwright, CI/CD",
                      },
                      {
                        title: "Cloud & DevOps Architecture",
                        tech: "AWS, Azure, Terraform, GitHub Actions, Linux administration",
                      },
                      {
                        title: "Data Science & GenAI Labs",
                        tech: "Python, LangChain, RAG Pipelines, Vector DBs, Power BI, SQL",
                      },
                    ].map((track, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 hover:border-sky-300 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-200 text-sky-700 grid place-items-center text-sm mb-2">
                          <FiCpu />
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{track.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{track.tech}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Info */}
                <div className="lg:col-span-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-sky-200">
                    <FiLayers className="text-sm text-sky-600" /> Deep Tech Engineering Stack
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900">
                    Technical & IT Training
                  </h3>
                  <p className="mt-3 sm:mt-4 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                    Designed specifically for engineering teams, software developers, and IT administrators. We deliver deep-dive technical workshops on modern architectural patterns, enterprise testing pipelines, cloud-native deployments, and modern framework migrations.
                  </p>
                  <ul className="mt-5 sm:mt-6 space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <FiCheckCircle className="text-emerald-600 shrink-0" />
                      <span>Led by active enterprise tech architects & Senior Staff Engineers</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <FiCheckCircle className="text-emerald-600 shrink-0" />
                      <span>Zero simulated hello-world code — 100% production architectural capstones</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <FiCheckCircle className="text-emerald-600 shrink-0" />
                      <span>Customized stack syllabus matching your internal technology repositories</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => onEnquire("Technical & IT Training Corporate Catalog")}
                    className="mt-6 sm:mt-8 btn-primary bg-sky-600 hover:bg-sky-700 text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-sky-600/20"
                  >
                    Request Technical Syllabus <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 3: LEADERSHIP & SOFT SKILLS */}
            <div id="leadership-soft-skills" className="rounded-3xl border border-sky-100 bg-white/95 backdrop-blur p-6 sm:p-10 lg:p-12 hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-md">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-amber-200">
                    <FiUsers className="text-sm text-amber-600" /> Behavioral & Management Mastery
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900">
                    Leadership & Soft Skills
                  </h3>
                  <p className="mt-3 sm:mt-4 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                    Great engineering requires superior communication, strategic prioritization, and high-impact people management. Our behavioral programs empower technical leads, managers, and cross-functional personnel to lead with vision and empathy.
                  </p>
                  <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-2.5">
                    {["Agile & Scrum Delivery", "Stakeholder Communication", "Conflict Resolution", "Executive Storytelling"].map((tag) => (
                      <span key={tag} className="px-2.5 sm:px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] sm:text-xs text-slate-700 font-medium">
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onEnquire("Leadership & Soft Skills Corporate Inquiry")}
                    className="mt-6 sm:mt-8 btn-accent text-xs uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-none shadow-md shadow-amber-500/20"
                  >
                    Explore Leadership Modules <FiArrowRight />
                  </button>
                </div>

                {/* Right Column: Visual Showcase + Leadership Pillars */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Image Card */}
                  <div className="rounded-2xl overflow-hidden border border-amber-200/80 shadow-md relative h-52 sm:h-60 group">
                    <img
                      src="/images/corp_leadership_banner.jpg"
                      alt="Corporate Leadership and Soft Skills Workshop"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/90 backdrop-blur-md">
                        Executive Soft Skills Lab
                      </span>
                      <span className="text-[11px] font-medium text-slate-200">
                        Agile, Conflict Resolution &amp; Strategy
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      {
                        title: "Transitioning to Tech Lead",
                        desc: "Equip individual contributors with delegation, code review etiquette, system design mentoring, and agile project delivery.",
                      },
                      {
                        title: "Executive Client Communication",
                        desc: "Master high-stakes client demos, technical proposal writing, sprint retrospectives, and expectation management.",
                      },
                      {
                        title: "High-Performance Team Dynamics",
                        desc: "Cultivate psychological safety, positive sprint cultures, constructive peer critique, and burnout mitigation.",
                      },
                      {
                        title: "Strategic Decision-Making",
                        desc: "Tradeoff analysis between technical debt and speed-to-market, risk assessment, and resource allocation frameworks.",
                      },
                    ].map((card, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 hover:border-amber-300 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 grid place-items-center text-xs font-bold mb-2 border border-amber-200">
                          0{i + 1}
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{card.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{card.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — PARTNERSHIP FAQS & COLLABORATIONS */}
      <FaqSection
        onEnquire={onEnquire}
        eyebrow="Institutional & Corporate FAQ"
        title="Frequently Asked Questions About Partnerships"
        subtitle="Common questions regarding academic MoUs, university workshops, corporate billing, and training logistics."
        ctaText="Discuss an MoU"
      />
      <CollaborationsSection title="OUR ACTIVE PARTNERS & ASSOCIATES" />
    </main>
  );
}
