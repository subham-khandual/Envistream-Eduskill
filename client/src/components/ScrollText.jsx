import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reduced } from "../anim/ui";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollText — GSAP word-by-word reveal on scroll.
 * Each word shows in ~0.1s (wordDuration) with a small stagger,
 * so headings pop in fast as you scroll.
 *
 * Usage:
 *   <ScrollText text="Explore our programs" className="..." />
 *   <ScrollText text="Loved across every track" as="h2" />
 */
export default function ScrollText({
  text = "",
  className = "",
  as: Tag = "span",
  delay = 0,
  wordDuration = 0.1,
  stagger = 0.06,
  y = 24,
  start = "top 88%",
  once = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll("[data-word]");
    if (!words.length) return;
    if (reduced()) {
      gsap.set(words, { clearProps: "all" });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { autoAlpha: 0, y, rotateX: -50 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: Math.max(wordDuration, 0.45),
          stagger,
          delay,
          ease: "expo.out",
          overwrite: "auto",
          scrollTrigger: { trigger: el, start, once, invalidateOnRefresh: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [text, delay, wordDuration, stagger, y, start, once]);

  const parts = String(text).split(/(\s+)/);

  return (
    <Tag ref={ref} className={className} style={{ perspective: "600px" }}>
      {parts.map((p, i) =>
        /^\s+$/.test(p) || p === "" ? (
          <span key={i}>{p}</span>
        ) : (
          <span key={i} data-word className="inline-block will-change-transform">
            {p}
          </span>
        )
      )}
    </Tag>
  );
}
