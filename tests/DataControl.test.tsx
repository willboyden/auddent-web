import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import DataControl from '../src/components/DataControl';
import { render } from './test-utils';

describe('DataControl', () => {
  it('renders the section with its three data-trust cards', () => {
    render(<DataControl />);
    expect(screen.getByRole('heading', { name: 'Your data, your practice' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Runs where you point it' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Every record is chained' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'You can leave with everything' })).toBeInTheDocument();
  });

  it('makes the no-fake-certifications pledge', () => {
    render(<DataControl />);
    expect(
      screen.getByText(/We do not claim certifications we do not have/),
    ).toBeInTheDocument();
  });
});
