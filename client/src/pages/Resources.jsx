import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiVideo,
  FiCompass,
  FiBookOpen,
  FiCpu,
  FiArrowRight,
  FiCheckCircle,
  FiExternalLink,
  FiPlay,
  FiClock,
  FiTag,
  FiFileText,
  FiHelpCircle,
  FiChevronDown,
  FiPlus,
  FiUser,
  FiSearch
} from "react-icons/fi";
import CollaborationsSection from "../components/CollaborationsSection";

export default function Resources({ onEnquire }) {
  const [activeTab, setActiveTab] = useState("all");
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. VIDEOS SECTION DATA
  const VIDEOS = [
    {
      id: "vid-1",
      title: "Building Production RAG Pipelines with Python & Vector DBs",
      category: "AI & GenAI",
      duration: "42 mins",
      views: "3.8k views",
      thumbnail: "/images/course_ai.jpg",
      instructor: "Senior AI Architect",
      desc: "Learn how vector embeddings, semantic chunks, and LangChain orchestrate real-time question answering over private enterprise PDF repositories.",
      badge: "Masterclass"
    },
    {
      id: "vid-2",
      title: "End-to-End MERN Stack Architecture & Cloud Deployment",
      category: "Full Stack",
      duration: "58 mins",
      views: "5.1k views",
      thumbnail: "/images/course_fullstack.jpg",
      instructor: "Staff Cloud Engineer",
      desc: "Architecting scalable Node.js micro-services with MongoDB replica sets, JWT token rotation, and automated GitHub Actions CI/CD to AWS/Vercel.",
      badge: "Hands-on Workshop"
    },
    {
      id: "vid-3",
      title: "Test Automation Blueprint: Selenium vs Cypress in Enterprise QA",
      category: "QA & Testing",
      duration: "35 mins",
      views: "2.9k views",
      thumbnail: "/images/course_testing.jpg",
      instructor: "Lead SDET",
      desc: "Detailed comparison between Java Selenium Page Object Models and JavaScript Cypress E2E pipelines with live parallel test execution in CI/CD.",
      badge: "Tech Breakdown"
    },
    {
      id: "vid-4",
      title: "Python for Automation & High-Volume Data Scraping",
      category: "Python",
      duration: "45 mins",
      views: "4.4k views",
      thumbnail: "/images/course_python.jpg",
      instructor: "Data Automation Lead",
      desc: "Write production-safe BeautifulSoup and AsyncIO web scrapers that respect rate limits, bypass CAPTCHA hurdles, and store structured data.",
      badge: "Live Coding"
    }
  ];

  // 2. CAREER GUIDES SECTION DATA
  const CAREER_GUIDES = [
    {
      id: "guide-3",
      title: "AEO & GEO: The New Era of Digital Marketing for MBAs",
      role: "Management & Growth",
      readTime: "10 min read",
      tags: ["AEO", "ChatGPT SEO", "Google AI", "Ads"],
      desc: "How modern brands get cited inside ChatGPT, Perplexity, and Google AI Overviews rather than just blue search links, and how to master performance ads.",
      actionText: "Read Roadmap"
    },
    {
      id: "guide-4",
      title: "Tech Interview Mastery: Behavioral + Live Coding Strategy",
      role: "Job Seekers",
      readTime: "14 min read",
      tags: ["STAR Method", "System Design", "HR Round"],
      desc: "Insider strategies for mastering Tier-1 MNC coding tests, white-board problem solving, and behavioral interviews without getting stuck.",
      actionText: "Read Roadmap"
    }
  ];

  // 4. BLOGS & ARTICLES DATA
  const BLOGS = [
    {
      id: "blog-1",
      title: "Why Traditional QA is Being Replaced by Cypress & AI-Assisted Testing",
      category: "Software Quality",
      date: "Sep 14, 2026",
      readTime: "6 min read",
      desc: "How modern engineering teams eliminated flaky Selenium test runs with modern browser-native automation, visual regression, and AI test-case generators.",
      author: "Pooja Mohapatra, QA Lead"
    },
    {
      id: "blog-2",
      title: "The Ultimate Guide to Final-Year Engineering Capstone Projects",
      category: "Academic & Projects",
      date: "Sep 08, 2026",
      readTime: "8 min read",
      desc: "How to select IEEE-standard capstone topics, write comprehensive SRS theses, and deploy live GitHub repositories that fetch straight-A viva marks.",
      author: "Academic Advisory Desk"
    },
    {
      id: "blog-3",
      title: "What 120+ Corporate Recruiters Actually Look for in a Fresher’s GitHub",
      category: "Career & Hiring",
      date: "Aug 29, 2026",
      readTime: "5 min read",
      desc: "Spoiler: It's not 50 toy calculator apps. Learn how documentation, clean commit histories, automated tests, and Dockerfiles signal true job-readiness.",
      author: "Envistream Career Cell"
    }
  ];

  // 4. AI GUIDELINES & AI FAQS DATA
  const AI_GUIDELINES = [
    {
      q: "What are Envistream's official guidelines on using AI (ChatGPT, Copilot, Cursor) during courses and internships?",
      a: "At Envistream EduSkill, we actively encourage the responsible and ethical adoption of AI tools. Rather than banning generative AI, we teach you how to use AI for boilerplate generation, test scaffolding, and debugging. However, learners must understand the underlying algorithms, be able to explain every line of code during viva reviews, and write production business logic independently."
    },
    {
      q: "Can I use AI to write my entire final-year capstone project or academic internship thesis?",
      a: "No. AI can be used as a research co-pilot, for literature review summarization, and for proof-reading grammar. However, generating entire simulated codebases or fabricated test outputs without live execution constitutes academic malpractice. All project submissions undergo automated repository PR audits and live mentor viva defense."
    },
    {
      q: "How does Envistream's own AI Assistant (Sayraa) help students throughout their learning journey?",
      a: "Our Sayraa AI chatbot is grounded in our curriculum, batch schedules, project guidelines, and FAQs. You can interact with Sayraa 24x7 to clarify prerequisite doubts, request syllabus PDFs, explore internship domains, or get connected to an admission counsellor."
    },
    {
      q: "Will learning AI & Prompt Engineering guarantee placement opportunities in 2026?",
      a: "AI alone without core computer science foundations is incomplete. That's why our AI & GenAI track teaches deep Python fundamentals, data structures, math for ML, and software architecture first, followed by PyTorch, vector databases, and Autonomous AI Agents. This dual-edge skill makes our candidates stand out to corporate recruiters."
    },
    {
      q: "Are the AI certifications awarded by Envistream recognized by hiring partners?",
      a: "Yes. Every credential issued carries an encrypted verification ID (e.g. EVS-2026-AI-000123). Employers can independently verify the student's project repository, skills covered, issue date, and distinction score on our instant Certificate Verification Registry."
    }
  ];

  return (
    <main className="bg-white text-slate-900 min-h-screen">
      {/* 1 — HERO HEADER: Hero Presenter Image with Face Uncovered & Visible on Right */}
      <section className="relative overflow-hidden py-16 lg:py-24 select-none border-b border-sky-200/80 bg-[#071120]">
        {/* Full-bleed Background Image with face pinned to the right and centered vertically */}
        <div
          className="absolute inset-0 bg-no-repeat pointer-events-none bg-cover bg-[position:right_center] md:bg-[position:calc(100%+60px)_center] lg:bg-[position:right_center]"
          style={{ backgroundImage: "url('/images/hero_presenter.jpg')" }}
        />

        {/* Dynamic Dark Gradient: heavily shades the left side for crisp text, stays transparent over her face on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071120] via-[#071120]/80 via-45% to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071120]/70 via-transparent to-[#071120]/30 pointer-events-none" />

        <div className="container-x relative z-10">
          {/* Confined to left column so text NEVER covers her face */}
          <div className="max-w-lg lg:max-w-xl">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight drop-shadow-lg">
              Curated Free{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent drop-shadow-md">
                Resources &amp; Career Kits
              </span>
            </h1>

            <p className="mt-3 text-slate-200 text-xs sm:text-base leading-relaxed font-medium drop-shadow-sm">
              Access masterclass technical videos, engineering career roadmaps, industry blog articles, and AI ethics guidelines curated by senior architects and tech leaders.
            </p>

            {/* Quick Links Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 mt-7">
              {[
                { label: "All Hubs", val: "all", icon: FiCompass },
                { label: "Videos", val: "videos", icon: FiVideo },
                { label: "Career Guides", val: "guides", icon: FiCompass },
                { label: "Blogs & Articles", val: "blogs", icon: FiBookOpen },
                { label: "AI Guidelines / FAQ", val: "ai-faq", icon: FiCpu },
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.val}
                    onClick={() => setActiveTab(tab.val)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-md backdrop-blur-md ${
                      activeTab === tab.val
                        ? "bg-[#1D4ED8] text-white shadow-blue-900/40 border border-blue-400/40"
                        : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
                    }`}
                  >
                    <TabIcon size={13} className={activeTab === tab.val ? "text-white" : "text-cyan-300"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2 — VIDEOS SECTION */}
      {(activeTab === "all" || activeTab === "videos") && (
        <section className="py-10 sm:py-14 bg-white border-b border-slate-200">
          <div className="container-x">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600">Free Tech Masterclasses</span>
                <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                  <FiVideo className="text-sky-600" />
                  <span>Technical Videos &amp; Masterclasses</span>
                </h2>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Watch industry architects break down real-world codebases.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {VIDEOS.map((vid) => (
                <div
                  key={vid.id}
                  className="group rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                  onClick={() => onEnquire?.(`Video Request: ${vid.title}`)}
                >
                  <div>
                    {/* Thumbnail banner */}
                    <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />

                      {/* Play Button Icon */}
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="w-10 h-10 rounded-full bg-white/95 text-[#EA580C] shadow-lg grid place-items-center group-hover:scale-110 transition-transform">
                          <FiPlay size={16} className="translate-x-0.5" />
                        </div>
                      </div>

                      {/* Duration & Badge */}
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-sm">
                        {vid.badge}
                      </span>
                      <span className="absolute bottom-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/80 text-white">
                        {vid.duration}
                      </span>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] font-bold text-sky-600 uppercase tracking-wider">{vid.category}</span>
                      <h3 className="font-display font-bold text-slate-900 text-sm mt-1 leading-snug group-hover:text-[#EA580C] transition-colors line-clamp-2">
                        {vid.title}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                        {vid.desc}
                      </p>
                    </div>
                  </div>

                  <div className="px-3.5 pb-3.5 pt-0 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>{vid.instructor}</span>
                    <span className="text-orange-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Watch <FiArrowRight size={11} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3 — CAREER GUIDES SECTION */}
      {(activeTab === "all" || activeTab === "guides") && (
        <section className="py-10 sm:py-14 bg-white border-b border-slate-200">
          <div className="container-x">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1D4ED8]">Expert Roadmaps</span>
                <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                  <FiCompass className="text-[#1D4ED8]" />
                  <span>Comprehensive Career Guides</span>
                </h2>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Step-by-step career path blueprints tailored to modern hiring requirements.
              </p>
            </div>

            {/* Career Guides Visual Showcase & Roadmap Cards */}
            <div className="grid lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              {/* Left Column: Visual Showcase Feature with Image */}
              <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-gradient-to-br from-[#071952] to-blue-900 border border-blue-800/60 shadow-lg relative flex flex-col justify-between group min-h-[300px]">
                <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                  <img
                    src="/images/indian_projects_students.jpg"
                    alt="Career Roadmaps & Engineering Guidance for Students"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071952] via-[#071952]/40 to-transparent" />
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white font-bold text-[11px] shadow-sm">
                    Curated 2026 Editions
                  </span>
                </div>
                <div className="p-5 sm:p-6 relative -mt-4 bg-gradient-to-b from-transparent via-[#071952] to-[#071952] text-white">
                  <h3 className="font-display font-bold text-lg sm:text-xl leading-snug">
                    Industry-Crafted Learning &amp; Hiring Blueprints
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    Designed by staff engineers and recruitment consultants to eliminate guesswork and fast-track high-value tech placements.
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-sky-300">
                    <FiCompass className="text-amber-400" />
                    <span>Free PDF Downloads &amp; Reading Lists</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Career Roadmap Cards */}
              <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 sm:gap-5">
                {CAREER_GUIDES.map((guide) => (
                  <div
                    key={guide.id}
                    className="rounded-2xl bg-gradient-to-br from-white to-sky-50/40 border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                    onClick={() => onEnquire?.(`Guide Request: ${guide.title}`)}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{guide.role}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{guide.readTime}</span>
                      </div>

                      <h3 className="font-display font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                        {guide.desc}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {guide.tags.map((t) => (
                          <span key={t} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-blue-600">
                      <span>Download Full Roadmap PDF</span>
                      <FiArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5 — BLOGS & ARTICLES SECTION */}
      {(activeTab === "all" || activeTab === "blogs") && (
        <section className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200">
          <div className="container-x">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600">Insights &amp; Analysis</span>
                <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                  <FiBookOpen className="text-purple-600" />
                  <span>Blogs &amp; Technical Articles</span>
                </h2>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Written by active practitioners, recruiters, and engineering faculty.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
              {BLOGS.map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  onClick={() => onEnquire?.(`Article Inquiry: ${b.title}`)}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                      <span className="font-bold text-purple-600">{b.category}</span>
                      <span>{b.readTime}</span>
                    </div>

                    <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base group-hover:text-purple-600 transition-colors leading-snug">
                      {b.title}
                    </h3>
                    <p className="text-slate-600 text-xs mt-2 leading-relaxed line-clamp-3">
                      {b.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>{b.author}</span>
                    <span className="text-purple-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Read <FiArrowRight size={11} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AI GUIDELINES & AI FAQ SECTION (STANDARD TWO-COLUMN LAYOUT) */}
      {(activeTab === "all" || activeTab === "ai-faq") && (
        <section className="py-16 sm:py-20 bg-[#F1F5F9] border-t border-b border-slate-200">
          <div className="container-x grid lg:grid-cols-[360px_1fr] gap-10 items-start">
            {/* Left Column: Heading, Context & Action Button */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8] bg-white border border-blue-200 px-3 py-1 rounded-full shadow-2xs">
                Academic Integrity &amp; Innovation
              </span>
              <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight mt-3 flex items-center gap-2">
                <FiCpu className="text-[#1D4ED8] shrink-0" />
                <span>AI Guidelines &amp; AI FAQs</span>
              </h2>
              <p className="text-slate-600 mt-2 text-sm leading-relaxed font-normal">
                Our clear code of ethics and best practices for leveraging Artificial Intelligence in coursework, projects, and internships.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/verify"
                  className="btn-primary text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 w-fit"
                >
                  <span>Verify Credentials</span>
                  <FiArrowRight size={14} />
                </Link>
                {onEnquire && (
                  <button
                    onClick={() => onEnquire?.("AI Guidelines & FAQ Inquiry")}
                    className="btn-secondary text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 w-fit cursor-pointer"
                  >
                    <span>Talk to a Counsellor</span>
                    <FiArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: FAQ Questions & Accordion */}
            <div className="space-y-3">
              {AI_GUIDELINES.map((item, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className={`rounded-xl border transition-all duration-200 ${
                      isOpen
                        ? "border-blue-500 bg-white shadow-md ring-1 ring-blue-400/30"
                        : "border-slate-200/90 bg-white hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between gap-4 p-4.5 sm:p-5 text-left font-bold text-slate-900 hover:text-blue-700 text-sm sm:text-base cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <FiHelpCircle className="text-blue-600 shrink-0 text-lg" />
                        <span>{item.q}</span>
                      </span>
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "bg-blue-600 text-white rotate-45 shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600"
                        }`}
                      >
                        <FiPlus className="text-base transition-transform" />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8 — COLLABORATIONS */}
      <CollaborationsSection title="OUR ACADEMIC &amp; HIRING PARTNERS" />
    </main>
  );
}
