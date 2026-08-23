import { StrictMode, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import App from './App';
import NotFound from './components/NotFound';
import PrivacyPage from './pages/Privacy';
import Resources from './pages/Resources';
import ResourceArticle from './pages/ResourceArticle';
import StateChecklist from './pages/StateChecklist';
import { getResourceBySlug } from './data/resources';
import { getChecklistBySlug } from './data/checklists';
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

// Static hosts (nginx, DO App Platform, …) canonicalize directory URLs to
// the trailing-slash form via 301 (`/resources` -> `/resources/`). Strip
// trailing slashes so the client router matches the same pages the
// prerenderer wrote in both forms; `/` must survive the strip.
const path = window.location.pathname.replace(/\/+$/, '') || '/';
const resourceMatch = path.match(/^\/resources\/([a-z0-9-]+)$/);
const article = resourceMatch ? getResourceBySlug(resourceMatch[1]) : undefined;
const checklistMatch = path.match(/^\/checklist\/([a-z]+)$/);
const checklist = checklistMatch ? getChecklistBySlug(checklistMatch[1]) : undefined;

let page: ReactElement;
if (path === '/') {
  page = <App />;
} else if (path === '/resources') {
  page = <Resources />;
} else if (path === '/privacy') {
  page = <PrivacyPage />;
} else if (article) {
  page = <ResourceArticle article={article} />;
} else if (checklist) {
  page = <StateChecklist checklist={checklist} />;
} else {
  page = <NotFound />;
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>{page}</ThemeProvider>
  </StrictMode>,
);
