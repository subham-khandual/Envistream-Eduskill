import { FiShield, FiPhone, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function AnnouncementBanner() {
  return (
    <div className="bg-[#08153D] text-white text-xs py-2 px-4 border-b border-white/10 select-none">
      <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left tagline with orange dot */}
        <p className="text-slate-200 font-medium tracking-normal text-center sm:text-left text-[12px] sm:text-[12.5px] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F97316] shrink-0 inline-block" />
          <span>Admissions open — 2026 batches · Internships · Corporate training</span>
        </p>

        {/* Right actions: Verify Certificate, Phone & Partner With Us */}
        <div className="flex items-center gap-4 sm:gap-6 text-slate-300 text-[12px]">
          <Link
            to="/verify"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <FiShield size={13} className="text-blue-300 shrink-0" />
            <span>Verify Certificate</span>
          </Link>

          <a
            href="tel:+919654453935"
            className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <FiPhone size={13} className="text-blue-300 shrink-0" />
            <span>+91 96544 53935</span>
          </a>

          <Link
            to="/partner"
            className="flex items-center gap-1 text-white hover:text-orange-400 font-bold transition-colors"
          >
            <span>Partner With Us</span>
            <FiArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
