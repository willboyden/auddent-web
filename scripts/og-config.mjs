// Per-vertical brand + palette for the generated og-image (scripts/make-og-image.mjs).
// This is the only scripts/ file allowed to differ between marketing sites.
export const ogConfig = {
  brand: 'BrightGuard',
  articleSlug: 'dental-inspection-prep',
  eyebrow: 'The compliance workbench for dental practices',
  headline: 'Walk into your next inspection with the evidence already in hand.',
  subline:
    'Sterilization, spore tests, training, DEA, HIPAA, and a tamper-evident audit trail — in one place your auditor can verify.',
  chips: ['Inspection-ready', 'Tamper-evident audit trail', 'Weekly owner digest'],
  palette: {
    bg: '#0b2545',
    glowA: '20, 65, 122',
    glowB: '14, 58, 110',
    primary: '#0a63c9',
    eyebrow: '#7fb1e8',
    sub: '#b9cbe0',
    chipText: '#eaf2fb',
    ctaText: '#0b2545',
  },
};
