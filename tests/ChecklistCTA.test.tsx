import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChecklistCTA from '../src/components/ChecklistCTA';
import { render } from './test-utils';

describe('ChecklistCTA', () => {
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
    expect(status).toHaveTextContent('Checklist for Colorado is on its way');
    expect(status).toHaveTextContent('dr.lee@brightsmile.example');
    expect(screen.getByRole('link', { name: 'Book the 30-minute demo' })).toHaveAttribute('href', '#demo');
    expect(screen.queryByRole('button', { name: 'Send my checklist' })).not.toBeInTheDocument();
  });
});
