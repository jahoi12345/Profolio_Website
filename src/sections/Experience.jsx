import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { experience } from '../data/experience';

const Experience = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1, once: true });
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section
      id="experience"
      ref={ref}
      className="pt-8 pb-20 px-10 max-w-[1600px] mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold mb-16 text-center"
      >
        Experience
      </motion.h2>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slab-edge hidden md:block" />

        <div className="space-y-12">
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative pl-0 md:pl-20"
            >
              {/* Timeline Dot - Alternating Mondrian Colors (WCAG Accessible) */}
              <div 
                className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-bg hidden md:block z-10"
                style={{ 
                  backgroundColor: index % 3 === 0 ? '#4A9CFF' : index % 3 === 1 ? '#FF5252' : '#FFEB00' 
                }}
              />

              <motion.div
                whileHover={{ y: -5, scale: 1.01 }}
                className="slab p-8 cursor-pointer"
                onClick={() => toggleExpand(exp.id)}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{exp.role}</h3>
                    <p 
                      className="font-mono text-sm mb-2"
                      style={{ 
                        color: index % 3 === 0 ? '#4A9CFF' : index % 3 === 1 ? '#FF5252' : '#FFEB00' 
                      }}
                    >
                      {exp.company}
                    </p>
                    <p className="text-text-dim text-sm">{exp.period}</p>
                    {exp.location && (
                      <p className="text-text-dim text-xs mt-1">{exp.location}</p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 md:mt-0 font-mono text-xs uppercase tracking-wider"
                    style={{ 
                      color: index % 3 === 0 ? '#4A9CFF' : index % 3 === 1 ? '#FF5252' : '#FFEB00' 
                    }}
                  >
                    {expandedId === exp.id ? 'LESS' : 'MORE'}
                  </motion.button>
                </div>

                <p className="text-text-dim mb-4">{exp.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono border border-text-dim text-text-dim"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <AnimatePresence>
                  {expandedId === exp.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-slab-edge">
                        <h4 
                          className="font-mono text-sm mb-3 uppercase tracking-wider"
                          style={{ 
                            color: index % 3 === 0 ? '#4A9CFF' : index % 3 === 1 ? '#FF5252' : '#FFEB00' 
                          }}
                        >
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="text-text-dim flex items-start">
                              <span 
                                className="mr-2"
                                style={{ 
                                  color: index % 3 === 0 ? '#4A9CFF' : index % 3 === 1 ? '#FF5252' : '#FFEB00' 
                                }}
                              >
                                ▸
                              </span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;

