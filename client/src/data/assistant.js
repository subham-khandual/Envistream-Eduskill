/**
 * Eduskill AI Assistant Brain
 * Rule-based, context-grounded in Envistream EduSkill data.
 */

export const QUICK_REPLIES = [
  "Explore Courses",
  "Internship Batches",
  "Testing & Cypress",
  "AI & GenAI",
  "Fee & 0% EMIs",
  "Verify Certificate"
];

export function getAnswer(input) {
  const q = String(input || "").toLowerCase();
  const has = (...ws) => ws.some((w) => q.includes(w));

  if (has("counsell", "call back", "callback", "talk", "human", "advisor", "admission"))
    return { text: "Our senior technical counsellor will call you back within 24 hours with a personalized curriculum roadmap.", action: "counsellor" };
  if (has("fee", "emi", "price", "cost", "payment", "installment"))
    return { text: "Career programs start from ₹14,999 with 0% interest monthly EMI options available via UPI, cards, and net banking." };
  if (has("test", "qa", "selenium", "cypress", "automation"))
    return { text: "Our Software Testing & Cypress track covers STLC, Selenium WebDriver in Java/JS, TestNG, Postman API testing, and Cypress E2E automation with live projects.", link: ["/courses/software-testing-automation", "View Testing Track"] };
  if (has("sap", "erp", "fico", "mm", "sd"))
    return { text: "Our ERP & SAP program covers SAP S/4HANA architecture, FICO, MM, SD business cycles, and automated SAP quality testing.", link: ["/courses/erp-sap-training", "View SAP Track"] };
  if (has("ai", "ml", "genai", "llm", "rag", "artificial"))
    return { text: "The AI & GenAI Master Program covers Python, PyTorch, RAG vector pipelines, and autonomous AI agents with 8 production capstones.", link: ["/courses/artificial-intelligence", "View AI Program"] };
  if (has("mern", "full stack", "react", "node", "javascript", "frontend", "backend"))
    return { text: "Full Stack Development covers React.js, Node.js, Express, MongoDB, Tailwind CSS, REST APIs, and cloud deployments.", link: ["/courses/full-stack-development", "View Full Stack Track"] };
  if (has("python", "django", "fastapi"))
    return { text: "Python Programming takes you from beginner syntax to OOP, web scraping with BeautifulSoup, and REST APIs with FastAPI.", link: ["/courses/python-programming", "View Python Track"] };
  if (has("market", "seo", "aeo", "geo", "digital marketing", "bba", "mba", "ads"))
    return { text: "Our Digital Marketing & AEO track trains you to rank on ChatGPT, Perplexity, and Google AI Overviews alongside Meta & Google Ads.", link: ["/courses/digital-marketing-aeo", "View Digital Marketing"] };
  if (has("intern", "project", "stipend", "duration"))
    return { text: "We offer 4, 8, and 12-week mentor-led internships across AI, Web Dev, Python, QA Testing, and Marketing with weekly code reviews.", link: ["/internships", "Explore Internships"] };
  if (has("place", "job", "career", "salary", "hiring", "package"))
    return { text: "Our placement cell provides ATS resume rewriting, 1-on-1 technical mock interviews, and direct referral drives with 120+ hiring partners.", link: ["/placement", "View Placement Program"] };
  if (has("certificate", "verify", "verification", "check"))
    return { text: "Every certificate carries a unique encrypted ID verifiable by employers worldwide on our instant Verification Portal.", link: ["/verify", "Verify a Certificate"] };
  if (has("corporate", "company", "b2b", "hr", "training for", "mou", "college", "partner"))
    return { text: "We partner with colleges for student internship MoUs & FDPs, and provide corporate upskilling in GenAI, QA, and Cloud.", link: ["/partner", "Partner With Us"] };
  if (has("address", "location", "office", "bhubaneswar", "where", "visit"))
    return { text: "Our Innovation Lab and Head Office is located at Plot-N6/454, 2nd floor, Saffire Building, Opposite- Crown Hotel, IRC Village, Nayapalli, Bhubaneswar, Odisha.", link: ["/contact", "Contact & Location"] };
  if (has("hi", "hello", "hey", "namaste"))
    return { text: "Hello! How can I help you? Ask about our courses, live internship batches, fees, or certificate verification." };

  return { text: "I can help with courses, live internships, syllabus details, placement assistance, and certificate verification. Choose an option below or ask any question!" };
}

export const GREETING = {
  from: "bot",
  text: "Hello! I'm the Envistream AI Advisor. Ask me about courses, internship batches, fees, or placements.",
};
