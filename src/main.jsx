import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AlgoViz from './algoviz';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AlgoViz />
  </StrictMode>,
);
