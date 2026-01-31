// Resume data structure for Noah Arooji
// Extracted from PDF and structured for easy maintenance

export interface ContactInfo {
  name: string;
  location: string;
  email: string;
  linkedin: string;
  website: string;
  phone?: string;
}

export interface Education {
  institution: string;
  location: string;
  degree: string;
  degree2?: string;
  gpa: string;
  expectedGraduation: string;
  coursework: string[];
}

export interface TechnicalSkills {
  languages: string[];
  frameworks: string[];
  certifications: string[];
}

export interface ExperienceItem {
  company: string;
  position: string;
  location: string;
  dates: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  technologies: string;
  date: string;
  bullets: string[];
  links?: {
    github?: string;
    demo?: string;
    devpost?: string;
  };
}

// Contact Information
export const contactInfo: ContactInfo = {
  name: "Noah Arooji",
  location: "Charlottesville, Virginia",
  email: "noaharooji@gmail.com",
  linkedin: "linkedin.com/in/noah-arooji",
  website: "www.noaharooji.com",
};

// Education
export const education: Education = {
  institution: "The University of Virginia, College of Engineering and Applied Sciences",
  location: "Expected May 2027",
  degree: "Bachelor of Science Computer Science",
  degree2: "Bachelor of Arts Applied Statistics",
  gpa: "3.80 / 4.00",
  expectedGraduation: "Expected May 2027",
  coursework: [
    "Data Structures and Algorithms",
    "Computer Systems & Organizations", 
    "Software Engineering",
    "Software Development Essentials",
    "Regression Analysis",
    "Mathematical Statistics",
  ],
};

// Technical Skills
export const technicalSkills: TechnicalSkills = {
  languages: [
    "Java",
    "C",
    "Python",
    "JavaScript/TypeScript",
    "R",
    "SQL",
    "HTML",
    "CSS",
    "MATLAB",
  ],
  frameworks: [
    "React.js",
    "Next.js",
    "Node.js",
    "TailwindCSS",
    "NumPy",
    "PyTorch",
    "Pandas",
    "REST APIs",
    "OOP",
    "Mockito",
    "Git",
    "Agile",
  ],
  certifications: [
    "2025 Oracle Cloud Infrastructure (OCI) Foundations",
    "2025 Oracle AI Foundations Associate",
    "CITI Researcher",
  ],
};

// Professional Experience
export const experience: ExperienceItem[] = [
  {
    company: "Mythics",
    position: "Software Engineer Intern",
    location: "Virginia Beach, VA",
    dates: "May 2025 – August 2025",
    bullets: [
      "Led a cross-functional team of 5–10 through development of a full-stack client prospecting tool surfacing 20+ high-quality business leads per run and $1M in generated business pipelines",
      "Contributed 600+ lines of code for a client insights dashboard using React.js (Typescript) emphasizing reusable components and maintainable state management",
      "Architected data ingestion and enrichment with REST API endpoints leveraging Express.js and Oracle ADW to fetch 50,000+ records in sub 600ms latency",
    ],
  },
  {
    company: "UVA School of Data Science",
    position: "Machine Learning Researcher",
    location: "Charlottesville, VA",
    dates: "April 2025 – Present",
    bullets: [
      "Built an automated data pipeline using BeautifulSoup and Selenium, extracting 3000+ records in 8 minutes, down from 3 hours, resulting in 95.6% increased efficiency",
      "Designed Python anomaly-detection utilities with aligned time-series embeddings, leveraging PyTorch and Pandas causing removal of 30+ insufficient time series datasets",
      "Engineered Python utilities and automated time series preprocessing workflows leading to 45% improved model training performance",
    ],
  },
  {
    company: "UVA Collaborative Robotics Lab",
    position: "Machine Learning Researcher",
    location: "Charlottesville, VA",
    dates: "January 2025 – June 2025",
    bullets: [
      "Managed the development of Llama-3 powered AI speech-to-text and text-to-speech, enabling human-robot communication, improving interaction latency by 25%",
      "Implemented an intuitive GUI enhancing robot responses and blocking hallucinations, while maintaining sub-300ms response times between participants and robots",
      "Led the modularization of ROS2 nodes for LLM-based communication, lowering integration time by approximately 40%",
    ],
  },
];

// Projects and Leadership
export const projects: ProjectItem[] = [
  {
    name: "PromptLite",
    technologies: "React.js, TailwindCSS, Vite, Chrome API",
    date: "March 2025",
    bullets: [
      "Built a Chrome Extension using React.js, TailwindCSS, and Vite, reducing user ChatGPT token waste by 30% while visualizing users sustainable AI usage patterns",
      "Implemented lightweight data persistence using the Chrome Storage API, locally caching token counts and prompt metadata for real-time efficiency tracking",
      "Rendered dynamic data visualization modules with Recharts, transforming token-level logs into clear trend insights on user efficiency and sustainability",
    ],
    links: {
      devpost: "https://devpost.com/software/ecochat",
    },
  },
  {
    name: "Recipe Macro Tracker",
    technologies: "Expo, React.js, Flask, Google Vision OCR, Amazon AWS",
    date: "November 2024",
    bullets: [
      "Engineered a full-stack macronutrient tracking application using React.js, Flask, and Expo, supporting cross-platform deployment for web and mobile clients",
      "Deployed and managed the application on AWS EC2 with S3 storage, integrating RESTful Flask APIs for real-time nutrient computation and user authentication",
      "Scaled backend services to reliably handle 100+ active users, improving request latency and data synchronization across devices",
    ],
  },
];

// Leadership Experience
export const leadership: ExperienceItem[] = [
  {
    company: "UVA Personal Trainer",
    position: "Personal Trainer",
    location: "Charlottesville, VA",
    dates: "January 2025 – Present",
    bullets: [
      "Guided over 20 clients through 100+ personalized sessions, breaking down complex goals into actionable steps for long-term client growth",
      "Constructed measurable performance metrics, increasing program adherence and goal completion by 25%",
    ],
  },
];

// Professional Summary (optional - can be used for a brief intro)
export const professionalSummary = `Computer Science and Applied Statistics student at The University of Virginia with expertise in full-stack development and machine learning. Experienced in building scalable web applications, data pipelines, and AI-powered solutions. Passionate about creating clean, performant code and user-centered design.`;
