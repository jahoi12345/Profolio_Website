import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const About = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  return (
    <section
      id="about"
      ref={ref}
      className="pt-20 pb-8 px-10 max-w-[1600px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column - Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center"
        >
          <div className="slab relative overflow-hidden aspect-[3/4] w-full">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={isVisible ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            src={`${import.meta.env.BASE_URL}CASEheadshots-Elisa-188.jpg`}
            alt="James Li"
            className="w-full h-full object-cover"
          />
          </div>
        </motion.div>

        {/* Right Column - Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col justify-center space-y-6 h-full"
        >
          <h2 className="text-4xl font-extrabold mb-4">About Me</h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-text-dim leading-relaxed"
          >
            I'm a data scientist and economics student at Northwestern University, 
            passionate about uncovering insights through statistical analysis and 
            economic modeling. I combine my technical skills in Python, SQL, and 
            machine learning with economic theory to solve complex problems and 
            drive data-driven decision-making.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-text-dim leading-relaxed"
          >
            Through my internships at Outside VC, Nexad, and other organizations, 
            I've built AI automation agents, developed classification models, and 
            created interactive data visualizations. I also enjoy coding web applications 
            and exploring the intersection of data science, economics, and creative technology.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

