import { useRef, useState } from "react";
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from "react-icons/fi";

/**
 * Local site film (`public/hero-film.mp4`) with brand-matched controls.
 * Autoplays muted + loops; visitors can pause or unmute. No YouTube.
 */
export default function LocalFilm({ autoPlay = true, className = "" }) {
  const video = useRef(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div className={`relative h-full w-full bg-slate-900/60 backdrop-blur ${className}`}>
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        src="/hero-film.mp4"
        autoPlay={autoPlay}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" aria-hidden />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause film" : "Play film"}
          className="w-11 h-11 grid place-items-center rounded-full bg-pink-500/90 hover:bg-pink-500 backdrop-blur border border-white/25 text-white shadow-lg transition hover:scale-105"
        >
          {playing ? <FiPause size={17} /> : <FiPlay size={17} className="ml-0.5" />}
        </button>
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute film" : "Mute film"}
          className="w-10 h-10 grid place-items-center rounded-full bg-slate-900/55 backdrop-blur text-white border border-white/20 hover:bg-slate-900/75 transition"
        >
          {muted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
        </button>
      </div>
    </div>
  );
}
