# Portfolio Setup Instructions

## Installation

1. Install dependencies:
```bash
npm install
```

## EmailJS Configuration

The contact form uses EmailJS for sending emails. To set it up:

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template
4. Get your Service ID, Template ID, and Public Key
5. Update the Contact component (`src/sections/Contact.jsx`) with your credentials:

```javascript
await emailjs.send(
  'YOUR_SERVICE_ID',      // Replace with your Service ID
  'YOUR_TEMPLATE_ID',     // Replace with your Template ID
  {
    from_name: data.name,
    from_email: data.email,
    subject: data.subject || 'Portfolio Contact',
    message: data.message,
  },
  'YOUR_PUBLIC_KEY'       // Replace with your Public Key
);
```

## Customization

### Update Personal Information

1. **Hero Section** (`src/sections/Hero.jsx`):
   - Update the meta text and name
   - Modify the description

2. **About Section** (`src/sections/About.jsx`):
   - Update the bio text
   - Replace the placeholder image/avatar

3. **Skills** (`src/data/skills.js`):
   - Update skills, categories, and proficiency levels

4. **Experience** (`src/data/experience.js`):
   - Add your work experience entries

5. **Projects** (`src/data/projects.js`):
   - Add your projects with details, links, and technologies

6. **Contact Section** (`src/sections/Contact.jsx`):
   - Update social media links
   - Configure EmailJS (see above)

### Styling

- CSS Variables are in `src/index.css` (root variables)
- Tailwind config is in `tailwind.config.js`
- Component-specific styles use Tailwind classes

## Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see your portfolio.

## Build

```bash
npm run build
```

The production build will be in the `dist` folder.

## Features Implemented

✅ Dark theme with CSS variables  
✅ Custom cursor (desktop only)  
✅ Grain texture overlay  
✅ Fixed top-right navigation  
✅ Hero section with Three.js particles  
✅ About section with animated skills  
✅ Experience timeline with expandable cards  
✅ Projects section with filtering and modals  
✅ Contact form with EmailJS integration  
✅ Three.js planet animation  
✅ Framer Motion animations  
✅ Responsive design  
✅ Scroll-triggered animations  

## Notes

- The custom cursor is hidden on mobile/touch devices
- Three.js scenes are optimized for performance
- All animations use hardware acceleration (transform/opacity)
- The portfolio is fully responsive

