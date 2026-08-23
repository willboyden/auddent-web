import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StickyCta from '../src/components/StickyCta';
import { render } from './test-utils';

describe('StickyCta', () => {
  afterEach(() => {
    window.plausible = undefined;
  });

  it('is hidden near the top of the page', () => {
    render(<StickyCta />);
    expect(screen.queryByRole('region', { name: 'Quick demo booking' })).not.toBeInTheDocument();
  });

  it('appears after scrolling past the hero and links to the demo form', async () => {
    render(<StickyCta />);
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1000 });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    const bar = await screen.findByRole('region', { name: 'Quick demo booking' });
    expect(bar).toBeInTheDocument();
    const link = bar.querySelector('a');
    expect(link).toBeTruthy();
    expect(link).toHaveAttribute('href', '/#demo');
  });

  it('tracks a CTA click from the bar', async () => {
    const plausible = vi.fn();
    window.plausible = plausible;
    const user = userEvent.setup();
    render(<StickyCta />);
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1000 });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    const bar = await screen.findByRole('region', { name: 'Quick demo booking' });
    await user.click(within(bar).getByRole('link', { name: 'Book a 30-minute demo' }));
    expect(plausible).toHaveBeenCalledTimes(1);
    expect(plausible).toHaveBeenCalledWith('cta_click', { props: { source: 'sticky_bar' } });
  });
});
