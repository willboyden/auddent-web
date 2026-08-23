import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import PrivacyPage from '../src/pages/Privacy';
import { CONTACT_EMAIL } from '../src/data/content';
import { render } from './test-utils';

describe('Privacy policy page', () => {
  it('renders the policy with its key sections', () => {
    render(<PrivacyPage />);
    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
    for (const section of [
      'What we collect',
      'How we use it',
      'What we do not collect',
      'Analytics',
      'Contact',
      'Changes',
    ]) {
      expect(screen.getByRole('heading', { name: section })).toBeVisible();
    }
  });

  it('states it never collects patient data and links the contact address', () => {
    render(<PrivacyPage />);
    expect(screen.getByText(/No patient data, ever/i)).toBeVisible();
    // The address appears in the Retention, Contact, and footer links —
    // every mailto instance must point at the same address.
    const contacts = screen.getAllByRole('link', { name: CONTACT_EMAIL });
    expect(contacts.length).toBeGreaterThan(0);
    for (const link of contacts) {
      expect(link).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}`);
    }
  });
});
