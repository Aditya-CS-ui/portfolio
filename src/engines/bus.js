// One-shot flags shared by the preloader, the 3D Earth and the page: 'earth-ready' and 'boot-done'.
// A flag can only be set once; a listener added after it was set runs straight away.
const set = new Set(), subs = {};
export const bus = {
  is: k => set.has(k),
  set(k) { if (set.has(k)) return; set.add(k); const l = subs[k] || []; delete subs[k]; l.forEach(f => f()); },
  once(k, f) { if (set.has(k)) f(); else (subs[k] ||= []).push(f); },
};
