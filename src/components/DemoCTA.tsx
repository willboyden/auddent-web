import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from '@emotion/styled';
import { breakpoints, colors } from '../theme';
import { CONTACT_EMAIL } from '../data/content';
import { trackEvent } from '../lib/analytics';
import { cooldownRemainingMs, demoMailto, openMailto, recordSubmission } from '../lib/leads';
import { validateDemoForm } from '../lib/validation';
import type { DemoFormErrors, DemoFormValues } from '../lib/validation';
import { Container, Section } from './ui';

const INITIAL: DemoFormValues = { name: '', practice: '', email: '', offices: '1', notes: '' };

const FIELD_IDS: Record<keyof DemoFormValues, string> = {
  name: 'demo-name',
  practice: 'demo-practice',
  email: 'demo-email',
  offices: 'demo-offices',
  notes: 'demo-notes',
};

const REQUIRED_ORDER: (keyof DemoFormValues)[] = ['name', 'practice', 'email'];

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: 48px;
  align-items: center;

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7fb1e8;
  margin-bottom: 12px;
`;

const PitchTitle = styled.h2`
  font-size: clamp(26px, 3.4vw, 38px);
  line-height: 1.15;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 14px;
`;

const PitchLede = styled.p`
  font-size: 16.5px;
  line-height: 1.65;
  color: #b9cbe0;
  margin: 0 0 24px;
  max-width: 520px;
`;

const PitchList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const PitchItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  line-height: 1.5;
  color: #eaf2fb;
  font-weight: 500;
`;

const BulletDot = styled.span`
  flex-shrink: 0;
  margin-top: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7fb1e8;
`;

const FormCard = styled.div`
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  padding: 28px;
  color: ${colors.text};
`;

const FormTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 800;
  color: ${colors.navy};
`;

const FormLede = styled.p`
  margin: 0 0 20px;
  font-size: 14px;
  color: ${colors.muted};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.navy};
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

const Select = styled.select`
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  color: ${colors.text};
  background: #ffffff;
  border: 1px solid ${colors.border};
  border-radius: 9px;
  padding: 11px 13px;
  width: 100%;
  box-sizing: border-box;

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 1px;
  }
`;

const TextArea = styled.textarea`
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  color: ${colors.text};
  background: #ffffff;
  border: 1px solid ${colors.border};
  border-radius: 9px;
  padding: 11px 13px;
  width: 100%;
  box-sizing: border-box;
  min-height: 84px;
  resize: vertical;

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

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 0;
  }
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

  a {
    color: inherit;
    font-weight: 600;
    text-decoration: underline;
  }
`;

const Success = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 28px 8px;
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
  font-size: 20px;
  font-weight: 800;
  color: ${colors.navy};
`;

const SuccessBody = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: ${colors.muted};
  max-width: 380px;
`;

export default function DemoCTA() {
  const [values, setValues] = useState<DemoFormValues>(INITIAL);
  const [errors, setErrors] = useState<DemoFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  function setField(key: keyof DemoFormValues, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next = validateDemoForm(values);
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      const firstInvalid = REQUIRED_ORDER.find((key) => next[key]);
      if (firstInvalid) {
        document.getElementById(FIELD_IDS[firstInvalid])?.focus();
      }
      return;
    }
    const remaining = cooldownRemainingMs('demo');
    if (remaining > 0) {
      setRateLimited(true);
      return;
    }
    trackEvent('demo_request', { offices: values.offices });
    recordSubmission('demo');
    openMailto(demoMailto(values));
    setRateLimited(false);
    setSubmitted(true);
  }

  return (
    <Section id="demo" bg="#0b2545">
      <Container>
        <Grid>
          <div>
            <Eyebrow>Book a demo</Eyebrow>
            <PitchTitle>See it with your practice, not a hypothetical one</PitchTitle>
            <PitchLede>
              A 30-minute walkthrough with someone who has sat through a dental inspection, on your schedule.
            </PitchLede>
            <PitchList>
              <PitchItem>
                <BulletDot aria-hidden="true" />
                We configure the modules your state actually checks — bring the checklist if you have it.
              </PitchItem>
              <PitchItem>
                <BulletDot aria-hidden="true" />
                Guided demo data, so you can click through a whole inspection season in half an hour.
              </PitchItem>
              <PitchItem>
                <BulletDot aria-hidden="true" />
                No prep required — no spreadsheets to export, nothing to tidy beforehand.
              </PitchItem>
            </PitchList>
          </div>

          <FormCard>
            {submitted ? (
              <Success role="status">
                <SuccessIcon aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="#1e7d4f" />
                    <path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </SuccessIcon>
                <SuccessTitle>Thanks, {values.name.trim().split(' ')[0]} — one more step.</SuccessTitle>
                <SuccessBody>
                  We’ve opened a draft email with your details. Hit send and we’ll reply to{' '}
                  <strong>{values.email.trim()}</strong> within one business day to schedule the walkthrough for{' '}
                  {values.practice.trim()}. If your email app didn’t open, email {CONTACT_EMAIL} directly.
                </SuccessBody>
              </Success>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <FormTitle>Book your 30-minute demo</FormTitle>
                <FormLede>Tell us who to ask for and we’ll do the rest.</FormLede>

                <TwoCol>
                  <Field>
                    <Label htmlFor="demo-name">Full name</Label>
                    <Input
                      id="demo-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Dr. Jordan Lee"
                      value={values.name}
                      hasError={Boolean(errors.name)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'demo-name-error' : undefined}
                      onChange={(e) => setField('name', e.target.value)}
                    />
                    {errors.name ? (
                      <ErrorMsg id="demo-name-error" role="alert" aria-label={errors.name}>
                        {errors.name}
                      </ErrorMsg>
                    ) : null}
                  </Field>
                  <Field>
                    <Label htmlFor="demo-practice">Practice name</Label>
                    <Input
                      id="demo-practice"
                      name="practice"
                      type="text"
                      autoComplete="organization"
                      placeholder="Brightsmile Dental"
                      value={values.practice}
                      hasError={Boolean(errors.practice)}
                      aria-invalid={Boolean(errors.practice)}
                      aria-describedby={errors.practice ? 'demo-practice-error' : undefined}
                      onChange={(e) => setField('practice', e.target.value)}
                    />
                    {errors.practice ? (
                      <ErrorMsg id="demo-practice-error" role="alert" aria-label={errors.practice}>
                        {errors.practice}
                      </ErrorMsg>
                    ) : null}
                  </Field>
                </TwoCol>

                <Field>
                  <Label htmlFor="demo-email">Work email</Label>
                  <Input
                    id="demo-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="dr.lee@brightsmile.example"
                    value={values.email}
                    hasError={Boolean(errors.email)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'demo-email-error' : undefined}
                    onChange={(e) => setField('email', e.target.value)}
                  />
                  {errors.email ? (
                    <ErrorMsg id="demo-email-error" role="alert" aria-label={errors.email}>
                      {errors.email}
                    </ErrorMsg>
                  ) : null}
                </Field>

                <TwoCol>
                  <Field>
                    <Label htmlFor="demo-offices">Number of offices</Label>
                    <Select
                      id="demo-offices"
                      name="offices"
                      value={values.offices}
                      onChange={(e) => setField('offices', e.target.value)}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </Select>
                  </Field>
                </TwoCol>

                <Field>
                  <Label htmlFor="demo-notes">
                    What’s your biggest compliance headache? <em style={{ fontWeight: 500 }}>(optional)</em>
                  </Label>
                  <TextArea
                    id="demo-notes"
                    name="notes"
                    placeholder="Spore logs, the DEA count, a license that keeps slipping…"
                    value={values.notes}
                    onChange={(e) => setField('notes', e.target.value)}
                  />
                </Field>

                {rateLimited ? (
                  <ErrorMsg id="demo-rate-limited" role="alert" aria-label="You just submitted this form. Please wait a minute before trying again.">
                    You just submitted this form — please wait a minute before trying again.
                  </ErrorMsg>
                ) : null}
                <SubmitButton type="submit">Book my demo</SubmitButton>
                <FinePrint>
                  Prefer email? Reach us at {CONTACT_EMAIL}. We never share your details — see our{' '}
                  <a href="/privacy">privacy policy</a>.
                </FinePrint>
              </form>
            )}
          </FormCard>
        </Grid>
      </Container>
    </Section>
  );
}
