import { useEffect, useRef } from "react";
import { reduced } from "../anim/ui";

/**
 * Transparent orange/gray tech backdrop: slow-drifting particles (orange/gray,
 * low opacity) with slight mouse response + a slow moving light beam.
 * Canvas 2D is used deliberately over Three.js here — cheaper, sharper
 * for tiny particles, and the content stays the focus.
 */
export default function HeroBackdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let raf = 0;
    const N = 70;
    const dots = [];
    for (let i = 0; i < N; i += 1) {
      dots.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.6 + 0.4,
        s: Math.random() * 0.0006 + 0.0002,
        o: Math.random() * 0.45 + 0.12,
        teal: Math.random() > 0.55,
      });
    }
    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let mx = 0.5;
    let my = 0.5;
    let tx = 0.5;
    let ty = 0.5;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      if (r.width === 0) return;
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const px = (d.x + (mx - 0.5) * 0.035 * d.r) * w;
        const py = (d.y + (my - 0.5) * 0.035 * d.r) * h;
        ctx.beginPath();
        ctx.arc(px, py, d.r, 0, 6.2832);
        ctx.fillStyle = d.teal
          ? `rgba(236,72,153,${d.o})`
          : `rgba(148,163,184,${d.o})`;
        ctx.fill();
      }
    };

    if (reduced()) {
      draw();
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMove);
      };
    }

    const loop = () => {
      mx += (tx - mx) * 0.03;
      my += (ty - my) * 0.03;
      for (const d of dots) {
        d.y -= d.s;
        if (d.y < -0.02) {
          d.y = 1.02;
          d.x = Math.random();
        }
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <canvas ref={ref} className="absolute inset-0" aria-hidden />
      <div className="beam" aria-hidden />
    </>
  );
}
