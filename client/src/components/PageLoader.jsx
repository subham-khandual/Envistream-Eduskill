import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { markBooted, reduced } from "../anim/ui";
import styles from "./pageLoader.module.css";

export default function PageLoader({ onDone }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const progressFillRef = useRef(null);
  const [percent, setPercent] = useState(0);
  const isFinishedRef = useRef(false);

  // Smooth finish and exit transition
  const finishTransition = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    markBooted();
    try {
      window.__lenis?.start();
    } catch {
      /* no smooth scroller */
    }

    const el = rootRef.current;
    if (!el) {
      onDone?.();
      return;
    }

    if (reduced()) {
      onDone?.();
      return;
    }

    // Cinematic Exit Animation: Rings burst & curtain slides upward
    const exitTl = gsap.timeline({
      onComplete: () => {
        onDone?.();
      },
    });

    exitTl
      .to(`.${styles.orbitWrapper}`, {
        scale: 1.25,
        opacity: 0,
        duration: 0.45,
        ease: "power2.in",
      })
      .to(
        `.${styles.mottoContainer}, .${styles.progressSection}`,
        {
          opacity: 0,
          y: -15,
          duration: 0.35,
          ease: "power2.in",
        },
        "-=0.35"
      )
      .to(el, {
        yPercent: -100,
        duration: 0.65,
        ease: "expo.inOut",
      });
  }, [onDone]);

  // Particle Starfield Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles = [];
    const PARTICLE_COUNT = Math.min(50, Math.floor(window.innerWidth / 25));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        color:
          i % 3 === 0
            ? "rgba(0, 240, 255, "
            : i % 3 === 1
            ? "rgba(249, 115, 22, "
            : "rgba(255, 255, 255, ",
        alpha: Math.random() * 0.7 + 0.2,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: (Math.random() - 0.5) * 0.45,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = Math.max(0.1, Math.min(0.9, p.alpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Main Intro Sequence & Progress Counter
  useEffect(() => {
    try {
      window.__lenis?.stop();
    } catch {
      /* no smooth scroller */
    }

    if (reduced()) {
      finishTransition();
      return undefined;
    }

    // Animate stage entrance
    const introTl = gsap.timeline();
    introTl
      .fromTo(
        `.${styles.orbitWrapper}`,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.4)" }
      )
      .fromTo(
        `.${styles.mottoContainer}`,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        `.${styles.progressSection}`,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
        "-=0.2"
      );

    // Dynamic progress bar loading from 0 to 100
    const progressObj = { val: 0 };
    const DURATION = 2.4; // 2.4 seconds total intro time

    gsap.to(progressObj, {
      val: 100,
      duration: DURATION,
      ease: "power1.inOut",
      onUpdate: () => {
        const curr = Math.round(progressObj.val);
        setPercent(curr);
        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${curr}%`;
        }
      },
      onComplete: () => {
        finishTransition();
      },
    });

    // Keyboard shortcut to skip intro
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.code === "Space") {
        finishTransition();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      introTl.kill();
    };
  }, [finishTransition]);

  return (
    <div
      ref={rootRef}
      className={styles.transitionWrapper}
      aria-label="Envistream EduSkill Opening Presentation"
    >
      {/* Background Cyber Grid */}
      <div className={styles.cyberGrid} />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Ambient Glowing Orbs */}
      <div className={styles.glowCyan} />
      <div className={styles.glowOrange} />

      {/* Skip Intro Button */}
      <button
        type="button"
        onClick={finishTransition}
        className={styles.skipBtn}
        title="Press Esc or Click to Skip"
      >
        <span>Skip Intro</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="13"
          height="13"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>

      {/* Center Stage Presentation */}
      <div className={styles.stage}>
        <div className={styles.orbitWrapper}>
          {/* Sonic Pulse Ripples */}
          <div className={styles.ripple} />
          <div className={styles.ripple} />

          {/* SVG Orbital Vector Rings */}
          <svg className={styles.orbitRingSvg} viewBox="0 0 400 400">
            <defs>
              <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="cyanArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="orangeArcGrad" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ff5500" stopOpacity="0.9" />
                <stop offset="65%" stopColor="#ea580c" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff5500" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Outer Cyan Ring (Clockwise Rotation) */}
            <g className={styles.outerRingGroup}>
              {/* Subtle background track */}
              <circle
                cx="200"
                cy="200"
                r="165"
                fill="none"
                stroke="rgba(0, 240, 255, 0.12)"
                strokeWidth="1.5"
                strokeDasharray="4 8"
              />
              {/* Radiant Arc */}
              <circle
                cx="200"
                cy="200"
                r="165"
                fill="none"
                stroke="url(#cyanArcGrad)"
                strokeWidth="2.5"
                strokeDasharray="260 780"
                strokeLinecap="round"
                filter="url(#cyanGlow)"
              />
              {/* Orbiting Comet Head */}
              <circle
                cx="365"
                cy="200"
                r="4.5"
                fill="#00f0ff"
                filter="url(#cyanGlow)"
              />
            </g>

            {/* Inner Orange Ring (Counter-Clockwise Rotation) */}
            <g className={styles.innerRingGroup}>
              {/* Subtle background track */}
              <circle
                cx="200"
                cy="200"
                r="135"
                fill="none"
                stroke="rgba(255, 107, 0, 0.14)"
                strokeWidth="1.5"
                strokeDasharray="6 10"
              />
              {/* Radiant Arc */}
              <circle
                cx="200"
                cy="200"
                r="135"
                fill="none"
                stroke="url(#orangeArcGrad)"
                strokeWidth="2.5"
                strokeDasharray="210 640"
                strokeLinecap="round"
                filter="url(#orangeGlow)"
              />
              {/* Orbiting Node Head */}
              <circle
                cx="65"
                cy="200"
                r="4"
                fill="#f97316"
                filter="url(#orangeGlow)"
              />
            </g>
          </svg>

          {/* Center Logo Showcase */}
          <div className={styles.logoWrapper}>
            <div className={styles.logoPill}>
              <div className={styles.shimmerBar} />
              <img
                src="/logo.png"
                alt="Envistream EduSkill"
                className={styles.logoImg}
              />
            </div>
          </div>
        </div>

        {/* Brand Motto & Slogan */}
        <div className={styles.mottoContainer}>
          <div className={styles.brandEyebrow}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
            Empowering Tech Leaders
          </div>
          <span className={styles.mottoText}>
            To earn more, you must learn more
          </span>
        </div>

        {/* Progress Bar & Status Meta */}
        <div className={styles.progressSection}>
          <div className={styles.progressTrack}>
            <div ref={progressFillRef} className={styles.progressFill} />
          </div>
          <div className={styles.progressMeta}>
            <span>INITIALIZING...</span>
            <span className={styles.progressPercent}>{percent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
