import { useState } from 'react';
import { PROJECTS, FILTERS } from '../data/content.js';

export default function Work({ onOpen }) {
  const [filter, setFilter] = useState('all');
  return (
    <section className="section" id="work"><p className="eyebrow" data-reveal="">Selected work</p><h2 data-reveal="" style={{ '--rd': '80ms' }}>Projects that solve real problems</h2>
      <div className="filters" id="filters" role="group" aria-label="Filter projects" data-reveal="">
        {FILTERS.map(([k, n]) => <button key={k} aria-pressed={filter === k} onClick={() => setFilter(k)}>{n}</button>)}
      </div>
      <div className="grid" id="grid">
        {PROJECTS.map((p, i) => (
          // hidden with data-hidden (not a class) so the reveal's imperative 'in' class survives re-renders
          <button key={p.t} type="button" className="card glass" data-reveal="" data-k={p.k} data-hidden={filter === 'all' || filter === p.k ? undefined : ''} style={{ '--rd': (i % 2) * 90 + 'ms' }} onClick={() => onOpen(p)}>
            <span className="top"><span className="track">{p.track}</span><span className={'status ' + p.st}>{p.label}</span></span><h3>{p.t}</h3><p>{p.d}</p><span className="more">View details &rarr;</span>
          </button>
        ))}
      </div></section>
  );
}
