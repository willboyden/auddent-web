import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DemoCTA from '../src/components/DemoCTA';
import { render } from './test-utils';

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full name'), 'Dr. Jordan Lee');
  await user.type(screen.getByLabelText('Practice name'), 'Brightsmile Dental');
  await user.type(screen.getByLabelText('Work email'), 'dr.lee@brightsmile.example');
}

describe('DemoCTA form', () => {
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
    expect(status).toHaveTextContent('Thanks, Dr. — request received.');
    expect(status).toHaveTextContent('dr.lee@brightsmile.example');
    expect(status).toHaveTextContent('Brightsmile Dental');
    expect(screen.queryByRole('button', { name: 'Book my demo' })).not.toBeInTheDocument();
  });

  it('defaults to one office', () => {
    render(<DemoCTA />);
    expect(screen.getByLabelText('Number of offices')).toHaveValue('1');
  });
});
