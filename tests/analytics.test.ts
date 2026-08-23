import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackEvent } from '../src/lib/analytics';

describe('trackEvent', () => {
  afterEach(() => {
    window.plausible = undefined;
  });

  it('no-ops without throwing when plausible is not loaded', () => {
    expect(() => trackEvent('demo_request')).not.toThrow();
    expect(() => trackEvent('billing_toggle', { period: 'yearly' })).not.toThrow();
  });

  it('forwards the event name to plausible', () => {
    const plausible = vi.fn();
    window.plausible = plausible;
    trackEvent('demo_request');
    expect(plausible).toHaveBeenCalledTimes(1);
    expect(plausible).toHaveBeenCalledWith('demo_request', undefined);
  });

  it('forwards props as the props option when given', () => {
    const plausible = vi.fn();
    window.plausible = plausible;
    trackEvent('checklist_request', { state: 'Colorado' });
    expect(plausible).toHaveBeenCalledWith('checklist_request', { props: { state: 'Colorado' } });
  });
});
