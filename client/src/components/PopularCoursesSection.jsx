import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight, FiClock, FiBriefcase, FiCode, FiCpu,
  FiCheckSquare, FiLayers, FiTrendingUp
} from "react-icons/fi";

export const POPULAR_COURSES = [
  {
    id: "full-stack-development",
    title: "Full Stack Development",
    subtitle: "MERN Stack Specialist",
    category: "Development",
    image: "/images/course_fullstack.jpg",
    duration: "4 – 6 Months",
    projects: "Live Projects",
    link: "/courses/full-stack-development",
    badgeIcon: FiCode,
    badgeShape: "rounded-xl",
    badgeColor: "bg-emerald-600 text-white",
  },
  {
    id: "python-programming",
    title: "Python Programming",
    subtitle: "Beginner to Advanced",
    category: "Development",
    image: "/images/course_python.jpg",
    duration: "3 – 4 Months",
    projects: "Live Projects",
    link: "/courses/python-programming",
    badgeIcon: FiLayers,
    badgeShape: "rounded-xl",
    badgeColor: "bg-[#1D4ED8] text-white",
  },
  {
    id: "software-testing",
    title: "Software Testing",
    subtitle: "Manual + Automation QA",
    category: "Enterprise & QA",
    image: "/images/course_testing.jpg",
    duration: "3 – 4 Months",
    projects: "Live Projects",
    link: "/courses/software-testing-automation",
    badgeIcon: FiCheckSquare,
    badgeShape: "rounded-xl",
    badgeColor: "bg-teal-600 text-white",
  },
  {
    id: "ai-machine-learning",
    title: "AI & Machine Learning",
    subtitle: "Python • ML • DL • LLMs",
    category: "Data & AI",
    image: "/images/course_ai.jpg",
    duration: "4 – 6 Months",
    projects: "Live Projects",
    link: "/courses/artificial-intelligence",
    badgeIcon: FiCpu,
    badgeShape: "rounded-xl",
    badgeColor: "bg-purple-600 text-white",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    subtitle: "SEO, SMM, Google Ads & AI",
    category: "Marketing",
    image: "/images/course_marketing.jpg",
    duration: "2 – 3 Months",
    projects: "Live Projects",
    link: "/courses/digital-marketing-aeo",
    badgeIcon: FiTrendingUp,
    badgeShape: "rounded-xl",
    badgeColor: "bg-amber-500 text-white",
  },
  {
    id: "sap-erp",
    title: "SAP / ERP Systems",
    subtitle: "SAP FICO, MM, SD Modules",
    category: "Enterprise & QA",
    image: "/images/course_sap.jpg",
    duration: "3 – 4 Months",
    projects: "Live Projects",
    link: "/courses/erp-sap-training",
    badgeIcon: FiBriefcase,
    badgeShape: "rounded-xl",
    badgeColor: "bg-blue-600 text-white",
  },
];

const CATEGORIES = ["All", "Development", "Data & AI", "Enterprise & QA", "Marketing"];

export default function PopularCoursesSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = selectedCategory === "All"
    ? POPULAR_COURSES
    : POPULAR_COURSES.filter(c => c.category === selectedCategory);

  return (
    <section className="relative py-6 sm:py-9 bg-gradient-to-b from-[#E8F4FD] via-[#DAEEFB] to-[#C8E6F9] text-slate-900 overflow-hidden select-none border-t border-b border-sky-200/70">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-sky-400/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-x relative z-10">
        {/* Section Header - Compact */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-[#0A1A4A] tracking-tight">
              Explore Our Programs
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5 font-medium">
              Industry-ready programs designed for real career opportunities.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#1D4ED8] hover:text-[#0F2468] transition-colors"
          >
            <span>View All Courses</span>
            <FiArrowRight size={14} />
          </Link>
        </div>

        {/* Category Filter Pills - Compact */}
        <div className="flex flex-wrap gap-1.5 mb-5 border-b border-slate-200/80 pb-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#0F2468] text-white shadow-xs shadow-blue-900/25"
                  : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses 3x2 Grid (Reduced small compact size) */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-3.5">
          {filtered.map((course) => {
            const BadgeIcon = course.badgeIcon;
            return (
              <div
                key={course.id}
                className="group relative rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/15 hover:shadow-orange-500/10 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Accent Line: None by default, appears as Orange + Sky Blue Mix on Hover */}
                <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div>
                  {/* Course Image - Compact banner */}
                  <div className="relative h-20 sm:h-22 w-full overflow-hidden bg-slate-900">
                    {/* Atmospheric blurred backdrop */}
                    <div
                      className="absolute inset-0 bg-cover bg-center blur-md opacity-40 scale-110 transition-opacity duration-500 group-hover:opacity-70"
                      style={{ backgroundImage: `url(${course.image})` }}
                      aria-hidden="true"
                    />
                    {/* Main photo */}
                    <img
                      src={course.image}
                      alt={course.title}
                      className="relative z-10 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Depth gradient overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Badge Icon at bottom-left */}
                    <div
                      className={`absolute bottom-1.5 left-2 z-20 w-5 h-5 rounded-md ${course.badgeColor} flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110`}
                    >
                      <BadgeIcon size={10} strokeWidth={2.4} />
                    </div>
                  </div>

                  {/* Card Content Body - Small compact size */}
                  <div className="p-2.5 sm:p-3 pt-2">
                    <h3 className="font-display font-bold text-[#0A1A4A] text-xs sm:text-[13.5px] leading-snug group-hover:text-[#EA580C] transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-[10px] sm:text-[11px] font-medium mt-0.5 line-clamp-1">
                      {course.subtitle}
                    </p>

                    {/* Meta Tags: Duration + Live Projects */}
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600 font-semibold">
                      <span className="flex items-center gap-1">
                        <FiClock size={11} className="text-sky-600" />
                        <span>{course.duration}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <FiBriefcase size={11} className="text-sky-600" />
                        <span>{course.projects}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Link */}
                <div className="px-2.5 sm:px-3 pb-2.5 pt-0">
                  <Link
                    to={course.link}
                    className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold text-[#EA580C] hover:text-[#C2410C] transition-colors group/link"
                  >
                    <span>View Course</span>
                    <FiArrowRight
                      size={11}
                      className="transition-transform group-hover/link:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
