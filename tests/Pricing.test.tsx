import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pricing from '../src/components/Pricing';
import { render } from './test-utils';

describe('Pricing', () => {
  afterEach(() => {
    window.plausible = undefined;
  });

  it('renders all three tiers with monthly prices by default', () => {
    render(<Pricing />);
    expect(screen.getByRole('heading', { name: 'Single office' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Multi-office' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dental group' })).toBeInTheDocument();
    expect(screen.getByTestId('price-single-office')).toHaveTextContent('$149');
    expect(screen.getByTestId('price-multi-office')).toHaveTextContent('$399');
    expect(screen.getByTestId('price-dental-group')).toHaveTextContent('$899');
  });

  it('marks the multi-office tier as most popular', () => {
    render(<Pricing />);
    expect(screen.getByText('Most popular')).toBeInTheDocument();
  });

  it('switches to yearly prices and back', async () => {
    const user = userEvent.setup();
    render(<Pricing />);

    const yearly = screen.getByRole('button', { name: 'Yearly' });
    await user.click(yearly);
    expect(yearly).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('price-single-office')).toHaveTextContent('$124');
    expect(screen.getByTestId('price-multi-office')).toHaveTextContent('$333');
    expect(screen.getByTestId('price-dental-group')).toHaveTextContent('$749');
    expect(screen.getByTestId('billed-single-office')).toHaveTextContent('Billed $1490 once a year');

    const monthly = screen.getByRole('button', { name: 'Monthly' });
    await user.click(monthly);
    expect(monthly).toHaveAttribute('aria-pressed', 'true');
    expect(yearly).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('price-single-office')).toHaveTextContent('$149');
    expect(screen.getByTestId('billed-single-office')).toHaveTextContent('Billed month to month');
  });

  it('tracks a billing toggle only when the period actually changes', async () => {
    const plausible = vi.fn();
    window.plausible = plausible;
    const user = userEvent.setup();
    render(<Pricing />);

    await user.click(screen.getByRole('button', { name: 'Monthly' }));
    expect(plausible).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Yearly' }));
    expect(plausible).toHaveBeenCalledTimes(1);
    expect(plausible).toHaveBeenCalledWith('billing_toggle', { props: { period: 'yearly' } });
  });

  it('shows the risk-reversal guarantee', () => {
    render(<Pricing />);
    expect(screen.getByText('If it doesn’t save you prep time, you don’t pay')).toBeInTheDocument();
    expect(screen.getByText('No setup fees')).toBeInTheDocument();
    expect(screen.getByText('30-day money-back guarantee')).toBeInTheDocument();
    expect(screen.getByText('Cancel anytime — full data export')).toBeInTheDocument();
  });

  it('shows a CTA on every tier', () => {
    render(<Pricing />);
    expect(screen.getByRole('link', { name: 'Start 30-day trial' })).toHaveAttribute('href', '/#demo');
    expect(screen.getByRole('link', { name: 'Book a demo' })).toHaveAttribute('href', '/#demo');
    expect(screen.getByRole('link', { name: 'Talk to sales' })).toHaveAttribute('href', '/#demo');
  });
});
