import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft, FiArrowRight, FiClock, FiBarChart2,
  FiLayers, FiStar
} from "react-icons/fi";
import { getCourseBySlug, getActiveCategories } from "../data/megaMenu";
import { COURSES } from "../data/site";
import Reveal from "../components/Reveal";
import FaqSection from "../components/FaqSection";
import CollaborationsSection from "../components/CollaborationsSection";

export default function CourseDetail({ onEnquire }) {
  const { slug } = useParams();
  const menuCourse = getCourseBySlug(slug);
  const rich = COURSES.find((c) => c.slug === slug);
  const cat = getActiveCategories().find((c) => c.id === menuCourse?.categoryId);

  if (!menuCourse && !rich) {
    return (
      <main className="container-x py-24 text-center bg-white text-[#080808]">
        <h1 className="font-display font-semibold text-3xl text-[#080808]">Program Not Found</h1>
        <p className="text-[#5a5a5a] mt-2 text-sm">The course “{slug}” does not exist in our catalog.</p>
        <Link to="/courses" className="btn-primary mt-6 inline-flex items-center gap-2 text-xs">
          <FiArrowLeft /> Back to All Programs
        </Link>
      </main>
    );
  }

  const name = rich?.name || menuCourse?.name;
  const desc = rich?.desc || menuCourse?.shortDescription;
  const techs = rich?.tools || rich?.skills || menuCourse?.technologies || [];
  const modules = rich?.modules || [
    "Foundations & Environment Setup",
    "Core Architecture & Advanced Concepts",
    "Hands-on Labs & Weekly Reviews",
    "Production Capstone & Verifiable Certification"
  ];
  const duration = rich?.duration || menuCourse?.duration || "4 Months";
  const level = rich?.level || menuCourse?.level || "Beginner to Advanced";
  const mode = rich?.mode || menuCourse?.mode || "Online + Offline";
  const fee = rich?.fee || "₹29,999";
  const oldFee = rich?.oldFee || "₹44,999";

  return (
    <main className="bg-white text-[#080808] min-h-screen">
      {/* 1 — HERO HEADER */}
      <section className="bg-white border-b border-[#d8d8d8] py-14 lg:py-20 studio-grid">
        <div className="container-x">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5a5a5a] hover:text-[#146ef5] uppercase tracking-[0.1em] mb-6 transition-colors"
          >
            <FiArrowLeft /> Back to All Programs
          </Link>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge-new">
                {rich?.track === "ENGINEERING" ? "Engineering (B.Tech)" : "Management (BBA/MBA)"}
              </span>
              <span className="text-xs text-[#5a5a5a] font-medium">
                {cat?.name || rich?.category}
              </span>
            </div>

            <h1 className="font-display font-semibold text-[#080808] text-3xl sm:text-5xl lg:text-[52px] tracking-[-0.01em] leading-[1.08]">
              {name}
            </h1>

            <p className="text-[#5a5a5a] mt-4 text-[16px] leading-relaxed">
              {rich?.tagline || menuCourse?.shortDescription}
            </p>

            <p className="text-[#5a5a5a] mt-2 text-[14px] leading-relaxed">
              {desc}
            </p>

            {/* Badges Strip */}
            <div className="flex flex-wrap gap-2 mt-6 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#f0f0f0] border border-[#d8d8d8] text-[#080808] px-3 py-1.5">
                <FiClock className="text-[#146ef5]" /> {duration}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#f0f0f0] border border-[#d8d8d8] text-[#080808] px-3 py-1.5">
                <FiBarChart2 className="text-[#146ef5]" /> {level}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#f0f0f0] border border-[#d8d8d8] text-[#080808] px-3 py-1.5">
                <FiLayers className="text-[#146ef5]" /> {mode}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#f0f0f0] border border-[#d8d8d8] text-[#080808] px-3 py-1.5">
                <FiStar className="text-[#ffa666] fill-current" /> 4.9 Rating
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <button
                onClick={() => onEnquire?.(name)}
                className="btn-primary text-sm"
              >
                Enroll Now · {fee} <FiArrowRight size={14} />
              </button>
              <button
                onClick={() => onEnquire?.(`Syllabus Request: ${name}`)}
                className="btn-secondary text-sm"
              >
                Download Syllabus PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — SYLLABUS & MODULES (Mist #f0f0f0) */}
      <section className="py-16 bg-[#f0f0f0] border-b border-[#d8d8d8]">
        <div className="container-x grid lg:grid-cols-[1fr_340px] gap-10 items-start">
          <div>
            <span className="eyebrow-label mb-2">Curriculum Breakdown</span>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[#080808] tracking-tight mt-1 mb-6">
              What You Will Master & Ship
            </h2>

            <div className="space-y-3">
              {modules.map((m, i) => (
                <div key={i} className="rounded-[8px] border border-[#d8d8d8] bg-white p-5 card-hover">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-[4px] bg-[#f0f0f0] text-[#080808] font-mono font-semibold text-xs grid place-items-center shrink-0">
                      0{i + 1}
                    </span>
                    <h3 className="font-display font-semibold text-[#080808] text-[15px]">
                      {m}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Technologies */}
            {techs.length > 0 && (
              <div className="mt-10">
                <span className="eyebrow-label mb-2">Tooling & Frameworks</span>
                <div className="flex flex-wrap gap-2 mt-3">
                  {techs.map((t) => (
                    <span key={t} className="rounded-[4px] border border-[#d8d8d8] bg-white px-3 py-1.5 text-xs font-mono text-[#080808]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="rounded-[8px] border border-[#d8d8d8] bg-white p-6 shadow-xs">
            <div className="text-xs text-[#888888] uppercase tracking-wider font-semibold">Course Tuition</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-bold text-3xl text-[#080808]">{fee}</span>
              <span className="text-sm text-[#888888] line-through">{oldFee}</span>
            </div>
            <p className="text-xs text-[#5a5a5a] mt-2">
              Includes 1-on-1 weekly mentor code reviews, capstone internship letter & verified certificate.
            </p>

            <div className="mt-5 space-y-2 border-t border-[#f0f0f0] pt-4">
              <div className="flex items-center justify-between text-xs text-[#080808]">
                <span>Duration</span>
                <strong className="font-mono">{duration}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-[#080808]">
                <span>Delivery</span>
                <strong className="font-mono">{mode}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-[#080808]">
                <span>Credential</span>
                <strong className="text-[#146ef5]">Verifiable ID</strong>
              </div>
            </div>

            <button
              onClick={() => onEnquire?.(name)}
              className="mt-6 w-full btn-primary text-xs py-3 justify-center"
            >
              Apply for Batch <FiArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* 3 — FAQS & COLLABORATIONS */}
      <FaqSection
        onEnquire={onEnquire}
        eyebrow={`${name} FAQ`}
        title={`Questions About ${name}?`}
        subtitle="Get clarity on batch schedules, prerequisite knowledge, mentor desks, and verifiable certification."
        ctaText="Speak with Program Advisor"
      />
      <CollaborationsSection title="OUR RECRUITMENT & HIRING ASSOCIATES" />
    </main>
  );
}
