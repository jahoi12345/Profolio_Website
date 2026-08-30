import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { skills } from '../data/skills';

const Skills = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  return (
    <section
      id="skills"
      ref={ref}
      className="pt-8 pb-16 px-6 md:px-10 max-w-[1600px] mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-extrabold mb-8"
      >
        Skills
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: categoryIndex * 0.06 }}
            className="slab p-6"
          >
            <h4 className="font-mono text-sm mb-4 uppercase tracking-wider text-mondrian-yellow">
              {category.category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {category.items.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-xs font-mono border border-slab-edge text-text-dim hover:border-mondrian-yellow hover:text-mondrian-yellow transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
