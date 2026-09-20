import { useState } from "react";
import { FiPlus, FiMinus, FiArrowRight } from "react-icons/fi";
import Reveal from "./Reveal";
import { FAQS } from "../data/site";

export default function FaqSection({
  faqs = FAQS,
  title = "Frequently Asked Questions",
  eyebrow = "Got Questions?",
  subtitle = "Still unsure which technology track fits your background best? Our career counsellors offer personalized guidance.",
  ctaText = "Talk to a Counsellor",
  onEnquire,
  className = "",
}) {
  const [faqOpen, setFaqOpen] = useState(0);
  const items = faqs && faqs.length > 0 ? faqs : FAQS;

  return (
    <section className={`py-16 sm:py-20 bg-[#F1F5F9] border-t border-b border-slate-200 ${className}`}>
      <div className="container-x grid lg:grid-cols-[360px_1fr] gap-10 items-start">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8] bg-white border border-blue-200 px-3 py-1 rounded-full shadow-2xs">
            {eyebrow}
          </span>
          <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight mt-3">
            {title}
          </h2>
          <p className="text-slate-600 mt-2 text-sm leading-relaxed font-normal">
            {subtitle}
          </p>
          {onEnquire && (
            <button
              onClick={() => onEnquire?.("General FAQ Consultation")}
              className="mt-6 btn-primary text-xs uppercase tracking-wider inline-flex items-center gap-2"
            >
              <span>{ctaText}</span>
              <FiArrowRight size={14} />
            </button>
          )}
        </Reveal>

        <div className="space-y-3">
          {items.slice(0, 7).map((f, i) => {
            const open = faqOpen === i;
            return (
              <div
                key={f.q || i}
                className={`rounded-xl border transition-all duration-200 ${
                  open
                    ? "border-blue-500 bg-white shadow-md ring-1 ring-blue-400/30"
                    : "border-slate-200/90 bg-white hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <button
                  onClick={() => setFaqOpen(open ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 p-4.5 sm:p-5 text-left font-bold text-slate-900 hover:text-blue-700 text-sm sm:text-base cursor-pointer transition-colors"
                >
                  <span>{f.q}</span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      open
                        ? "bg-blue-600 text-white rotate-45 shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600"
                    }`}
                  >
                    <FiPlus className="text-base transition-transform" />
                  </span>
                </button>
                {open && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
