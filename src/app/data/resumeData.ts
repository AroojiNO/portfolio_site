// Resume data structure for Noah Arooji
// Extracted from PDF and structured for easy maintenance

export interface ContactInfo {
  name: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
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
  summary?: string; // One-line summary shown on collapsed main page timeline cards
  skills?: string[]; // Tags shown on main page timeline cards
}

export interface ProjectItem {
  name: string;
  technologies: string;
  date: string;
  bullets: string[];
  images?: string[]; // Array of image paths/URLs for carousel
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
  github: "github.com/AroojiNO",
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
    "Machine Learning",
    "Artificial Intelligence",
    "Regression Analysis",
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
    company: "Amazon Web Services (AWS)",
    position: "Software Development Engineer Intern",
    location: "Herndon, VA",
    dates: "May 2026 – August 2026",
    bullets: [
      "Designed and built a value insights system surfacing $15M in actionable price intelligence daily, replacing manual spreadsheets with an on-demand dashboard and cutting manual record pricing by 99% for internal metering teams",
      "Architected a distributed pricing application in Java hosted on AWS Fargate, leveraging an event-driven pipeline to process 7,000 billing records per minute with 99.94% file success rate",
      "Engineered data ingestion to handle 5M writes per hour to InfluxDB, optimizing batch writes and time-series indexing to serve sub-second time-range queries to React.js (TypeScript) dashboards",
    ],
    summary: "Built a price intelligence system and an event-driven pricing pipeline for internal metering teams.",
    skills: ["Java", "AWS Fargate", "InfluxDB", "TypeScript"],
  },
  {
    company: "Mythics",
    position: "Software Engineer Intern",
    location: "Virginia Beach, VA",
    dates: "May 2025 – August 2025",
    bullets: [
      "Led a cross-functional team of 5–10 through development of a full-stack client prospecting tool surfacing 20+ high-quality business leads and $1M in generated business pipelines per use",
      "Built interactive data visualization components in React.js with modular state management, rendering client metrics across filterable lead scoring views, reducing lead evaluation time by 40% across 3 internal teams",
      "Architected data ingestion and enrichment with REST API endpoints leveraging Express.js and Oracle ADW to fetch 50,000+ records in sub 600ms latency",
    ],
    summary: "Led a team of 5–10 building a full-stack client prospecting tool with React.js, Express.js and Oracle ADW.",
    skills: ["React", "Express.js", "Oracle ADW Warehouse"],
  },
  {
    company: "UVA School of Data Science",
    position: "Machine Learning Researcher",
    location: "Charlottesville, VA",
    dates: "April 2025 – Present",
    bullets: [
      "Trained a CLIP-based multimodal retrieval model using PyTorch, aligning time-series chart embeddings with natural language descriptions across 3,000+ Federal Reserve economic blog posts",
      "Built scalable preprocessing pipelines in Pandas and NumPy, transforming raw economic time-series records into structured contrastive learning pairs, reducing data preparation time by 95%",
      "Optimized model training through systematic data quality filtering and time-series alignment, removing 30+ insufficient data pairs and improving validation recall convergence by 45% across encoder configuration experiments",
    ],
    summary: "Training a CLIP-based model that matches economic time-series charts with natural-language descriptions.",
    skills: ["PyTorch", "CLIP", "Pandas", "NumPy"],
  },
];

// Projects and Leadership
export const projects: ProjectItem[] = [
  {
    name: "PromptLite",
    technologies: "React.js, TailwindCSS, Vite, Chrome API",
    date: "March 2025",
    bullets: [
      "Built a Chrome Extension using React.js, TailwindCSS, and Vite, reducing user ChatGPT token waste by 30% while visualizing users’ sustainable AI usage patterns",
      "Implemented lightweight data persistence using the Chrome Storage API, locally caching token counts and prompt metadata for real-time efficiency tracking",
      "Rendered dynamic data visualization modules with Recharts, transforming token-level logs into clear trend insights on user efficiency and sustainability",
    ],
    images: [
      "/promptlite-1.jpg",
      "/promptlite-2.jpg",
      "/promptlite-3.jpg",
      "/promptlite-4.jpg",
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
    images: [
      "/macrotracker-1.png",
      "/macrotracker-2.png"
    ],
  },
];

// Leadership Experience
export const leadership: ExperienceItem[] = [
  {
    company: "UVA Personal Trainer",
    position: "Personal Trainer",
    location: "Charlottesville, VA",
    dates: "January 2025 – August 2026",
    bullets: [
      "Guided over 20 clients through 100+ personalized sessions, breaking down complex goals into actionable steps for long-term client growth",
      "Constructed measurable performance metrics, increasing program adherence and goal completion by 25%",
    ],
  },
];

// Professional Summary (optional - can be used for a brief intro)
export const professionalSummary = `Computer Science and Applied Statistics student at The University of Virginia with expertise in full-stack development and machine learning. Experienced in building scalable web applications, data pipelines, and AI-powered solutions. Passionate about creating clean, performant code and user-centered design.`;
