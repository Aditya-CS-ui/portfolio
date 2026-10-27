import { useEffect, useRef } from 'react';
import { bus } from '../engines/bus.js';
import { asset } from '../asset.js';

const STATS = [{ n: 95.25, d: 2, s: '%', label: 'SVM test accuracy' }, { n: 4, label: 'Hackathons' }, { n: 8, label: 'Projects and studies' }];

// counts up from zero once visible; starts after the preloader bursts, so visitors see it count
function Stat({ n, d = 0, s = '', label }) {
  const el = useRef(null);
  useEffect(() => {
    let io = null, raf = 0;
    bus.once('boot-done', () => {
      io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return; io.disconnect();
        if (matchMedia('(prefers-reduced-motion:reduce)').matches) { el.current.textContent = n.toFixed(d) + s; return }
        const t0 = performance.now();
        (function f(t) { const p = Math.min(1, (t - t0) / 1500); el.current.textContent = (n * (1 - Math.pow(1 - p, 3))).toFixed(d) + s; if (p < 1) raf = requestAnimationFrame(f) })(t0);
      }));
      io.observe(el.current);
    });
    return () => { io && io.disconnect(); cancelAnimationFrame(raf) };
  }, [n, d, s]);
  return <div><b ref={el}>{n.toFixed(d) + s}</b><small>{label}</small></div>;
}

export default function Hero() {
  return (
    <section className="hero2">
      <div className="hero-top">
        <span className="avatar-wrap" data-reveal="" style={{ '--rd': '20ms' }}><img className="avatar" fetchPriority="high" src={asset('Aditya%20Gaurav.jpeg')} alt="Aditya Gaurav" onError={e => { e.currentTarget.parentNode.style.display = 'none' }} /></span>
        <p className="eyebrow" data-reveal="" style={{ '--rd': '60ms' }}>Developer · AI Researcher</p>
        <h1 data-reveal="" style={{ '--rd': '120ms' }}>Aditya <em>Gaurav</em></h1>
        <p className="role" data-reveal="" style={{ '--rd': '180ms' }}>Full-stack developer, medical AI researcher, Development Team Lead</p>
        <p className="lead" data-reveal="" style={{ '--rd': '240ms' }}>I build secure web products and explainable medical AI. I'm a B.Tech Computer Science student at United University, Prayagraj, and Development Team Lead at WikiClub Tech UU.</p>
        <div className="btns" data-reveal="" style={{ '--rd': '320ms' }}><a className="btn btn-primary" href="#work">See my work <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></a><a className="btn btn-outline" href="#contact">Get in touch</a></div>
      </div>
      <div className="hero-bottom" data-reveal="" style={{ '--rd': '420ms' }}>
        <p className="avail"><i></i>Open to internships, freelance work, and research collaborations</p>
        <div className="stats">{STATS.map(st => <Stat key={st.label} {...st} />)}</div>
      </div>
    </section>
  );
}
