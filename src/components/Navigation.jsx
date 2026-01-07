import { useState, useEffect } from 'react';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = ['hero', 'about', 'projects', 'experience', 'skills', 'websites', 'contact'];
    const isMobile = window.innerWidth < 768;
    
    // Responsive threshold: smaller on mobile, larger on desktop
    const getThreshold = () => {
      // Check current window width (handles rotation/resize)
      const currentIsMobile = window.innerWidth < 768;
      // Mobile: ~80px (navigation at top-2 = 8px + some buffer)
      // Desktop: ~150px (navigation at top-10 = 40px + buffer)
      return currentIsMobile ? 80 : 150;
    };
    
    const updateActiveSection = () => {
      const threshold = getThreshold();
      let activeSectionId = sections[0];
      let bestScore = Infinity;
      
      // Single pass: find the section whose top is closest to the threshold
      // Prioritize sections that are visible in the viewport (top >= 0)
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const sectionTop = rect.top;
          const distance = Math.abs(sectionTop - threshold);
          
          // Prioritize visible sections (in viewport) over those above viewport
          // If section is visible (top >= 0), use the distance as-is
          // If section is above viewport (top < 0), add a penalty to prefer visible sections
          const isVisible = sectionTop >= 0;
          const score = isVisible ? distance : distance + 1000; // Large penalty for non-visible
          
          if (score < bestScore) {
            bestScore = score;
            activeSectionId = sectionId;
          }
        }
      }
      
      setActiveSection(activeSectionId);
    };
    
    // On mobile, use continuous RAF polling for reliable updates during momentum scrolling
    // On desktop, use scroll events with throttling
    let rafId = null;
    let isActive = true;
    
    if (isMobile) {
      // Continuous polling on mobile using requestAnimationFrame
      // This ensures updates even during momentum scrolling when scroll events don't fire
      const poll = () => {
        if (isActive) {
          updateActiveSection();
          rafId = requestAnimationFrame(poll);
        }
      };
      
      // Start continuous polling
      rafId = requestAnimationFrame(poll);
      
      // Handle resize to update threshold (e.g., when address bar shows/hides)
      const handleResize = () => {
        updateActiveSection();
      };
      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('orientationchange', handleResize, { passive: true });
      
      // Initial check
      updateActiveSection();
      
      return () => {
        isActive = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    } else {
      // Desktop: use throttled scroll events
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateActiveSection();
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Also update when smooth scroll completes
      const handleScrollEnd = () => {
        updateActiveSection();
      };
      
      if ('onscrollend' in window) {
        window.addEventListener('scrollend', handleScrollEnd, { passive: true });
      }
      
      // Initial check
      updateActiveSection();
      
      // Periodic check as backup
      const intervalId = setInterval(updateActiveSection, 100);
      
      // Handle resize to update threshold
      const handleResize = () => {
        updateActiveSection();
      };
      window.addEventListener('resize', handleResize, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if ('onscrollend' in window) {
          window.removeEventListener('scrollend', handleScrollEnd);
        }
        window.removeEventListener('resize', handleResize);
        clearInterval(intervalId);
      };
    }
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { id: 'hero', label: 'Index' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'websites', label: 'Websites' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-2 md:top-10 right-2 md:right-10 z-[100] font-mono text-[10px] md:text-xs uppercase tracking-widest max-w-[calc(100vw-1rem)]">
      <ul className="flex flex-wrap gap-1.5 md:gap-8 justify-end">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
              className={`transition-colors duration-300 ${
                activeSection === item.id
                  ? 'text-mondrian-blue'
                  : 'text-text-dim hover:text-mondrian-blue'
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;

