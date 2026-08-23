import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChecklistCTA from '../src/components/ChecklistCTA';
import { checklistMailto, openMailto } from '../src/lib/leads';
import { render } from './test-utils';

// The mailto stopgap (FOLLOWUPS #4) navigates to an external protocol —
// spy on it instead of letting jsdom attempt the navigation.
vi.mock('../src/lib/leads', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/lib/leads')>();
  return { ...actual, openMailto: vi.fn() };
});

describe('ChecklistCTA', () => {
  afterEach(() => {
    window.plausible = undefined;
    vi.mocked(openMailto).mockClear();
    sessionStorage.clear();
  });

  it('lists all 50 states plus DC in the select', () => {
    render(<ChecklistCTA />);
    expect(screen.getAllByRole('option')).toHaveLength(52);
    const labels = screen.getAllByRole('option').map((option) => option.textContent);
    expect(labels).toContain('Colorado');
    expect(labels).toContain('District of Columbia');
  });

  it('validates an empty submission', async () => {
    const user = userEvent.setup();
    render(<ChecklistCTA />);
    await user.click(screen.getByRole('button', { name: 'Send my checklist' }));
    expect(screen.getByRole('alert', { name: 'Please choose your state.' })).toBeInTheDocument();
    expect(screen.getByRole('alert', { name: 'Please enter your email.' })).toBeInTheDocument();
    expect(screen.getByLabelText('Your state')).toHaveFocus();
  });

  it('rejects a malformed email', async () => {
    const user = userEvent.setup();
    render(<ChecklistCTA />);
    await user.selectOptions(screen.getByLabelText('Your state'), 'Colorado');
    await user.type(screen.getByLabelText('Your work email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Send my checklist' }));
    expect(screen.getByRole('alert', { name: /does not look right/ })).toBeInTheDocument();
  });

  it('submits and offers the demo handoff', async () => {
    const user = userEvent.setup();
    render(<ChecklistCTA />);
    await user.selectOptions(screen.getByLabelText('Your state'), 'Colorado');
    await user.type(screen.getByLabelText('Your work email'), 'dr.lee@brightsmile.example');
    await user.click(screen.getByRole('button', { name: 'Send my checklist' }));

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('One more step to get the Colorado checklist');
    expect(status).toHaveTextContent('dr.lee@brightsmile.example');
    expect(screen.getByRole('link', { name: 'Book the 30-minute demo' })).toHaveAttribute('href', '/#demo');
    expect(screen.queryByRole('button', { name: 'Send my checklist' })).not.toBeInTheDocument();
    // Interim delivery: a pre-filled draft opens in the visitor's email app.
    expect(openMailto).toHaveBeenCalledWith(checklistMailto({ state: 'Colorado', email: 'dr.lee@brightsmile.example' }));
  });

  it('offers the live checklist link when the shipped state is requested', async () => {
    const user = userEvent.setup();
    render(<ChecklistCTA />);
    await user.selectOptions(screen.getByLabelText('Your state'), 'California');
    await user.type(screen.getByLabelText('Your work email'), 'dr.lee@brightsmile.example');
    await user.click(screen.getByRole('button', { name: 'Send my checklist' }));

    expect(screen.getByRole('link', { name: 'Or read the California checklist now →' })).toHaveAttribute(
      'href',
      '/checklist/california',
    );
  });

  it('blocks a repeat submission while the cooldown is active', async () => {
    const user = userEvent.setup();
    render(<ChecklistCTA />);
    await user.selectOptions(screen.getByLabelText('Your state'), 'Colorado');
    await user.type(screen.getByLabelText('Your work email'), 'dr.lee@brightsmile.example');
    await user.click(screen.getByRole('button', { name: 'Send my checklist' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(openMailto).toHaveBeenCalledTimes(1);

    // A fresh page load within the cooldown window is refused — the draft
    // email must not open a second time.
    cleanup();
    render(<ChecklistCTA />);
    await user.selectOptions(screen.getByLabelText('Your state'), 'Colorado');
    await user.type(screen.getByLabelText('Your work email'), 'dr.lee@brightsmile.example');
    await user.click(screen.getByRole('button', { name: 'Send my checklist' }));
    expect(screen.getByRole('alert', { name: /wait a minute/i })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(openMailto).toHaveBeenCalledTimes(1);
  });

  it('tracks the checklist request with the state as the only prop', async () => {
    const plausible = vi.fn();
    window.plausible = plausible;
    const user = userEvent.setup();
    render(<ChecklistCTA />);
    await user.selectOptions(screen.getByLabelText('Your state'), 'Colorado');
    await user.type(screen.getByLabelText('Your work email'), 'dr.lee@brightsmile.example');
    await user.click(screen.getByRole('button', { name: 'Send my checklist' }));

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(plausible).toHaveBeenCalledTimes(1);
    expect(plausible).toHaveBeenCalledWith('checklist_request', { props: { state: 'Colorado' } });
    expect(JSON.stringify(plausible.mock.calls)).not.toContain('brightsmile.example');
  });
});
