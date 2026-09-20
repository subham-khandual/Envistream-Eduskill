import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EnquiryModal from "./components/EnquiryModal";
import ChatbotPopup from "./components/ChatbotPopup";
import PageLoader from "./components/PageLoader";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Internships from "./pages/Internships";
import Placement from "./pages/Placement";
import Verify from "./pages/Verify";
import Contact from "./pages/Contact";
import PartnerCorporate from "./pages/PartnerCorporate";
import Resources from "./pages/Resources";
import Placeholder from "./pages/Placeholder";
import { isFirstBoot, reduced } from "./anim/ui";

gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    try {
      if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);
  return null;
}

function NotFound() {
  return (
    <main className="container-x py-24 text-center font-poppins bg-slate-50 min-h-[60vh] flex flex-col items-center justify-center">
      <p className="text-xs font-bold uppercase tracking-widest text-orange-500">404 Error</p>
      <h1 className="font-display font-extrabold text-4xl text-slate-900 mt-2">Page Not Found</h1>
      <p className="text-slate-500 text-sm mt-2 max-w-md">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn-primary mt-6 text-xs uppercase tracking-wider">Back to Home</Link>
    </main>
  );
}

function Shell() {
  const [modal, setModal] = useState(false);
  const [course, setCourse] = useState("");
  const [booted, setBooted] = useState(false);
  const openEnquire = useCallback((c = "") => { setCourse(c || ""); setModal(true); }, []);

  // Fluid, controlled smooth scroll (Lenis) kept in sync with ScrollTrigger.
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const t = setTimeout(() => ScrollTrigger.refresh(), 800);
    if (reduced()) {
      return () => {
        window.removeEventListener("load", onLoad);
        clearTimeout(t);
      };
    }
    let lenis = null;
    let raf = null;
    try {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      raf = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    } catch {
      window.__lenis = null;
    }
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(t);
      if (raf) gsap.ticker.remove(raf);
      try {
        lenis?.destroy();
      } catch {
        /* noop */
      }
      window.__lenis = null;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#080808] relative">
      {!booted && <PageLoader onDone={() => setBooted(true)} />}
      <ScrollToTop />
      <Navbar onEnquire={() => openEnquire()} booted={booted} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home onEnquire={openEnquire} booted={booted} />} />
          <Route path="/about" element={<About onEnquire={openEnquire} />} />
          <Route path="/courses" element={<Courses onEnquire={openEnquire} />} />
          <Route path="/courses/:slug" element={<CourseDetail onEnquire={openEnquire} />} />
          <Route path="/internships" element={<Internships onEnquire={openEnquire} />} />
          <Route path="/projects" element={<Internships onEnquire={openEnquire} />} />
          <Route path="/placement" element={<Placement onEnquire={openEnquire} />} />
          <Route path="/verify" element={<Verify onEnquire={openEnquire} />} />
          <Route path="/contact" element={<Contact onEnquire={openEnquire} />} />
          <Route path="/partner" element={<PartnerCorporate onEnquire={openEnquire} />} />
          <Route path="/corporate" element={<PartnerCorporate onEnquire={openEnquire} />} />
          <Route path="/resources" element={<Resources onEnquire={openEnquire} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer onEnquire={() => openEnquire()} />
      <EnquiryModal open={modal} course={course} onClose={() => setModal(false)} />
      <ChatbotPopup onEnquire={openEnquire} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
