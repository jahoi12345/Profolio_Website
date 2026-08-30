import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const About = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  return (
    <section
      id="about"
      ref={ref}
      className="pt-10 pb-16 px-6 md:px-10 max-w-[1600px] mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 md:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="slab overflow-hidden aspect-square w-full max-w-[220px]"
        >
          <img
            src={`${import.meta.env.BASE_URL}CASEheadshots-Elisa-188.jpg`}
            alt="James Li"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-5">About</h2>
          <p className="text-text-dim leading-relaxed max-w-2xl">
            I'm a data scientist and economics student at Northwestern University.
            I like turning messy data into clear stories &mdash; through statistical
            analysis, economic modeling, and interactive visualization.
          </p>
          <p className="text-text-dim leading-relaxed max-w-2xl mt-4">
            Through internships at Outside VC, Nexad, and Walmart, I've built AI
            automation agents, classification models, and data pipelines. Outside
            of work I build side projects at the intersection of data, economics,
            and creative code &mdash; most of what's below started as one.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
