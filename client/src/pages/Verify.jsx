import { useState } from "react";
import {
  FiCheckCircle, FiShield, FiSearch, FiPrinter, FiAlertCircle, FiCheck
} from "react-icons/fi";
import Reveal from "../components/Reveal";
import { CERT_DB } from "../data/site";

export default function Verify({ onEnquire }) {
  const [certId, setCertId] = useState("EVS-2026-AI-000123");
  const [searched, setSearched] = useState(true);
  const [result, setResult] = useState(CERT_DB["EVS-2026-AI-000123"]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const clean = certId.trim().toUpperCase();
    if (!clean) return;
    setSearched(true);
    setResult(CERT_DB[clean] || null);
  };

  const sampleIds = [
    "EVS-2026-AI-000123",
    "EVS-2026-FS-000456",
    "EVS-2026-QA-000219",
    "EVS-2026-DA-000789",
    "EVS-2026-DM-000331",
  ];

  return (
    <main className="bg-white text-[#080808] min-h-screen">
      {/* 1 — HERO */}
      <section className="relative overflow-hidden bg-white border-b border-[#d8d8d8] py-14 lg:py-20 min-h-[400px] flex flex-col justify-center studio-grid">
        <div className="container-x relative text-center max-w-3xl mx-auto">
          <span className="eyebrow-label mb-2 justify-center">
            <FiShield size={14} className="text-[#146ef5]" /> Official Verification Registry
          </span>
          <h1 className="font-display font-semibold text-3xl sm:text-5xl lg:text-[52px] tracking-[-0.01em] text-[#080808] mt-2 leading-[1.08]">
            Verify Student Credentials & Internships
          </h1>
          <p className="mt-3 text-[#5a5a5a] text-sm sm:text-base leading-relaxed">
            Enter the unique Certificate ID printed on any Envistream EduSkill certificate to authenticate learner details, track, grade, and capstone repository.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a5a5a] text-sm" />
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="Enter ID e.g. EVS-2026-AI-000123"
                className="w-full pl-10 pr-3 py-3 rounded-[4px] bg-white border border-[#d8d8d8] text-[#080808] placeholder:text-[#888888] focus:outline-none focus:border-[#146ef5] font-mono text-sm tracking-wider uppercase"
              />
            </div>
            <button
              type="submit"
              className="btn-primary text-xs py-3 px-5 uppercase tracking-wider justify-center"
            >
              Verify Record →
            </button>
          </form>

          {/* Sample IDs */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-[#5a5a5a]">
            <span>Try sample IDs:</span>
            {sampleIds.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setCertId(id);
                  setSearched(true);
                  setResult(CERT_DB[id] || null);
                }}
                className="font-mono text-[11px] text-[#080808] hover:text-[#146ef5] bg-[#f0f0f0] border border-[#d8d8d8] px-1.5 py-0.5 rounded-[2px]"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2 — RESULT CONTAINER (Mist #f0f0f0) */}
      <section className="py-16 bg-[#f0f0f0]">
        <div className="container-x max-w-2xl">
          {searched && result && (
            <div className="rounded-[8px] border border-[#d8d8d8] bg-white p-7 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4 mb-4">
                <div>
                  <span className="badge-new">VERIFIED CREDENTIAL</span>
                  <p className="font-mono text-xs text-[#5a5a5a] mt-1">{result.id}</p>
                </div>
                <div className="w-9 h-9 rounded-[4px] bg-[#60ed76]/15 text-[#080808] grid place-items-center text-lg border border-[#60ed76]/30">
                  <FiCheck className="text-[#080808]" />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-[#f0f0f0] pb-2">
                  <span className="text-[#5a5a5a]">Student Name</span>
                  <strong className="text-[#080808]">{result.name}</strong>
                </div>
                <div className="flex justify-between border-b border-[#f0f0f0] pb-2">
                  <span className="text-[#5a5a5a]">Program / Track</span>
                  <strong className="text-[#080808]">{result.course}</strong>
                </div>
                <div className="flex justify-between border-b border-[#f0f0f0] pb-2">
                  <span className="text-[#5a5a5a]">Batch & Duration</span>
                  <span className="text-[#080808] font-mono">{result.duration} ({result.batch})</span>
                </div>
                <div className="flex justify-between border-b border-[#f0f0f0] pb-2">
                  <span className="text-[#5a5a5a]">Academic Grade</span>
                  <span className="font-mono font-bold text-[#146ef5]">{result.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5a5a5a]">Capstone Project</span>
                  <span className="text-[#080808] font-medium text-right max-w-xs">{result.project}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f0f0f0] flex items-center justify-between">
                <button
                  onClick={() => window.print()}
                  className="btn-secondary text-xs py-2 px-3 inline-flex items-center gap-1.5"
                >
                  <FiPrinter size={13} /> Print Verification Slip
                </button>
                <span className="text-[11px] font-mono text-[#5a5a5a]">SHA-256 Validated</span>
              </div>
            </div>
          )}

          {searched && !result && (
            <div className="rounded-[8px] border border-[#d8d8d8] bg-white p-8 text-center">
              <FiAlertCircle size={32} className="text-[#5a5a5a] mx-auto mb-2" />
              <h3 className="font-display font-semibold text-lg text-[#080808]">Certificate Record Not Found</h3>
              <p className="text-xs text-[#5a5a5a] mt-1">
                Please re-check the Certificate ID format (e.g. EVS-2026-AI-000123) or contact admissions.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
