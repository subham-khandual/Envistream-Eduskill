import { useState } from "react";
import { FiCode, FiVideo, FiCheck, FiLayers, FiMaximize2, FiMonitor, FiTablet, FiSmartphone, FiTerminal, FiPlay } from "react-icons/fi";
import LocalFilm from "./LocalFilm";

export default function BrowserMockup({ className = "" }) {
  const [activeMode, setActiveMode] = useState("inspector"); // default to interactive inspector for immediate eye-catchy wow factor!
  const [selectedElement, setSelectedElement] = useState("ai");
  const [deviceMode, setDeviceMode] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'

  const elements = [
    {
      id: "ai",
      tag: "<AI.NeuralRAG>",
      color: "#146ef5",
      track: "Artificial Intelligence & GenAI",
      metrics: "48ms Inference · PyTorch & Ollama",
      code: `const agent = new NeuralPipeline({\n  model: "llama-3-8b",\n  embeddings: "text-embedding-3",\n  ragStore: "pgvector"\n});`,
      accentClass: "text-[#146ef5]",
    },
    {
      id: "fullstack",
      tag: "<FullStack.MERN>",
      color: "#60ed76",
      track: "Production MERN Architecture",
      metrics: "Next.js 15 SSR · Tailwind · Docker",
      code: `export default async function Page() {\n  const session = await auth();\n  const telemetry = await db.query();\n  return <Dashboard data={telemetry} />;\n}`,
      accentClass: "text-[#146ef5]",
    },
    {
      id: "qa",
      tag: "<Cypress.E2E>",
      color: "#ffa666",
      track: "QA Test Automation & CI/CD",
      metrics: "128 Automated Tests · 0 Flaky Specs",
      code: `describe("Checkout Pipeline", () => {\n  it("verifies payment webhook", () => {\n    cy.intercept("/api/pay").as("pay");\n    cy.get("[data-test=submit]").click();\n  });\n});`,
      accentClass: "text-[#146ef5]",
    },
    {
      id: "growth",
      tag: "<Growth.AEO>",
      color: "#146ef5",
      track: "Answer Engine Optimization",
      metrics: "AI Overviews Citation Rate: 94.2%",
      code: `const schema = {\n  "@context": "https://schema.org",\n  "@type": "EducationalOrganization",\n  "name": "Envistream EduSkill"\n};`,
      accentClass: "text-[#146ef5]",
    },
  ];

  const currentEl = elements.find((e) => e.id === selectedElement) || elements[0];

  return (
    <div
      className={`browser-frame bg-white transition-all duration-300 ${className}`}
      style={{
        boxShadow: "rgba(0, 0, 0, 0.04) 0px 54px 30px -10px, rgba(20, 110, 245, 0.12) 0px 0px 40px 0px, rgba(0, 0, 0, 0.08) 0px 20px 25px -5px",
      }}
    >
      {/* 28px Browser Chrome Top Bar */}
      <div className="h-8 bg-[#f0f0f0] border-b border-[#d8d8d8] px-3 flex items-center justify-between select-none">
        {/* 3 Traffic-Light Dots */}
        <div className="flex items-center gap-1.5 w-16">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] border border-[#e0443e]/40 shadow-xs" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] border border-[#d89e24]/40 shadow-xs" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-[#1aab29]/40 shadow-xs" />
        </div>

        {/* Monospace URL Address Bar with Animated Lock & URL */}
        <div className="flex-1 max-w-sm mx-auto flex items-center justify-center">
          <div className="w-full bg-white border border-[#d8d8d8] rounded-[3px] py-0.5 px-3 flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#5a5a5a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#146ef5] animate-pulse" />
            <span className="truncate text-[#080808]">envistream.org/studio/interactive-lab</span>
          </div>
        </div>

        {/* View Switcher: Video vs Live Inspector */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveMode("inspector")}
            title="Interactive Visual Inspector View"
            className={`px-2 py-0.5 text-[10.5px] font-medium rounded-[3px] transition-all flex items-center gap-1 ${
              activeMode === "inspector"
                ? "bg-white text-[#146ef5] border border-[#d8d8d8] shadow-xs font-semibold"
                : "text-[#5a5a5a] hover:text-[#080808]"
            }`}
          >
            <FiCode size={11} /> Live Inspector
          </button>
          <button
            onClick={() => setActiveMode("film")}
            title="Video Player View"
            className={`px-2 py-0.5 text-[10.5px] font-medium rounded-[3px] transition-all flex items-center gap-1 ${
              activeMode === "film"
                ? "bg-white text-[#080808] border border-[#d8d8d8] shadow-xs font-semibold"
                : "text-[#5a5a5a] hover:text-[#080808]"
            }`}
          >
            <FiVideo size={11} /> Video Film
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative aspect-video bg-[#080808] overflow-hidden">
        {activeMode === "film" ? (
          <div className="relative w-full h-full">
            <LocalFilm />
            <div className="absolute top-3 left-3 bg-[#080808]/75 backdrop-blur border border-white/20 px-2.5 py-1 rounded-[4px] text-[11px] text-white flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-[#60ed76] animate-pulse" />
              <span>Nayapalli Innovation Lab · 4K Studio Preview</span>
            </div>
          </div>
        ) : (
          /* Eye-Catchy Interactive Drafting Table / Visual Inspector Demo */
          <div className="w-full h-full bg-[#ffffff] studio-grid flex flex-col select-none text-[#080808]">
            {/* Inspector Ribbon */}
            <div className="h-9 border-b border-[#d8d8d8] bg-[#fcfcfc] px-3.5 flex items-center justify-between text-[11.5px] font-mono">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#146ef5]">STUDIO_CANVAS</span>
                <span className="text-[#d8d8d8]">|</span>
                <span className="text-[#080808] font-bold">{currentEl.tag}</span>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-[#5a5a5a]">
                <span>viewport: <strong className="text-[#080808] font-mono">1200px</strong></span>
                <span>accent: <strong className="text-[#146ef5] font-mono">#146ef5</strong></span>
              </div>
            </div>

            {/* Interactive Workspace Canvas */}
            <div className="flex-1 p-3.5 sm:p-5 grid grid-cols-1 sm:grid-cols-[1.1fr_210px] gap-4 items-center">
              {/* Left Canvas Preview */}
              <div className="h-full border border-[#d8d8d8] rounded-[6px] p-4 bg-white flex flex-col justify-between shadow-[rgba(0,0,0,0.02)_0px_8px_16px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#146ef5]/5 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#146ef5] animate-pulse" />
                      <span className="text-xs font-bold text-[#080808]">{currentEl.track}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#146ef5] bg-[#146ef5]/10 border border-[#146ef5]/20 px-2 py-0.5 rounded-[3px] font-semibold">
                      LIVE COMPONENT
                    </span>
                  </div>

                  {/* Code Editor Snippet Display */}
                  <div className="mt-3 bg-[#080808] rounded-[4px] p-3 text-white font-mono text-[11.5px] leading-relaxed overflow-hidden border border-[#292929]">
                    <div className="flex items-center justify-between text-[10px] text-[#bdbdbd] border-b border-[#222222] pb-1.5 mb-2">
                      <span>production_module.ts</span>
                      <span className="text-[#60ed76]">✔ compiled</span>
                    </div>
                    <pre className="text-[#e5e5e5] overflow-x-auto whitespace-pre-wrap">
                      <code>{currentEl.code}</code>
                    </pre>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#f0f0f0] flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[#5a5a5a]">
                    {currentEl.metrics}
                  </span>
                  <span className="badge-new text-[10px]">
                    INSPECTED
                  </span>
                </div>
              </div>

              {/* Right DOM / Layer Tree */}
              <div className="h-full border border-[#d8d8d8] rounded-[6px] bg-[#fcfcfc] p-3 flex flex-col justify-between text-[11.5px] font-mono">
                <div>
                  <div className="text-[10.5px] uppercase font-bold text-[#5a5a5a] tracking-wider mb-2 flex items-center justify-between">
                    <span>Curriculum Layers</span>
                    <span className="text-[#146ef5]">4 Tracks</span>
                  </div>
                  <div className="space-y-1.5">
                    {elements.map((el) => (
                      <button
                        key={el.id}
                        onClick={() => setSelectedElement(el.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-[4px] text-[11.5px] flex items-center justify-between transition-all ${
                          selectedElement === el.id
                            ? "bg-[#146ef5] text-white font-semibold shadow-xs"
                            : "text-[#080808] bg-white border border-[#d8d8d8] hover:border-[#146ef5]"
                        }`}
                      >
                        <span className="truncate">{el.tag}</span>
                        {selectedElement === el.id && <FiCheck size={12} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#d8d8d8] text-[10px] text-[#5a5a5a] flex items-center justify-between">
                  <span>Drafting Standard</span>
                  <span className="font-semibold text-[#146ef5]">Interactive</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
