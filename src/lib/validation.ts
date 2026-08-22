export interface DemoFormValues {
  name: string;
  practice: string;
  email: string;
  offices: string;
  notes: string;
}

export type DemoFormErrors = Partial<Record<keyof DemoFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateDemoForm(values: DemoFormValues): DemoFormErrors {
  const errors: DemoFormErrors = {};
  if (!values.name.trim()) {
    errors.name = 'Please enter your name.';
  }
  if (!values.practice.trim()) {
    errors.practice = 'Please enter your practice name.';
  }
  const email = values.email.trim();
  if (!email) {
    errors.email = 'Please enter your work email.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'That email does not look right — try name@practice.com.';
  }
  return errors;
}

export interface ChecklistFormValues {
  state: string;
  email: string;
}

export type ChecklistFormErrors = Partial<Record<keyof ChecklistFormValues, string>>;

export function validateChecklistForm(values: ChecklistFormValues): ChecklistFormErrors {
  const errors: ChecklistFormErrors = {};
  if (!values.state.trim()) {
    errors.state = 'Please choose your state.';
  }
  const email = values.email.trim();
  if (!email) {
    errors.email = 'Please enter your email.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'That email does not look right — try name@practice.com.';
  }
  return errors;
}
