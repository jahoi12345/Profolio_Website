import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  const socialLinks = [
    { icon: FaGithub, url: 'https://github.com', label: 'GitHub' },
    { icon: FaLinkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FaTwitter, url: 'https://twitter.com', label: 'Twitter' },
    { icon: FaEnvelope, url: 'mailto:james.li.northwestern@gmail.com', label: 'Email' },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="pt-10 pb-16 px-6 md:px-10 max-w-[1600px] mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="slab p-8 md:p-14"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold mb-4">Get in touch</h2>
            <p className="text-text-dim">
              I'm always open to discussing new opportunities, collaborations,
              or just having a conversation. Feel free to reach out.
            </p>
          </div>

          <div className="space-y-6">
            <a
              href="mailto:james.li.northwestern@gmail.com"
              className="w-full px-8 py-4 border border-mondrian-yellow text-mondrian-yellow font-mono text-sm uppercase tracking-wider hover:bg-mondrian-yellow hover:text-bg transition-colors inline-block text-center"
            >
              Send Email
            </a>

            <div className="flex gap-6 pt-6 border-t border-slab-edge">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-dim hover:text-mondrian-yellow transition-colors"
                  aria-label={label}
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
