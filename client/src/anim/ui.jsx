import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const isFirstBoot = () => true;
export const markBooted = () => {
  /* Transition can replay on every page refresh */
};

/**
 * Subtle magnetic pull for important CTAs. Desktop (fine pointer) only,
 * max ~6px displacement, smooth return. Wrapper keeps its own transform
 * so inner Tailwind hover classes never conflict.
 */
export function Magnetic({ children, strength = 6, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !finePointer()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    const RANGE = 90;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < RANGE) {
        const f = (1 - dist / RANGE) * strength;
        xTo((dx / dist) * f);
        yTo((dy / dist) * f);
      } else {
        xTo(0);
        yTo(0);
      }
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    window.addEventListener("mousemove", move, { passive: true });
    el.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);
  return (
    <span ref={ref} className={`inline-flex ${className}`} style={{ willChange: "transform" }}>
      {children}
    </span>
  );
}

/**
 * Scramble-resolve for small labels ONLY (hero badge). Never for headings.
 */
export function Scramble({ text, className = "", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      el.textContent = text;
      return;
    }
    const GLYPHS = "!<>-_\\/[]{}=+*^?#______";
    let raf;
    let frame = 0;
    const t0 = performance.now() + delay * 1000;
    const tick = (now) => {
      if (now < t0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      frame += 1;
      const reveal = Math.floor(frame / 2);
      let out = "";
      for (let i = 0; i < text.length; i += 1) {
        const c = text[i];
        if (c === " " || c === "·") out += c;
        else if (i < reveal) out += c;
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
      if (reveal <= text.length) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };
    el.textContent = "";
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay]);
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}

/**
 * Subtle masked image/panel reveal on scroll (left→right or bottom→top).
 */
export function MaskReveal({ children, className = "", from = "left" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: from === "left" ? "inset(0 100% 0 0)" : "inset(100% 0 0 0)" },
        {
          clipPath: from === "left" ? "inset(0 0% 0 0)" : "inset(0% 0 0 0)",
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [from]);
  return (
    <div ref={ref} className={className} style={{ willChange: "clip-path" }}>
      {children}
    </div>
  );
}

/**
 * Parallax — professional scroll-linked drift (scrub).
 * speed: percent of own height to travel (positive = sinks as you scroll).
 * Wraps content; never affects layout (transform only).
 */
export function Parallax({ children, speed = 10, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed / 2 },
        {
          yPercent: speed / 2,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1, invalidateOnRefresh: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [speed]);
  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

/**
 * Stagger — professional grouped entrance.
 * Direct children rise in with a tight expo stagger on scroll enter.
 */
export function Stagger({ children, className = "", stagger = 0.09, y = 34 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduced()) {
      gsap.set(el.children, { clearProps: "all" });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children,
        { autoAlpha: 0, y, scale: 0.985 },
        {
          autoAlpha: 1, y: 0, scale: 1, duration: 0.95, stagger, ease: "expo.out", overwrite: "auto",
          scrollTrigger: { trigger: el, start: "top 86%", once: true, invalidateOnRefresh: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [stagger, y]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * useHeroIntro — cinematic hero timeline (professional studio standard).
 * Plays once the loader lifts (booted === true):
 *  badge drops in → headline lines mask up (stagger) → para rises →
 *  CTAs pop in stagger → visual clip-reveals with settle zoom →
 *  ambient glows breathe in. Then a scrub parallax takes over the visual.
 */
export function useHeroIntro(scopeRef, booted = true) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || !booted) return undefined;
    if (reduced()) {
      gsap.set(scope.querySelectorAll(".hero-badge, .hero-para, .hero-pop, #hero-visual, .hero-glow"), { clearProps: "all", opacity: 1 });
      gsap.set(scope.querySelectorAll(".hl-line"), { y: "0%" });
      gsap.set(scope.querySelectorAll(".hero-cta > *"), { clearProps: "all", opacity: 1 });
      return undefined;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.08 });
      tl.fromTo(".hero-badge", { autoAlpha: 0, y: -18, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 })
        .to(".hl-line", { y: "0%", duration: 1.15, stagger: 0.12 }, "-=0.35")
        .fromTo(".hero-para", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.75")
        .fromTo(".hero-cta > *", { autoAlpha: 0, y: 22, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1 }, "-=0.65")
        .fromTo(
          "#hero-visual",
          { autoAlpha: 0, y: 44, scale: 0.96, clipPath: "inset(6% 4% 6% 4% round 24px)" },
          { autoAlpha: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.25 },
          "-=0.9"
        )
        .to(".hero-glow", { opacity: 1, duration: 1.4, stagger: 0.15 }, "-=1.0");
      if (scope.querySelectorAll(".hero-pop").length) {
        tl.fromTo(".hero-pop", { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.08 }, "-=1.1");
      }
      // Gentle scroll parallax on the visual once the intro lands.
      gsap.to("#hero-visual-inner", {
        yPercent: 7, ease: "none",
        scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 1, invalidateOnRefresh: true },
      });
      gsap.to(".hero-glow", {
        yPercent: -18, ease: "none", stagger: 0.05,
        scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 1.2, invalidateOnRefresh: true },
      });
    }, scopeRef);
    return () => ctx.revert();
  }, [scopeRef, booted]);
}
