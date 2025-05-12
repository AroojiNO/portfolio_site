import React from 'react';

interface SkillBarProps {
  skillName: string;
  level: 3 | 4 | 5; // Proficiency level, constrained to 3, 4,  or 5
  totalBlocks?: number; // Total blocks in the bar, defaults to 5
}

const SkillBar: React.FC<SkillBarProps> = ({
  skillName,
  level,
  totalBlocks = 5,
}) => {
  const filledBlocks = level;
  const emptyBlocks = totalBlocks - filledBlocks;

  // Ensure level doesn't exceed totalBlocks, though with 4|5 and default 5, it's mostly fine.
  if (level > totalBlocks) {
    console.warn(`SkillBar: Level (${level}) for "${skillName}" cannot exceed totalBlocks (${totalBlocks}).`);
    // Optionally adjust or return null/error display
  }

  return (
    <div>
      <span className="text-base font-medium text-gray-200 mb-2 block">
        {skillName}
      </span>
      <div className="flex space-x-1.5 h-3">
        {/* Filled Blocks */}
        {Array.from({ length: Math.max(0, Math.min(filledBlocks, totalBlocks)) }).map((_, index) => (
          <div
            key={`filled-${skillName}-${index}`}
            className="flex-1 bg-accent rounded-sm"
            aria-label="Filled proficiency block"
          ></div>
        ))}
        {/* Empty Blocks */}
        {Array.from({ length: Math.max(0, totalBlocks - Math.max(0, Math.min(filledBlocks, totalBlocks))) }).map((_, index) => (
          <div
            key={`empty-${skillName}-${index}`}
            className="flex-1 bg-gray-700 rounded-sm"
            aria-label="Empty proficiency block"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SkillBar;