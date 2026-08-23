import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import App from '../src/App';
import { render } from './test-utils';

describe('App (full page smoke)', () => {
  it('renders the headline and the example dashboard card', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Walk into your next inspection with the evidence already in hand.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Example compliance dashboard' })).toBeInTheDocument();
  });

  it('includes a skip link to the main content', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders every major section with a stable id', () => {
    const { container } = render(<App />);
    for (const id of [
      'features',
      'audit-trail',
      'data',
      'how-it-works',
      'digest',
      'compare',
      'pricing',
      'faq',
      'checklist',
      'demo',
    ]) {
      expect(container.querySelector(`#${id}`), `section #${id}`).not.toBeNull();
    }
  });

  it('renders the three pricing tiers and the footer', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Single office' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Multi-office' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dental group' })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
