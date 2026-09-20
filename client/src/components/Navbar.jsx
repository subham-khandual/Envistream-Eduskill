import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiMenu, FiX, FiArrowRight, FiLogIn, FiChevronDown, FiDownload
} from "react-icons/fi";
import {
  FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn
} from "react-icons/fa";
import Logo from "./Logo";
import { MegaPanel } from "./MegaMenu";

const NAV_ITEMS = [
  { label: "About Us", to: "/about" },
  { label: "Courses", to: "/courses" },
  { label: "Internships & Projects", to: "/internships" },
  { label: "Corporate Training", to: "/corporate" },
  { label: "Placement / Career", to: "/placement" },
  { label: "Resources", to: "/resources" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar({ onEnquire }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full left-0 right-0 bg-white/95 backdrop-blur-md text-[#0A1A4D] border-b border-slate-200/80 select-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-all">
      {/* Top Information Strip (Phone, Email, Socials) - Teal */}
      <div className="w-full bg-[#0A7C8C] text-white text-[10.5px] sm:text-[12px] font-medium border-b border-teal-700/40 shadow-xs">
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 py-1.5 flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          {/* Contact Numbers & Emails */}
          <div className="flex items-center gap-2.5 sm:gap-5 lg:gap-6 shrink-0 flex-wrap">
            <a
              href="tel:+917873489364"
              className="flex items-center gap-1 sm:gap-1.5 text-white hover:text-slate-200 transition-colors whitespace-nowrap"
            >
              <FaPhoneAlt className="text-[9px] sm:text-[11px] rotate-12 text-white" />
              <span>+91 7873489364</span>
            </a>
            <a
              href="tel:+919078419012"
              className="hidden md:flex items-center gap-1.5 text-white hover:text-slate-200 transition-colors whitespace-nowrap"
            >
              <FaPhoneAlt className="text-[10px] sm:text-[11px] rotate-12 text-white" />
              <span>+91 9078419012</span>
            </a>
            <a
              href="mailto:training@envistream.org"
              className="flex items-center gap-1 sm:gap-1.5 text-white hover:text-slate-200 transition-colors whitespace-nowrap"
            >
              <FaEnvelope className="text-[10px] sm:text-[12px] text-white" />
              <span>training@envistream.org</span>
            </a>
            <a
              href="mailto:internshipenvistream@gmail.com"
              className="hidden xl:flex items-center gap-1.5 text-white hover:text-slate-200 transition-colors whitespace-nowrap"
            >
              <FaEnvelope className="text-[11px] sm:text-[12px] text-white" />
              <span>internshipenvistream@gmail.com</span>
            </a>
          </div>

                                         
          {/* Social Media Links */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a
              href="https://www.facebook.com/EnvistreamEduskill/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-white hover:text-slate-200 transition-transform hover:scale-110"
            >
              <FaFacebookF className="text-white text-[12px] sm:text-[13px]" />
            </a>
            <a
              href="https://www.instagram.com/envistreameduskill/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-white hover:text-slate-200 transition-transform hover:scale-110"
            >
              <FaInstagram className="text-white text-[12px] sm:text-[13px]" />
            </a>
            <a
              href="https://www.linkedin.com/company/envistream-eduskill/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-white hover:text-slate-200 transition-transform hover:scale-110"
            >
              <FaLinkedinIn className="text-white text-[12px] sm:text-[13px]" />
                        </a>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between h-20 sm:h-24 md:h-26 gap-4 py-2">
        {/* Left Side: Brand Logo (Prominent, Left-Aligned & Clean Background) */}
        <Logo
          dark={false}
          className="shrink-0 py-1"
          imgClassName="h-14 sm:h-16 md:h-20 lg:h-22 w-auto object-contain block transition-transform duration-300 group-hover:scale-105"
        />

        {/* Center: Features Shown in a Horizontal Line (Desktop) with Rich Hover Animation & Courses Dropdown */}
        <nav className="hidden xl:flex items-center gap-1 2xl:gap-2" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isCourses = item.to === "/courses";

            if (isCourses) {
              return (
                <div
                  key={item.label}
                  className="relative group/courses"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setMegaOpen(false)}
                                          className={({ isActive }) =>
                      `relative px-3.5 py-2 rounded-xl text-[14px] 2xl:text-[15px] font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? "text-[#EA580C] bg-orange-50 font-black shadow-xs ring-1 ring-orange-300"
                          : "text-[#0A1A4A] hover:text-[#EA580C] hover:bg-orange-50/80 hover:-translate-y-0.5"
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    <FiChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        megaOpen ? "rotate-180 text-[#EA580C]" : "text-[#0A1A4D] group-hover/courses:text-[#EA580C]"
                      }`}
                    />
                  </NavLink>

                  {/* Mega Menu Dropdown Panel */}
                  {megaOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/3 pt-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <MegaPanel onNavigate={() => setMegaOpen(false)} />
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.to}
                                className={({ isActive }) =>
                  `relative px-3.5 py-2 rounded-xl text-[14px] 2xl:text-[15px] font-bold transition-all duration-200 whitespace-nowrap flex items-center ${
                    isActive
                      ? "text-white bg-[#0A7C8C] font-black shadow-xs ring-1 ring-teal-300"
                      : "text-[#0A1A4D] hover:text-[#EA580C] hover:bg-orange-50 hover:-translate-y-0.5"
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

                {/* Right Side: Log In & Register Now CTA */}
        <div className="hidden lg:flex items-center gap-3 2xl:gap-4 shrink-0">
          <Link
            to="/contact"
            className="px-4 py-2 text-xs sm:text-sm font-bold rounded-lg border border-teal-300 text-[#0A1A4D] hover:text-[#EA580C] hover:bg-orange-50 inline-flex items-center gap-1.5 transition-all shadow-xs"
          >
            <FiLogIn size={14} className="text-[#0A1A4D]" />
            <span>Log In</span>
          </Link>

          {/* Vibrant Orange Register Now Button */}
          <button
            onClick={() => onEnquire?.("Navbar Register Now")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#EA580C] hover:opacity-95 text-white text-xs sm:text-sm font-black shadow-lg shadow-orange-500/35 hover:shadow-orange-500/50 inline-flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
          >
            <span>Register Now</span>
            <FiArrowRight size={14} />
          </button>

          {/* Download Brochure Button */}
          <a
            href="https://www.envistream.org/assets/envistream-brochure.pdf"
            download
            className="px-4 py-2 rounded-xl border border-[#EA580C] text-[#EA580C] hover:bg-[#EA580C] hover:text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-all hover:scale-105 shadow-xs"
          >
            <FiDownload size={14} />
            <span>Download Brochure</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="xl:hidden w-10 h-10 grid place-items-center rounded-lg border border-slate-200 text-[#08153D] bg-slate-50 hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 py-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-orange-50 text-[#F97316] font-bold border-l-4 border-[#F97316]"
                      : "text-[#08153D] hover:bg-orange-50/70 hover:text-[#F97316] hover:translate-x-1"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-100">
            <div className="flex gap-2.5">
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-2.5 text-center text-xs font-semibold rounded-lg border border-slate-300/80 text-[#08153D] hover:bg-slate-50"
              >
                Log In
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onEnquire?.("Mobile Register Now");
                }}
                className="flex-1 py-2.5 text-center text-xs font-bold rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white shadow-md shadow-orange-500/20"
              >
                Register Now →
              </button>
            </div>
            <a
              href="https://www.envistream.org/assets/envistream-brochure.pdf"
              download
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-center text-xs font-bold rounded-lg border border-[#EA580C] text-[#EA580C] hover:bg-[#EA580C] hover:text-white inline-flex items-center justify-center gap-1.5 transition-all"
            >
              <FiDownload size={12} />
              Download Brochure
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
