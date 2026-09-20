import React from "react";

export const COLLABORATIONS = [
  {
    name: "Tata Consultancy Services (TCS)",
    image: "/images/collaborations/collab_tcs.png",
  },
  {
    name: "Cognizant",
    image: "/images/collaborations/collab_cognizant.png",
  },
  {
    name: "Accenture",
    image: "/images/collaborations/collab_accenture.png",
  },
  {
    name: "Wipro",
    image: "/images/collaborations/collab_wipro.png",
  },
  {
    name: "Genpact",
    image: "/images/collaborations/collab_genpact.png",
  },
  {
    name: "GeekyAnts",
    image: "/images/collaborations/collab_geekyants.png",
  },
  {
    name: "Intellect Design",
    image: "/images/collaborations/collab_intellect.png",
  },
  {
    name: "Qwikcilver",
    image: "/images/collaborations/collab_qwikcilver.png",
  },
  {
    name: "Startup Odisha",
    image: "/images/collaborations/collab_startup_odisha.png",
  },
  {
    name: "Startup India",
    image: "/images/collaborations/collab_startup_india.png",
  },
  {
    name: "PMKVY - Pradhan Mantri Kaushal Vikas Yojana",
    image: "/images/collaborations/collab_pmkvy.png",
  },
  {
    name: "APRI Corporation",
    image: "/images/collaborations/collab_apri.png",
  },
  {
    name: "Technocracy Pte Ltd",
    image: "/images/collaborations/collab_technocracy.png",
  },
  {
    name: "ISO, MSME & GeM Recognitions",
    image: "/images/collaborations/collab_iso_msme_gem.png",
  },
];

export default function CollaborationsSection({ title = "OUR COLLABORATION & ASSOCIATES", className = "" }) {
  return (
    <section className={`py-12 bg-white border-t border-slate-200 overflow-hidden ${className}`}>
      <div className="container-x text-center mb-6">
        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#08153D]">
          {title}
        </p>
      </div>
      <div className="marquee-paused overflow-hidden">
        <div className="animate-marquee flex w-max gap-6 pr-6 items-center">
          {[...COLLABORATIONS, ...COLLABORATIONS].map((item, i) => (
            <div
              key={i}
              className="h-20 min-w-[210px] sm:min-w-[230px] rounded-xl border border-slate-200/90 bg-slate-50/80 px-5 py-2.5 flex items-center justify-center shadow-xs hover:shadow-md hover:bg-white hover:border-blue-400 transition-all group shrink-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="max-h-12 max-w-[180px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
