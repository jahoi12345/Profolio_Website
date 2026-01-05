import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { skills } from '../data/skills';

const About = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen py-20 px-10 max-w-[1600px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column - Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="slab relative overflow-hidden aspect-[3/4] w-full"
        >
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={isVisible ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            src="/CASEheadshots-Elisa-188.jpg"
            alt="James Li"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Right Column - Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col justify-center space-y-6"
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

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-20"
      >
        <h3 className="text-3xl font-bold mb-10 text-center">Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 + categoryIndex * 0.1 }}
              className="slab p-6"
            >
              <h4 
                className="font-mono text-sm mb-4 uppercase tracking-wider"
                style={{ 
                  color: categoryIndex % 3 === 0 ? '#0052FF' : categoryIndex % 3 === 1 ? '#E60012' : '#FFEB00' 
                }}
              >
                {category.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ 
                      duration: 0.3, 
                      delay: 1.2 + categoryIndex * 0.1 + skillIndex * 0.03 
                    }}
                    className="px-3 py-1.5 text-xs font-mono border transition-colors hover:scale-105"
                    style={{ 
                      borderColor: skillIndex % 3 === 0 ? '#0052FF' : skillIndex % 3 === 1 ? '#E60012' : '#FFEB00',
                      color: skillIndex % 3 === 0 ? '#0052FF' : skillIndex % 3 === 1 ? '#E60012' : '#FFEB00'
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About;

