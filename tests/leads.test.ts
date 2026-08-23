import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  checklistMailto,
  cooldownRemainingMs,
  demoMailto,
  LEAD_COOLDOWN_MS,
  recordSubmission,
} from '../src/lib/leads';
import { CONTACT_EMAIL } from '../src/data/content';

const demoValues = {
  name: 'Dr. Jordan Lee',
  practice: 'Brightsmile & Co',
  email: 'dr.lee@brightsmile.example',
  offices: '2',
  notes: 'Spore logs & the DEA count',
};

function bodyOf(url: string): string {
  return decodeURIComponent(url.split('body=')[1]);
}

function subjectOf(url: string): string {
  return decodeURIComponent(url.split('subject=')[1].split('&body=')[0]);
}

describe('lead mailto builders (interim delivery — FOLLOWUPS #4)', () => {
  it('builds a demo mailto addressed to the team inbox with every field', () => {
    const url = demoMailto(demoValues);
    expect(url).toContain(`mailto:${CONTACT_EMAIL}?subject=`);
    const body = bodyOf(url);
    expect(body).toContain('Name: Dr. Jordan Lee');
    expect(body).toContain('Practice: Brightsmile & Co');
    expect(body).toContain('Email: dr.lee@brightsmile.example');
    expect(body).toContain('Offices: 2');
    expect(body).toContain('Notes: Spore logs & the DEA count');
  });

  it('omits the notes line when notes are blank', () => {
    const body = bodyOf(demoMailto({ ...demoValues, notes: '   ' }));
    expect(body).not.toContain('Notes:');
  });

  it('builds a checklist mailto with the state and email only', () => {
    const url = checklistMailto({ state: 'Colorado', email: 'dr.lee@brightsmile.example' });
    expect(url).toContain(`mailto:${CONTACT_EMAIL}?subject=`);
    expect(subjectOf(url)).toBe('Checklist request — Colorado');
    const body = bodyOf(url);
    expect(body).toContain('State: Colorado');
    expect(body).toContain('Email: dr.lee@brightsmile.example');
    expect(body).not.toContain('Name:');
  });
});

describe('lead submission cooldown (abuse control — FOLLOWUPS #4)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('reports no cooldown before any submission', () => {
    expect(cooldownRemainingMs('demo')).toBe(0);
    expect(cooldownRemainingMs('checklist')).toBe(0);
  });

  it('holds the submitting form for the cooldown window and leaves the other form open', () => {
    recordSubmission('demo');
    expect(cooldownRemainingMs('demo')).toBeGreaterThan(0);
    expect(cooldownRemainingMs('demo')).toBeLessThanOrEqual(LEAD_COOLDOWN_MS);
    // Per-form keying: the checklist → demo handoff must never be blocked.
    expect(cooldownRemainingMs('checklist')).toBe(0);
  });

  it('expires once the window has passed', () => {
    recordSubmission('demo', Date.now() - LEAD_COOLDOWN_MS - 1);
    expect(cooldownRemainingMs('demo')).toBe(0);
  });

  it('treats a corrupt stored value as no cooldown', () => {
    sessionStorage.setItem('lead-cooldown.demo', 'not-a-timestamp');
    expect(cooldownRemainingMs('demo')).toBe(0);
  });

  it('fails open when storage is unavailable', () => {
    const deny = () => {
      throw new Error('storage denied');
    };
    // jsdom's storage methods can't be spied on reliably — replace the
    // global binding instead (the module reads bare `sessionStorage`).
    vi.stubGlobal('sessionStorage', {
      getItem: deny,
      setItem: deny,
      length: 0,
      clear: () => {},
      key: () => null,
      removeItem: () => {},
    } as Storage);
    expect(() => recordSubmission('demo')).not.toThrow();
    expect(cooldownRemainingMs('demo')).toBe(0);
  });
});
