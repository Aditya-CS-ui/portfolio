import { asset } from '../asset.js';

export default function Leadership() {
  return (
    <section className="section" id="leadership"><p className="eyebrow" data-reveal="">Leadership</p><h2 data-reveal="" style={{ '--rd': '80ms' }}>Development Team Lead, WikiClub Tech UU</h2>
      <div className="lead-box" data-reveal="" style={{ '--rd': '140ms' }}><img className="club-logo" loading="lazy" decoding="async" src={asset('wikiclub-logo.svg')} alt="WikiClub Tech UU logo" onError={e => { e.currentTarget.style.display = 'none' }} width="110" height="110" /><div>
        <p>As Development Team Lead at WikiClub Tech UU, the university tech club at United University, Prayagraj, I help lead the development and maintenance of the club's website and digital platforms, coordinate technical projects, review code, and support open-source contributions across club initiatives.</p>
        <ul><li>Website and platforms</li><li>Technical projects</li><li>Development workflow</li><li>Code review</li><li>Open-source contributions</li></ul></div></div></section>
  );
}
