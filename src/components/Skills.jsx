import { SKILLS } from '../data/content.js';

export default function Skills() {
  return (
    <section className="section" id="skills"><p className="eyebrow" data-reveal="">Toolkit</p><h2 data-reveal="" style={{ '--rd': '80ms' }}>Skills</h2>
      <div className="skills" id="skill-grid">
        {SKILLS.map(([n, v], i) => <div key={n} className="skill glass" data-reveal="" style={{ '--rd': (i % 2) * 90 + 'ms' }}><h3>{n}</h3><div className="chips">{v.split(', ').map(x => <span key={x}>{x}</span>)}</div></div>)}
      </div></section>
  );
}
