import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Mondrian from '../three/MondrianComposition';

const ParticleScene = () => {
  return (
    <>
      <Stars radius={300} depth={50} count={5000} factor={4} fade speed={1} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      <ambientLight intensity={0.5} />
    </>
  );
};

const Hero = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  return (
    <section
      id="hero"
      ref={ref}
      className="slab min-h-screen grid grid-cols-1 md:grid-cols-12 gap-5 p-6 md:p-10 max-w-[1600px] mx-auto relative"
    >
      {/* Background 3D Scene */}
      <div className="absolute inset-0 opacity-30">
        <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-accent/10 to-transparent" />}>
          <Canvas camera={{ position: [0, 0, 5] }} gl={{ antialias: true }}>
            <ParticleScene />
          </Canvas>
        </Suspense>
      </div>

      {/* Content */}
      <div className="md:col-span-7 flex flex-col justify-end pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-mono text-mondrian-blue text-sm mb-2"
        >
          /// DATA SCIENCE & ECONOMICS & FILM
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.04em] mb-5"
        >
          JAMES
          <br />
          LI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-text-dim text-lg max-w-2xl"
        >
          Transforming data into insights through statistical analysis, 
          economic modeling, and interactive visualizations that tell compelling stories.
        </motion.p>
      </div>

      {/* Mondrian Composition - Right side */}
      <div className="md:col-span-5 flex items-center justify-end relative z-10 h-full w-full overflow-visible">
        <div className="w-[200%] h-full min-w-[800px] -ml-[50%]">
          <Suspense fallback={<div className="w-full h-full" />}>
            <Canvas shadows camera={{ position: [0, 0, 75], fov: 45 }}>
              <color attach="background" args={['#111111']} />
              
              {/* Lights setup to emphasize depth differences */}
              <ambientLight intensity={1.4} />
              <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2.5} castShadow />
              <pointLight position={[-10, -10, 10]} intensity={1.7} />
              
              <Mondrian />
              
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                minDistance={75}
                maxDistance={75}
              />
            </Canvas>
          </Suspense>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 rounded-full flex items-center justify-center"
          style={{ borderColor: '#FFEB00' }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#FFEB00' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
