import React from 'react';

// Data for the skills section. You can easily update these arrays.
const skillsData = {
  languages: ["Java", "C", "Python", "RStudio", "JavaScript / TypeScript", "HTML5", "SQL", "CSS"],
  technologies: ["React", "Next.js", "Node.js", "Express.js", "Tailwind", "GSAP", "NumPy", "Git/GitHub", "Oracle Cloud Infrastructure"],
  certifications: ["2025 Oracle Cloud Infrastructure Foundations", "2025 Oracle AI Foundations Associate"]
};

// Simple SVG icons for visual flair.
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 text-accent">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const ToolIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 text-accent">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
);

const CertificateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 text-accent">
    <path d="M12 21l-8-4.5v-9l8 4.5 8-4.5v9L12 21z"></path>
    <path d="M12 12l8-4.5"></path>
    <path d="M12 12v9"></path>
    <path d="M12 12L4 7.5"></path>
    <path d="M16 5.25l-8 4.5"></path>
  </svg>
);


const SkillShowcase = () => {
  const cardClasses = "transition-all duration-300 ease-in-out hover:scale-[1.03] hover:border-yellow-400/80 hover:shadow-[0_0_25px_rgba(250,204,21,0.4)]";
  return (
    <section className="my-16 py-4">
      <h2 className="text-3xl font-semibold mb-8 text-accent text-center">
        Skills & Technologies
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Languages Card */}
        <div className="glass p-6 flex flex-col transition-all duration-300 hover:border-accent/60 hover:shadow-accent/20 hover:shadow-[0_0_25px_var(--accent-color)]">
          <h3 className="text-2xl font-bold mb-4 flex items-center"><CodeIcon /> Languages</h3>
          <ul className="space-y-2 flex-grow">
            {skillsData.languages.map((skill, index) => (
              <li key={index} className={`bg-dark/50 rounded-md px-3 py-2 text-sm text-gray-200 ${cardClasses}`}>
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies Card */}
        <div className="glass p-6 flex flex-col transition-all duration-300 hover:border-accent/60 hover:shadow-accent/20 hover:shadow-[0_0_25px_var(--accent-color)]">
          <h3 className="text-2xl font-bold mb-4 flex items-center"><ToolIcon /> Technologies</h3>
          <ul className="space-y-2 flex-grow">
            {skillsData.technologies.map((skill, index) => (
              <li key={index} className={`bg-dark/50 rounded-md px-3 py-2 text-sm text-gray-200 ${cardClasses}`}>
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Certifications Card */}
        <div className="glass p-6 flex flex-col transition-all duration-300 hover:border-accent/60 hover:shadow-accent/20 hover:shadow-[0_0_25px_var(--accent-color)]">
          <h3 className="text-2xl font-bold mb-4 flex items-center"><CertificateIcon /> Certifications</h3>
          <ul className="space-y-2 flex-grow">
            {skillsData.certifications.map((skill, index) => (
              <li key={index} className={`bg-dark/50 rounded-md px-3 py-2 text-sm text-gray-200 ${cardClasses}`}>
                {skill}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
};

export default SkillShowcase;
