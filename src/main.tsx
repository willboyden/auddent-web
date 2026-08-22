import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import App from './App';
import NotFound from './components/NotFound';
import { theme } from './theme';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root is missing');
}

const isHome = window.location.pathname === '/';

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      {isHome ? <App /> : <NotFound />}
    </ThemeProvider>
  </StrictMode>,
);
