import { Link } from "react-router-dom";

export default function Logo({ dark = false, className = "", imgClassName = "" }) {
  return (
    <Link
      to="/"
      className={`flex items-center shrink-0 group select-none transition-transform duration-200 hover:scale-[1.02] ${className}`}
      aria-label="Envistream EduSkill Home"
    >
      <img
        src="/logo.png"
        alt="Envistream EduSkill"
        className={imgClassName || "h-8 sm:h-10 w-auto object-contain block"}
      />
    </Link>
  );
}
