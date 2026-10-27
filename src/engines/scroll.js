// Smooth scrolling (Lenis). It is driven from the Earth's render loop so the page and the planet move in the same frame.
import Lenis from 'lenis';

let lenis = null;
export const getLenis = () => lenis;

export function initScroll({ reduce }) {
  if (reduce || lenis) return lenis;
  lenis = new Lenis({ lerp: 0.07, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.6, syncTouch: false, anchors: false });
  if (document.querySelector('.pop[open]')) lenis.stop();
  // in-page links glide to an exact position: the section top, just below the sticky header
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href').slice(1), el = id && document.getElementById(id); if (!el) return;
    e.preventDefault();
    const y = id === 'top' ? 0 : el.getBoundingClientRect().top + scrollY - document.querySelector('header').offsetHeight - 14;
    lenis.scrollTo(Math.max(0, y)); history.replaceState(null, '', '#' + id);
  });
  return lenis;
}
