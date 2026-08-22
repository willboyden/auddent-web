import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import Compare from '../src/components/Compare';
import { render } from './test-utils';

describe('Compare', () => {
  it('renders the three comparison columns', () => {
    render(<Compare />);
    expect(screen.getByRole('columnheader', { name: 'Spreadsheets' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Lives in your EHR' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'BrightGuard' })).toBeInTheDocument();
  });

  it('renders six feature rows with row headers and eighteen cells', () => {
    render(<Compare />);
    expect(screen.getAllByRole('row')).toHaveLength(7);
    expect(screen.getAllByRole('rowheader')).toHaveLength(6);
    expect(screen.getAllByRole('cell')).toHaveLength(18);
  });

  it('shows the BrightGuard answer on every row', () => {
    render(<Compare />);
    expect(screen.getByText('One bundle, printed in minutes')).toBeInTheDocument();
    expect(screen.getByText('Every entry carries who, when, and a chain hash')).toBeInTheDocument();
    expect(screen.getByText('Hard gates and alerts fire before inspection day')).toBeInTheDocument();
    expect(screen.getByText('Role-based requirements, expiry, auto-escalation')).toBeInTheDocument();
    expect(screen.getByText('Alerts assign a person, not a pile')).toBeInTheDocument();
    expect(screen.getByText('A five-line digest with the three things to fix')).toBeInTheDocument();
  });

  it('links the CTA to the demo section', () => {
    render(<Compare />);
    expect(screen.getByRole('link', { name: 'Book a demo' })).toHaveAttribute('href', '#demo');
  });
});
