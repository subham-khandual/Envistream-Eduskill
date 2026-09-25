import { findBestQaMatch, OFF_TOPIC_COURSE_REGEX } from "./chatbotQa.js";

export const QUICK_REPLIES = [
  "Explore Courses",
  "Internship Batches",
  "Testing & Cypress",
  "AI & GenAI",
  "Fee & 0% EMIs",
];

// Dedicated regex & matcher for code writing / code generation requests
export const isCodeRequest = (text) => {
  const t = String(text || "").toLowerCase().trim();
  if (!t) return false;

  // Hinglish / Hindi patterns asking to write / create / give code or program
  const hinglishPatterns = [
    /\bcode\s+(?:ek\s+)?(?:likh|bana|de\b|do\b|karo|chahiye|generate|provide)/,
    /\b(?:likh|bana|de\b|generate|karo)\s+.*code\b/,
    /\b(?:ek|koi|kuch|koyi)\s+(?:bhi\s+)?code\b/,
    /\bcode\s+(?:likho|likhiye|likhna|likhdo|likh\s*do|likhkar|likh\s*kar|banao|banaiye|bana\s*do)/,
    /\b(?:program|script)\s+(?:ek\s+)?(?:likh|bana|karo|chahiye|generate|de\b|do\b)/,
    /\b(?:likh|bana)\s+.*(?:program|script)\b/,
    /\b(?:ek|koi|kuch)\s+(?:bhi\s+)?(?:program|script)\b/,
    /\bcoding\s+(?:karo|kardo|kar\s*do|karke\s*do|likho|banao)/,
  ];

  // English patterns asking to write / generate / create code or program
  const englishPatterns = [
    /\b(?:write|give|generate|create|provide)\s+(?:me\s+|us\s+)?(?:a\s+|an\s+|the\s+|some\s+|simple\s+|sample\s+)?(?:[a-z0-9#+-]+\s+)?(?:code|program|script)\b/,
    /\b(?:write|generate|create)\s+(?:a\s+|an\s+)?(?:[a-z0-9#+-]+\s+)?code\b/,
    /\b(?:code|program)\s+(?:to|for)\s+[a-z]+/i,
    /\bcan\s+you\s+(?:write|generate|create|code|program)\b.*(?:code|program|script)/,
    /\b(?:write|type|print)\s+.*code\b/,
  ];

  return hinglishPatterns.some((p) => p.test(t)) || englishPatterns.some((p) => p.test(t));
};

export function getAnswer(input, lang = "hinglish") {
  const q = String(input || "").toLowerCase().trim();
  const isEn = lang === "english";

  if (!q) {
    return isEn
      ? { text: "Hello! How can I help you? Ask about our courses, live internship batches, fees, or certificate verification." }
      : { text: "Hello! Main aapki kya madad kar sakti hoon? Aap courses, internship batches, fees ya certificate verification ke baare mein pooch sakte hain." };
  }

  // 0. Code writing request guard (Envistream AI assistant does not write code)
  if (isCodeRequest(q)) {
    return {
      text: isEn
        ? "I am Envistream EduSkill's AI assistant and I cannot help to write code. I can help you with our training programs, courses, internships, and career guidance! 😊"
        : "Main Envistream EduSkill ki AI assistant hoon aur main code nahi likh sakti. Main aapki training programs, courses, internships aur career guidance mein madad kar sakti hoon! 😊",
    };
  }

  // 0. Off-topic courses check (0ms immediate rejection)
  if (OFF_TOPIC_COURSE_REGEX.test(q)) {
    return {
      text: isEn
        ? "This course is not offered at Envistream EduSkill. We offer IT software training like Web Development, Software Testing (Cypress), Python, Java, SAP/ERP, AI/ML, and Digital Marketing with live internships. 😊"
        : "Ye course Envistream EduSkill ke curriculum mein nahi hai. Hum IT software courses jaise Web Development, Software Testing (Cypress), Python, Java, SAP/ERP, AI/ML aur Digital Marketing with live internships provide karte hain. 😊",
    };
  }

  // 1. Try finding a direct match from the official Q&A dataset first
  const qaMatch = findBestQaMatch(input, lang) || (lang === "english" ? findBestQaMatch(input) : null);
  if (qaMatch) {
    return { text: qaMatch.answer };
  }

  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const has = (...ws) =>
    ws.some((w) => {
      if (w.includes(" ") || w.includes("-") || w.includes("/")) {
        return q.includes(w);
      }
      // Single word of <= 3 chars (like "ai", "ml", "hr", "sd", "pp", "mm", "ui", "qa", "ads", "seo", "geo", "aeo"):
      // MUST match as a whole word with \b to avoid matching inside words like "domain", "html", "three", "application", "leads"
      if (w.length <= 3) {
        return new RegExp(`\\b${escapeRegex(w)}\\b`, "i").test(q);
      }
      // Words > 3 chars: match as word prefix (e.g. "counsell" matches "counsellor", "test" matches "testing")
      return new RegExp(`\\b${escapeRegex(w)}`, "i").test(q);
    });

  // Dedicated Domain Selection / Career Guidance Handler
  // Catches questions like "which domain is better", "which course should I choose", "as a student which domain is better"
  const isNonTech = /\b(non[\s-]?it|not\s+career|non[\s-]?tech|non[\s-]?coding|no\s+coding|beginner|beginners|fresh\s*start|arts|commerce|bcom|bba)\b/i.test(q);

  const isDomainChoiceQuery =
    (/\b(domain|domains|field|fields|track|tracks|stream|streams|branch)\b/i.test(q) &&
      /\b(better|best|choose|select|right|sahi|achha|accha|confused|decide|recommend|suggest|preference|scope|option|options|guidance|karein|chahiye)\b/i.test(q)) ||
    /\b(which|whichi|what)\s+(?:is\s+)?(?:the\s+)?(?:better|best)\s+(?:domain|course|track|field|tech|technology|career)\b/i.test(q) ||
    /\b(which|whichi)\s+(?:domain|course|track|field|tech|technology)\s+(?:is\s+)?(?:better|best|good|recommended|suitable)\b/i.test(q) ||
    /\b(which|whichi)\s+(?:domain|course|track|field)\s+(?:should|can|to)\s+(?:i|we)?\s*(?:choose|take|select|join|learn)\b/i.test(q) ||
    /\b(konsa|kaun\s*sa|kon\s*sa)\s+(?:domain|course|track|field)\s+(?:better|best|achha|accha|sahi|choose|select|lu|le|karein|karna|chahiye)\b/i.test(q) ||
    (/\b(freshers?|beginners?|students?)\b/i.test(q) && /\b(domain|track|field)\b/i.test(q) && /\b(better|best|choose|recommend|start|guidance)\b/i.test(q)) ||
    (/\b(help|guide)\b/i.test(q) && /\b(choose|select|pick)\b/i.test(q) && /\b(domain|course|track)\b/i.test(q)) ||
    (isNonTech && /\b(domain|course|field|track|start|learn|choose)\b/i.test(q));

  if (isDomainChoiceQuery) {
    if (isNonTech) {
      return {
        text: isEn
          ? "If you come from a non-IT, non-technical, or beginner background, you can definitely build a successful IT career! Here is our honest domain guide:\n\n1. 🌟 Software Testing & QA Automation (Top Pick for Non-IT):\n• Minimal heavy coding; focuses on application quality, test cases, and Cypress/Selenium automation.\n• High fresher hiring demand across IT service and product companies.\n\n2. 💼 SAP/ERP Enterprise Modules (FICO, MM, SD):\n• Best for Commerce (B.Com), BBA/MBA, or non-coding students aiming for enterprise consulting.\n• Focuses on corporate business processes and ERP workflows.\n\n3. 📢 Digital Marketing & AEO:\n• 100% zero-coding track covering SEO, AI search optimization, and digital campaigns.\n\n4. 🚀 Full-Stack Web Development / Python:\n• If you are eager to learn programming, our mentors teach from absolute scratch with 1-on-1 doubt sessions.\n\n💡 Summary: For fastest entry with least coding, choose Software Testing! Would you like a free counselling roadmap call? 😊"
          : "Agar aap non-IT, non-technical background se hain ya beginner student hain, toh IT industry mein career banana bilkul possible hai! Yeh honest domain guide aapki help karegi:\n\n1. 🌟 Software Testing & QA Automation (Non-IT ke liye #1 Recommended):\n• Heavy coding ki zaroorat nahi hoti; logic aur bug identification par focus hota hai.\n• IT companies freshers ko QA roles ke liye actively hire karti hain.\n\n2. 💼 SAP/ERP Modules (FICO, MM, SD):\n• Commerce (B.Com), BBA/MBA ya non-coding students ke liye perfect enterprise consulting track.\n• Corporate business workflows aur ERP configuration par focus hota hai.\n\n3. 📢 Digital Marketing & AEO:\n• 100% zero-coding track, SEO, AI search engine optimization aur digital branding ke liye.\n\n4. 🚀 Full-Stack Web Dev / Python:\n• Agar aap coding seekhna chahte hain, toh hamare mentors absolute zero se 1-on-1 guidance ke sath sikhate hain.\n\n💡 Recommendation: Fast entry & kam coding ke liye Software Testing best hai! Kya aap senior counsellor se free roadmap consultation chahte hain? 😊",
        link: ["/courses", isEn ? "Explore All Tracks" : "Sabhi Tracks Dekhein"],
      };
    }

    return {
      text: isEn
        ? "Choosing the right IT domain depends on your interest, skills, and career goals. Here is a breakdown of our top career tracks:\n\n1. 🚀 Full-Stack Web Development (React & Node.js):\n• Focus: React frontend, Node backend, REST APIs, databases & live cloud deployment.\n• Best for: Students who love building web apps, interactive UI, and solving problems.\n• Career roles: Full-Stack Developer, Frontend/Backend Engineer.\n\n2. 🧪 Software Testing & QA Automation (Cypress & Manual):\n• Focus: Manual testing methodologies, test cases, and Cypress/Selenium automation.\n• Best for: Freshers, beginners, or non-IT students looking for quick entry into IT with high hiring demand.\n• Career roles: QA Automation Engineer, Software Test Analyst.\n\n3. 🤖 Python, AI/ML & Data Science:\n• Focus: Python programming, data analytics, Machine Learning models, and GenAI / LLM agents.\n• Best for: Analytical minds, math/engineering graduates, and students passionate about AI innovation.\n• Career roles: AI/ML Engineer, Data Analyst, Python Developer.\n\n4. 🏢 SAP / ERP Enterprise Modules (FICO, MM, SD, ABAP):\n• Focus: Enterprise resource planning, finance, supply chain, and business operations.\n• Best for: Commerce (B.Com), BBA/MBA, or engineering students aiming for enterprise consulting.\n• Career roles: SAP Functional Consultant, ERP Analyst.\n\n5. 📈 Digital Marketing & AEO:\n• Focus: SEO, AI search optimization (AEO), Google Ads, and brand lead generation (zero coding).\n\n💡 Quick Guide:\n• Minimal coding & quick job: Software Testing\n• Build web applications: Full-Stack Web Dev\n• Math, logic & smart tech: Python & AI/ML\n• Enterprise business & finance: SAP/ERP\n\nAll tracks include live industry project internships and placement support. Would you like personalized counselling? 😊"
        : "Right IT domain choose karna aapke interest, background aur career goals par depend karta hai. Yeh guide aapko decide karne mein help karegi:\n\n1. 🚀 Full-Stack Web Development (React & Node.js):\n• Focus: React frontend, Node.js backend, MongoDB, APIs aur live project deployment.\n• Best for: Jo students web apps aur websites build karna pasand karte hain.\n• Scope: High job demand across startups aur IT companies.\n\n2. 🧪 Software Testing & QA Automation (Cypress & Manual):\n• Focus: Bug finding, test case design, aur Cypress/Selenium automated testing.\n• Best for: Freshers, beginners ya non-IT students jo kam coding ke sath IT mein fast placement chahte hain.\n• Scope: Freshers ke liye highest hiring volumes.\n\n3. 🤖 Python, AI/ML & Data Science:\n• Focus: Python coding, Data Science, Machine Learning models aur GenAI / AI agents.\n• Best for: Analytical students jinka interest data, math aur future AI technology mein hai.\n• Scope: High-paying emerging tech roles.\n\n4. 🏢 SAP / ERP Enterprise Modules (FICO, MM, SD, ABAP):\n• Focus: Enterprise business workflows, finance, supply chain aur corporate systems.\n• Best for: Commerce (B.Com), BBA/MBA aur engineering graduates enterprise consulting ke liye.\n• Scope: MNCs mein high-paying consultant roles.\n\n5. 📈 Digital Marketing & AEO:\n• Focus: SEO, AEO (AI Engine Optimization), Google Ads aur growth marketing (zero coding).\n\n💡 Quick Selection Guide:\n• Kam coding & quick placement: Software Testing\n• Websites & web applications: Full-Stack Web Dev\n• Data analysis & future tech: Python & AI/ML\n• Corporate finance & business: SAP/ERP\n\nSabhi tracks mein live project internships aur placement support milta hai. Aap senior counsellor se free roadmap guidance le sakte hain! 😊",
      link: ["/courses", isEn ? "Explore All Courses" : "Sabhi Courses Dekhein"],
    };
  }

  // 0. Intelligent Technology Comparison Handler (e.g. "sap vs ai vs java", "python vs java", etc.)
  const isVsQuery = /\b(vs|versus|difference|compare|comparison|kisme zyada|kaun sa better|kaunsa better|konsa better)\b/i.test(q);

  if (isVsQuery) {
    const hasSap = has("sap", "erp");
    const hasAi = has("ai", "ml", "artificial", "genai", "machine learning");
    const hasJava = has("java");
    const hasPython = has("python");
    const hasTesting = has("test", "qa", "testing", "cypress", "selenium");
    const hasDevOps = has("devops", "ci/cd", "cicd", "docker", "kubernetes", "cloud", "aws", "azure");
    const hasDigital = has("digital", "digital marketing", "marketing", "seo", "aeo", "ads");
    const hasDev = (has("development", "full stack", "mern", "web dev", "web development", "react", "node", "frontend", "backend") || has("dev")) && !hasDevOps;

    // Digital Marketing vs DevOps
    if (hasDigital && hasDevOps) {
      return {
        text: isEn
          ? "• Digital Marketing & AEO: Focuses on search engine optimization (SEO/AEO), online lead generation, brand visibility, and ad campaigns (100% zero-coding track).\n• DevOps & Cloud: Focuses on CI/CD automation pipelines, containerization (Docker, Kubernetes), cloud infrastructure (AWS/Azure), and system reliability (technical and scripting-intensive).\n• Key Difference: Digital Marketing drives customer acquisition and business growth, while DevOps automates software deployment and server infrastructure.\nAt Envistream EduSkill, we provide a dedicated Digital Marketing & AEO career track, and modern CI/CD & deployment fundamentals are integrated into our Full-Stack Web Development program! 😊"
          : "• Digital Marketing & AEO: Online brand growth, SEO/AEO search optimization, social media marketing aur lead generation par focus karta hai (100% zero-coding track).\n• DevOps & Cloud: CI/CD automation pipelines, Docker, Kubernetes aur cloud servers automate karne par focus karta hai (technical aur scripting-intensive track).\n• Main Difference: Digital Marketing business growth aur customer reach badhata hai, jabki DevOps software deployment aur cloud systems manage karta hai.\nEnvistream EduSkill mein Digital Marketing & AEO ka dedicated program available hai, aur CI/CD & cloud deployment hamare Full-Stack Web Development track mein integrated hai! 😊",
        link: ["/courses", isEn ? "Explore Tracks" : "Tracks Dekhein"],
      };
    }

    // Digital Marketing vs Web Dev
    if (hasDigital && hasDev) {
      return {
        text: isEn
          ? "• Full-Stack Web Development: Focuses on coding, software architecture, frontend UI (React.js), and backend APIs/databases (Node.js) to build web applications.\n• Digital Marketing: Focuses on promoting websites and products via SEO/AEO, Google Ads, content strategy, and user growth (zero coding).\n• Choose Web Dev if you love coding and building digital products, or Digital Marketing if you prefer creativity, analytics, and business strategy! 😊"
          : "• Full-Stack Web Development: Coding, software design, frontend (React) aur backend APIs (Node.js) se websites aur apps build karne par focus karta hai.\n• Digital Marketing: Unhi websites aur products ko rank karwane, SEO/AEO, Google Ads aur online audience grow karne par focus karta hai (zero-coding).\nCoding aur apps banane ke liye Web Dev choose karein, aur marketing & branding ke liye Digital Marketing! 😊",
        link: ["/courses", isEn ? "Explore Tracks" : "Tracks Dekhein"],
      };
    }

    // Digital Marketing vs Software Testing
    if (hasDigital && hasTesting) {
      return {
        text: isEn
          ? "• Software Testing (QA): Focuses on application quality, finding bugs, test case design, and Cypress/Selenium automation before software goes live.\n• Digital Marketing: Focuses on post-launch growth — SEO, search engine visibility, brand campaigns, and acquiring customers.\nBoth are great entry points into tech with minimal coding; choose QA for software quality analysis or Digital Marketing for business growth! 😊"
          : "• Software Testing (QA): Software launch hone se pehle uske bugs dhundhne, test cases design karne aur quality assure karne par focus karta hai.\n• Digital Marketing: Product launch hone ke baad uski online reach, SEO, Google Ads aur customers attract karne par focus karta hai.\nDono kam coding ke sath best entry tracks hain; quality testing ke liye QA aur online growth ke liye Digital Marketing choose karein! 😊",
        link: ["/courses", isEn ? "Explore Tracks" : "Tracks Dekhein"],
      };
    }

    // DevOps vs Web Development
    if (hasDevOps && hasDev) {
      return {
        text: isEn
          ? "• Full-Stack Web Development: Builds features, interactive user interfaces, APIs, and databases using React, Node, and Python.\n• DevOps: Builds automated pipelines (CI/CD) to package, test, deploy, monitor, and scale those applications on cloud servers (Docker, Kubernetes, AWS).\nChoose Web Dev if you love creating software features, or DevOps if you love cloud infrastructure and deployment automation! 😊"
          : "• Full-Stack Web Dev: React aur Node.js se web apps, features aur databases build karta hai.\n• DevOps: Unhi applications ko cloud servers (Docker, Kubernetes, AWS) par automatically deploy, test aur scale karne ke liye pipelines banata hai.\nSoftware build karne ke liye Web Dev aur cloud deployment manage karne ke liye DevOps choose karein! 😊",
        link: ["/courses", isEn ? "Explore Tracks" : "Tracks Dekhein"],
      };
    }

    // DevOps vs Software Testing
    if (hasDevOps && hasTesting) {
      return {
        text: isEn
          ? "• Software Testing (QA): Writes test scripts and executes test suites (Cypress, Selenium, TestNG) to verify application functionality and prevent bugs.\n• DevOps: Integrates those test suites into CI/CD pipelines so every code commit is automatically tested and deployed.\nTesting guarantees software quality, while DevOps guarantees fast, automated delivery! 😊"
          : "• Software Testing (QA): Cypress aur Selenium se test scripts likh kar application ke bugs verify karta hai.\n• DevOps: Un test scripts ko automated CI/CD pipelines mein integrate karke code automatically deploy karta hai.\nQA software quality ensure karta hai, aur DevOps automatic delivery pipeline manage karta hai! 😊",
        link: ["/courses", isEn ? "Explore Tracks" : "Tracks Dekhein"],
      };
    }

    // SAP vs AI vs Java
    if (hasSap && hasAi && hasJava) {
      return {
        text: isEn
          ? "• SAP: Enterprise ERP platform for corporate business workflows (Finance, Supply Chain, HR) – ideal for business consultants.\n• AI/ML: Intelligent algorithms, predictive models, and GenAI automation – ideal for data innovation and future tech.\n• Java: Robust backend architecture, scalable microservices, and enterprise applications – ideal for core software engineering.\nChoose Java for software development, AI for data & smart systems, or SAP for enterprise business solutions! 😊"
          : "• SAP: Corporate business workflows (Finance, Supply Chain, HR) ke liye Enterprise ERP platform hai.\n• AI/ML: Intelligent algorithms, predictive models aur GenAI automation ke liye best hai.\n• Java: Enterprise backend architecture, microservices aur software development ke liye top choice hai.\nSoftware dev ke liye Java, smart data ke liye AI, aur corporate consulting ke liye SAP choose karein! 😊",
        link: ["/courses", isEn ? "Explore Tracks" : "Tracks Dekhein"],
      };
    }

    // SAP vs Java
    if (hasSap && hasJava) {
      return {
        text: isEn
          ? "• SAP: Manages enterprise business processes (ERP like FICO, MM, SD) for corporate clients.\n• Java: General-purpose language used to build scalable backend systems, APIs, and microservices.\nChoose Java for software development or SAP for enterprise business consulting! 😊"
          : "• SAP: Corporate clients ke enterprise business processes (FICO, MM, SD) manage karta hai.\n• Java: Scalable backend systems, APIs aur enterprise software develop karne ke liye use hota hai.\nSoftware development ke liye Java aur corporate consulting ke liye SAP choose karein! 😊",
        link: ["/courses", isEn ? "Explore Tracks" : "Tracks Dekhein"],
      };
    }

    // SAP vs AI
    if (hasSap && hasAi) {
      return {
        text: isEn
          ? "• SAP: Focuses on enterprise operational management (finance, logistics, sales, HR).\n• AI/ML: Focuses on data analytics, predictive intelligence, and GenAI automation.\nChoose SAP for corporate business management, or AI for cutting-edge data science! 😊"
          : "• SAP: Enterprise business processes (finance, logistics, sales, HR) par focus karta hai.\n• AI/ML: Data analytics, predictive intelligence aur GenAI automation par focus karta hai.\nCorporate management ke liye SAP aur data science ke liye AI choose karein! 😊",
        link: ["/courses", isEn ? "Explore Tracks" : "Tracks Dekhein"],
      };
    }

    // Python vs Java
    if (hasPython && hasJava) {
      return {
        text: isEn
          ? "• Python: Simpler syntax, dominates AI/ML, Data Science, and rapid backend scripting (Django/FastAPI).\n• Java: Statically typed, high execution speed, powers large-scale enterprise backend systems and microservices.\nChoose Python for AI/Data or Java for enterprise backend software! 😊"
          : "• Python: Simple syntax, AI/ML, Data Science aur rapid development mein dominate karta hai.\n• Java: Statically typed, high performance, aur large-scale enterprise backend systems powers karta hai.\nAI/Data ke liye Python aur enterprise backend ke liye Java choose karein! 😊",
        link: ["/courses", isEn ? "Explore Tracks" : "Tracks Dekhein"],
      };
    }

    // Testing vs Dev
    if (hasTesting && hasDev) {
      return {
        text: isEn
          ? "• Software Development: Focuses on coding, UI design, and building web/backend features from scratch (React, Node, Java, Python).\n• Software Testing (QA): Focuses on finding bugs, test automation (Cypress/Selenium), and product quality assurance.\nChoose Development if you love building code, or QA/Testing if you love finding issues and automating tests! 😊"
          : "• Software Development: Coding, UI design aur features build karne par focus karta hai (React, Node, Java).\n• Software Testing (QA): Bugs find karne, test automation (Cypress/Selenium) aur product quality ensure karne par focus karta hai.\nCoding & product building ke liye Dev aur quality & automation testing ke liye QA choose karein! 😊",
        link: ["/courses", isEn ? "Explore Tracks" : "Tracks Dekhein"],
      };
    }

    // Intern vs Internship
    const hasInternVsInternship =
      (/\bintern\b/i.test(q) && /\b(internship|intrenship|intership)\b/i.test(q)) ||
      has("intern vs internship", "intern vs intrenship", "intern aur internship", "difference between intern and internship");

    if (hasInternVsInternship) {
      return {
        text: isEn
          ? "• Intern: The student or trainee who works at an organization to acquire practical skills and industry exposure.\n• Internship: The structured training program or work period where the intern works on live projects.\nAt Envistream EduSkill, our interns work on live software projects under senior mentor guidance! 😊"
          : "• Intern: Wo student ya trainee hota hai jo real-world experience lene ke liye kisi organization mein kaam karta hai.\n• Internship: Wo practical training program hota hai jisme intern live projects par kaam karta hai.\nEnvistream EduSkill mein interns expert mentors ke guidance mein live projects deliver karte hain! 😊",
        link: ["/internships", isEn ? "Explore Internships" : "Internships Dekhein"],
      };
    }

    // Program / Course / Training vs Internship
    const hasProgramOrCourse = has("program", "course", "training", "classes", "batch");
    const hasInternship = has("intern", "internship", "apprentice");
    const hasJob = has("job", "placement", "full time", "employment");
    const hasProject = has("project", "major project", "minor project");

    if (hasProgramOrCourse && hasInternship) {
      return {
        text: isEn
          ? "• Training Program / Course: Focuses on structured classroom learning, technical fundamentals, and lab practice across core technologies.\n• Internship: Involves applying those skills on live client projects under senior mentor guidance, with stipend, experience credentials, and PPO opportunities.\nAt Envistream EduSkill, our training programs include integrated live internships! 😊"
          : "• Program / Course: Isme structured syllabus ke through technical skills aur coding fundamentals seekhte hain (Web Dev, QA, Python, SAP).\n• Internship: Isme live client projects par real corporate environment mein kaam karke experience gain karte hain (with stipend & PPO).\nEnvistream EduSkill mein training ke saath live project internship integrated rehti hai! 😊",
        link: ["/internships", isEn ? "Explore Internships" : "Internships Dekhein"],
      };
    }

    // Internship vs Job
    if (hasInternship && hasJob) {
      return {
        text: isEn
          ? "• Internship: A temporary training period to gain real-world industry experience, mentorship, and project portfolio.\n• Job: A permanent employment role with full salary and independent deliverables.\nTop performers in Envistream internships can convert their role into a full-time job (PPO)! 😊"
          : "• Internship: Real industry exposure aur technical skills gain karne ke liye temporary learning period hota hai.\n• Job: Full salary aur independent responsibilities ke sath permanent position hoti hai.\nEnvistream internships mein top performers ko direct full-time PPO (job offer) milta hai! 😊",
        link: ["/placement", isEn ? "Placement Support" : "Placement Support Dekhein"],
      };
    }

    // Project vs Internship
    if (hasProject && hasInternship) {
      return {
        text: isEn
          ? "• Project: Focuses on building a specific technical software solution or final-year submission.\n• Internship: Covers full corporate work environment exposure, team collaboration, and client deliverables.\nEnvistream provides AICTE & BPUT approved Major Projects paired with corporate internships! 😊"
          : "• Project: Specific technical software ya final-year academic submission build karne par focus karta hai.\n• Internship: Real-time industry workflow, team collaboration aur mentor guidance ke sath corporate experience provide karti hai.\nEnvistream mein AICTE aur BPUT approved Major Projects internship ke saath hi aate hain! 😊",
        link: ["/internships", isEn ? "Explore Internships" : "Internships Dekhein"],
      };
    }

    // Online vs Offline Training
    const hasOnline = has("online", "virtual", "remote", "ghar se");
    const hasOffline = has("offline", "classroom", "in person", "nayapalli", "center", "centre");
    if (hasOnline && hasOffline) {
      return {
        text: isEn
          ? "• Online Training: Learn remotely from home with flexible schedules, live interactive sessions, and 24x7 recorded access.\n• Classroom Training: In-person training at our Bhubaneswar Nayapalli centre with direct mentor face-to-face doubts and lab practice.\nBoth modes provide identical curriculum, live projects, and placement assistance! 😊"
          : "• Online Training: Flexible timing ke saath ghar se live interactive classes aur 24x7 recordings milti hain.\n• Classroom Training: Hamare Bhubaneswar Nayapalli center par face-to-face mentorship aur lab access milta hai.\nDono modes mein same curriculum, live projects aur placement support milta hai! 😊",
      };
    }

    // Frontend vs Backend
    const hasFrontend = has("frontend", "front end", "client side", "ui");
    const hasBackend = has("backend", "back end", "server side", "api");
    if (hasFrontend && hasBackend) {
      return {
        text: isEn
          ? "• Frontend: Builds the visual user interface using HTML, CSS, JavaScript, and React.js.\n• Backend: Handles server logic, database management, and APIs using Node.js, Express, Java, or Python.\nOur Full-Stack MERN track covers both frontend and backend seamlessly! 😊"
          : "• Frontend: HTML, CSS, JavaScript aur React.js se visual user interface develop karta hai.\n• Backend: Node.js, Express, Java ya Python se server logic, APIs aur databases handle karta hai.\nHamara Full-Stack MERN track dono ko cover karta hai! 😊",
        link: ["/courses/full-stack-development", isEn ? "View Full Stack Track" : "Full Stack Track Dekhein"],
      };
    }

    // Manual vs Automation Testing
    const hasManual = has("manual", "manual testing");
    const hasAuto = has("automation", "selenium", "cypress");
    if (hasManual && hasAuto) {
      return {
        text: isEn
          ? "• Manual Testing: Human testers manually execute test cases and verify application behavior without coding.\n• Automation Testing: Uses scripts and tools like Cypress and Selenium to execute repetitive tests automatically.\nEnvistream trains you in both Manual and Cypress Automation with live framework projects! 😊"
          : "• Manual Testing: Tester bina coding ke manually test cases run karke application verify karta hai.\n• Automation Testing: Cypress aur Selenium tools se test scripts automate ki jati hain.\nEnvistream dono areas live framework projects ke saath cover karta hai! 😊",
        link: ["/courses/software-testing-automation", isEn ? "View Testing Track" : "Testing Track Dekhein"],
      };
    }

    // Python vs Web Dev / MERN
    if (hasPython && (hasDev || has("mern", "web dev", "web development"))) {
      return {
        text: isEn
          ? "• Full-Stack MERN: Ideal for building interactive websites, SaaS applications, and modern web portals with React & Node.\n• Python Track: Ideal for AI/ML, Data Science, automation scripting, and backend development with Django/FastAPI.\nChoose MERN for web products, or Python for AI and data careers! 😊"
          : "• Full-Stack MERN: React aur Node.js ke sath modern web apps aur SaaS platforms banane ke liye best hai.\n• Python Track: AI/ML, Data Science aur intelligent backend scripting ke liye best hai.\nWeb apps ke liye MERN aur AI/Data ke liye Python choose karein! 😊",
        link: ["/courses", isEn ? "Explore Courses" : "Courses Dekhein"],
      };
    }

    // Google / Chrome vs Brave
    const hasGoogle = has("google", "chrome");
    const hasBrave = has("brave");
    if (hasGoogle && hasBrave) {
      return {
        text: isEn
          ? "• Google (Chrome): Dominates the browser market with unmatched Google account sync, speed, and a vast extension ecosystem, but collects browsing telemetry for targeted advertising.\n• Brave: Built on the open-source Chromium engine, Brave prioritizes user privacy by automatically blocking third-party ads, trackers, and fingerprinting by default (Brave Shields), giving faster page loads and lower RAM usage.\n• Verdict: Choose Chrome for seamless Google ecosystem integration, or Brave for privacy, built-in ad-blocking, and speed! 😊"
          : "• Google (Chrome): Google services ke saath seamless sync aur high speed deta hai, par ads ke liye browsing activity track karta hai.\n• Brave Browser: Chromium engine par bana hai aur by-default ads, web trackers aur cookies ko block karta hai, jisse fast speed aur complete privacy milti hai.\n• Summary: Google ecosystem aur sync ke liye Chrome use karein, aur bina ads ke privacy aur fast speed ke liye Brave best hai! 😊",
      };
    }

    // AI Models: ChatGPT vs Claude vs Gemini
    const hasChatGPT = has("chatgpt", "gpt");
    const hasClaude = has("claude");
    const hasGemini = has("gemini");
    if ((hasChatGPT && hasClaude) || (hasChatGPT && hasGemini) || (hasClaude && hasGemini)) {
      return {
        text: isEn
          ? "• Google Gemini: Native multimodal reasoning across text, code, audio, video, and Google ecosystem integration.\n• ChatGPT (OpenAI): Known for advanced reasoning, code generation, custom GPTs, and diverse plugins.\n• Claude (Anthropic): Known for large context windows, articulate coding, and safety-focused nuance.\nAt Envistream EduSkill, our AI/ML & GenAI track teaches you how to leverage these LLMs, prompt engineering, and building autonomous AI agent projects! 😊"
          : "• Google Gemini: Google ka multimodal AI model jo text, code, audio aur video ko real-time analyze karta hai.\n• ChatGPT: OpenAI ka popular model jo coding, writing aur custom GPTs ke liye jana jata hai.\n• Claude: Anthropic ka AI model jo long documents, articulate reasoning aur coding ke liye famous hai.\nEnvistream EduSkill ke AI/ML & GenAI track mein hum in AI models ki API integration aur autonomous AI agents banana sikhate hain! 😊",
        link: ["/courses/artificial-intelligence", isEn ? "Explore AI & GenAI Track" : "AI & GenAI Track Dekhein"],
      };
    }

    // Windows vs Linux
    const hasWindows = has("windows");
    const hasLinux = has("linux", "ubuntu");
    if (hasWindows && hasLinux) {
      return {
        text: isEn
          ? "• Linux: Open-source, highly secure, lightweight, and the industry standard for cloud servers, DevOps, and programming environments.\n• Windows: User-friendly, vast software compatibility, and dominant for desktop and gaming environments.\nFor software engineering and server deployments, Linux commands are an essential skill taught in our Full-Stack tracks! 😊"
          : "• Linux: Open-source, fast, lightweight aur secure OS hai jo cloud servers aur DevOps mein standard hai.\n• Windows: User-friendly desktop OS hai jisme broad software aur gaming support milta hai.\nSoftware development aur cloud deployment ke liye Linux seekhna bohot zaroori hai jo hamare tracks mein included hai! 😊",
        link: ["/courses", isEn ? "Explore Tracks" : "Tracks Dekhein"],
      };
    }

    // Pass through un-fed comparisons cleanly to NLP without forcing rigid course fallback
    return {
      text: null,
      isFallback: true,
    };
  }

  if (has("counsell", "call back", "callback", "talk", "human", "advisor", "admission"))
    return {
      text: isEn
        ? "Our senior technical counsellor will call you back within 24 hours with a personalized curriculum roadmap."
        : "Hamare senior technical counsellor aapko 24 ghante ke andar call karke personalized curriculum roadmap provide karenge.",
      action: "counsellor",
    };
  if (has("fee", "emi", "price", "cost", "payment", "installment"))
    return {
      text: isEn
        ? "Career programs start from ₹14,999 with 0% interest monthly EMI options available via UPI, cards, and net banking."
        : "Career programs ₹14,999 se start hote hain, aur UPI, cards ya net banking ke through 0% interest monthly EMI options available hain.",
    };
  if (has("test", "testing", "tester", "qa", "selenium", "cypress", "automation"))
    return {
      text: isEn
        ? "Software Testing evaluates software applications to detect bugs and ensure high performance. This course is available at Envistream EduSkill covering Manual Testing, Selenium, TestNG, and Cypress with live internships. 😊"
        : "Software Testing mein software applications ko test karke bugs detect aur fix kiye jate hain. Envistream EduSkill mein Manual Testing, Selenium, TestNG aur Cypress live internships ke sath available hain. 😊",
      link: ["/courses/software-testing-automation", isEn ? "View Testing Track" : "Testing Track Dekhein"],
    };
  if (has("sap", "erp", "fico", "mm", "sd", "abap", "pp", "hr"))
    return {
      text: isEn
        ? "SAP is a premier Enterprise Resource Planning software used to integrate finance, materials, and operations. This course is available at Envistream EduSkill covering SAP FICO, MM, SD, and ABAP with real-time enterprise training. 😊"
        : "SAP ek premier Enterprise Resource Planning software hai. Envistream EduSkill mein SAP FICO, MM, SD aur ABAP real-time enterprise training ke sath available hain. 😊",
      link: ["/courses/erp-sap-training", isEn ? "View SAP Track" : "SAP Track Dekhein"],
    };
  if (has("gemini", "chatgpt", "gpt", "claude", "deepseek", "copilot", "ai tool", "ai tools")) {
    const isGemini = has("gemini");
    const isChatGPT = has("chatgpt", "gpt");
    const isClaude = has("claude");

    if (isGemini && !isChatGPT && !isClaude) {
      return {
        text: isEn
          ? "Google Gemini is an advanced multimodal Generative AI model and tool developed by Google that understands, reasons, and generates text, code, images, and audio.\nAt Envistream EduSkill, our Python, AI/ML & Generative AI program trains you on using Gemini APIs, prompt engineering, and building autonomous AI agent projects! 😊"
          : "Google Gemini ek advanced multimodal Generative AI tool aur LLM hai jise Google ne banaya hai. Ye text, coding, reasoning aur images ko understand aur generate karta hai (jaise ChatGPT aur Claude).\nEnvistream EduSkill ke Python, AI/ML & GenAI track mein hum Gemini API integration, prompt engineering aur live AI agent projects banana sikhate hain! 😊",
        link: ["/courses/artificial-intelligence", isEn ? "Explore AI & GenAI Program" : "AI & GenAI Program Dekhein"],
      };
    }

    if (isChatGPT && !isGemini && !isClaude) {
      return {
        text: isEn
          ? "ChatGPT is a state-of-the-art Generative AI conversational assistant and Large Language Model (LLM) developed by OpenAI, widely used for reasoning, writing code, and answering complex questions.\nAt Envistream EduSkill, our AI/ML & GenAI program teaches prompt engineering, OpenAI API integration, RAG architectures, and custom AI application development! 😊"
          : "ChatGPT ek leading Generative AI chatbot aur Large Language Model (LLM) hai jise OpenAI ne banaya hai. Ye natural language samajhne, code generate karne aur complex problem-solving mein widely use hota hai.\nEnvistream EduSkill ke AI/ML & GenAI course mein hum OpenAI API integration, prompt engineering aur live AI applications build karna sikhate hain! 😊",
        link: ["/courses/artificial-intelligence", isEn ? "Explore AI & GenAI Program" : "AI & GenAI Program Dekhein"],
      };
    }

    if (isClaude && !isGemini && !isChatGPT) {
      return {
        text: isEn
          ? "Claude is a next-generation Generative AI assistant developed by Anthropic, renowned for deep reasoning, long-context document analysis, and high-precision coding.\nAt Envistream EduSkill, our AI/ML & GenAI curriculum covers modern LLM architectures (Claude, Gemini, and GPT), prompt engineering, and autonomous AI agents! 😊"
          : "Claude ek advanced Generative AI assistant aur Large Language Model (LLM) hai jise Anthropic ne banaya hai. Ye deep reasoning, long context analysis aur accurate coding ke liye famous hai.\nEnvistream EduSkill ke AI/ML & GenAI curriculum mein hum modern LLMs (Claude, Gemini, GPT), prompt engineering aur live AI projects cover karte hain! 😊",
        link: ["/courses/artificial-intelligence", isEn ? "Explore AI & GenAI Program" : "AI & GenAI Program Dekhein"],
      };
    }

    return {
      text: isEn
        ? "Gemini (Google), ChatGPT (OpenAI), and Claude (Anthropic) are the world's leading Generative AI tools and Large Language Models (LLMs):\n• Google Gemini: Excels at multimodal reasoning across text, code, audio, and images.\n• ChatGPT: The leading conversational assistant for coding, problem-solving, and automation.\n• Claude: Renowned for deep reasoning, long-document comprehension, and nuanced coding.\nAt Envistream EduSkill, our Python, AI/ML & GenAI course covers hands-on integration of these LLMs, prompt engineering, and autonomous AI agent development! 😊"
        : "Gemini (Google), ChatGPT (OpenAI) aur Claude (Anthropic) duniya ke top Generative AI tools aur LLMs hain:\n• Google Gemini: Google ka multimodal AI hai jo text, coding aur images ko understand karta hai.\n• ChatGPT: Top conversational AI assistant jo coding aur automation mein widely used hai.\n• Claude: Deep reasoning, long documents analysis aur high-precision coding ke liye jaana jaata hai.\nEnvistream EduSkill ke AI/ML & GenAI track mein hum in modern LLMs ke APIs, prompt engineering aur live AI agents develop karna sikhate hain! 😊",
      link: ["/courses/artificial-intelligence", isEn ? "Explore AI & GenAI Program" : "AI & GenAI Program Dekhein"],
    };
  }

  if (has("ai", "ml", "genai", "llm", "rag", "artificial", "machine learning"))
    return {
      text: isEn
        ? "Artificial Intelligence and Machine Learning enable computers to learn from data and perform intelligent tasks. This course is available at Envistream EduSkill covering Python, ML, GenAI, and AI agent projects. 😊"
        : "Artificial Intelligence aur Machine Learning computers ko data se seekh kar intelligent tasks perform karne ke kabil banate hain. Envistream EduSkill mein Python, ML aur GenAI live projects ke sath available hain. 😊",
      link: ["/courses/artificial-intelligence", isEn ? "View AI Program" : "AI Program Dekhein"],
    };
  if (has("mern", "full stack", "react", "node", "javascript", "frontend", "backend"))
    return {
      text: isEn
        ? "Web Development involves building modern responsive web apps using front-end and back-end tools. This course is available at Envistream EduSkill covering React.js, Node.js, Express, and MongoDB with live capstone projects. 😊"
        : "Web Development mein React.js frontend aur Node.js/MongoDB backend ke sath modern responsive web apps banaye jate hain. Envistream EduSkill mein ye live capstone projects ke sath available hai. 😊",
      link: ["/courses/full-stack-development", isEn ? "View Full Stack Track" : "Full Stack Track Dekhein"],
    };
  if (has("python", "django", "fastapi"))
    return {
      text: isEn
        ? "Python is a versatile, high-level programming language widely used in Web Development, Data Science, and AI. This course is available at Envistream EduSkill with hands-on projects and internship certification. 😊"
        : "Python ek versatile programming language hai jo Web Development, Data Science aur AI mein use hoti hai. Envistream EduSkill mein hands-on projects aur internship certification ke sath sikhaya jata hai. 😊",
      link: ["/courses/python-programming", isEn ? "View Python Track" : "Python Track Dekhein"],
    };
  if (has("java", "core java", "advance java", "spring", "springboot", "hibernate") && !has("javascript"))
    return {
      text: isEn
        ? "Java is a premier programming language for enterprise software and robust backend systems. This course is available at Envistream EduSkill with live projects and internship certification. 😊"
        : "Java enterprise software aur backend systems develop karne ke liye top programming language hai. Envistream EduSkill mein ye course live projects aur internship certification ke sath available hai. 😊",
      link: ["/courses/full-stack-development", isEn ? "View Java Track" : "Java Track Dekhein"],
    };
  if (has("market", "seo", "aeo", "geo", "digital marketing", "bba", "mba", "ads", "lead gen", "business development"))
    return {
      text: isEn
        ? "Digital Marketing leverages search engines, social media, and digital campaigns to build brands and acquire customers. This course is available at Envistream EduSkill covering SEO, AEO, and Google Ads. 😊"
        : "Digital Marketing search engines aur social media ke through brand building aur leads acquire karne mein help karta hai. Envistream EduSkill mein SEO, AEO aur Google Ads available hain. 😊",
      link: ["/courses/digital-marketing-aeo", isEn ? "View Digital Marketing" : "Digital Marketing Dekhein"],
    };
  const isProgramDef =
    /\b(program|programs)\b/i.test(q) &&
    !has("kaun", "kon", "list", "offer", "provide", "available", "fee", "cost", "vs", "versus") &&
    (has("kya", "what", "meaning", "matlab", "define", "definition", "hota", "hoti", "kise") || q.trim() === "program");

  if (isProgramDef) {
    return {
      text: isEn
        ? "A program is a set of coded instructions that tells a computer how to perform a specific task.\nIn career education, a training program is a structured curriculum designed to build job-ready technical skills.\nEnvistream EduSkill offers industry-aligned programs with live projects and internships. 😊"
        : "Program computer instructions ka ek set hota hai jo kisi specific task ko perform karne ke liye likha jata hai.\nCareer context mein ye ek structured training curriculum hota hai jo job-ready technical skills develop karta hai.\nEnvistream EduSkill mein ye programs live capstone projects aur internships ke sath offer kiye jaate hain. 😊",
      link: ["/courses", isEn ? "Explore Programs" : "Programs Dekhein"],
    };
  }

  if (has("program", "programs", "course", "courses", "curriculum", "tracks", "track", "syllabus", "training program", "training programs"))
    return {
      text: isEn
        ? "Envistream EduSkill offers career-focused IT training programs and live internships across:\n• Full-Stack Web Development (React.js, Node.js)\n• Software Testing & Cypress Automation (QA)\n• Python, AI/ML & Data Science\n• SAP/ERP (FICO, MM, SD, ABAP)\n• Digital Marketing & AEO\nAll programs include live capstone projects and placement assistance! Which domain are you interested in? 😊"
        : "Envistream EduSkill career-focused IT training programs aur live internships offer karta hai:\n• Full-Stack Web Development (React.js, Node.js)\n• Software Testing & Cypress Automation (QA)\n• Python, AI/ML & Data Science\n• SAP/ERP (FICO, MM, SD, ABAP)\n• Digital Marketing & AEO\nSabhi programs mein live capstone projects aur placement assistance shamil hai! Aap kis program mein interested hain? 😊",
      link: ["/courses", isEn ? "Explore All Programs" : "Sabhi Programs Dekhein"],
    };
  const isInternPerson =
    /\b(intern|interns)\b/i.test(q) &&
    !/\b(internship|internships)\b/i.test(q) &&
    (has("kya", "kaun", "kon", "who", "what", "meaning", "matlab", "kise", "define") || q.trim() === "intern");

  if (isInternPerson) {
    return {
      text: isEn
        ? "An intern is a student or trainee who works temporarily at an organization to gain practical hands-on experience and professional skills.\nAt Envistream EduSkill, interns work directly on live projects under senior mentor guidance. 😊"
        : "Intern ek student ya fresher trainee hota hai jo real-world work experience aur technical skills seekhne ke liye kisi tech company mein temporarily kaam karta hai.\nEnvistream EduSkill mein interns expert mentors ke guidance mein live software projects par kaam karte hain. 😊",
      link: ["/internships", isEn ? "Explore Internships" : "Internships Dekhein"],
    };
  }

  if (has("intern", "internship", "stipend", "duration", "bput", "aicte"))
    return {
      text: isEn
        ? "An internship is a practical training program where students work on live industry projects to gain hands-on experience.\nEnvistream EduSkill offers AICTE & BPUT aligned Final-Year Major Projects, Summer Internships, and Paid Corporate Apprenticeships across Web Dev, QA, Python, AI/ML, and SAP. 😊"
        : "Internship ek practical training program hai jisme students live projects par kaam karke real industry experience gain karte hain.\nEnvistream EduSkill mein AICTE & BPUT aligned Final-Year Projects, Summer Internships aur Paid Corporate Apprenticeships available hain across Web Dev, QA, Python, AI aur SAP. 😊",
      link: ["/internships", isEn ? "Explore Internships" : "Internships Dekhein"],
    };
  if (has("place", "job", "career", "salary", "hiring", "package", "interview"))
    return {
      text: isEn
        ? "Envistream provides dedicated Technical Placement Assistance and a Campus Placement Program, including technical workshops, intensive HR prep, and mock interviews with external panels and HR professionals."
        : "Envistream dedicated Technical Placement Assistance aur Campus Placement Program provide karta hai, jisme technical workshops, HR preparation aur external HR professionals ke sath mock interviews shamil hain.",
      link: ["/placement", isEn ? "View Placement Program" : "Placement Program Dekhein"],
    };
  if (has("timing", "hour", "open", "close", "sunday", "saturday"))
    return {
      text: isEn
        ? "Envistream is open Monday through Saturday from 9:00 AM to 8:00 PM."
        : "Envistream Monday se Saturday subah 9:00 AM se shaam 8:00 PM tak open rehta hai.",
    };
  if (has("lab", "facility", "practice", "doubt"))
    return {
      text: isEn
        ? "Envistream provides 24x7 lab facilities for students to practice beyond regular training sessions, alongside Daily Doubt Clearing Classes."
        : "Envistream students ke liye 24x7 lab facilities aur Daily Doubt Clearing Classes provide karta hai taaki aap regular batch ke baad bhi practice kar sakein.",
    };
  if (has("certificate", "verify", "verification", "check"))
    return {
      text: isEn
        ? "Every certificate carries a unique encrypted ID. Please contact our admissions team for certificate verification assistance."
        : "Har certificate par unique encrypted ID hoti hai. Verification ke liye hamari admissions team se contact karein.",
    };
  if (has("corporate", "company", "b2b", "hr", "training for", "mou", "college", "partner"))
    return {
      text: isEn
        ? "We partner with colleges for student internship MoUs & FDPs, and provide corporate upskilling in GenAI, QA, and Cloud."
        : "Hum colleges ke sath student internship MoUs & FDPs karte hain, aur companies ke liye corporate upskilling provide karte hain.",
      link: ["/partner", isEn ? "Partner With Us" : "Partner Karein"],
    };
  if (has("address", "location", "office", "bhubaneswar", "where", "visit"))
    return {
      text: isEn
        ? "Envistream Eduskill is located at Plot-N6/454, 2nd Floor, Saffire Building, opposite Crown Hotel, IRC Village, Nayapalli, Bhubaneswar."
        : "Envistream Eduskill Plot-N6/454, 2nd Floor, Saffire Building, opposite Crown Hotel, IRC Village, Nayapalli, Bhubaneswar mein located hai.",
      link: ["/contact", isEn ? "Contact & Location" : "Contact & Location Dekhein"],
    };
  const isHowAreYou =
    /\b(how\s+(?:are|r)\s+(?:you|u)|how's\s+it\s+going|how\s+is\s+it\s+going|how\s+are\s+things|how\s+do\s+you\s+do|how\s+about\s+you)\b/i.test(q) ||
    /\b(kaise\s+ho|kaise\s+hain|kaisa\s+hai|kaisi\s+ho|kya\s+haal|sab\s+kaisa)\b/i.test(q);

  if (isHowAreYou) {
    return {
      text: isEn
        ? "I am happy! 😊 I'm Sayraa, Envistream EduSkill's AI assistant — I can help you with IT courses, internships, and tech career roadmaps! How can I help you today?"
        : "Main bahut khush hoon! 😊 Main Sayraa hoon, Envistream EduSkill ki AI assistant — main IT courses, internships aur tech career roadmaps mein aapki help kar sakti hoon! Aaj main aapki kya madad kar sakti hoon?",
    };
  }

  if (has("hi", "hello", "namaste", "good morning", "good afternoon", "good evening") || q === "hey") {
    return {
      text: isEn
        ? "Hello! Welcome to Envistream EduSkill. How can I help you with our training programs, internships, or career guidance today? 😊"
        : "Hello! Envistream EduSkill mein aapka swagat hai. Main aaj aapki training programs, internships ya career guidance mein kaise madad kar sakti hoon? 😊",
    };
  }

  // Any non-greeting query outside Envistream's scope
  return {
    text: isEn
      ? "This question is outside my topic and courses. 😊 I'm Sayraa, Envistream EduSkill's AI assistant — I can help you with IT courses, internships, and tech career roadmaps!"
      : "Ye question mere topic aur courses se bahar hai. 😊 Main Sayraa hoon, Envistream EduSkill ki AI assistant — main IT software training aur internships mein help karti hoon!",
  };
}

export const GREETING = {
  from: "bot",
  text: "Hello! I'm Sayraa, your Envistream EduSkill AI assistant. Ask me about courses, internship batches, fees, or placements.",
};
