import { useEffect, useRef, useState } from 'react';
import { bus } from './engines/bus.js';
import Preloader from './components/Preloader.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Work from './components/Work.jsx';
import Research from './components/Research.jsx';
import Leadership from './components/Leadership.jsx';
import Achievements from './components/Achievements.jsx';
import Journey from './components/Journey.jsx';
import Skills from './components/Skills.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ProjectDialog from './components/ProjectDialog.jsx';

export default function App({ earthModule }) {
  const earthCanvas = useRef(null);
  const [project, setProject] = useState(null);

  // the 3D Earth loads as its own chunk (requested in main.jsx), so the preloader starts without waiting for three.js
  useEffect(() => {
    let stop = null, cancelled = false;
    earthModule
      .then(m => { if (!cancelled) stop = m.startEarth(earthCanvas.current) })
      .catch(e => { console.warn('3D Earth failed to load', e); bus.set('earth-ready') });
    return () => { cancelled = true; stop && stop() };
  }, [earthModule]);

  // reveals wait for the preloader burst, so the hero animates in right after it
  useEffect(() => {
    let io = null;
    bus.once('boot-done', () => {
      const els = document.querySelectorAll('[data-reveal]');
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(e => e.classList.add('in')); return }
      io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .18, rootMargin: '0px 0px -8% 0px' });
      els.forEach(e => io.observe(e));
    });
    return () => io && io.disconnect();
  }, []);

  return (
    <>
      <Preloader />
      <canvas className="planet-canvas" aria-hidden="true" ref={earthCanvas} />
      <div className="page" id="top">
        <Header />
        <main>
          <Hero />
          <About />
          <Work onOpen={setProject} />
          <Research />
          <Leadership />
          <Achievements />
          <Journey />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
      <ProjectDialog project={project} onClosed={() => setProject(null)} />
    </>
  );
}
