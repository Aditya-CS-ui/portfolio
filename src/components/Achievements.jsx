import { ACHIEVEMENTS } from '../data/content.js';

export default function Achievements() {
  return (
    <section className="section" id="achievements"><p className="eyebrow" data-reveal="">Recognition</p><h2 data-reveal="" style={{ '--rd': '80ms' }}>Achievements</h2>
      <div className="ach" id="ach">
        {ACHIEVEMENTS.map(([d, t, x], i) => <div key={t} className="ach-row glass" data-reveal="" style={{ '--rd': i * 80 + 'ms' }}><time>{d}</time><div><h3>{t}</h3><p>{x}</p></div></div>)}
      </div></section>
  );
}
