import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FiX, FiArrowRight, FiCheckCircle, FiShield } from "react-icons/fi";
import { COURSES } from "../data/site";

export default function EnquiryModal({ open, course, onClose }) {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    selectedCourse: course || "Artificial Intelligence & GenAI",
    type: "Student (B.Tech / BBA / MCA)"
  });
  const boxRef = useRef(null);

  useEffect(() => {
    if (course) {
      setFormData((prev) => ({ ...prev, selectedCourse: course }));
    }
  }, [course]);

  useEffect(() => {
    if (open && boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        { opacity: 0, y: 16, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
      document.body.style.overflow = "hidden";
      try { window.__lenis?.stop(); } catch { /* no smooth scroller */ }
    } else {
      document.body.style.overflow = "";
      try { window.__lenis?.start(); } catch { /* no smooth scroller */ }
    }
    return () => {
      document.body.style.overflow = "";
      try { window.__lenis?.start(); } catch { /* noop */ }
    };
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setSent(false);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      data-lenis-prevent
    >
      <div className="absolute inset-0 bg-[#080808]/60 backdrop-blur-xs" onClick={handleClose} />
      <div
        ref={boxRef}
        className="relative w-full max-w-lg rounded-[8px] bg-white border border-[#d8d8d8] shadow-[rgba(0,0,0,0.02)_0px_67px_27px_0px,rgba(0,0,0,0.06)_0px_38px_23px_0px,rgba(0,0,0,0.1)_0px_17px_17px_0px,rgba(0,0,0,0.12)_0px_4px_9px_0px] p-6 sm:p-8 overflow-hidden"
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 grid place-items-center rounded-[4px] bg-[#f0f0f0] hover:bg-[#d8d8d8] text-[#080808] transition-colors"
          aria-label="Close"
        >
          <FiX size={16} />
        </button>

        {!sent ? (
          <>
            <div className="mb-2">
              <span className="eyebrow-label">
                Admissions & Counselling
              </span>
            </div>
            <h3 className="font-display font-semibold text-[#080808] text-2xl">
              Talk to a Technical Advisor
            </h3>
            <p className="text-xs sm:text-sm text-[#5a5a5a] mt-1 leading-relaxed">
              {course ? (
                <>Applying for <strong className="text-[#080808]">{course}</strong>. We will contact you within 24 hours.</>
              ) : (
                "Get a personalized curriculum roadmap, batch schedule, and syllabus breakdown."
              )}
            </p>

            <form
              className="mt-6 space-y-3.5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div>
                <label className="label">
                  Full Name *
                </label>
                <input
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Diya Singh"
                  className="field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="diya@example.com"
                    className="field"
                  />
                </div>
                <div>
                  <label className="label">
                    Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">
                    Selected Track
                  </label>
                  <select
                    className="field"
                    value={formData.selectedCourse}
                    onChange={(e) => setFormData({ ...formData, selectedCourse: e.target.value })}
                  >
                    {COURSES.map((c) => (
                      <option key={c.slug} value={c.name}>{c.name}</option>
                    ))}
                    {course && !COURSES.some(c => c.name === course) && (
                      <option value={course}>{course}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="label">
                    Current Status
                  </label>
                  <select
                    className="field"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option>College Student (B.Tech/BBA)</option>
                    <option>Final Year (2025/2026 Batch)</option>
                    <option>Recent Graduate / Job Seeker</option>
                    <option>Working Professional</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3.5 text-xs font-semibold uppercase tracking-wider mt-3"
              >
                Request Free Callback & Syllabus <FiArrowRight size={14} />
              </button>

              <p className="text-[11px] text-[#5a5a5a] text-center flex items-center justify-center gap-1.5 pt-1">
                <FiShield className="text-[#146ef5]" />
                100% privacy guaranteed. No spam calls.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-[4px] bg-[#146ef5]/10 text-[#146ef5] grid place-items-center text-2xl mx-auto mb-3 border border-[#146ef5]/20">
              <FiCheckCircle />
            </div>
            <h3 className="font-display font-semibold text-[#080808] text-xl">
              Application Received
            </h3>
            <p className="text-[#5a5a5a] text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong>{formData.fullName}</strong>. Our senior technical advisor will call you at <strong>{formData.phone}</strong> shortly.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 btn-primary text-xs uppercase tracking-wider px-6"
            >
              Done & Explore Programs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
