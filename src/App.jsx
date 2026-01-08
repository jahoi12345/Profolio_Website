import CustomCursor from './components/CustomCursor';
import GrainOverlay from './components/GrainOverlay';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Websites from './sections/Websites';
import Contact from './sections/Contact';

function App() {
  return (
    <>
      {/* Skip link for keyboard accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <CustomCursor />
      <GrainOverlay />
      <Navigation />
      
      <main id="main-content" tabIndex="-1">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Websites />
        <Contact />
      </main>
      
      <Footer />
    </>
  );
}

export default App;
