import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('TAGZILLA: Starting application...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('TAGZILLA: Root element found, creating React root...');
  const root = createRoot(rootElement);
  
  console.log('TAGZILLA: Rendering App component...');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log('TAGZILLA: App rendered successfully');
} catch (error) {
  console.error('TAGZILLA: Failed to render app:', error);
}
