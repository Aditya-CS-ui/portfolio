// Research section: an animated, simulated blood-smear scan drawn on a 2D canvas.
export function startScan(cv) {
  const RM = matchMedia('(prefers-reduced-motion:reduce)').matches, x = cv.getContext('2d');
  let W, cells = [], sx = 0, run = true, raf = 0, stopped = false;
  function sz() { const d = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; cv.width = cv.height = W * d; x.setTransform(d, 0, 0, d, 0, 0); cells = Array.from({ length: 24 }, () => ({ x: Math.random() * W, y: Math.random() * W, r: W * (.05 + Math.random() * .03), vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, inf: Math.random() < .35, t: RM ? 1 : 0 })) }
  function fr() {
    const g = x.createRadialGradient(W / 2, W / 2, W * .1, W / 2, W / 2, W / 2); g.addColorStop(0, '#0c1226'); g.addColorStop(1, '#060a18'); x.fillStyle = g; x.fillRect(0, 0, W, W); if (!RM) sx = (sx + W * .004) % (W * 1.15);
    for (const c of cells) {
      if (!RM) { c.x = (c.x + c.vx + W) % W; c.y = (c.y + c.vy + W) % W; if (Math.abs(c.x - sx) < W * .006) c.t = 1; c.t = Math.max(0, c.t - .005) }
      x.beginPath(); x.arc(c.x, c.y, c.r, 0, 7); x.fillStyle = 'rgba(150,175,230,.1)'; x.fill(); x.lineWidth = 1; x.strokeStyle = 'rgba(150,175,230,.4)'; x.stroke();
      if (c.inf) { x.fillStyle = '#9aa6c4'; x.beginPath(); x.arc(c.x + c.r * .25, c.y - c.r * .15, c.r * .16, 0, 7); x.fill() }
      if (c.t > 0) { const k = c.inf ? '#ffd27a' : '#5df0a8'; x.globalAlpha = Math.min(1, c.t * 2); x.strokeStyle = x.fillStyle = k; x.lineWidth = 2; x.beginPath(); x.arc(c.x, c.y, c.r + 6, 0, 7); x.stroke(); x.font = '600 12px Inter,sans-serif'; x.fillText(c.inf ? 'Parasitized' : 'Uninfected', c.x - c.r, c.y - c.r - 10); x.globalAlpha = 1 }
    }
    if (!RM) { const l = x.createLinearGradient(sx - 50, 0, sx, 0); l.addColorStop(0, 'rgba(93,240,168,0)'); l.addColorStop(1, 'rgba(93,240,168,.3)'); x.fillStyle = l; x.fillRect(sx - 50, 0, 50, W); x.fillStyle = '#5df0a8'; x.fillRect(sx, 0, 2, W) }
  }
  function loop() { if (stopped) return; if (run && !document.hidden) fr(); if (!RM) raf = requestAnimationFrame(loop) }
  const onResize = () => { if (cv.clientWidth === W) return; sz(); if (RM) fr() };
  sz(); addEventListener('resize', onResize);
  const io = new IntersectionObserver(e => run = e[0].isIntersecting); io.observe(cv);
  if (RM) fr(); else loop();
  return () => { stopped = true; cancelAnimationFrame(raf); removeEventListener('resize', onResize); io.disconnect() };
}
