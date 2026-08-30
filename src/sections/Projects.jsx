import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { projects } from '../data/projects';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1, once: true });
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))],
    []
  );

  const visibleProjects = useMemo(
    () =>
      activeCategory === 'All'
        ? projects
        : projects.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  return (
    <section
      id="projects"
      ref={ref}
      className="pt-10 pb-20 px-6 md:px-10 max-w-[1600px] mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-extrabold mb-6"
      >
        Projects
      </motion.h2>

      {/* Category Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-10"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`filter-pill ${activeCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -3 }}
              className="slab overflow-hidden cursor-pointer group"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-44 overflow-hidden bg-slab-surface">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 transition-all duration-300"
                    style={project.id === 2 ? { objectPosition: '45% center' } : {}}
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-base font-bold leading-snug">{project.title}</h3>
                  {project.featured && (
                    <span className="shrink-0 text-[10px] font-mono text-mondrian-yellow tracking-wider mt-1">
                      FEATURED
                    </span>
                  )}
                </div>
                {project.category && (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-3">
                    {project.category}
                  </p>
                )}
                <p className="text-text-dim text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-text-dim hover:text-mondrian-yellow transition-colors"
                    >
                      <FaGithub size={16} />
                    </a>
                  )}
                  {(project.liveUrl || project.reportUrl) && (
                    <a
                      href={project.liveUrl || project.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-text-dim hover:text-mondrian-yellow transition-colors"
                    >
                      <FaExternalLinkAlt size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="slab max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-text-dim hover:text-mondrian-yellow text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
              {selectedProject.category && (
                <p className="font-mono text-xs uppercase tracking-widest text-mondrian-yellow mb-2">
                  {selectedProject.category}
                </p>
              )}
              <h2 className="text-2xl font-bold mb-4">{selectedProject.title}</h2>
              <p className="text-text-dim mb-6 leading-relaxed">{selectedProject.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-mono border border-slab-edge text-text-dim"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 flex-wrap">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 border border-mondrian-yellow text-mondrian-yellow font-mono text-xs uppercase tracking-wider hover:bg-mondrian-yellow hover:text-bg transition-colors"
                  >
                    View Live
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 border border-mondrian-yellow text-mondrian-yellow font-mono text-xs uppercase tracking-wider hover:bg-mondrian-yellow hover:text-bg transition-colors"
                  >
                    View Code
                  </a>
                )}
                {selectedProject.reportUrl && (
                  <a
                    href={selectedProject.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 border border-mondrian-yellow text-mondrian-yellow font-mono text-xs uppercase tracking-wider hover:bg-mondrian-yellow hover:text-bg transition-colors"
                  >
                    View Report
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
