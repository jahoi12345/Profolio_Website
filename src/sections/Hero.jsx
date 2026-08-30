import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Hero = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  return (
    <section
      id="hero"
      ref={ref}
      className="min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center px-6 md:px-10 max-w-[1600px] mx-auto pt-24 pb-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="font-mono text-mondrian-yellow text-xs md:text-sm tracking-[0.2em] mb-4"
      >
        DATA SCIENCE / ECONOMICS / FILM
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-[clamp(2.75rem,9vw,6.5rem)] font-extrabold leading-[0.95] tracking-[-0.03em]"
      >
        James Li
      </motion.h1>

      <motion.hr
        initial={{ opacity: 0, width: 0 }}
        animate={isVisible ? { opacity: 1, width: 64 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="accent-rule my-6"
      />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="text-text-dim text-base md:text-lg max-w-xl leading-relaxed"
      >
        Hi, glad you're here. This is a collection of the data, econ, and
        creative-coding projects I've built in my free time and at work.
      </motion.p>
    </section>
  );
};

export default Hero;
