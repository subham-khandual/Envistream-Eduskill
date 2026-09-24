import { findBestQaMatch } from "./chatbotQa.js";

export const QUICK_REPLIES = [
  "Explore Courses",
  "Internship Batches",
  "Testing & Cypress",
  "AI & GenAI",
  "Fee & 0% EMIs",
];

export function getAnswer(input) {
  const q = String(input || "").toLowerCase().trim();
  if (!q) {
    return { text: "Hello! How can I help you? Ask about our courses, live internship batches, fees, or certificate verification." };
  }

  // 1. Try finding a direct match from the official Q&A dataset first
  const qaMatch = findBestQaMatch(input);
  if (qaMatch) {
    return { text: qaMatch.answer };
  }

  const has = (...ws) => ws.some((w) => q.includes(w));

  if (has("counsell", "call back", "callback", "talk", "human", "advisor", "admission"))
    return { text: "Our senior technical counsellor will call you back within 24 hours with a personalized curriculum roadmap.", action: "counsellor" };
  if (has("fee", "emi", "price", "cost", "payment", "installment"))
    return { text: "Career programs start from ₹14,999 with 0% interest monthly EMI options available via UPI, cards, and net banking." };
  if (has("test", "qa", "selenium", "cypress", "automation"))
    return { text: "Envistream provides Software Testing training covering Manual Testing and Automation Testing, plus modern Cypress E2E automation with live projects.", link: ["/courses/software-testing-automation", "View Testing Track"] };
  if (has("sap", "erp", "fico", "mm", "sd", "abap", "pp", "hr"))
    return { text: "Envistream offers SAP training in SAP SD, SAP FICO, SAP MM, SAP PP, SAP HR, and SAP ABAP with real-time practical implementation guidance.", link: ["/courses/erp-sap-training", "View SAP Track"] };
  if (has("ai", "ml", "genai", "llm", "rag", "artificial", "machine learning"))
    return { text: "We offer comprehensive AI, Machine Learning, and Generative AI guidance covering Python, data processing, LLMs, prompt engineering, and building production chatbots.", link: ["/courses/artificial-intelligence", "View AI Program"] };
  if (has("mern", "full stack", "react", "node", "javascript", "frontend", "backend"))
    return { text: "Full-Stack Node.js and React.js training covers building modern web applications using React.js for the frontend and Node.js-based technologies for backend development.", link: ["/courses/full-stack-development", "View Full Stack Track"] };
  if (has("python", "django", "fastapi"))
    return { text: "Python Programming takes you from fundamental syntax to data analysis with NumPy & Pandas, web development, and machine learning algorithms.", link: ["/courses/python-programming", "View Python Track"] };
  if (has("market", "seo", "aeo", "geo", "digital marketing", "bba", "mba", "ads", "lead gen", "business development"))
    return { text: "Envistream offers management and business programs including Digital Marketing, SEO, Social Media Marketing, Market Research, Business Development, and Lead Generation.", link: ["/courses/digital-marketing-aeo", "View Digital Marketing"] };
  if (has("intern", "stipend", "duration", "bput", "aicte"))
    return { text: "Envistream provides training and internship programs designed to align with the new AICTE and BPUT model syllabus for final-year students, combining practical learning with live projects.", link: ["/internships", "Explore Internships"] };
  if (has("place", "job", "career", "salary", "hiring", "package", "interview"))
    return { text: "Envistream provides dedicated Technical Placement Assistance and a Campus Placement Program, including technical workshops, intensive HR prep, and mock interviews with external panels and HR professionals.", link: ["/placement", "View Placement Program"] };
  if (has("timing", "hour", "open", "close", "sunday", "saturday"))
    return { text: "Envistream is open Monday through Saturday from 9:00 AM to 8:00 PM." };
  if (has("lab", "facility", "practice", "doubt"))
    return { text: "Envistream provides 24x7 lab facilities for students to practice beyond regular training sessions, alongside Daily Doubt Clearing Classes." };
  if (has("certificate", "verify", "verification", "check"))
    return { text: "Every certificate carries a unique encrypted ID. Please contact our admissions team for certificate verification assistance." };
  if (has("corporate", "company", "b2b", "hr", "training for", "mou", "college", "partner"))
    return { text: "We partner with colleges for student internship MoUs & FDPs, and provide corporate upskilling in GenAI, QA, and Cloud.", link: ["/partner", "Partner With Us"] };
  if (has("address", "location", "office", "bhubaneswar", "where", "visit"))
    return { text: "Envistream Eduskill is located at Plot-N6/454, 2nd Floor, Saffire Building, opposite Crown Hotel, IRC Village, Nayapalli, Bhubaneswar.", link: ["/contact", "Contact & Location"] };
  if (has("hi", "hello", "hey", "namaste"))
    return { text: "Hello! Welcome to Envistream EduSkill. How can I help you with courses, internships, projects, or career guidance?" };

  return { text: "I can help with courses, live internships, syllabus details, placement assistance, and certificate verification. Choose an option below or ask any question!" };
}

export const GREETING = {
  from: "bot",
  text: "Hello! I'm Sayraa, your Envistream EduSkill AI assistant. Ask me about courses, internship batches, fees, or placements.",
};
