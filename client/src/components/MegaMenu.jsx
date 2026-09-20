import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
  FiChevronRight, FiArrowRight, FiClock, FiBarChart2, FiLayers,
  FiCpu, FiCode, FiDatabase, FiShield, FiCloud, FiTerminal,
  FiTrendingUp, FiZap, FiCheck, FiCheckSquare, FiBriefcase,
} from "react-icons/fi";
import {
  getActiveCategories, getCoursesByCategory, getFeaturedCourseForCategory, FEATURED_COURSE,
} from "../data/megaMenu";

export const CAT_THEMES = {
  "cat-ai": {
    activeBg: "bg-blue-50/90 text-blue-700 border-blue-400 shadow-blue-500/10 ring-2 ring-blue-200",
    iconActive: "bg-blue-600 text-white shadow-md shadow-blue-500/30",
    iconInactive: "bg-blue-50 border-blue-200/80 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    accent: "text-blue-600",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    hoverBorder: "hover:border-blue-300 hover:bg-blue-50/40",
  },
  "cat-qa": {
    activeBg: "bg-indigo-50/90 text-indigo-700 border-indigo-400 shadow-indigo-500/10 ring-2 ring-indigo-200",
    iconActive: "bg-indigo-600 text-white shadow-md shadow-indigo-500/30",
    iconInactive: "bg-indigo-50 border-indigo-200/80 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    accent: "text-indigo-600",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    hoverBorder: "hover:border-indigo-300 hover:bg-indigo-50/40",
  },
  "cat-fullstack": {
    activeBg: "bg-orange-50/90 text-orange-700 border-orange-400 shadow-orange-500/10 ring-2 ring-orange-200",
    iconActive: "bg-orange-600 text-white shadow-md shadow-orange-500/30",
    iconInactive: "bg-orange-50 border-orange-200/80 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    accent: "text-orange-600",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    hoverBorder: "hover:border-orange-300 hover:bg-orange-50/40",
  },
  "cat-data": {
    activeBg: "bg-cyan-50/90 text-cyan-800 border-cyan-400 shadow-cyan-500/10 ring-2 ring-cyan-200",
    iconActive: "bg-cyan-600 text-white shadow-md shadow-cyan-500/30",
    iconInactive: "bg-cyan-50 border-cyan-200/80 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white",
    accent: "text-cyan-600",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
    hoverBorder: "hover:border-cyan-300 hover:bg-cyan-50/40",
  },
  "cat-sap": {
    activeBg: "bg-purple-50/90 text-purple-700 border-purple-400 shadow-purple-500/10 ring-2 ring-purple-200",
    iconActive: "bg-purple-600 text-white shadow-md shadow-purple-500/30",
    iconInactive: "bg-purple-50 border-purple-200/80 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    accent: "text-purple-600",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    hoverBorder: "hover:border-purple-300 hover:bg-purple-50/40",
  },
  "cat-cyber": {
    activeBg: "bg-emerald-50/90 text-emerald-700 border-emerald-400 shadow-emerald-500/10 ring-2 ring-emerald-200",
    iconActive: "bg-emerald-600 text-white shadow-md shadow-emerald-500/30",
    iconInactive: "bg-emerald-50 border-emerald-200/80 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    accent: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    hoverBorder: "hover:border-emerald-300 hover:bg-emerald-50/40",
  },
  "cat-prog": {
    activeBg: "bg-sky-50/90 text-sky-700 border-sky-400 shadow-sky-500/10 ring-2 ring-sky-200",
    iconActive: "bg-sky-600 text-white shadow-md shadow-sky-500/30",
    iconInactive: "bg-sky-50 border-sky-200/80 text-sky-600 group-hover:bg-sky-600 group-hover:text-white",
    accent: "text-sky-600",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    hoverBorder: "hover:border-sky-300 hover:bg-sky-50/40",
  },
  "cat-marketing": {
    activeBg: "bg-amber-50/90 text-amber-800 border-amber-400 shadow-amber-500/10 ring-2 ring-amber-200",
    iconActive: "bg-amber-600 text-white shadow-md shadow-amber-500/30",
    iconInactive: "bg-amber-50 border-amber-200/80 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
    accent: "text-amber-600",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    hoverBorder: "hover:border-amber-300 hover:bg-amber-50/40",
  },
};

export const CAT_ICONS = {
  Ai: FiCpu,
  Qa: FiCheckSquare,
  Fs: FiLayers,
  Ds: FiDatabase,
  Erp: FiBriefcase,
  Cs: FiShield,
  Cl: FiCloud,
  Pg: FiTerminal,
  Dm: FiTrendingUp,
  Et: FiZap,
};

function courseUrl(course) {
  return course.menuUrl || `/courses/${course.slug}`;
}

/**
 * Sleek Reference-Styled Featured Spotlight Card
 */
export function FeaturedCard({ compact = false, course = null, eyebrow = null, onNavigate }) {
  const data = course
    ? {
        badge: eyebrow || "FEATURED PROGRAM",
        name: course.name,
        points: (course.technologies && course.technologies.length > 0)
          ? course.technologies.slice(0, 4)
          : ["Production Architecture", "Hands-on Capstones", "Mentor Code Review"],
        desc: course.shortDescription,
        cta: "Explore Program",
        slug: course.slug,
        stats: `${course.duration} · ${course.level?.split(" ")[0] || "Intermediate"}`,
      }
    : FEATURED_COURSE;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-b from-[#1F2937] via-[#111827] to-[#0B0F19] text-white p-5 shadow-xl flex flex-col justify-between h-full">
      {/* Subtle blueprint grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#37415115_1px,transparent_1px),linear-gradient(to_bottom,#37415115_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Gold Pill Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/15 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          {data.badge}
        </span>

        <h4 className="font-display font-extrabold text-[17px] text-white leading-snug mt-3">
          {data.name}
        </h4>
        <p className="text-[12px] text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
          {data.desc}
        </p>

        {/* Checkmark List */}
        <ul className="mt-4 space-y-2 border-t border-slate-700/60 pt-3">
          {data.points.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-[12px] font-semibold text-slate-200">
              <span className="w-4 h-4 grid place-items-center rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FiCheck size={11} strokeWidth={3} />
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1">
            <FiClock size={11} className="text-amber-400" /> {data.stats.split("·")[0]?.trim()}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1 text-slate-300">
            <FiBarChart2 size={11} className="text-sky-400" /> Job-ready
          </span>
        </div>
      </div>

      {/* Gold/Orange CTA Button */}
      <div className="relative z-10 mt-5">
        <Link
          to={`/courses/${data.slug}`}
          onClick={onNavigate}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#D97706] hover:from-[#B45309] hover:to-[#F59E0B] text-white text-xs font-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
        >
          <span>{data.cta}</span>
          <FiArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

/**
 * DESKTOP mega panel — 3 zones: categories | programs | per-category spotlight.
 */
export function MegaPanel({ onNavigate }) {
  const categories = useMemo(() => getActiveCategories(), []);
  const [activeId, setActiveId] = useState(categories[0]?.id || "cat-ai");
  const [shownId, setShownId] = useState(categories[0]?.id || "cat-ai");
  const busy = useRef(false);
  const panelRef = useRef(null);
  const listRef = useRef(null);
  const spotRef = useRef(null);

  const activeCat = categories.find((c) => c.id === activeId) || categories[0];
  const shownCat = categories.find((c) => c.id === shownId) || activeCat;
  const programs = useMemo(() => (shownCat ? getCoursesByCategory(shownCat.id) : []), [shownCat]);
  const spotlight = useMemo(() => (activeCat ? getFeaturedCourseForCategory(activeCat.id) : null), [activeCat]);

  // Enter animation
  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: -8, scale: 0.99 },
      { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" }
    );
  }, []);

  // Category transition
  useEffect(() => {
    if (!listRef.current) return;
    if (activeId === shownId) return;
    if (busy.current) {
      setShownId(activeId);
      return;
    }
    busy.current = true;
    const kids = listRef.current.children;
    gsap.to(kids, {
      opacity: 0, x: -6, duration: 0.1, ease: "power2.in", overwrite: true,
      onComplete: () => {
        setShownId(activeId);
        requestAnimationFrame(() => {
          if (!listRef.current) {
            busy.current = false;
            return;
          }
          gsap.fromTo(
            listRef.current.children,
            { opacity: 0, x: 8 },
            {
              opacity: 1, x: 0, duration: 0.18, stagger: 0.02, ease: "power2.out",
              overwrite: true, onComplete: () => { busy.current = false; },
            }
          );
        });
      },
    });
  }, [activeId, shownId]);

  return (
    <div
       ref={panelRef}
       className="w-[960px] xl:w-[1040px] max-w-[calc(100vw-2.5rem)] rounded-2xl bg-white border border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(29,78,216,0.18),0_10px_20px_-5px_rgba(0,0,0,0.08)] overflow-hidden text-slate-800"
    >
         <div className="grid grid-cols-[260px_1fr_280px]">
         {/* LEFT — Categories (Browse by Technology) */}
          <div className="bg-[#F8FAFC] border-r border-slate-200/80 py-5 px-3" role="tablist" aria-label="Course categories">
            <p className="px-3 pb-3 text-[9px] font-black uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-500">
              Browse by Technology
            </p>
           <div className="space-y-1.5">
             {categories.map((cat) => {
               const Icon = CAT_ICONS[cat.icon] || FiCode;
               const active = cat.id === activeId;
               const theme = CAT_THEMES[cat.id] || CAT_THEMES["cat-ai"];
               return (
                 <button
                   key={cat.id}
                   role="tab"
                   aria-selected={active}
                   onMouseEnter={() => setActiveId(cat.id)}
                   onFocus={() => setActiveId(cat.id)}
                   onClick={() => setActiveId(cat.id)}
                   className={`group w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all duration-200 cursor-pointer ${
                     active
                       ? `${theme.activeBg} font-bold border shadow-sm scale-[1.02]`
                       : "text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-md"
                   }`}
                 >
                   <span
                     className={`w-8 h-8 grid place-items-center rounded-xl shrink-0 transition-all duration-200 ${
                       active
                         ? theme.iconActive
                         : `border ${theme.iconInactive}`
                     }`}
                   >
                     <Icon size={15} />
                   </span>
                   <span className="flex-1 min-w-0">
                     <span className="block text-[13px] font-display font-semibold leading-tight truncate">
                       {cat.name}
                     </span>
                     <span className="block text-[10.5px] text-slate-400 font-medium truncate mt-0.5">
                       {getCoursesByCategory(cat.id).length} programs
                     </span>
                   </span>
                   <FiChevronRight
                     size={13}
                     className={`shrink-0 transition-all duration-200 ${
                       active ? `${theme.accent} translate-x-0.5` : "text-slate-300 opacity-60 group-hover:opacity-100"
                     }`}
                   />
                 </button>
               );
             })}
           </div>
         </div>

        {/* MIDDLE — Programs List for hovered category */}
        {(() => {
          const currentTheme = CAT_THEMES[shownCat?.id] || CAT_THEMES["cat-ai"];
          return (
            <div className="py-6 px-7 min-h-[420px] bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg mb-2 border ${currentTheme.badge}`}>
                      {shownCat?.name}
                    </span>
                    <h3 className="font-display font-black text-[#071952] text-[17px] tracking-tight">
                      Specialized Tracks &amp; Certifications
                    </h3>
                    <p className="text-[12px] text-slate-500 font-medium line-clamp-1 mt-1 max-w-[420px]">
                      {shownCat?.description}
                    </p>
                  </div>
                  <Link
                    to={`/courses?category=${shownCat?.slug}`}
                    onClick={onNavigate}
                    className={`text-[12px] font-bold ${currentTheme.accent} hover:underline inline-flex items-center gap-1.5 shrink-0 ml-4`}
                  >
                    <span>View all {shownCat?.name?.split(" ")[0]}</span>
                    <FiArrowRight size={12} />
                  </Link>
                </div>

                <div ref={listRef} className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {programs.map((p) => (
                    <Link
                      key={p.id}
                      to={courseUrl(p)}
                      onClick={onNavigate}
                      className={`group relative p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 ${currentTheme.hoverBorder} hover:shadow-md transition-all duration-200 block`}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className={`text-[13px] font-display font-semibold text-slate-800 group-hover:${currentTheme.accent} transition-colors leading-tight`}>
                          {p.name}
                        </span>
                        <span className={`text-[11px] font-bold ${currentTheme.accent} opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5`}>
                          →
                        </span>
                      </span>
                      <span className="block text-[11.5px] text-slate-500 font-medium leading-snug mt-1.5 line-clamp-2">
                        {p.shortDescription}
                      </span>
                      <span className="flex items-center gap-2 mt-2.5 text-[10.5px] text-slate-400 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <FiClock size={10} className="text-amber-500" /> {p.duration}
                        </span>
                        <span>·</span>
                        <span className="text-slate-600 font-semibold">{p.level?.split(" ")[0] || "All Levels"}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* RIGHT — Dark Spotlight Card & Talk to Counsellor */}
        <div className="border-l border-slate-200/80 bg-[#FAFAFC] p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,#FB930608_0%,transparent_70%)] pointer-events-none" />
          <div ref={spotRef} key={activeCat?.id} className="flex-1 relative z-10">
            <FeaturedCard
              course={spotlight}
              eyebrow={`FEATURED · ${activeCat?.name?.toUpperCase()}`}
              onNavigate={onNavigate}
            />
          </div>

          {/* Talk to a Counsellor Card */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4 text-center shadow-xs hover:shadow-md transition-shadow">
            <p className="text-[11px] text-slate-500 font-medium">Not sure what to learn?</p>
            <Link
              to="/contact"
              onClick={onNavigate}
              className="text-[12px] font-black text-sky-600 hover:text-sky-700 hover:underline block mt-1 inline-flex items-center gap-1"
            >
              Talk to a counsellor →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MOBILE accordion — Courses → Category → Programs
 */
export function MobileMegaMenu({ onNavigate }) {
  const categories = useMemo(() => getActiveCategories(), []);
  const [openCat, setOpenCat] = useState(null);
  const [coursesOpen, setCoursesOpen] = useState(false);

  return (
    <div className="rounded-[4px] border border-[#d8d8d8] bg-white overflow-hidden">
      <button
        onClick={() => setCoursesOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 font-medium text-sm text-[#080808] bg-[#f0f0f0]"
        aria-expanded={coursesOpen}
      >
        Programs & Tracks
        <FiChevronRight className={`transition-transform duration-200 ${coursesOpen ? "rotate-90 text-[#146ef5]" : "text-[#5a5a5a]"}`} />
      </button>

      {coursesOpen && (
        <div className="divide-y divide-[#f0f0f0]">
          {categories.map((cat) => {
            const Icon = CAT_ICONS[cat.icon] || FiCode;
            const open = openCat === cat.id;
            const programs = getCoursesByCategory(cat.id);
            return (
              <div key={cat.id}>
                <button
                  onClick={() => setOpenCat(open ? null : cat.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left bg-white hover:bg-[#f0f0f0] transition-colors"
                  aria-expanded={open}
                >
                  <span className="w-7 h-7 grid place-items-center rounded-[3px] bg-[#f0f0f0] text-[#080808]">
                    <Icon size={14} />
                  </span>
                  <span className="flex-1 text-[13px] font-medium text-[#080808]">{cat.name}</span>
                  <FiChevronRight size={13} className={`transition-transform ${open ? "rotate-90 text-[#146ef5]" : "text-[#5a5a5a]"}`} />
                </button>

                {open && (
                  <div className="bg-[#fcfcfc] pl-10 pr-3 py-1 space-y-1 border-t border-[#f0f0f0]">
                    {programs.map((p) => (
                      <Link
                        key={p.id}
                        to={courseUrl(p)}
                        onClick={onNavigate}
                        className="block py-1.5 text-[12.5px] text-[#5a5a5a] hover:text-[#146ef5] transition-colors"
                      >
                        {p.name}
                      </Link>
                    ))}
                    <Link
                      to={`/courses?category=${cat.slug}`}
                      onClick={onNavigate}
                      className="block py-2 text-[12px] font-medium text-[#146ef5]"
                    >
                      View all in {cat.name} →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
