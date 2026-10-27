import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// start downloading the 3D Earth (three.js) right away, in parallel with the first render
const earthModule = import('./engines/earth.js');

createRoot(document.getElementById('root')).render(<App earthModule={earthModule} />);
