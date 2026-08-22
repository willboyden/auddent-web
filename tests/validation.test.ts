import { describe, expect, it } from 'vitest';
import { validateChecklistForm, validateDemoForm } from '../src/lib/validation';
import type { ChecklistFormValues, DemoFormValues } from '../src/lib/validation';

const base: DemoFormValues = {
  name: 'Dr. Jordan Lee',
  practice: 'Brightsmile Dental',
  email: 'dr.lee@brightsmile.example',
  offices: '1',
  notes: '',
};

describe('validateDemoForm', () => {
  it('accepts a fully filled form', () => {
    expect(validateDemoForm(base)).toEqual({});
  });

  it('requires the name', () => {
    expect(validateDemoForm({ ...base, name: '' }).name).toBe('Please enter your name.');
    expect(validateDemoForm({ ...base, name: '   ' }).name).toBe('Please enter your name.');
  });

  it('requires the practice name', () => {
    expect(validateDemoForm({ ...base, practice: '' }).practice).toBe(
      'Please enter your practice name.',
    );
  });

  it('requires the email', () => {
    expect(validateDemoForm({ ...base, email: '' }).email).toBe('Please enter your work email.');
  });

  it('rejects malformed emails', () => {
    expect(validateDemoForm({ ...base, email: 'dr.lee' }).email).toMatch(/does not look right/);
    expect(validateDemoForm({ ...base, email: 'dr.lee@' }).email).toMatch(/does not look right/);
    expect(validateDemoForm({ ...base, email: 'a b@c.com' }).email).toMatch(/does not look right/);
    expect(validateDemoForm({ ...base, email: 'dr.lee @brightsmile.example' }).email).toMatch(
      /does not look right/,
    );
  });

  it('accepts a trimmed valid email', () => {
    expect(validateDemoForm({ ...base, email: '  dr.lee@brightsmile.example  ' }).email).toBeUndefined();
  });

  it('does not require notes or offices', () => {
    expect(validateDemoForm({ ...base, notes: '', offices: '' })).toEqual({});
  });

  it('reports every missing field at once', () => {
    const errors = validateDemoForm({
      name: '',
      practice: '',
      email: '',
      offices: '1',
      notes: '',
    });
    expect(Object.keys(errors).sort()).toEqual(['email', 'name', 'practice']);
  });
});

const checklistBase: ChecklistFormValues = {
  state: 'Colorado',
  email: 'dr.lee@brightsmile.example',
};

describe('validateChecklistForm', () => {
  it('accepts a valid state + email', () => {
    expect(validateChecklistForm(checklistBase)).toEqual({});
  });

  it('requires the state', () => {
    expect(validateChecklistForm({ ...checklistBase, state: '' }).state).toBe('Please choose your state.');
  });

  it('requires the email', () => {
    expect(validateChecklistForm({ ...checklistBase, email: '' }).email).toBe('Please enter your email.');
  });

  it('rejects malformed emails', () => {
    expect(validateChecklistForm({ ...checklistBase, email: 'dr.lee' }).email).toMatch(/does not look right/);
  });

  it('reports every missing field at once', () => {
    const errors = validateChecklistForm({ state: '', email: '' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'state']);
  });
});
