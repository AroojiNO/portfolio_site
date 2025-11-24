# Noah Arooji — Portfolio

Interactive portfolio built with Next.js showcasing experience, projects, and skills with animated hero visuals and smooth scroll choreography.

## Features
- Shader-driven topography hero built with OGL plus mouse parallax.
- GSAP-powered scroll transitions that guide visitors from hero to content.
- Expandable experience timeline, skills/cards grid, and project highlights.
- Inline resume viewer at `/resume`
- Placeholder papers page at `/papers` for future writing.

## Tech Stack
- Next.js 15 (App Router) + React 19
- Tailwind CSS 4 (utility styling)  
- GSAP + @gsap/react for scroll/viewport animations  
- OGL for the fragment/vertex shader hero background  

## Project Structure
```
src/app
  page.tsx           # landing page with hero, experience, skills, projects
  resume/page.tsx    # embedded PDF viewer
  papers/page.tsx    # placeholder
  components/        # hero shader, experience timeline, skills, nav, etc.
public/              # profile photo, social icons, resume PDF
```

## Editing Content
- Experience entries: `src/app/components/Experiences.tsx` (`experiences` array).
- Skills & certifications: `src/app/components/SkillsShowcase.tsx` (`skillsData`).
- Projects cards: `projects` array in `src/app/page.tsx`.
- Resume PDF & profile/social icons: drop replacements into `public/` and update paths if filenames change.
- Hero visuals: tweak props on `<TopographyHero />` in `src/app/page.tsx` (`spacing`, `enableMouseInteraction`) or shader uniforms in `src/app/components/TopographyHero.tsx`.
