
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeCapacitor } from './capacitor-plugins';

// تهيئة Capacitor للتطبيق المحمول
initializeCapacitor();

createRoot(document.getElementById("root")!).render(<App />);
