export type TrackProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (name: string, options?: { props?: TrackProps }) => void;
  }
}

/**
 * Fires a Plausible custom event. Safe to call anywhere: no-ops when the
 * snippet is not loaded (tests, SSR, blocked network) and never throws.
 * Event names and props are analytics-only — never include PII.
 */
export function trackEvent(name: string, props?: TrackProps) {
  if (typeof window === 'undefined') {
    return;
  }
  if (typeof window.plausible === 'function') {
    window.plausible(name, props ? { props } : undefined);
  }
}
