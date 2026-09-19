import React from 'react';
import { Award, Code, Wrench } from 'lucide-react';
import { technicalSkills } from '../data/resumeData';
import SectionHeading from './SectionHeading';

// Skill groups come from the resume data so the main page stays in sync with the resume.
const skillGroups = [
  { title: "Languages", Icon: Code, skills: technicalSkills.languages },
  { title: "Frameworks & Tools", Icon: Wrench, skills: technicalSkills.frameworks },
  { title: "Certifications", Icon: Award, skills: technicalSkills.certifications },
];

const SkillShowcase = () => {
  return (
    <section className="my-16">
      <SectionHeading title="Skills" />
      <div className="glass divide-y divide-white/10">
        {skillGroups.map(({ title, Icon, skills }) => (
          <div key={title} className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 md:flex-row md:gap-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white md:w-52 md:shrink-0">
              <Icon className="h-5 w-5 text-accent" />
              {title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="bg-gray-700/50 text-sm text-amber-300 font-medium px-3 py-1 rounded-full transition-colors duration-300 hover:bg-amber-400/20"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillShowcase;
