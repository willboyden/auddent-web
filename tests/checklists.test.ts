import { describe, expect, it } from 'vitest';
import { US_STATES } from '../src/data/content';
import {
  CHECKLIST_ITEMS,
  CHECKLIST_SECTIONS,
  CHECKLIST_STATES,
  getChecklistBySlug,
} from '../src/data/checklists';

const SECTION_IDS = new Set(CHECKLIST_SECTIONS.map((s) => s.id));
const ITEM_IDS = new Set(CHECKLIST_ITEMS.map((i) => i.id));
const SOURCES = new Set(['state', 'federal', 'both']);

describe('state checklist data (docs/plans/state-checklist.md M1)', () => {
  it('defines non-empty sections with unique ids', () => {
    expect(CHECKLIST_SECTIONS.length).toBeGreaterThan(0);
    expect(SECTION_IDS.size).toBe(CHECKLIST_SECTIONS.length);
    for (const section of CHECKLIST_SECTIONS) {
      expect(section.title.length).toBeGreaterThan(0);
    }
  });

  it('item ids are unique', () => {
    expect(ITEM_IDS.size).toBe(CHECKLIST_ITEMS.length);
  });

  it('every item has the required shape', () => {
    for (const item of CHECKLIST_ITEMS) {
      expect(SECTION_IDS.has(item.section)).toBe(true);
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.requirement.length).toBeGreaterThan(20);
      expect(item.evidence.length).toBeGreaterThan(0);
      expect(item.frequency.length).toBeGreaterThan(0);
      expect(SOURCES.has(item.source)).toBe(true);
      const url = new URL(item.referenceUrl);
      expect(url.protocol).toBe('https:');
      expect(url.hostname).not.toBe('');
    }
  });

  it('shipped states are well-formed', () => {
    const slugs = new Set<string>();
    for (const state of CHECKLIST_STATES) {
      expect(US_STATES).toContain(state.state);
      expect(state.slug).toMatch(/^[a-z]+$/);
      expect(slugs.has(state.slug)).toBe(false);
      slugs.add(state.slug);
      expect(state.boardName.length).toBeGreaterThan(0);
      const url = new URL(state.boardUrl);
      expect(url.protocol).toBe('https:');
      expect(state.stateNotes.length).toBeGreaterThan(20);
      expect(state.items.length).toBeGreaterThan(10);
      // no orphan item references
      for (const id of state.items) {
        expect(ITEM_IDS.has(id)).toBe(true);
      }
      // lastReviewedIso is a valid date and not in the future
      expect(state.lastReviewedIso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const reviewed = new Date(`${state.lastReviewedIso}T00:00:00Z`);
      expect(Number.isNaN(reviewed.getTime())).toBe(false);
      expect(reviewed.getTime()).toBeLessThanOrEqual(Date.now());
    }
  });

  it('no item is orphaned (every item is referenced by at least one state)', () => {
    const referenced = new Set(CHECKLIST_STATES.flatMap((s) => s.items));
    for (const item of CHECKLIST_ITEMS) {
      expect(referenced.has(item.id)).toBe(true);
    }
  });

  it('lookup by slug works for shipped states and misses for unshipped', () => {
    for (const state of CHECKLIST_STATES) {
      expect(getChecklistBySlug(state.slug)?.state).toBe(state.state);
    }
    expect(getChecklistBySlug('new-york')).toBeUndefined();
  });
});
