import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FiExternalLink, FiNavigation } from "react-icons/fi";

const LAT = 20.2924;
const LNG = 85.8188;
const GOOGLE_MAPS_URL =
  "https://www.google.com/maps?q=Plot-N6%2F454%2C+2nd+floor%2C+Saffire+Building%2C+Opposite-+Crown+Hotel%2C+IRC+Village%2C+Nayapalli%2C+Bhubaneswar%2C+Odisha&ll=20.2924,85.8188&z=17";

export default function FooterMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const openGoogleMaps = () => {
    window.open(GOOGLE_MAPS_URL, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Initialize Leaflet Map centered on Saffire Building / Crown Hotel Nayapalli
    const map = L.map(mapContainerRef.current, {
      center: [LAT, LNG],
      zoom: 16,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Google Maps Roadmap tile layer via Leaflet
    L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      attribution: "© Google Maps",
    }).addTo(map);

    // Custom Brand Beacon Marker Icon
    const customIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <span style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(249, 115, 22, 0.45); animation: mapPulse 1.8s infinite ease-out;"></span>
          <span style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(29, 78, 216, 0.65); animation: mapPulse 1.8s infinite 0.6s ease-out;"></span>
          <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #1D4ED8 0%, #0F2468 100%); border: 2.5px solid #FFFFFF; box-shadow: 0 4px 14px rgba(0,0,0,0.6); display: grid; place-items: center; z-index: 5;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -22],
    });

    // Create Pin & Popup
    const marker = L.marker([LAT, LNG], { icon: customIcon }).addTo(map);

    const popupContent = `
      <div style="font-family: 'Inter', sans-serif; padding: 4px 2px; color: #0F172A; min-width: 190px;">
        <strong style="font-size: 13px; color: #1D4ED8; display: block; margin-bottom: 2px;">Envistream EduSkill</strong>
        <p style="font-size: 11px; color: #475569; line-height: 1.35; margin: 0 0 6px 0;">
          Plot-N6/454, 2nd Flr, Saffire Bldg<br/>
          Opp. Crown Hotel, IRC Village, Nayapalli
        </p>
        <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: #EA580C;">
          Click to View on Google Maps &rarr;
        </span>
      </div>
    `;

    marker.bindPopup(popupContent).openPopup();

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="rounded-xl border border-[#2d323b] bg-gradient-to-br from-[#1f232a]/95 via-[#181b21]/90 to-[#121418]/95 backdrop-blur-md overflow-hidden text-white shadow-xl shadow-black/40 flex flex-col">
      {/* Location Card Header */}
      <div className="p-3 pb-2 border-b border-[#2d323b] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
              Campus Location
            </span>
          </div>
          <h4 className="font-display font-bold text-white text-xs leading-snug">
            Bhubaneswar Training Center
          </h4>
        </div>
        <button
          type="button"
          onClick={openGoogleMaps}
          title="Open in Google Maps"
          className="p-1 rounded bg-[#252a33] text-slate-300 hover:text-white hover:bg-[#323945] border border-[#373e4d] transition-all cursor-pointer"
        >
          <FiExternalLink size={13} />
        </button>
      </div>

      {/* Leaflet Google Map with Direct Click-to-Open Action */}
      <div
        onClick={openGoogleMaps}
        className="relative w-full h-[130px] sm:h-[145px] bg-[#0f172a] cursor-pointer group overflow-hidden"
        title="Click to open this location in Google Maps"
      >
        <div ref={mapContainerRef} className="w-full h-full z-0 pointer-events-none" />

        {/* Hover Click Hint Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-blue-950/20 transition-all z-10 flex items-center justify-center pointer-events-none">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-full border border-sky-400/40 shadow-xl flex items-center gap-1 transform translate-y-1 group-hover:translate-y-0 duration-200">
            <span>Open in Maps</span>
            <FiExternalLink size={10} className="text-sky-400" />
          </span>
        </div>

        {/* Top-Right Pill Badge */}
        <div className="absolute top-2 right-2 z-20 bg-slate-900/90 text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/15 shadow-lg backdrop-blur-sm flex items-center gap-1.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Google Maps</span>
        </div>
      </div>

      {/* Footer Address Info & Navigation CTA */}
      <div className="p-2.5 bg-[#14161a] border-t border-[#252a33] flex flex-col gap-1.5">
        <p className="text-[11px] text-slate-300 leading-tight">
          Plot-N6/454, 2nd Flr, Saffire Bldg, Opp. Crown Hotel, Nayapalli, Bhubaneswar
        </p>
        <button
          type="button"
          onClick={openGoogleMaps}
          className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-2.5 rounded-md bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-[11px] tracking-wide shadow-sm transition-all text-center cursor-pointer border-none"
        >
          <FiNavigation size={11} />
          <span>Open in Google Maps</span>
        </button>
      </div>

      {/* Embedded Pulse Animation CSS */}
      <style>{`
        @keyframes mapPulse {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.35);
        }
      `}</style>
    </div>
  );
}
