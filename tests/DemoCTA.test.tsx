import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DemoCTA from '../src/components/DemoCTA';
import { demoMailto, openMailto } from '../src/lib/leads';
import { render } from './test-utils';

// The mailto stopgap (FOLLOWUPS #4) navigates to an external protocol —
// spy on it instead of letting jsdom attempt the navigation.
vi.mock('../src/lib/leads', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/lib/leads')>();
  return { ...actual, openMailto: vi.fn() };
});

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full name'), 'Dr. Jordan Lee');
  await user.type(screen.getByLabelText('Practice name'), 'Brightsmile Dental');
  await user.type(screen.getByLabelText('Work email'), 'dr.lee@brightsmile.example');
}

describe('DemoCTA form', () => {
  afterEach(() => {
    window.plausible = undefined;
    vi.mocked(openMailto).mockClear();
    sessionStorage.clear();
  });

  it('shows a field error for each empty required field on submit', async () => {
    const user = userEvent.setup();
    render(<DemoCTA />);
    await user.click(screen.getByRole('button', { name: 'Book my demo' }));
    expect(screen.getByRole('alert', { name: 'Please enter your name.' })).toBeInTheDocument();
    expect(screen.getByRole('alert', { name: 'Please enter your practice name.' })).toBeInTheDocument();
    expect(screen.getByRole('alert', { name: 'Please enter your work email.' })).toBeInTheDocument();
    expect(screen.getByLabelText('Full name')).toHaveFocus();
  });

  it('moves focus to the first invalid field when later fields are the problem', async () => {
    const user = userEvent.setup();
    render(<DemoCTA />);
    await user.type(screen.getByLabelText('Full name'), 'Dr. Jordan Lee');
    await user.click(screen.getByRole('button', { name: 'Book my demo' }));
    expect(screen.getByLabelText('Practice name')).toHaveFocus();
  });

  it('rejects a malformed email with a specific message', async () => {
    const user = userEvent.setup();
    render(<DemoCTA />);
    await user.type(screen.getByLabelText('Full name'), 'Dr. Jordan Lee');
    await user.type(screen.getByLabelText('Practice name'), 'Brightsmile Dental');
    await user.type(screen.getByLabelText('Work email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Book my demo' }));
    expect(screen.getByRole('alert', { name: /does not look right/ })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('clears a field error once the field is corrected', async () => {
    const user = userEvent.setup();
    render(<DemoCTA />);
    await user.click(screen.getByRole('button', { name: 'Book my demo' }));
    expect(screen.getByRole('alert', { name: 'Please enter your name.' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Full name'), 'Dr. Jordan Lee');
    expect(screen.queryByRole('alert', { name: 'Please enter your name.' })).not.toBeInTheDocument();
  });

  it('submits a valid form and shows the confirmation', async () => {
    const user = userEvent.setup();
    render(<DemoCTA />);
    await fillValidForm(user);
    await user.selectOptions(screen.getByLabelText('Number of offices'), '2');
    await user.click(screen.getByRole('button', { name: 'Book my demo' }));

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Thanks, Dr. — one more step.');
    expect(status).toHaveTextContent('dr.lee@brightsmile.example');
    expect(status).toHaveTextContent('Brightsmile Dental');
    expect(screen.queryByRole('button', { name: 'Book my demo' })).not.toBeInTheDocument();
    // Interim delivery: a pre-filled draft opens in the visitor's email app.
    expect(openMailto).toHaveBeenCalledTimes(1);
    expect(openMailto).toHaveBeenCalledWith(
      demoMailto({
        name: 'Dr. Jordan Lee',
        practice: 'Brightsmile Dental',
        email: 'dr.lee@brightsmile.example',
        offices: '2',
        notes: '',
      }),
    );
  });

  it('defaults to one office', () => {
    render(<DemoCTA />);
    expect(screen.getByLabelText('Number of offices')).toHaveValue('1');
  });

  it('links the fine print to the privacy policy', () => {
    render(<DemoCTA />);
    const privacy = screen.getByRole('link', { name: 'privacy policy' });
    expect(privacy).toHaveAttribute('href', '/privacy');
  });

  it('blocks a repeat submission while the cooldown is active', async () => {
    const user = userEvent.setup();
    render(<DemoCTA />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Book my demo' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(openMailto).toHaveBeenCalledTimes(1);

    // A fresh page load within the cooldown window is refused — the draft
    // email must not open a second time.
    cleanup();
    render(<DemoCTA />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Book my demo' }));
    expect(screen.getByRole('alert', { name: /wait a minute/i })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(openMailto).toHaveBeenCalledTimes(1);
  });

  it('tracks the demo request without sending PII', async () => {
    const plausible = vi.fn();
    window.plausible = plausible;
    const user = userEvent.setup();
    render(<DemoCTA />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Book my demo' }));

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(plausible).toHaveBeenCalledTimes(1);
    expect(plausible).toHaveBeenCalledWith('demo_request', { props: { offices: '1' } });
    const sent = JSON.stringify(plausible.mock.calls);
    expect(sent).not.toContain('Jordan');
    expect(sent).not.toContain('brightsmile.example');
  });
});
