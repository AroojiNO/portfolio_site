# Noah Arooji — Portfolio

Interactive portfolio built with Next.js showcasing experience, projects, and skills with animated hero visuals and smooth scroll choreography.

## Features
- Shader-driven topography hero built with OGL plus mouse parallax.
- GSAP-powered scroll transitions that guide visitors from hero to content.
- Expandable experience timeline, skills/cards grid, and project highlights.
- Inline resume viewer at `/resume`
- Placeholder papers page at `/papers` for future writing, hidden (shows the 404 page) until `PAPERS_PUBLISHED` in `src/app/papers/page.tsx` is set to `true`.

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
public/              # profile photo, project images, resume PDF
```

## Editing Content
- Resume content (contact info, experience, skills, projects): `src/app/data/resumeData.ts`. The main page and `/resume` both read from it. Experience entries take an optional `summary` and `skills` for the main page timeline cards.
- Resume PDF & profile photo: drop replacements into `public/` and update paths if filenames change.
- Hero visuals: tweak props on `<TopographyHero />` in `src/app/page.tsx` (`spacing`, `enableMouseInteraction`) or shader uniforms in `src/app/components/TopographyHero.tsx`.
