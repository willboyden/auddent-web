import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../src/components/Header';
import { render } from './test-utils';
import { NAV_LINKS } from '../src/data/content';

describe('Header', () => {
  it('renders the brand and every desktop nav link', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'BrightGuard' })).toHaveAttribute('href', '#top');

    const mainNav = screen.getByRole('navigation', { name: 'Main' });
    NAV_LINKS.forEach((link) => {
      expect(within(mainNav).getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
    });
  });

  it('keeps a Book a demo CTA pointing at the demo section', () => {
    render(<Header />);
    const ctas = screen.getAllByRole('link', { name: 'Book a demo', hidden: true });
    expect(ctas.length).toBeGreaterThanOrEqual(1);
    ctas.forEach((cta) => expect(cta).toHaveAttribute('href', '#demo'));
  });

  it('toggles the mobile menu with the correct aria state', async () => {
    const user = userEvent.setup();
    const { container } = render(<Header />);

    // The toggle is display:none at desktop widths in jsdom (media queries never
    // match), so accessible-name queries can't see it — query by its stable
    // aria-controls attribute instead. Real mobile visibility is covered by the
    // 375px Playwright spec.
    const toggle = container.querySelector('button[aria-controls="mobile-nav"]') as HTMLButtonElement;
    expect(toggle).toBeTruthy();
    expect(toggle.getAttribute('aria-label')).toBe('Open menu');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle.getAttribute('aria-label')).toBe('Close menu');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const panel = document.getElementById('mobile-nav') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.tagName).toBe('NAV');
    expect(panel).toHaveAttribute('aria-label', 'Mobile');
    const links = within(panel).getAllByRole('link', { hidden: true });
    expect(links.length).toBe(NAV_LINKS.length + 1);
    const hrefs = links.map((link) => link.getAttribute('href'));
    NAV_LINKS.forEach((link) => expect(hrefs).toContain(link.href));
    expect(hrefs).toContain('#demo');

    await user.click(toggle);
    expect(toggle.getAttribute('aria-label')).toBe('Open menu');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
