import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Planet = () => {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#00f2ff"
        emissive="#00f2ff"
        emissiveIntensity={0.2}
        metalness={0.8}
        roughness={0.2}
      />
      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1}
        enablePan={false}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={300} depth={50} count={2000} factor={4} fade speed={0.5} />
    </mesh>
  );
};

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
      className="pt-6 pb-10 md:min-h-screen md:py-20 px-10 max-w-[1600px] mx-auto relative"
    >
      {/* Three.js Planet Background */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-20 pointer-events-none hidden md:block">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Planet />
          </Canvas>
        </Suspense>
      </div>

      <div className="slab p-12 md:p-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          {/* Left Side - Title */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              GET IN
              <br />
              TOUCH
            </h2>
            <p className="text-text-dim text-lg">
              I'm always open to discussing new opportunities, collaborations, 
              or just having a conversation. Feel free to reach out!
            </p>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-6">
              <div>
                <p className="text-text-dim mb-4">
                  Feel free to reach out via email or connect through social media.
                </p>
                <motion.a
                  href="mailto:james.li.northwestern@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 border border-mondrian-blue text-mondrian-blue font-mono text-sm uppercase tracking-wider hover:bg-mondrian-blue hover:text-bg transition-colors inline-block text-center"
                >
                  SEND EMAIL
                </motion.a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-6 pt-6 border-t border-slab-edge">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-dim hover:text-mondrian-blue transition-colors"
                  aria-label={label}
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

