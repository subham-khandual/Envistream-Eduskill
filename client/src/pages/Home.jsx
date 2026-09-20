import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight, FiStar, FiChevronDown, FiClock,
  FiCpu, FiBriefcase, FiLayers, FiShield, FiCheckCircle
} from "react-icons/fi";
import HeroSection from "../components/HeroSection";
import PopularCoursesSection from "../components/PopularCoursesSection";
import PathToHiredSection from "../components/PathToHiredSection";
import Reveal from "../components/Reveal";
import FaqSection from "../components/FaqSection";
import CollaborationsSection from "../components/CollaborationsSection";
import { TESTIMONIALS } from "../data/site";

export default function Home({ onEnquire }) {
  return (
    <main className="bg-white text-slate-900">
      {/* 1 — HERO SECTION (1st: Blue) */}
      <HeroSection onEnquire={onEnquire} />

      {/* 2 — EXPLORE OUR PROGRAMS SECTION */}
      <PopularCoursesSection />

      {/* 3 — YOUR PATH TO HIRED (How It Works) */}
      <PathToHiredSection onEnquire={onEnquire} />

      {/* 4 — WHY CHOOSE EDUSKILL SECTION (Grey - B) */}
      <section className="py-16 sm:py-20 bg-[#F1F5F9] border-t border-b border-slate-200">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Why 15,000+ Students Choose EduSkill
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base font-medium">
              State-of-the-art facilities, 1-on-1 industry mentors, and verifiable digital credentials.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FiCpu,
                title: "24x7 High-Tech Lab",
                desc: "Workstations at Nayapalli center equipped with gigabit fiber, GPU clusters, and production dev environments.",
                hoverBg: "hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/20",
                iconColor: "bg-sky-100 text-sky-600 group-hover:bg-sky-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-sky-500/30",
                titleHover: "group-hover:text-sky-600",
              },
              {
                icon: FiLayers,
                title: "Live Production Capstones",
                desc: "Zero simulated toy code. Build real repositories, submit weekly pull requests, and deploy to AWS.",
                hoverBg: "hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20",
                iconColor: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/30",
                titleHover: "group-hover:text-blue-600",
              },
              {
                icon: FiShield,
                title: "Verifiable Digital Credentials",
                desc: "Cryptographically verifiable certificates and experience letters recognized by 120+ corporate recruiters.",
                hoverBg: "hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20",
                iconColor: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-emerald-500/30",
                titleHover: "group-hover:text-emerald-600",
              },
              {
                icon: FiBriefcase,
                title: "Direct Placement Drives",
                desc: "Fast-track campus drives, resume ATS optimization, and mock interview rounds with senior engineering leads.",
                hoverBg: "hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/20",
                iconColor: "bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-amber-500/30",
                titleHover: "group-hover:text-amber-600",
              },
              {
                icon: FiCheckCircle,
                title: "1-on-1 Mentorship Desks",
                desc: "Weekly personalized architectural reviews and code feedback sessions with working software leads.",
                hoverBg: "hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/20",
                iconColor: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-purple-500/30",
                titleHover: "group-hover:text-purple-600",
              },
              {
                icon: FiStar,
                title: "Hybrid Learning Flexibility",
                desc: "Attend in-person at Bhubaneswar or join interactive live online batches with full classroom recording access.",
                hoverBg: "hover:border-rose-400 hover:shadow-xl hover:shadow-rose-500/20",
                iconColor: "bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-rose-500/30",
                titleHover: "group-hover:text-rose-600",
              },
            ].map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <Reveal key={adv.title} delay={idx * 0.05}>
                  <div className={`relative rounded-2xl border border-slate-200/90 bg-white p-6 h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 cursor-pointer group shadow-sm ${adv.hoverBg}`}>
                    <div>
                      <div className={`w-12 h-12 rounded-xl grid place-items-center mb-4 transition-all duration-300 group-hover:scale-110 ${adv.iconColor}`}>
                        <Icon size={24} />
                      </div>
                      <h3 className={`font-display font-bold text-slate-900 text-lg transition-colors duration-200 ${adv.titleHover}`}>
                        {adv.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
                        {adv.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5 — STUDENT TESTIMONIALS (White - A) */}
      <section className="py-16 sm:py-20 bg-white border-t border-b border-slate-200">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full shadow-2xs">
              Success Stories
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-3">
              Proven Results Across Every Track
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base font-medium">
              Real stories from students who launched rewarding careers with EduSkill.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((t, i) => {
              const cardThemes = [
                {
                  hoverBg: "hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/20",
                  avatarRing: "group-hover:ring-2 group-hover:ring-sky-400",
                  nameHover: "group-hover:text-sky-700",
                  roleColor: "text-sky-600",
                },
                {
                  hoverBg: "hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20",
                  avatarRing: "group-hover:ring-2 group-hover:ring-emerald-400",
                  nameHover: "group-hover:text-emerald-700",
                  roleColor: "text-emerald-600",
                },
                {
                  hoverBg: "hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/20",
                  avatarRing: "group-hover:ring-2 group-hover:ring-amber-400",
                  nameHover: "group-hover:text-amber-700",
                  roleColor: "text-amber-600",
                },
              ];
              const theme = cardThemes[i % cardThemes.length];

              return (
                <Reveal key={t.name} delay={i * 0.08}>
                  <div className={`relative rounded-2xl border border-slate-200/90 bg-slate-50/80 p-6 h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:border-slate-300 cursor-pointer group shadow-sm ${theme.hoverBg}`}>
                    <div>
                      <div className="flex gap-1 text-amber-400 mb-3.5">
                        {Array.from({ length: t.rating }).map((_, s) => (
                          <FiStar key={s} className="fill-current text-sm drop-shadow-xs" />
                        ))}
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed italic">
                        “{t.text}”
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className={`w-11 h-11 rounded-full object-cover border border-slate-200 transition-all duration-200 ${theme.avatarRing}`}
                      />
                      <div>
                        <p className={`font-bold text-slate-900 text-sm transition-colors ${theme.nameHover}`}>{t.name}</p>
                        <p className={`text-xs font-semibold ${theme.roleColor}`}>{t.role}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 — FAQS ACCORDION */}
      <FaqSection onEnquire={onEnquire} />

      {/* 7 — OUR COLLABORATION & ASSOCIATES */}
      <CollaborationsSection />

    </main>
  );
}
