import { useState } from 'react';

const LINKS = [['work', 'Work'], ['research', 'Research'], ['leadership', 'Leadership'], ['journey', 'Journey'], ['skills', 'Skills'], ['contact', 'Contact']];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header><div className="nav"><a className="brand" href="#top"><span className="brand-mark">▲</span>Aditya Gaurav</a>
      <nav id="nv" aria-label="Primary" className={open ? 'o' : undefined}>
        {LINKS.map(([id, name]) => <a key={id} href={'#' + id} onClick={() => setOpen(false)}>{name}</a>)}
      </nav>
      <button className="btn btn-ghost" id="mb" aria-expanded={open} aria-controls="nv" onClick={() => setOpen(o => !o)}>Menu</button></div></header>
  );
}
