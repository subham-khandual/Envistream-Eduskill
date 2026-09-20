export default function StatsTrustStrip() {
  const STATS = [
    {
      value: "15,000+",
      label: "Learners Trained",
    },
    {
      value: "120+",
      label: "College & Industry Partners",
    },
    {
      value: "50+",
      label: "Expert Mentors",
    },
    {
      value: "4.8/5",
      label: "Average Rating",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-[#BBF7D0] via-[#86EFAC] to-[#BBF7D0] py-8 sm:py-10 border-t border-b border-emerald-400 select-none">
      <div className="container-x">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center justify-between text-center sm:text-left">
          {STATS.map((item, idx) => (
            <div
              key={item.label}
              className={`flex flex-col items-center sm:items-start ${
                idx !== STATS.length - 1 ? "lg:border-r lg:border-emerald-200/70 lg:pr-6" : ""
              }`}
            >
              <div className="font-display font-black text-[#0A1A4A] text-3xl sm:text-4xl lg:text-[40px] leading-tight tracking-tight">
                {item.value}
              </div>
              <div className="text-slate-600 text-xs sm:text-sm font-medium mt-1 leading-snug">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
