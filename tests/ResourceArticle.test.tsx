import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import ResourceArticle from '../src/pages/ResourceArticle';
import { RESOURCE_ARTICLES } from '../src/data/resources';
import { render } from './test-utils';

const article = RESOURCE_ARTICLES[0];

describe('ResourceArticle page', () => {
  it('renders the title, meta line, and every section', () => {
    render(<ResourceArticle article={article} />);
    expect(screen.getByRole('heading', { level: 1, name: article.title })).toBeInTheDocument();
    expect(screen.getByText(`${article.category} · Updated ${article.updated} · ${article.readTime}`)).toBeInTheDocument();
    for (const section of article.sections) {
      expect(screen.getByRole('heading', { level: 2, name: section.heading })).toBeInTheDocument();
    }
  });

  it('links back to the hub and forward to the checklist and demo', () => {
    render(<ResourceArticle article={article} />);
    expect(screen.getByRole('link', { name: '← All resources' })).toHaveAttribute('href', '/resources');
    expect(screen.getByRole('link', { name: 'Get the state checklist' })).toHaveAttribute('href', '/#checklist');
    expect(screen.getByRole('link', { name: 'Book a 30-minute demo' })).toHaveAttribute('href', '/#demo');
  });

  it('lists every other guide as a related link and omits the current one', () => {
    render(<ResourceArticle article={article} />);
    expect(screen.getByRole('heading', { name: 'More from resources' })).toBeInTheDocument();
    const others = RESOURCE_ARTICLES.filter((entry) => entry.slug !== article.slug);
    expect(others).toHaveLength(3);
    for (const entry of others) {
      expect(screen.getByRole('link', { name: entry.title })).toHaveAttribute(
        'href',
        `/resources/${entry.slug}`,
      );
    }
    expect(screen.queryByRole('link', { name: article.title })).not.toBeInTheDocument();
  });
});
