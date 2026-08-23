export const PRODUCT_NAME = 'AudDent';
export const PRODUCT_TAGLINE = 'The compliance workbench for dental practices';

export interface NavLink {
  label: string;
  href: string;
}

// Home section links are root-absolute (`/#section`) so the shared
// header/footer work from every prerendered page (`/`, `/resources`,
// articles, `/privacy`) — a bare `#section` resolves against the current
// path and silently no-ops off the home page.
export const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '/#features' },
  { label: 'Audit trail', href: '/#audit-trail' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
];

export const PAGE_LINKS: NavLink[] = [{ label: 'Resources', href: '/resources' }];

export const TRUST_ITEMS: string[] = [
  'OSHA bloodborne pathogens',
  'HIPAA privacy & security',
  'DEA controlled substances',
  'CDC sterilization guidance',
  'State board of health',
  'EPA Mercury Act (amalgam)',
];

export interface Feature {
  id: string;
  mark: string;
  title: string;
  body: string;
}

export const FEATURES: Feature[] = [
  {
    id: 'infection-control',
    mark: 'IC',
    title: 'Infection control & spore tests',
    body: 'Log every sterilizer cycle and daily spore result. A hard gate stops you from recording a cycle when the last spore test failed — so a FAIL never hides until inspection day.',
  },
  {
    id: 'training',
    mark: 'TR',
    title: 'Staff training lifecycle',
    body: 'Assign requirements by role — DDS/DMD, RDH, assistant, front desk — then attest, track expiry, and escalate automatically 30 days before anything lapses.',
  },
  {
    id: 'controlled-substances',
    mark: 'DEA',
    title: 'Controlled substances',
    body: 'A dual-signature ledger for every draw, count, return, and disposal. Monthly variance reports with the reconciliation math already done.',
  },
  {
    id: 'hipaa',
    mark: 'HIPAA',
    title: 'HIPAA',
    body: 'Versioned policies with staff acknowledgments, a breach workflow, and the records that prove your privacy program actually runs.',
  },
  {
    id: 'exposures',
    mark: 'OSHA',
    title: 'Exposure incidents',
    body: 'A bloodborne-pathogen protocol log: what happened, which steps you took, and where the follow-up stands — until it is closed and documented.',
  },
  {
    id: 'waterline',
    mark: 'H₂O',
    title: 'Waterline testing',
    body: 'TDL, ATP, and HPC results per dental unit, checked against CDC guidance thresholds, with per-unit history you can produce on request.',
  },
  {
    id: 'credentials',
    mark: 'LIC',
    title: 'Credential registry',
    body: 'Licenses, associate licenses, DEA numbers, and X-ray permits in one registry — with expiring-soon alerts 90 days before a lapse reaches a patient.',
  },
  {
    id: 'radiation',
    mark: 'XRY',
    title: 'Radiation safety',
    body: 'X-ray equipment calibration schedules and dosimetry badge readings, with action levels that alert you before you exceed them.',
  },
  {
    id: 'sharps-waste',
    mark: 'WST',
    title: 'Sharps & waste',
    body: 'Container-full tracking, EPA Mercury Act amalgam pickups, and expired-pharmaceutical disposal — on cadences you can actually prove.',
  },
  {
    id: 'retention',
    mark: '7YR',
    title: 'Retention & legal hold',
    body: 'Seven-year retention for every record class, litigation holds that block deletion, and tamper-evident exports you can verify.',
  },
];

export interface Step {
  n: string;
  title: string;
  body: string;
}

export const STEPS: Step[] = [
  {
    n: '1',
    title: 'Set up your practice',
    body: 'Add staff, assign roles, list your equipment, and turn on the modules your state actually checks. One afternoon, not a project.',
  },
  {
    n: '2',
    title: 'Record as you already work',
    body: 'Log cycles, attest training, count substances — the same motions you do today, except every entry lands in a verifiable audit chain.',
  },
  {
    n: '3',
    title: 'Get ahead of every deadline',
    body: 'Alerts fire before training lapses, licenses expire, spore tests go stale, or waterline values drift out of range. When the auditor arrives, you print one bundle.',
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'What exactly does the inspector check at a dental practice?',
    a: 'Sterilization and spore-test logs, staff training certificates, controlled-substance records, license validity, exposure-incident handling, and waterline quality — the same checklist year after year. AudDent organizes each of them into dated, signed, exportable sections, so the answer to “show me” is a button, not a weekend.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most single-office practices are live in an afternoon: add staff, assign roles, list equipment. And because every module ships with guided demo data, you can explore the whole system before you enter a single real record.',
  },
  {
    q: 'Does it replace our PMS?',
    a: 'No — AudDent sits beside your PMS. Your PMS owns scheduling and billing; AudDent owns the compliance record, which a PMS was never built to keep. PMS integration (Open Dental first) is on the roadmap.',
  },
  {
    q: 'What makes the audit trail “tamper-evident”?',
    a: 'Every record is hash-chained to the one before it. The inspection bundle recomputes the chain over the exact date range you request and reports the result: an altered or missing entry breaks the chain, and the bundle shows it. “Chain intact” becomes a verifiable fact instead of a hope.',
  },
  {
    q: 'How does it handle HIPAA?',
    a: 'Versioned policies with per-staff acknowledgment, a breach reporting workflow, and seven-year retention with legal hold. You remain responsible for your own privacy program — AudDent keeps the evidence that it is being run.',
  },
  {
    q: 'Can my whole team use it?',
    a: 'Yes — access is role-based. Chairside staff record cycles and attest training; only managers touch the substance ledger or the breach console. And every permission denial is itself written to the audit log.',
  },
];

export interface PricingTier {
  id: string;
  name: string;
  monthly: number;
  blurb: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'single-office',
    name: 'Single office',
    monthly: 149,
    blurb: 'For one practice that wants to stop dreading inspection season.',
    features: [
      '1 office, unlimited staff seats',
      'Every compliance module',
      'Inspection bundles & score reports',
      'Weekly owner digest',
      'Email support',
    ],
    cta: 'Start 30-day trial',
  },
  {
    id: 'multi-office',
    name: 'Multi-office',
    monthly: 399,
    blurb: 'For practices running 2–4 locations under one compliance roof.',
    features: [
      'Up to 4 offices',
      'Everything in Single office',
      'Cross-office alerts & group bundle',
      'Credential registry for all providers',
      'Priority support',
    ],
    cta: 'Book a demo',
    highlighted: true,
  },
  {
    id: 'dental-group',
    name: 'Dental group',
    monthly: 899,
    blurb: 'For groups that need reporting the whole ownership team can sign.',
    features: [
      'Up to 12 offices',
      'Everything in Multi-office',
      'Group compliance score & benchmarking',
      'Custom retention schedules',
      'Dedicated onboarding',
    ],
    cta: 'Talk to sales',
  },
];

export interface CompareCell {
  mark: 'yes' | 'no' | 'partial';
  text: string;
}

export interface CompareRow {
  label: string;
  cells: [CompareCell, CompareCell, CompareCell];
}

export const COMPARE_COLUMNS: string[] = ['Spreadsheets', 'Lives in your EHR', 'AudDent'];

export const COMPARE_ROWS: CompareRow[] = [
  {
    label: 'Prepping for an inspection',
    cells: [
      { mark: 'no', text: 'A weekend of hunting files and folders' },
      { mark: 'no', text: 'Notes buried in patient charts' },
      { mark: 'yes', text: 'One bundle, printed in minutes' },
    ],
  },
  {
    label: 'Evidence is dated & attributable',
    cells: [
      { mark: 'partial', text: 'If you remember to stamp it' },
      { mark: 'no', text: 'Chart notes, no chain of custody' },
      { mark: 'yes', text: 'Every entry carries who, when, and a chain hash' },
    ],
  },
  {
    label: 'A failure gets caught early',
    cells: [
      { mark: 'no', text: 'Whatever you remember to check' },
      { mark: 'no', text: 'No compliance awareness at all' },
      { mark: 'yes', text: 'Hard gates and alerts fire before inspection day' },
    ],
  },
  {
    label: 'Staff training tracked per role',
    cells: [
      { mark: 'partial', text: 'A sheet of names and dates' },
      { mark: 'no', text: 'Not a thing it was built for' },
      { mark: 'yes', text: 'Role-based requirements, expiry, auto-escalation' },
    ],
  },
  {
    label: 'Someone owns each open item',
    cells: [
      { mark: 'no', text: 'A pile of tabs, no owner' },
      { mark: 'no', text: 'Everyone and no one' },
      { mark: 'yes', text: 'Alerts assign a person, not a pile' },
    ],
  },
  {
    label: 'What the owner sees on Monday',
    cells: [
      { mark: 'partial', text: 'Whatever they remember to ask' },
      { mark: 'no', text: 'Nothing, until something breaks' },
      { mark: 'yes', text: 'A five-line digest with the three things to fix' },
    ],
  },
];

export const US_STATES: string[] = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'District of Columbia',
];

// TODO(followup 5): swap for the real address when the domain ships.
export const CONTACT_EMAIL = 'hello@auditdent.example';

// TODO(followup 7): placeholder until a real booking page exists —
// swap for the live Cal.com/Calendly URL (or remove the link) at deploy.
export const CALENDAR_URL = 'https://cal.com/auditdent/30min';

export const BUNDLE_SECTIONS: string[] = [
  'Staff & credentials',
  'Licenses expiring',
  'Training & attestations',
  'Sterilization & spore tests',
  'Equipment & waterline',
  'Substance ledger & variance',
  'HIPAA policies & breaches',
  'Exposure incidents',
  'Radiation safety',
  'Sharps & waste',
  'Policy acknowledgments',
  'Open alerts',
  'Audit log (chain verified)',
];
