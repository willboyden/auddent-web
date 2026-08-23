import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import Footer from '../src/components/Footer';
import { render } from './test-utils';
import { NAV_LINKS, PAGE_LINKS } from '../src/data/content';
import { SHIPPED_STATE_NAMES, SHIPPED_STATE_SLUGS } from '../src/data/checklists';

describe('Footer', () => {
  it('links every shipped state checklist', () => {
    render(<Footer />);
    SHIPPED_STATE_NAMES.forEach((name, index) => {
      expect(screen.getByRole('link', { name })).toHaveAttribute(
        'href',
        `/checklist/${SHIPPED_STATE_SLUGS[index]}`,
      );
    });
  });

  it('keeps the product and page links', () => {
    render(<Footer />);
    const footerNav = screen.getByRole('navigation', { name: 'Footer' });
    [...NAV_LINKS, ...PAGE_LINKS].forEach((link) => {
      expect(within(footerNav).getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
    });
  });
});
