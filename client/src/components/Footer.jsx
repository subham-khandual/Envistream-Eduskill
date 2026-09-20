import { Link } from "react-router-dom";
import {
  FiFacebook, FiInstagram, FiLinkedin, FiYoutube, FiTwitter,
  FiMail, FiPhone, FiMapPin, FiArrowRight, FiShield
} from "react-icons/fi";
import Logo from "./Logo";
import FooterMap from "./FooterMap";

export default function Footer({ onEnquire }) {
  return (
    <footer className="bg-gradient-to-b from-[#181b20] via-[#131518] to-[#0c0d0f] text-slate-300 relative overflow-hidden border-t border-slate-800">
      {/* Subtle neutral ambient glows */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-x relative py-8 sm:py-10 grid lg:grid-cols-[1.2fr_.8fr_1fr] gap-8 lg:gap-10 items-start">
        {/* Brand & Address */}
        <div>
          <Logo dark />
          <p className="mt-3 text-[12.5px] sm:text-[13px] text-slate-400 leading-relaxed max-w-sm">
            Envistream Smartech Pvt. Ltd. delivers industry-ready training, live capstone internships, and verified credentials across engineering and modern management tracks.
          </p>

          <ul className="mt-4 space-y-2 text-[12.5px] text-slate-300">
            <li className="flex items-start gap-2">
              <FiMapPin className="text-sky-400 mt-0.5 shrink-0 text-sm" />
              <span>Plot-N6/454, 2nd floor, Saffire Building, Opp. Crown Hotel, IRC Village, Nayapalli, Bhubaneswar</span>
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-sky-400 shrink-0 text-sm" />
              <a href="mailto:training@envistream.org" className="text-slate-300 hover:text-white transition-colors">
                training@envistream.org / info@envistream.org
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="text-sky-400 shrink-0 text-sm" />
              <a href="tel:+917873489364" className="text-slate-300 hover:text-white transition-colors">
                +91 7873489364 / +91 9078419012
              </a>
            </li>
          </ul>

          <div className="flex gap-1.5 mt-4">
            {[
              { Icon: FiLinkedin, href: "https://www.linkedin.com/company/envistream-eduskill/", label: "LinkedIn" },
              { Icon: FiInstagram, href: "https://www.instagram.com/envistreameduskill/", label: "Instagram" },
              { Icon: FiYoutube, href: "https://www.youtube.com/@EnvistreamEduskill", label: "YouTube" },
              { Icon: FiFacebook, href: "https://www.facebook.com/EnvistreamEduskill/", label: "Facebook" },
              { Icon: FiTwitter, href: "https://twitter.com", label: "Twitter" },
            ].map(({ Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-8 h-8 grid place-items-center rounded-md bg-[#20242c] border border-[#2f3542] hover:bg-[#2f3542] hover:text-white hover:border-slate-500 transition-all text-slate-300 shadow-sm"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-semibold text-white text-[12px] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            Navigation
          </h4>
          <ul className="space-y-1.5 text-[12.5px] text-slate-400">
            <li><Link to="/courses" className="hover:text-white hover:translate-x-1 inline-block transition-all">All Career Programs</Link></li>
            <li><Link to="/internships" className="hover:text-white hover:translate-x-1 inline-block transition-all">Internships & Live Projects</Link></li>
            <li><Link to="/placement" className="hover:text-white hover:translate-x-1 inline-block transition-all">Placement Assistance</Link></li>
            <li><Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all">About Envistream</Link></li>
            <li><Link to="/resources" className="hover:text-white hover:translate-x-1 inline-block transition-all">Resources & Knowledge Hub</Link></li>
            <li><Link to="/partner" className="hover:text-white hover:translate-x-1 inline-block transition-all">College & Corporate MoUs</Link></li>
            <li><Link to="/verify" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all"><FiShield className="text-[#34D399]" /> Certificate Verification</Link></li>
            <li><Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all">Contact & Counselling</Link></li>
          </ul>
        </div>

        {/* Google Map of Campus Location using Leaflet */}
        <FooterMap />
      </div>

      <div className="border-t border-[#1f232a] py-3.5 bg-[#0a0b0d]">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>© 2026 Envistream Smartech Pvt. Ltd. · envistream.org · All rights reserved.</p>
          <p className="font-medium text-slate-300">Learn. Build. Get Industry Ready.</p>
        </div>
      </div>
    </footer>
  );
}

