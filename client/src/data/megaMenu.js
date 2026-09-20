/**
 * Dynamic Course Mega-Menu Database
 * ---------------------------------
 * Mirrors the backend shape so the frontend never needs code changes
 * when admin adds categories / courses:
 *
 * CourseCategory { id, name, slug, description, icon, displayOrder, isActive }
 * Course { id, categoryId, name, slug, shortDescription, description, duration,
 *          mode, level, technologies, image, isFeatured, isActive, displayOrder, menuVisible, menuUrl }
 */

export const COURSE_CATEGORIES = [
  { id: "cat-ai", name: "AI & Emerging Tech", slug: "artificial-intelligence", description: "AI, GenAI, ML, Deep Learning, NLP, Vision & Agents", icon: "Ai", displayOrder: 1, isActive: true,
    hue: { soft: "bg-blue-600/10", text: "text-blue-600", solid: "bg-blue-600", border: "hover:border-blue-500", glow: "hover:shadow-[0_20px_50px_-20px_rgba(37,99,235,.4)]", hoverText: "group-hover:text-blue-600" } },
  { id: "cat-qa", name: "Testing & QA Automation", slug: "software-testing-automation", description: "Manual Testing, Selenium, Cypress, API Testing, Jira", icon: "Qa", displayOrder: 2, isActive: true,
    hue: { soft: "bg-indigo-600/10", text: "text-indigo-600", solid: "bg-indigo-600", border: "hover:border-indigo-500", glow: "hover:shadow-[0_20px_50px_-20px_rgba(79,70,229,.4)]", hoverText: "group-hover:text-indigo-600" } },
  { id: "cat-fullstack", name: "Full Stack Web Dev", slug: "full-stack-development", description: "MERN, MEAN, Java, Python, PHP, .NET", icon: "Fs", displayOrder: 3, isActive: true,
    hue: { soft: "bg-orange-500/10", text: "text-orange-500", solid: "bg-orange-500", border: "hover:border-orange-400", glow: "hover:shadow-[0_20px_50px_-20px_rgba(249,115,22,.4)]", hoverText: "group-hover:text-orange-500" } },
  { id: "cat-data", name: "Data Science & Analytics", slug: "data-science-analytics", description: "Data Science, Analytics, SQL, Power BI, Excel", icon: "Ds", displayOrder: 4, isActive: true,
    hue: { soft: "bg-cyan-500/10", text: "text-cyan-600", solid: "bg-cyan-600", border: "hover:border-cyan-400", glow: "hover:shadow-[0_20px_50px_-20px_rgba(6,182,212,.4)]", hoverText: "group-hover:text-cyan-600" } },
  { id: "cat-sap", name: "ERP & SAP Training", slug: "erp-sap-training", description: "SAP FICO, SAP MM, SAP SD, SAP Testing & ERP", icon: "Erp", displayOrder: 5, isActive: true,
    hue: { soft: "bg-purple-600/10", text: "text-purple-600", solid: "bg-purple-600", border: "hover:border-purple-500", glow: "hover:shadow-[0_20px_50px_-20px_rgba(147,51,234,.4)]", hoverText: "group-hover:text-purple-600" } },
  { id: "cat-cyber", name: "Cybersecurity & Cloud", slug: "cybersecurity", description: "Ethical Hacking, Pentesting, SOC, AWS, Azure, DevOps", icon: "Cs", displayOrder: 6, isActive: true,
    hue: { soft: "bg-emerald-500/10", text: "text-emerald-600", solid: "bg-emerald-600", border: "hover:border-emerald-400", glow: "hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,.4)]", hoverText: "group-hover:text-emerald-600" } },
  { id: "cat-prog", name: "Programming & DSA", slug: "python-programming", description: "Python, Java, C++, JavaScript, TypeScript, DSA", icon: "Pg", displayOrder: 7, isActive: true,
    hue: { soft: "bg-blue-500/10", text: "text-blue-500", solid: "bg-blue-500", border: "hover:border-blue-400", glow: "hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,.4)]", hoverText: "group-hover:text-blue-500" } },
  { id: "cat-marketing", name: "Digital Marketing & AEO", slug: "digital-marketing-aeo", description: "SEO, AEO/GEO, Meta/Google Ads, Social Media, Lead Gen", icon: "Dm", displayOrder: 8, isActive: true,
    hue: { soft: "bg-amber-500/10", text: "text-amber-600", solid: "bg-amber-500", border: "hover:border-amber-400", glow: "hover:shadow-[0_20px_50px_-20px_rgba(245,158,11,.4)]", hoverText: "group-hover:text-amber-600" } },
];

export const MENU_COURSES = [
  // ---------- ARTIFICIAL INTELLIGENCE ----------
  { id: "ai-01", categoryId: "cat-ai", name: "Artificial Intelligence & GenAI", slug: "artificial-intelligence", shortDescription: "Master AI foundations, neural networks, LLMs & AI Agents.", duration: "6 Months", mode: "Online + Offline", level: "Beginner to Advanced", technologies: ["Python", "PyTorch", "LangChain", "RAG"], isFeatured: true, isActive: true, menuVisible: true, displayOrder: 1 },
  { id: "ai-02", categoryId: "cat-ai", name: "Generative AI & LLMs", slug: "generative-ai-llm", shortDescription: "Learn modern generative AI models, APIs and applications.", duration: "4 Months", mode: "Online Live", level: "Intermediate", technologies: ["OpenAI", "LangChain", "RAG"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 2 },
  { id: "ai-03", categoryId: "cat-ai", name: "Machine Learning", slug: "machine-learning", shortDescription: "Build predictive models using Python and ML algorithms.", duration: "5 Months", mode: "Online + Offline", level: "Beginner to Advanced", technologies: ["Scikit-learn", "XGBoost"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 3 },
  { id: "ai-04", categoryId: "cat-ai", name: "Deep Learning & Vision", slug: "deep-learning", shortDescription: "Learn neural networks, CNNs, RNNs and modern DL architectures.", duration: "4 Months", mode: "Online Live", level: "Intermediate", technologies: ["TensorFlow", "PyTorch", "Keras"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 4 },

  // ---------- TESTING & QA ----------
  { id: "qa-01", categoryId: "cat-qa", name: "Software Testing & QA Automation", slug: "software-testing-automation", shortDescription: "Manual testing, STLC, Selenium WebDriver, TestNG & Postman.", duration: "4 Months", mode: "Online + Offline", level: "Beginner", technologies: ["Selenium", "Java", "TestNG", "Postman"], isFeatured: true, isActive: true, menuVisible: true, displayOrder: 1 },
  { id: "qa-02", categoryId: "cat-qa", name: "Cypress & Modern Web Testing", slug: "cypress-automation", shortDescription: "Next-gen web testing with JavaScript, TypeScript & Cypress.", duration: "3 Months", mode: "Online Live", level: "Intermediate", technologies: ["Cypress", "JavaScript", "E2E"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 2 },
  { id: "qa-03", categoryId: "cat-qa", name: "API Testing with Postman & RestAssured", slug: "api-testing", shortDescription: "Automated REST API testing, mock servers & CI/CD runs.", duration: "2 Months", mode: "Online Live", level: "Intermediate", technologies: ["Postman", "RestAssured", "JSON"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 3 },

  // ---------- FULL STACK ----------
  { id: "fs-01", categoryId: "cat-fullstack", name: "Full Stack Development (MERN)", slug: "full-stack-development", shortDescription: "MongoDB + Express.js + React.js + Node.js + Tailwind CSS", duration: "7 Months", mode: "Online + Offline", level: "Beginner to Advanced", technologies: ["React", "Node.js", "MongoDB", "Express"], isFeatured: true, isActive: true, menuVisible: true, displayOrder: 1 },
  { id: "fs-02", categoryId: "cat-fullstack", name: "Java Full Stack Development", slug: "java-full-stack", shortDescription: "Java 17 + Spring Boot + React + PostgreSQL", duration: "7 Months", mode: "Online + Offline", level: "Beginner to Advanced", technologies: ["Java", "Spring Boot", "React", "PostgreSQL"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 2 },
  { id: "fs-03", categoryId: "cat-fullstack", name: "Web Development (Frontend)", slug: "web-development", shortDescription: "Modern responsive web interfaces with HTML5, CSS3, Tailwind & GSAP.", duration: "4 Months", mode: "Online + Offline", level: "Beginner", technologies: ["HTML", "Tailwind", "JavaScript", "GSAP"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 3 },

  // ---------- DATA SCIENCE & ANALYTICS ----------
  { id: "da-01", categoryId: "cat-data", name: "Data Science & Analytics", slug: "data-science-analytics", shortDescription: "SQL, Excel, Power BI, Python Pandas & business storytelling.", duration: "5 Months", mode: "Online Live", level: "Beginner to Intermediate", technologies: ["SQL", "Power BI", "Python", "Pandas"], isFeatured: true, isActive: true, menuVisible: true, displayOrder: 1 },
  { id: "da-02", categoryId: "cat-data", name: "Data Engineering", slug: "data-engineering", shortDescription: "Pipelines, Spark, Airflow, Kafka & cloud data platforms.", duration: "6 Months", mode: "Online Live", level: "Intermediate", technologies: ["Spark", "Airflow", "Kafka", "SQL"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 2 },
  { id: "da-03", categoryId: "cat-data", name: "Power BI & Business Analytics", slug: "power-bi", shortDescription: "DAX formulas, interactive KPI dashboards & executive reporting.", duration: "2 Months", mode: "Online Live", level: "Beginner", technologies: ["Power BI", "DAX", "SQL"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 3 },

  // ---------- ERP & SAP ----------
  { id: "sap-01", categoryId: "cat-sap", name: "ERP & SAP Functional/Testing", slug: "erp-sap-training", shortDescription: "SAP Architecture, FICO, MM, SD & automated SAP testing.", duration: "5 Months", mode: "Online + Offline", level: "Beginner to Intermediate", technologies: ["SAP S/4HANA", "FICO", "MM", "SD"], isFeatured: true, isActive: true, menuVisible: true, displayOrder: 1 },
  { id: "sap-02", categoryId: "cat-sap", name: "SAP FICO (Financials & Controlling)", slug: "sap-fico", shortDescription: "General ledger, accounts payable/receivable, asset accounting.", duration: "3 Months", mode: "Online Live", level: "Intermediate", technologies: ["SAP FICO", "GL", "AP/AR"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 2 },

  // ---------- CYBERSECURITY & CLOUD ----------
  { id: "cb-01", categoryId: "cat-cyber", name: "Cybersecurity & Ethical Hacking", slug: "cybersecurity", shortDescription: "Network security, web pentesting, Linux & SOC defense.", duration: "6 Months", mode: "Online Live", level: "Beginner to Advanced", technologies: ["Kali Linux", "Burp Suite", "Splunk", "OWASP"], isFeatured: true, isActive: true, menuVisible: true, displayOrder: 1 },
  { id: "cb-02", categoryId: "cat-cyber", name: "AWS Cloud & DevOps Engineering", slug: "cloud-computing", shortDescription: "AWS EC2, S3, Docker, Kubernetes, CI/CD with GitHub Actions.", duration: "4 Months", mode: "Online Live", level: "Intermediate", technologies: ["AWS", "Docker", "Kubernetes", "CI/CD"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 2 },
  { id: "cb-03", categoryId: "cat-cyber", name: "Cloud Computing", slug: "cloud-computing", shortDescription: "Cloud models, services & architecture basics.", duration: "2 Months", mode: "Online Live", level: "Beginner", technologies: ["Cloud Models", "IaaS/PaaS", "Virtualization"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 3 },
  { id: "cb-04", categoryId: "cat-cyber", name: "AWS Solutions Architect", slug: "cloud-computing", shortDescription: "EC2, S3, IAM, VPC & solutions architect path.", duration: "3 Months", mode: "Online Live", level: "Intermediate", technologies: ["EC2", "S3", "Lambda", "IAM"], isFeatured: true, isActive: true, menuVisible: true, displayOrder: 4 },
  { id: "cb-05", categoryId: "cat-cyber", name: "Microsoft Azure", slug: "cloud-computing", shortDescription: "Azure services, AZ-104 & AZ-900 prep.", duration: "3 Months", mode: "Online Live", level: "Intermediate", technologies: ["Azure VMs", "Blob", "Entra ID"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 5 },
  { id: "cb-06", categoryId: "cat-cyber", name: "Google Cloud (GCP)", slug: "cloud-computing", shortDescription: "GCP core services & data on cloud.", duration: "2.5 Months", mode: "Online Live", level: "Intermediate", technologies: ["Compute Engine", "BigQuery", "IAM"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 6 },
  { id: "cb-07", categoryId: "cat-cyber", name: "DevOps Engineering", slug: "cloud-computing", shortDescription: "Git, Linux, CI/CD & SRE practices.", duration: "4 Months", mode: "Online Live", level: "Intermediate", technologies: ["Git", "Linux", "Jenkins", "Ansible"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 7 },
  { id: "cb-08", categoryId: "cat-cyber", name: "Docker Containerization", slug: "cloud-computing", shortDescription: "Containers, images & compose mastery.", duration: "1 Month", mode: "Online Live", level: "Beginner", technologies: ["Dockerfiles", "Compose", "Registry"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 8 },
  { id: "cb-09", categoryId: "cat-cyber", name: "Kubernetes (K8s)", slug: "cloud-computing", shortDescription: "Pods, deployments, helm & production K8s.", duration: "2 Months", mode: "Online Live", level: "Advanced", technologies: ["Pods", "Ingress", "Helm", "Cluster"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 9 },
  { id: "cb-10", categoryId: "cat-cyber", name: "CI/CD Pipelines", slug: "cloud-computing", shortDescription: "Pipelines with GitHub Actions & Jenkins.", duration: "1.5 Months", mode: "Online Live", level: "Intermediate", technologies: ["GitHub Actions", "Jenkins", "Workflows"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 10 },

  // ---------- PROGRAMMING ----------
  { id: "pg-01", categoryId: "cat-prog", name: "Python Programming & Automation", slug: "python-programming", shortDescription: "The perfect first language — from zero to automation and APIs.", duration: "3 Months", mode: "Online + Offline", level: "Beginner", technologies: ["Python 3", "OOP", "APIs", "Automation"], isFeatured: true, isActive: true, menuVisible: true, displayOrder: 1 },
  { id: "pg-02", categoryId: "cat-prog", name: "Core & Advanced Java", slug: "java", shortDescription: "Object-oriented programming, Collections, JDBC & multi-threading.", duration: "4 Months", mode: "Online + Offline", level: "Beginner to Intermediate", technologies: ["Java 17", "OOP", "Collections"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 2 },
  { id: "pg-03", categoryId: "cat-prog", name: "Data Structures & Algorithms (DSA)", slug: "dsa", shortDescription: "Arrays, Trees, Graphs, Dynamic Programming for technical interviews.", duration: "4 Months", mode: "Online Live", level: "Intermediate", technologies: ["DSA", "LeetCode", "Algorithms"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 3 },

  // ---------- MARKETING & MANAGEMENT ----------
  { id: "dm-01", categoryId: "cat-marketing", name: "Digital Marketing & AEO/GEO", slug: "digital-marketing-aeo", shortDescription: "SEO, AI Search AEO/GEO, Meta/Google Ads & Analytics.", duration: "4 Months", mode: "Online Live", level: "Beginner Friendly", technologies: ["AEO", "SEO", "Meta Ads", "GA4"], isFeatured: true, isActive: true, menuVisible: true, displayOrder: 1 },
  { id: "dm-02", categoryId: "cat-marketing", name: "Advanced SEO & Search Marketing", slug: "seo-search-marketing", shortDescription: "Technical SEO, Core Web Vitals, authority backlink strategies.", duration: "3 Months", mode: "Online Live", level: "Beginner to Intermediate", technologies: ["Semrush", "GSC", "Ahrefs"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 2 },
  { id: "dm-03", categoryId: "cat-marketing", name: "Social Media & Brand Strategy", slug: "social-media-brand-strategy", shortDescription: "Audience building, creative storytelling & influencer campaigns.", duration: "3 Months", mode: "Online Live", level: "Beginner Friendly", technologies: ["Instagram", "LinkedIn", "Canva"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 3 },
  { id: "dm-04", categoryId: "cat-marketing", name: "B2B Lead Generation & Sales", slug: "business-development-lead-gen", shortDescription: "Cold outreach, B2B sales funnels, CRM tools & closing deals.", duration: "3 Months", mode: "Online Live", level: "Beginner Friendly", technologies: ["HubSpot", "Apollo.io", "LinkedIn"], isFeatured: false, isActive: true, menuVisible: true, displayOrder: 4 },
];

export const FEATURED_COURSE = {
  badge: "Admissions Open · 2026",
  name: "Artificial Intelligence & GenAI Master Program",
  points: ["Python & ML Foundations", "Generative AI, LLMs & RAG", "AI Agents + Production Capstone"],
  desc: "Master AI foundations, neural networks and LLM applications — with internship, projects and verifiable certification.",
  cta: "Explore Program",
  slug: "artificial-intelligence",
  stats: "6 Months · 8 Projects · Internship",
};

export function getActiveCategories() {
  return COURSE_CATEGORIES.filter((c) => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
}
export function getCategoryBySlug(slug) {
  return COURSE_CATEGORIES.find((c) => c.slug === slug && c.isActive);
}
export function getCategoryById(id) {
  return COURSE_CATEGORIES.find((c) => c.id === id && c.isActive);
}
export function getCoursesByCategory(categoryId) {
  return MENU_COURSES.filter((c) => c.categoryId === categoryId && c.isActive && c.menuVisible !== false).sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
}
export function getCourseBySlug(slug) {
  return MENU_COURSES.find((c) => c.slug === slug && c.isActive);
}
export function getFeaturedCourse() {
  return MENU_COURSES.find((c) => c.isFeatured && c.isActive) || MENU_COURSES[0];
}
export function getFeaturedCourseForCategory(categoryId) {
  const list = getCoursesByCategory(categoryId);
  return list.find((c) => c.isFeatured) || list[0];
}
