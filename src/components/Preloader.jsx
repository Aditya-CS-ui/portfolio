import { useEffect, useRef, useState } from 'react';
import { startPreloader } from '../engines/preloader.js';

export default function Preloader() {
  const pre = useRef(null), canvas = useRef(null);
  const [gone, setGone] = useState(false);
  useEffect(() => startPreloader({ pre: pre.current, canvas: canvas.current, onDone: () => setGone(true) }), []);
  if (gone) return null;
  return <div id="pre" aria-hidden="true" ref={pre}><canvas id="pc" ref={canvas} /></div>;
}
