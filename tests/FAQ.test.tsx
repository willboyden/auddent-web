import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FAQ from '../src/components/FAQ';
import { render } from './test-utils';
import { FAQ_ITEMS } from '../src/data/content';

describe('FAQ', () => {
  it('renders every question as a toggle button', () => {
    render(<FAQ />);
    FAQ_ITEMS.forEach((item) => {
      expect(screen.getByRole('button', { name: item.q })).toBeInTheDocument();
    });
  });

  it('has the first question open by default', () => {
    render(<FAQ />);
    expect(screen.getByRole('button', { name: FAQ_ITEMS[0].q })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: FAQ_ITEMS[0].q })).toBeVisible();
  });

  it('toggles a closed answer open and closed', async () => {
    const user = userEvent.setup();
    const { container } = render(<FAQ />);
    const second = screen.getByRole('button', { name: FAQ_ITEMS[1].q });
    expect(second).toHaveAttribute('aria-expanded', 'false');
    // A hidden region computes to an empty accessible name, so check the
    // closed state via its stable id.
    expect(container.querySelector<HTMLElement>('#faq-answer-1')).not.toBeVisible();

    await user.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
    const answer = screen.getByRole('region', { name: FAQ_ITEMS[1].q });
    expect(answer).toBeVisible();
    expect(answer).toHaveTextContent(/live in an afternoon/i);

    await user.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens only one answer at a time', async () => {
    const user = userEvent.setup();
    render(<FAQ />);
    const first = screen.getByRole('button', { name: FAQ_ITEMS[0].q });
    const second = screen.getByRole('button', { name: FAQ_ITEMS[1].q });

    await user.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'true');
  });
});
