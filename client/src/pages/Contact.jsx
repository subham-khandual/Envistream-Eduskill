import { useState } from "react";
import {
  FiMapPin, FiPhone, FiMail, FiSend,
  FiClock, FiCheckCircle,
  FiArrowRight, FiCompass, FiExternalLink
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Reveal from "../components/Reveal";
import FaqSection from "../components/FaqSection";
import CollaborationsSection from "../components/CollaborationsSection";

export default function Contact({ onEnquire }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    track: "Artificial Intelligence & GenAI",
    type: "Student (B.Tech / BBA / MCA)",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactCards = [
    {
      icon: FiMapPin,
      tag: "Main Campus & Lab",
      title: "Bhubaneswar Center",
      desc: "Plot-N6/454, 2nd floor, Saffire Building, Opposite- Crown Hotel, IRC Village, Nayapalli, Bhubaneswar, Odisha 751015",
      action: "Get Directions",
      href: "https://www.google.com/maps?q=Plot-N6%2F454%2C+2nd+floor%2C+Saffire+Building%2C+Opposite-+Crown+Hotel%2C+IRC+Village%2C+Nayapalli%2C+Bhubaneswar%2C+Odisha",
      isExternal: true,
      color: "from-blue-600 to-indigo-600",
      accentBg: "bg-blue-50 border-blue-200 text-blue-700",
      badgeColor: "bg-blue-600/10 text-blue-600 border-blue-200",
    },
    {
      icon: FiPhone,
      tag: "Direct Support",
      title: "Call Our Advisors",
      desc: "Speak directly with our senior mentors for batch allocation, syllabus counseling, or fee plans.",
      numbers: [
        { label: "Admissions & Counseling", phone: "+91 7873489364" },
        { label: "Placement & Corporate", phone: "+91 9078419012" },
      ],
      color: "from-sky-500 to-cyan-500",
      accentBg: "bg-sky-50 border-sky-200 text-sky-700",
      badgeColor: "bg-sky-600/10 text-sky-700 border-sky-200",
    },
    {
      icon: FiMail,
      tag: "Official Inquiries",
      title: "Email Assistance",
      desc: "Send us your queries, CVs, or institutional MoU proposals. Guaranteed reply within 24 hours.",
      emails: [
        { label: "Training & Admissions", email: "training@envistream.org" },
        { label: "General & Institutional", email: "info@envistream.org" },
      ],
      color: "from-amber-500 to-orange-500",
      accentBg: "bg-orange-50 border-orange-200 text-orange-700",
      badgeColor: "bg-orange-600/10 text-orange-700 border-orange-200",
    },
    {
      icon: FaWhatsapp,
      tag: "Instant Messaging",
      title: "WhatsApp Helpdesk",
      desc: "Connect on WhatsApp for instant curriculum PDFs, course fees, and upcoming weekend demo invites.",
      action: "Chat with Us on WhatsApp",
      href: "https://wa.me/917873489364?text=Hi%20Envistream%20Team%2C%20I%20want%20to%20know%20more%20about%20your%20training%20programs",
      isExternal: true,
      color: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
      badgeColor: "bg-emerald-600/10 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <main className="bg-slate-50 text-[#080808] min-h-screen overflow-x-hidden">
      {/* 1 — HERO SECTION: Eye-Catchy Sky Blue, Slate Grey & Warm Orange Mix */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#E0F2FE] via-[#F1F5F9] to-[#BAE6FD] text-slate-900 py-12 sm:py-16 lg:py-20 select-none border-b border-sky-300 shadow-xs">
        {/* Eye-Catchy Multi-Color Ambient Glows: Orange, Slate-Grey & Sky Blue Mesh */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[380px] bg-gradient-to-bl from-orange-400/25 via-amber-300/20 to-transparent rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-5 w-[450px] h-[320px] bg-gradient-to-tr from-sky-400/35 via-cyan-300/25 to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[350px] h-[250px] bg-slate-300/30 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.12)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-80" />

        <div className="container-x relative z-10 pb-8 sm:pb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-extrabold tracking-widest uppercase mb-3 shadow-xs">
              <span>GET IN TOUCH WITH MENTORS</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-[54px] tracking-tight text-[#071952] leading-[1.12]">
              Connect With Our <br className="hidden sm:inline" />
              <span className="text-[#EA580C]">Technical</span>{" "}
              <span className="text-[#0369A1]">Advisors</span>
            </h1>

            <p className="mt-4 text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-medium">
              Get personalized clarity on industry curricula, capstone project tracks, real-time lab schedules, and guaranteed placement assistance. Visit our physical center or leave a quick message.
            </p>
          </div>
        </div>
      </section>

      {/* 2 — MAIN CONTACT SECTION (Interactive Form + Eye-Catchy Cards) */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-slate-100 via-sky-50/40 to-white relative">
        <div className="container-x">
          
          {/* 4 Eye-Catching Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 -mt-20 sm:-mt-24 mb-14 relative z-20">
            {contactCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl p-6 border border-slate-200/80 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:border-sky-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white grid place-items-center shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform`}>
                        <Icon size={22} />
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {card.desc}
                    </p>

                    {/* Dedicated elements for phone numbers */}
                    {card.numbers && (
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                        {card.numbers.map((item, nIdx) => (
                          <div key={nIdx} className="text-xs">
                            <span className="text-slate-400 block text-[11px]">{item.label}</span>
                            <a
                              href={`tel:${item.phone.replace(/\s+/g, "")}`}
                              className="font-semibold text-slate-800 hover:text-blue-600 flex items-center gap-1.5 mt-0.5"
                            >
                              <FiPhone size={12} className="text-sky-500" />
                              {item.phone}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dedicated elements for emails */}
                    {card.emails && (
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                        {card.emails.map((item, eIdx) => (
                          <div key={eIdx} className="text-xs">
                            <span className="text-slate-400 block text-[11px]">{item.label}</span>
                            <a
                              href={`mailto:${item.email}`}
                              className="font-semibold text-slate-800 hover:text-orange-600 flex items-center gap-1.5 mt-0.5 break-all"
                            >
                              <FiMail size={12} className="text-orange-500 shrink-0" />
                              {item.email}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Link for Map and WhatsApp */}
                  {card.action && (
                    <div className="mt-5 pt-3 border-t border-slate-100">
                      <a
                        href={card.href}
                        target={card.isExternal ? "_blank" : "_self"}
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
                      >
                        <span>{card.action}</span>
                        <FiArrowRight size={13} />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Form & Center Location Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form (7 cols) */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-10 shadow-xl shadow-sky-900/5 relative overflow-hidden">
                  {/* Subtle top color ribbon */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500" />

                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>Free Career Counselling</span>
                  </div>

                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    Book a Mentorship Session
                  </h2>
                  <p className="text-slate-600 text-sm mt-2 mb-8">
                    Let our tech leads help you choose the right specialization, examine live course projects, and clarify upcoming offline/online batch schedules.
                  </p>

                  {submitted ? (
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center animate-fade-in">
                      <div className="w-14 h-14 rounded-full bg-emerald-500 text-white grid place-items-center text-2xl mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                        <FiCheckCircle />
                      </div>
                      <h3 className="font-display font-bold text-xl text-slate-900">
                        Counselling Request Dispatched!
                      </h3>
                      <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                        Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. A dedicated tech advisor will reach out to you at <strong className="text-emerald-700">{formData.phone}</strong> within 24 hours.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-700 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Your Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Subham Mishra"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="subham@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            WhatsApp / Phone <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            Interested Specialization
                          </label>
                          <select
                            value={formData.track}
                            onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                          >
                            <option>Artificial Intelligence & GenAI</option>
                            <option>Full Stack Web (MERN / Next.js)</option>
                            <option>Software Testing & QA Automation</option>
                            <option>Data Science & Business Analytics</option>
                            <option>Cloud Computing & DevOps</option>
                            <option>Answer Engine Optimization (AEO)</option>
                            <option>Other / Custom Consultation</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            Current Status
                          </label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                          >
                            <option>Student (B.Tech / BBA / MCA)</option>
                            <option>Final Year Student (2025/2026)</option>
                            <option>Recent Graduate / Job Seeker</option>
                            <option>Working Professional (Upskilling)</option>
                            <option>College / Faculty Representative</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Specific Questions or Goals
                        </label>
                        <textarea
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us what you are aiming for (placement prep, capstone project, weekend batch timings, syllabus details)..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                      >
                        <span>Schedule Free Technical Counselling</span>
                        <FiSend size={15} />
                      </button>

                      <p className="text-center text-[11px] text-slate-400 mt-2">
                        🔒 Your data is confidential. We will never spam or share your contact info.
                      </p>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Right Column: Campus Highlight & Key Support Info (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Center Details Card */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-xs font-semibold mb-4">
                  <FiCompass className="text-amber-400" />
                  <span>Physical Innovation Lab</span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                  Visit Our Bhubaneswar Center
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  Located right in the education and business corridor of Nayapalli, Bhubaneswar. Walk-in to inspect our high-speed developer labs, meet faculty mentors, and verify your credentials.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                    <FiMapPin className="text-amber-400 shrink-0 mt-1" size={18} />
                    <div className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-white block">Envistream Smartech Pvt. Ltd.</strong>
                      Plot-N6/454, 2nd floor, Saffire Building, Opp. Crown Hotel, IRC Village, Nayapalli, Bhubaneswar, Odisha 751015
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                    <FiClock className="text-cyan-400 shrink-0" size={18} />
                    <div className="text-xs text-slate-300">
                      <span className="text-white font-semibold">Office & Lab Hours:</span> Monday to Saturday, 9:00 AM – 7:30 PM
                    </div>
                  </div>
                </div>

                {/* Open in Maps Button */}
                <div className="mt-6">
                  <a
                    href="https://www.google.com/maps?q=Plot-N6%2F454%2C+2nd+floor%2C+Saffire+Building%2C+Opposite-+Crown+Hotel%2C+IRC+Village%2C+Nayapalli%2C+Bhubaneswar%2C+Odisha"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md transition-all uppercase tracking-wider"
                  >
                    <span>Open in Google Maps</span>
                    <FiExternalLink size={14} />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3 — FAQ & COLLABORATIONS */}
      <FaqSection
        onEnquire={onEnquire}
        eyebrow="Admissions & Support FAQ"
        title="Frequently Asked Questions"
        subtitle="Need help choosing a track, understanding timings, or scheduling a visit to our center?"
        ctaText="Request Quick Callback"
      />
      <CollaborationsSection title="OUR CORPORATE ASSOCIATES & PARTNERS" />
    </main>
  );
}

