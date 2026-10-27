import { useEffect, useRef } from 'react';
import { startScan } from '../engines/scan.js';

export default function Research() {
  const cv = useRef(null);
  useEffect(() => startScan(cv.current), []);
  return (
    <section className="section" id="research"><p className="eyebrow" data-reveal="">Research</p><h2 data-reveal="" style={{ '--rd': '80ms' }}>Malaria parasite classification</h2>
      <p className="sub" data-reveal="" style={{ '--rd': '140ms' }}>Classifies blood-smear images as parasitized or uninfected using Otsu thresholding, morphological operations, feature extraction, and GWO-based feature selection. SHAP was used for explainability.</p>
      <figure className="scan" data-reveal=""><canvas id="cv" ref={cv} role="img" aria-label="Animated illustration of a simulated blood-smear scan detecting parasitized cells" /><figcaption>Simulated blood-smear scan</figcaption></figure>
      <div className="research"><div className="glass" data-reveal=""><b>95.25%</b><small>Test accuracy with SVM</small></div><div className="glass" data-reveal="" style={{ '--rd': '90ms' }}><b>146 → 19</b><small>Features after selection</small></div><div className="glass" data-reveal="" style={{ '--rd': '180ms' }}><b>3+</b><small>Models compared, including Random Forest and stacking</small></div></div></section>
  );
}
