import { lazy, Suspense } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

// The Three.js scene (canvas, particle logos, post-processing) is the single
// biggest chunk of this app's JS -- lazy-loaded, and only mounted once this
// section scrolls near the viewport, so a visitor who never gets this far
// never pays for downloading or running it.
const WebsitesCanvas = lazy(() => import('./WebsitesCanvas'))

const Websites = () => {
  const [ref, isNear] = useScrollAnimation({ threshold: 0, rootMargin: '400px 0px', once: true })

  return (
    <section
      id="websites"
      className="pt-8 pb-6 md:py-16 px-6 md:px-10 max-w-[1600px] mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Websites</h2>
        <p className="text-text-dim">
          Interactive web experiences built with modern technologies and creative design.
        </p>
      </div>

      {/* Fixed-size container so the placeholder-to-canvas swap causes no
          layout shift; background matches the canvas's own clear color. */}
      <div ref={ref} className="h-[400px] md:h-[600px] w-full" style={{ background: '#0a0a0a' }}>
        {isNear && (
          <Suspense fallback={null}>
            <WebsitesCanvas />
          </Suspense>
        )}
      </div>
    </section>
  );
};

export default Websites;
