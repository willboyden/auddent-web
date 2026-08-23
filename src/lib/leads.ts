import { CONTACT_EMAIL } from '../data/content';
import type { ChecklistFormValues, DemoFormValues } from './validation';

// Interim lead delivery until a real endpoint exists (FOLLOWUPS.md #4): a
// valid submission opens a pre-filled mailto: draft in the visitor's own
// email client. The on-page confirmation copy must keep describing exactly
// this (a draft the visitor sends), never "we received your request".

function mailtoUrl(to: string, subject: string, bodyLines: string[]): string {
  const body = bodyLines.filter((line) => line.length > 0).join('\n');
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function demoMailto(values: DemoFormValues): string {
  return mailtoUrl(CONTACT_EMAIL, `Demo request — ${values.practice.trim()}`, [
    `Name: ${values.name.trim()}`,
    `Practice: ${values.practice.trim()}`,
    `Email: ${values.email.trim()}`,
    `Offices: ${values.offices}`,
    values.notes.trim() ? `Notes: ${values.notes.trim()}` : '',
  ]);
}

export function checklistMailto(values: ChecklistFormValues): string {
  return mailtoUrl(CONTACT_EMAIL, `Checklist request — ${values.state.trim()}`, [
    `State: ${values.state.trim()}`,
    `Email: ${values.email.trim()}`,
  ]);
}

export function openMailto(url: string) {
  window.location.href = url;
}

// Abuse control (FOLLOWUPS.md #4): a per-form submission cooldown. The
// mailto: stopgap has no server-side to throttle, so the client keeps a
// sessionStorage timestamp per form — a bot that reloads the page and
// re-submits is told to wait. sessionStorage (not localStorage) so a closed
// browser clears it; forms are keyed separately so the legitimate
// checklist → demo handoff is never blocked. Fails open when storage is
// unavailable (private browsing, blocked storage).
export const LEAD_COOLDOWN_MS = 60_000;

function cooldownKey(form: string): string {
  return `lead-cooldown.${form}`;
}

export function cooldownRemainingMs(form: string, now = Date.now()): number {
  try {
    const raw = sessionStorage.getItem(cooldownKey(form));
    const until = raw === null ? NaN : Number.parseInt(raw, 10);
    return Number.isFinite(until) && until > now ? until - now : 0;
  } catch {
    return 0;
  }
}

export function recordSubmission(form: string, now = Date.now()): void {
  try {
    sessionStorage.setItem(cooldownKey(form), String(now + LEAD_COOLDOWN_MS));
  } catch {
    // storage unavailable — nothing to record, fail open
  }
}
