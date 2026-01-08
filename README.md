# James Li Portfolio Website

A modern, interactive portfolio website built with React, Vite, and Three.js. Features smooth animations, 3D graphics, and a responsive design.

**[View the live application →](https://jahoi12345.github.io/Profolio_Website/)**

## Features

- **Interactive 3D Graphics**: Three.js powered particle logos and visual effects
- **Smooth Animations**: Framer Motion for fluid transitions and scroll animations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Custom cursor, grain overlay, and elegant navigation
- **Sections**:
  - Hero section with animated introduction
  - About section
  - Experience timeline
  - Projects showcase
  - Websites portfolio
  - Contact form with EmailJS integration

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics and animations
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS framework
- **EmailJS** - Contact form integration
- **React Three Fiber** - React renderer for Three.js


## Deployment

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Setup

1. The repository is configured to deploy to: `https://jahoi12345.github.io/Profolio_Website/`
2. Push to the `main` branch to trigger automatic deployment
3. Enable GitHub Pages in repository settings:
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

The site will automatically build and deploy on every push to `main`.

## Project Structure

```
src/
├── components/     # Reusable components (Navigation, Footer, etc.)
├── sections/       # Page sections (Hero, About, Experience, etc.)
├── three/          # Three.js components and animations
├── data/           # Static data (projects, experience, skills)
├── hooks/          # Custom React hooks
└── assets/         # Images and static assets
```

## Customization

- Update project data in `src/data/projects.js`
- Modify experience in `src/data/experience.js`
- Adjust skills in `src/data/skills.js`
- Customize styling in `src/index.css` and component files

## License

Feel free to copy!
