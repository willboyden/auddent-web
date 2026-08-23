import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import Resources from '../src/pages/Resources';
import { RESOURCE_ARTICLES } from '../src/data/resources';
import { render } from './test-utils';

describe('Resources page', () => {
  it('lists every guide with a link to its article', () => {
    render(<Resources />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Inspection prep, without the guesswork' }),
    ).toBeInTheDocument();
    for (const article of RESOURCE_ARTICLES) {
      const card = screen.getByRole('link', { name: new RegExp(article.title) });
      expect(card).toHaveAttribute('href', `/resources/${article.slug}`);
      // the card shows the category chip, summary, and a "… · N min read" meta row
      expect(within(card).getByText(article.category)).toBeInTheDocument();
      expect(within(card).getByText(article.summary)).toBeInTheDocument();
      expect(within(card).getByText(new RegExp(article.readTime))).toBeInTheDocument();
    }
  });

  it('shows the category for each guide', () => {
    render(<Resources />);
    expect(screen.getAllByText('Infection control').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Inspection prep')).toBeInTheDocument();
    expect(screen.getByText('Recordkeeping')).toBeInTheDocument();
  });
});
