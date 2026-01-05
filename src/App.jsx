import CustomCursor from './components/CustomCursor';
import GrainOverlay from './components/GrainOverlay';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Websites from './sections/Websites';
import Contact from './sections/Contact';

function App() {
  return (
    <>
      <CustomCursor />
      <GrainOverlay />
      <Navigation />
      
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Websites />
        <Contact />
      </main>
      
      <Footer />
    </>
  );
}

export default App;
