import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reduced } from "../anim/ui";

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal — professional scroll entrance.
 * Fades + rises with expo.out, subtle settle scale, no layout shift.
 * Backward compatible: <Reveal delay y className as>.
 */
export default function Reveal({ children, delay = 0, y = 36, className = "", as: Tag = "div" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduced()) {
      gsap.set(el, { clearProps: "all", opacity: 1 });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, scale: 0.985 },
        {
          autoAlpha: 1, y: 0, scale: 1, duration: 1, delay, ease: "expo.out",
          overwrite: "auto",
          scrollTrigger: { trigger: el, start: "top 88%", once: true, invalidateOnRefresh: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [delay, y]);
  return <Tag ref={ref} className={className} style={{ opacity: 0 }}>{children}</Tag>;
}
