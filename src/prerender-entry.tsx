import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme';
import PrivacyPage from './pages/Privacy';
import ResourcesPage from './pages/Resources';
import ResourceArticlePage from './pages/ResourceArticle';
import StateChecklistPage from './pages/StateChecklist';
import type { ResourceArticle as ArticleData } from './data/resources';
import type { StateChecklist as ChecklistData } from './data/checklists';

/**
 * Node-side renderers for the post-build prerender pass (scripts/prerender.mjs).
 * Emotion is SSR-safe in Node (string sink, no DOM access) and emits the
 * page's styles as inline <style data-emotion> tags in the markup, so the
 * prerendered pages are self-styled; the built CSS bundle (font-face + static
 * CSS) is inlined in <head> by the script.
 */
function renderPage(page: ReactElement) {
  return renderToString(<ThemeProvider theme={theme}>{page}</ThemeProvider>);
}

export function renderResourcesPage(): string {
  return renderPage(<ResourcesPage />);
}

export function renderPrivacyPage(): string {
  return renderPage(<PrivacyPage />);
}

export function renderArticlePage(article: ArticleData): string {
  return renderPage(<ResourceArticlePage article={article} />);
}

export function renderChecklistPage(checklist: ChecklistData): string {
  return renderPage(<StateChecklistPage checklist={checklist} />);
}
