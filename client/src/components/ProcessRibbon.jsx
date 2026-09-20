import { FiBookOpen, FiCode, FiBriefcase, FiAward, FiUser, FiArrowRight } from "react-icons/fi";

const STEPS = [
  {
    icon: FiBookOpen,
    title: "LEARN",
    subtitle: "Industry Courses",
  },
  {
    icon: FiCode,
    title: "BUILD",
    subtitle: "Real Projects",
  },
  {
    icon: FiBriefcase,
    title: "INTERN",
    subtitle: "Gain Experience",
  },
  {
    icon: FiAward,
    title: "CERTIFY",
    subtitle: "Get Certified",
  },
  {
    icon: FiUser,
    title: "GET HIRED",
    subtitle: "Kickstart Career",
  },
];

export default function ProcessRibbon() {
  return (
    <section className="bg-gradient-to-r from-[#0F3BD4] via-[#1D4ED8] to-[#0A2EA8] text-white py-6 shadow-md select-none">
      <div className="container-x">
        <div className="flex flex-wrap items-center justify-between gap-4 lg:gap-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === STEPS.length - 1;

            return (
              <div key={step.title} className="flex items-center gap-3 md:gap-5 flex-1 min-w-[150px] justify-center lg:justify-start">
                <div className="flex items-center gap-3">
                  {/* Circular White Badge with Dark Icon */}
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white text-[#1D4ED8] flex items-center justify-center shadow-md shrink-0">
                    <Icon size={20} strokeWidth={2.5} />
                  </div>

                  {/* Title and Subtitle */}
                  <div>
                    <h3 className="font-display font-extrabold text-white text-[14px] md:text-[15px] tracking-wide leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-blue-100 text-[11px] md:text-[12px] font-medium leading-tight mt-0.5 whitespace-nowrap">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                {/* Arrow to next step */}
                {!isLast && (
                  <div className="hidden xl:flex items-center text-blue-300/70 ml-auto pr-2">
                    <FiArrowRight size={18} />
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
