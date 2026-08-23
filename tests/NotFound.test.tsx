import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import NotFound from '../src/components/NotFound';
import { render } from './test-utils';

describe('NotFound', () => {
  it('shows the 404 code, a message, and a link home', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'This page doesn’t exist.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to AudDent' })).toHaveAttribute('href', '/');
  });
});
