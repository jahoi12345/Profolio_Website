import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { skills } from '../data/skills';

const Skills = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  return (
    <section
      id="skills"
      ref={ref}
      className="pt-8 pb-20 px-10 max-w-[1600px] mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold mb-10 text-center"
      >
        Skills
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
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
                    delay: 0.2 + categoryIndex * 0.1 + skillIndex * 0.03 
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
    </section>
  );
};

export default Skills;


