import Reveal from "./Reveal";
import ScrollText from "./ScrollText";

export default function SectionHeading({ eyebrow, title, sub, center = true, dark = false }) {
  return (
    <Reveal className={`${center ? "text-center mx-auto" : "text-left"} max-w-3xl mb-12`}>
      {eyebrow && (
        <div className="mb-4">
          <span className={`eyebrow-label ${dark ? "text-[#bdbdbd]" : "text-[#5a5a5a]"}`}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className={`font-display font-semibold tracking-[-0.01em] text-3xl sm:text-4xl lg:text-[40px] leading-[1.08] ${
          dark ? "text-white" : "text-[#080808]"
        }`}
      >
        {typeof title === "string" ? (
          <ScrollText text={title} wordDuration={0.08} stagger={0.05} />
        ) : (
          title
        )}
      </h2>
      {sub && (
        <p className={`mt-3 text-[16px] leading-[1.5] ${dark ? "text-[#bdbdbd]" : "text-[#5a5a5a]"}`}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}
