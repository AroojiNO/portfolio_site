// src/components/SocialMediaLinks/SocialMediaLinks.tsx
import React from 'react';

// src/components/SocialMediaLinks/SocialMediaLinks.types.ts
export interface SocialProfile {
  name: string;
  url: string;
  iconSrc: string; // Path or URL to the icon image
  ariaLabel?: string; // Optional more specific aria-label
}

export interface SocialMediaLinksProps {
  socialProfiles: SocialProfile[];
  containerClassName?: string; // Optional class for the main container
  linkClassName?: string;      // Optional class for each link
  iconClassName?: string;      // Optional class for each icon
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  socialProfiles,
  containerClassName = 'social-links-container', // Default class name
  linkClassName = 'social-link',                // Default class name
  iconClassName = 'social-icon',                // Default class name
}) => {
  if (!socialProfiles || socialProfiles.length === 0) {
    return null; // Don't render anything if there are no profiles
  }

  return (
    <div className={containerClassName} style={{ display: 'flex', gap: '10px' }}>
      {socialProfiles.map((profile: SocialProfile) => (
        <a style={{ display: 'flex', alignItems: 'center' }}
          key={profile.name}
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer" // Important for security and SEO
          className={`${linkClassName} w-10 border-accent object-cover mb-4 mx-3 border-1 rounded-[10px] bg-glass `} // Apply the link class name
          aria-label={profile.ariaLabel || `Link to my ${profile.name} profile`} // For accessibility
        >
          <img
            src={profile.iconSrc}
            alt={`${profile.name} icon`}
            className={iconClassName}
          />
        </a>
      ))}
    </div>
  );
};

export default SocialMediaLinks;