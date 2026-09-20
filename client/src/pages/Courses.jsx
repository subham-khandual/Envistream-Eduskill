import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiArrowRight, FiClock, FiSearch, FiStar, FiFilter, FiCheckCircle, FiChevronDown } from "react-icons/fi";
import { getActiveCategories, getCategoryBySlug } from "../data/megaMenu";
import { COURSES } from "../data/site";
import Reveal from "../components/Reveal";
import FaqSection from "../components/FaqSection";
import CollaborationsSection from "../components/CollaborationsSection";
import { MegaPanel } from "../components/MegaMenu";

// Unique image per course — no duplicates
const COURSE_IMAGES = {
  "artificial-intelligence":       "/images/course_ai.jpg",
  "software-testing-automation":   "/images/course_testing.jpg",
  "cypress-automation":            "/images/course_cypress.jpg",
  "erp-sap-training":              "/images/course_sap.jpg",
  "full-stack-development":        "/images/course_fullstack.jpg",
  "python-programming":            "/images/course_python.jpg",
  "data-science-analytics":        "/images/course_datascience.jpg",
  "cybersecurity":                 "/images/course_cybersecurity.jpg",
  "digital-marketing-aeo":         "/images/course_marketing.jpg",
  "seo-search-marketing":          "/images/course_seo.jpg",
  "social-media-brand-strategy":   "/images/course_socialmedia.jpg",
  "lead-generation-funnels":       "/images/course_leads.jpg",
  "content-marketing-copywriting": "/images/course_content.jpg",
};

export default function Courses({ onEnquire }) {
  const categories = useMemo(() => getActiveCategories(), []);
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [trackFilter, setTrackFilter] = useState("ALL");
  const [browseOpen, setBrowseOpen] = useState(false);

  useEffect(() => {
    const slug = params.get("category");
    if (slug) {
      const match = getCategoryBySlug(slug) || categories.find((c) => c.id === slug);
      setCat(match ? match.id : "all");
    } else {
      setCat("all");
    }

    const searchQueryParam = params.get("q");
    if (searchQueryParam !== null) {
      setQ(searchQueryParam);
    }
  }, [params, categories]);

  const filteredCourses = useMemo(() => {
    return COURSES.filter((c) => {
      const matchTrack = trackFilter === "ALL" || c.track === trackFilter;
      const matchCategory = cat === "all" || c.category.toLowerCase().includes(cat.toLowerCase()) || categories.find(ct => ct.id === cat)?.name.toLowerCase().includes(c.category.toLowerCase());
      const matchSearch = q.trim() === "" ||
        `${c.name} ${c.tagline} ${c.desc} ${c.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase());
      return matchTrack && matchCategory && matchSearch;
    });
  }, [trackFilter, cat, q, categories]);

  return (
    <main className="bg-slate-50 text-slate-900 min-h-screen">
      {/* 1 — HERO HEADER: Eye-Catchy Sky Blue, Slate Grey & Warm Orange Mix */}
      <section className="relative bg-gradient-to-br from-[#E0F2FE] via-[#F1F5F9] to-[#BAE6FD] text-slate-900 py-10 lg:py-14 select-none border-b border-sky-300 overflow-hidden shadow-xs">
        {/* Eye-Catchy Multi-Color Ambient Glows: Orange, Slate-Grey & Sky Blue Mesh */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[380px] bg-gradient-to-bl from-orange-400/25 via-amber-300/20 to-transparent rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-5 w-[450px] h-[320px] bg-gradient-to-tr from-sky-400/35 via-cyan-300/25 to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[350px] h-[250px] bg-slate-300/30 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.12)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-80" />

        <div className="container-x relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[#071952] leading-tight">
                Master In-Demand{" "}
                <span className="text-[#0369A1] font-black">
                  Tech &amp; Leadership
                </span>{" "}
                Tracks
              </h1>
              <p className="text-slate-800 mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed font-semibold">
                Industry-certified career programs with verified credentials, mentor-led repositories, and direct placement drives.
              </p>

              {/* Controls: Search + Track Filter + Browse Mega Dropdown */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="relative flex-1 flex items-center rounded-xl bg-white border border-sky-200/80 text-slate-800 px-3.5 py-2.5 shadow-sm focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200 transition-all">
                  <FiSearch className="text-sky-600 text-base mr-2 shrink-0" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search AI, Testing, MERN, Python, SAP..."
                    className="w-full outline-none text-xs sm:text-sm bg-transparent placeholder:text-slate-400 text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl bg-white/90 border border-sky-200/80 p-1 shadow-sm shrink-0">
                    {[
                      { label: "All Tracks", val: "ALL" },
                      { label: "Engineering", val: "ENGINEERING" },
                      { label: "Management", val: "MANAGEMENT" },
                    ].map((trk) => (
                      <button
                        key={trk.val}
                        onClick={() => setTrackFilter(trk.val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          trackFilter === trk.val
                            ? "bg-[#0A1A4A] text-white shadow-sm shadow-blue-900/20"
                            : "text-slate-600 hover:text-slate-900 hover:bg-sky-50"
                        }`}
                      >
                        {trk.label}
                      </button>
                    ))}
                  </div>

                  {/* Browse Categories Mega Dropdown Button */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setBrowseOpen(!browseOpen)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border shadow-sm cursor-pointer ${
                        browseOpen
                          ? "bg-[#071952] text-white border-[#071952] shadow-md shadow-blue-950/20"
                          : "bg-white border-sky-200/90 text-[#071952] hover:bg-sky-50 hover:border-sky-300"
                      }`}
                    >
                      <FiFilter className={browseOpen ? "text-amber-400" : "text-sky-600"} size={13} />
                      <span className="hidden xs:inline">Browse</span>
                      <FiChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${browseOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Desktop MegaPanel Floating Dropdown */}
                    {browseOpen && (
                      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
                        {/* Backdrop dismiss */}
                        <div
                          className="fixed inset-0"
                          onClick={() => setBrowseOpen(false)}
                        />
                        <div className="relative z-10 max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl">
                          <MegaPanel onNavigate={() => setBrowseOpen(false)} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow frame effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-400/30 via-cyan-400/30 to-blue-400/30 rounded-2xl blur-lg opacity-80 group-hover:opacity-100 transition duration-500" />

                {/* Image Container */}
                <div className="relative rounded-2xl overflow-hidden border border-sky-200/90 shadow-xl bg-white aspect-[4/3] group">
                  <img
                    src="/images/courses_hero.jpg"
                    alt="Envistream Tech Courses & Classroom Training"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/about_hero_bg.jpg";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — COURSE LISTING GRID: Whole-Side Adjusted with Eye-Catchy Cards */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100">
        <div className="container-x">
          {/* Header Row with Active Count and Reset */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs sm:text-sm font-bold tracking-wide uppercase text-slate-500">
              Showing <span className="text-[#1D4ED8] font-black">{filteredCourses.length}</span> Programs
            </p>
            {(q || cat !== "all" || trackFilter !== "ALL") && (
              <button
                onClick={() => { setQ(""); setCat("all"); setTrackFilter("ALL"); }}
                className="text-xs font-bold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors"
              >
                Reset Filters ×
              </button>
            )}
          </div>

          {/* WHOLE-SIDE ADJUSTED GRID (Compact, Reduced Size) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredCourses.map((c, i) => {
              const courseImg = COURSE_IMAGES[c.slug] || "/images/course_fullstack.jpg";
              return (
                <Reveal key={c.slug} delay={(i % 3) * 0.05}>
                  <div className="group relative h-full rounded-xl bg-white border border-slate-200/90 hover:border-sky-400 shadow-xs hover:shadow-xl hover:shadow-orange-500/10 hover:shadow-sky-500/15 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
                    {/* Top Accent Line: Hidden by default (None), appears as Orange + Sky Blue Mix on Hover */}
                    <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      {/* Course Image Header — compact banner */}
                      <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-slate-900">
                        {/* Atmospheric blurred backdrop */}
                        <div
                          className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-125 transition-opacity duration-500 group-hover:opacity-75"
                          style={{ backgroundImage: `url(${courseImg})` }}
                          aria-hidden="true"
                        />
                        {/* Main course image */}
                        <img
                          src={courseImg}
                          alt={c.name}
                          className="relative z-10 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Top Category Badge */}
                        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md border border-white/20 rounded-md px-2 py-0.5">
                            {c.category}
                          </span>
                        </div>

                        {/* Icon Badge bottom-left */}
                        <div className="absolute bottom-2 left-2.5 z-20 w-7 h-7 rounded-lg bg-white/95 backdrop-blur-md border border-white/40 flex items-center justify-center text-sm shadow-md">
                          {c.icon}
                        </div>
                      </div>

                      <div className="p-3.5 sm:p-4">
                        <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#EA580C] group-hover:to-[#0284C7] group-hover:bg-clip-text transition-all leading-snug">
                          {c.name}
                        </h3>
                        <p className="text-slate-600 text-xs leading-relaxed mt-1.5 line-clamp-2">
                          {c.desc}
                        </p>

                        {/* Key Skills Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {c.skills.slice(0, 4).map((sk) => (
                            <span
                              key={sk}
                              className="text-[10.5px] font-medium text-slate-600 bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-orange-50 group-hover:to-sky-50 group-hover:text-slate-900 rounded-md px-1.5 py-0.5 transition-colors"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>

                        {/* Course Duration & Rating */}
                        <div className="mt-3.5 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <FiClock size={12} className="text-orange-500" />
                            <span>{c.duration}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-800 justify-end">
                            <FiStar className="text-amber-500 fill-current" size={12} />
                            <span>{c.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer with Fee and Syllabus Link */}
                    <div className="px-3.5 sm:px-4 pb-3.5 pt-0">
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400 line-through mr-1.5">{c.oldFee}</span>
                          <span className="font-display font-extrabold text-sm sm:text-base text-slate-900">{c.fee}</span>
                        </div>
                        <Link
                          to={`/courses/${c.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 via-sky-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white text-[11px] font-bold shadow-xs shadow-sky-500/20 transition-all duration-200 hover:scale-105"
                        >
                          <span>View Syllabus</span>
                          <FiArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="font-display font-bold text-slate-900 text-lg">No programs match “{q}”.</h3>
              <p className="text-slate-500 text-sm mt-1">Try searching for AI, Testing, Python, MERN, or Digital Marketing.</p>
              <button
                onClick={() => { setQ(""); setTrackFilter("ALL"); setCat("all"); }}
                className="mt-4 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3 — FAQS & COLLABORATIONS */}
      <FaqSection
        onEnquire={onEnquire}
        eyebrow="Curriculum & Programs FAQ"
        title="Frequently Asked Questions About Our Courses"
        subtitle="Learn more about prerequisites, live project capstones, class timings, and recognized credentials."
      />
      <CollaborationsSection />
    </main>
  );
}
