import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { projects } from '../data/projects';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1, once: true });
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section
      id="projects"
      ref={ref}
      className="pt-20 pb-8 px-10 max-w-[1600px] mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold mb-12 text-center"
      >
        Projects
      </motion.h2>

      {/* Projects Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="wait">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="slab overflow-hidden cursor-pointer group"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-48 overflow-hidden">
                {project.image && project.image !== '/api/placeholder/600/400' ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className={`w-full h-full ${project.id === 2 ? 'object-cover' : 'object-cover'}`}
                    style={project.id === 2 ? { objectPosition: '45% center' } : {}}
                    loading="lazy"
                  />
                ) : null}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundColor: project.id % 5 === 0 ? 'rgba(0, 82, 255, 0.1)' : 
                    project.id % 5 === 1 ? 'rgba(230, 0, 18, 0.1)' : 
                    project.id % 5 === 2 ? 'rgba(255, 235, 0, 0.1)' :
                    project.id % 5 === 3 ? 'rgba(255, 235, 0, 0.08)' : 'rgba(0, 82, 255, 0.08)'
                  }}
                  whileHover={{ opacity: 1 }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  {project.featured && (
                    <span className="text-xs font-mono text-mondrian-red border border-mondrian-red px-2 py-1">
                      FEATURED
                    </span>
                  )}
                </div>
                <p className="text-text-dim text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono text-text-dim border border-text-dim px-2 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-mondrian-blue hover:text-mondrian-blue/80 transition-colors"
                    >
                      <FaGithub size={20} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-mondrian-blue hover:text-mondrian-blue/80 transition-colors"
                    >
                      <FaExternalLinkAlt size={20} />
                    </a>
                  )}
                  {project.reportUrl && (
                    <a
                      href={project.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-mondrian-blue hover:text-mondrian-blue/80 transition-colors"
                    >
                      <FaExternalLinkAlt size={20} />
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="slab max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-text-dim hover:text-mondrian-blue text-2xl"
              >
                ×
              </button>
              <h2 className="text-3xl font-bold mb-4">{selectedProject.title}</h2>
              <p className="text-text-dim mb-6">{selectedProject.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm font-mono border"
                    style={{ 
                      borderColor: selectedProject.id % 5 === 0 ? '#0052FF' : 
                      selectedProject.id % 5 === 1 ? '#E60012' : 
                      selectedProject.id % 5 === 2 ? '#FFEB00' :
                      selectedProject.id % 5 === 3 ? '#0052FF' : '#E60012',
                      color: selectedProject.id % 5 === 0 ? '#0052FF' : 
                      selectedProject.id % 5 === 1 ? '#E60012' : 
                      selectedProject.id % 5 === 2 ? '#FFEB00' :
                      selectedProject.id % 5 === 3 ? '#0052FF' : '#E60012'
                    }}
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
                    className="px-6 py-3 border border-accent text-accent font-mono text-sm uppercase tracking-wider hover:bg-accent hover:text-bg transition-colors"
                  >
                    View Live
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-accent text-accent font-mono text-sm uppercase tracking-wider hover:bg-accent hover:text-bg transition-colors"
                  >
                    View Code
                  </a>
                )}
                {selectedProject.reportUrl && (
                  <a
                    href={selectedProject.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-accent text-accent font-mono text-sm uppercase tracking-wider hover:bg-accent hover:text-bg transition-colors"
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

