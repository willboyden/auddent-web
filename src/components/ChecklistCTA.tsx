import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from '@emotion/styled';
import { colors, radii, shadows } from '../theme';
import { CONTACT_EMAIL, US_STATES } from '../data/content';
import { trackEvent } from '../lib/analytics';
import { checklistMailto, cooldownRemainingMs, openMailto, recordSubmission } from '../lib/leads';
import { validateChecklistForm } from '../lib/validation';
import type { ChecklistFormErrors, ChecklistFormValues } from '../lib/validation';
import { Button, Container, Section, Eyebrow, SectionLede, SectionTitle } from './ui';

const INITIAL: ChecklistFormValues = { state: '', email: '' };

const FIELD_IDS: Record<keyof ChecklistFormValues, string> = {
  state: 'checklist-state',
  email: 'checklist-email',
};

const REQUIRED_ORDER: (keyof ChecklistFormValues)[] = ['state', 'email'];

const Wrap = styled.div`
  max-width: 620px;
  margin: 0 auto;
  text-align: center;
`;

const FormCard = styled.div`
  margin-top: 36px;
  background: #ffffff;
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg}px;
  box-shadow: ${shadows.card};
  padding: 28px;
  text-align: left;
`;

const FormTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 800;
  color: ${colors.navy};
`;

const FormLede = styled.p`
  margin: 0 0 20px;
  font-size: 14px;
  line-height: 1.55;
  color: ${colors.muted};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.navy};
`;

const Input = styled.input<{ hasError?: boolean }>`
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  color: ${colors.text};
  background: #ffffff;
  border: 1px solid ${({ hasError, theme }) => (hasError ? theme.colors.red : theme.colors.border)};
  border-radius: 9px;
  padding: 11px 13px;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: #9aa9ba;
    font-weight: 400;
  }

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 1px;
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  color: ${({ hasError }) => (hasError ? colors.text : colors.muted)};
  background: #ffffff;
  border: 1px solid ${({ hasError, theme }) => (hasError ? theme.colors.red : theme.colors.border)};
  border-radius: 9px;
  padding: 11px 13px;
  width: 100%;
  box-sizing: border-box;

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 1px;
  }
`;

const ErrorMsg = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.red};
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  border-radius: 10px;
  padding: 13px 22px;
  cursor: pointer;
  border: none;
  background: ${colors.primary};
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(10, 99, 201, 0.35);
  transition: background-color 0.15s ease;

  &:hover {
    background: ${colors.primaryHover};
  }

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
  }
`;

const FinePrint = styled.p`
  margin: 12px 0 0;
  font-size: 12.5px;
  color: ${colors.muted};
  text-align: center;
`;

const Success = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 16px 8px;
`;

const SuccessIcon = styled.span`
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${colors.greenBg};
`;

const SuccessTitle = styled.h3`
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  color: ${colors.navy};
`;

const SuccessBody = styled.p`
  margin: 0;
  font-size: 14.5px;
  line-height: 1.6;
  color: ${colors.muted};
  max-width: 420px;
`;

export default function ChecklistCTA() {
  const [values, setValues] = useState<ChecklistFormValues>(INITIAL);
  const [errors, setErrors] = useState<ChecklistFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  function setField(key: keyof ChecklistFormValues, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next = validateChecklistForm(values);
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      const firstInvalid = REQUIRED_ORDER.find((key) => next[key]);
      if (firstInvalid) {
        document.getElementById(FIELD_IDS[firstInvalid])?.focus();
      }
      return;
    }
    const remaining = cooldownRemainingMs('checklist');
    if (remaining > 0) {
      setRateLimited(true);
      return;
    }
    trackEvent('checklist_request', { state: values.state });
    recordSubmission('checklist');
    openMailto(checklistMailto(values));
    setRateLimited(false);
    setSubmitted(true);
  }

  return (
    <Section id="checklist">
      <Container>
        <Wrap>
          <Eyebrow>Free checklist</Eyebrow>
          <SectionTitle>Get your state’s inspection checklist</SectionTitle>
          <SectionLede style={{ margin: '0 auto' }}>
            State inspectors don’t all check the same things. Tell us where you practice and we’ll send the list your
            state is most likely to walk through — free, and no account needed.
          </SectionLede>

          <FormCard>
            {submitted ? (
              <Success role="status">
                <SuccessIcon aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill={colors.green} />
                    <path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </SuccessIcon>
                <SuccessTitle>One more step to get the {values.state} checklist</SuccessTitle>
                <SuccessBody>
                  We’ve opened a draft email with your request. Hit send and we’ll reply to{' '}
                  <strong>{values.email.trim()}</strong> with the {values.state} checklist — it takes about two
                  minutes to read. If your email app didn’t open, email {CONTACT_EMAIL} directly.
                </SuccessBody>
                <Button href="/#demo" variant="primary">
                  Book the 30-minute demo
                </Button>
              </Success>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <FormTitle>Two fields, that’s it</FormTitle>
                <FormLede>We’ll match the checklist to your state and send it the same day.</FormLede>

                <Field>
                  <Label htmlFor="checklist-state">Your state</Label>
                  <Select
                    id="checklist-state"
                    name="state"
                    autoComplete="off"
                    value={values.state}
                    hasError={Boolean(errors.state)}
                    aria-invalid={Boolean(errors.state)}
                    aria-describedby={errors.state ? 'checklist-state-error' : undefined}
                    onChange={(e) => setField('state', e.target.value)}
                  >
                    <option value="">Choose your state…</option>
                    {US_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Select>
                  {errors.state ? (
                    <ErrorMsg id="checklist-state-error" role="alert" aria-label={errors.state}>
                      {errors.state}
                    </ErrorMsg>
                  ) : null}
                </Field>

                <Field>
                  <Label htmlFor="checklist-email">Your work email</Label>
                  <Input
                    id="checklist-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="dr.lee@brightsmile.example"
                    value={values.email}
                    hasError={Boolean(errors.email)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'checklist-email-error' : undefined}
                    onChange={(e) => setField('email', e.target.value)}
                  />
                  {errors.email ? (
                    <ErrorMsg id="checklist-email-error" role="alert" aria-label={errors.email}>
                      {errors.email}
                    </ErrorMsg>
                  ) : null}
                </Field>

                {rateLimited ? (
                  <ErrorMsg id="checklist-rate-limited" role="alert" aria-label="You just submitted this form. Please wait a minute before trying again.">
                    You just submitted this form — please wait a minute before trying again.
                  </ErrorMsg>
                ) : null}
                <SubmitButton type="submit">Send my checklist</SubmitButton>
                <FinePrint>No spam, no account. We’ll also use this to tailor your demo if you book one.</FinePrint>
              </form>
            )}
          </FormCard>
        </Wrap>
      </Container>
    </Section>
  );
}
