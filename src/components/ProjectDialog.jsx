import { useEffect, useRef } from 'react';
import { getLenis } from '../engines/scroll.js';

// Project details popup. Page scrolling is paused while it is open; it closes on Back, Escape or a backdrop click.
export default function ProjectDialog({ project, onClosed }) {
  const dlg = useRef(null);
  useEffect(() => {
    const d = dlg.current;
    if (project && !d.open) { getLenis()?.stop(); d.showModal() }
  }, [project]);
  const close = () => dlg.current.close();
  const p = project;
  return (
    <dialog className="pop" aria-labelledby="pop-t" data-lenis-prevent="" ref={dlg}
      onClick={e => { if (e.target === e.currentTarget) close() }}
      onClose={() => { getLenis()?.start(); onClosed() }}>
      {p && <div className="pop-in"><button className="back" type="button" onClick={close}>&larr; Back</button><div className="pop-meta"><span className="track">{p.track}</span><span className={'status ' + p.st}>{p.label}</span></div><h3 id="pop-t">{p.t}</h3><p>{p.d}</p>{p.o ? <p className="outcome">{p.o}</p> : null}{p.x.map(h => <div className="xd" key={h[0]}><h4>{h[0]}</h4><p>{h[1]}</p></div>)}<p className="stack">{p.s}</p></div>}
    </dialog>
  );
}
