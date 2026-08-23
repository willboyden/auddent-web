import { US_STATES } from '../content';

// "Get the state checklist" data (docs/plans/state-checklist.md, M1).
//
// Discipline (plan non-negotiables):
// - Curated states only — shipped states have a `lastReviewedIso` and every
//   item links to a primary source (state board / CDC / OSHA / EPA / ADA).
// - "Commonly checks" phrasing: items describe what inspectors commonly look
//   at, never a pass guarantee. The page carries the "not legal advice" line.
// - State numbers mirror the product's jurisdiction rule packs
//   (src/packs/jurisdictions in the monorepo root) — the same data that
//   drives the app's thresholds. Per-state claims need the plan's
//   two-reviewer compliance sign-off before the state ships.

/** Fixed sections, aligned 1:1 with the product modules so the M4
 *  "AudDent tracks this" chips map cleanly. */
export type ChecklistSectionId =
  | 'sterilization'
  | 'waterline'
  | 'radiation'
  | 'osha'
  | 'waste-sharps'
  | 'chemicals-sds'
  | 'credentials-training'
  | 'policy-emergency';

export interface ChecklistSection {
  id: ChecklistSectionId;
  title: string;
}

export const CHECKLIST_SECTIONS: ChecklistSection[] = [
  { id: 'sterilization', title: 'Sterilization' },
  { id: 'waterline', title: 'Dental unit water' },
  { id: 'radiation', title: 'Radiation' },
  { id: 'osha', title: 'OSHA recordkeeping' },
  { id: 'waste-sharps', title: 'Waste & sharps' },
  { id: 'chemicals-sds', title: 'Chemicals & SDS' },
  { id: 'credentials-training', title: 'Credentials & training' },
  { id: 'policy-emergency', title: 'Policies & emergencies' },
];

export type ChecklistSource = 'state' | 'federal' | 'both';

export interface ChecklistItem {
  /** Stable id, referenced by states. */
  id: string;
  section: ChecklistSectionId;
  /** What the item is (the checklist line). */
  title: string;
  /** What inspectors commonly check. */
  requirement: string;
  /** What proves it. */
  evidence: string;
  /** "per cycle" / "annual" / … */
  frequency: string;
  source: ChecklistSource;
  /** Primary source, linkrot-guarded in the gate. */
  referenceUrl: string;
}

export interface StateChecklist {
  /** Must be a member of US_STATES. */
  state: string;
  /** URL slug for /checklist/<slug>. */
  slug: string;
  boardName: string;
  boardUrl: string;
  /** Item ids, ordered as an inspector walks the room. */
  items: string[];
  /** 1–3 sentences of state-specific context. */
  stateNotes: string;
  /** Drives the "last reviewed" line + the review backlog. */
  lastReviewedIso: string;
}

const CDC_STERILIZATION = 'https://www.cdc.gov/health-care/settings/general/sterilization.html';
const CDC_WATER = 'https://www.cdc.gov/dental-infection-control/hcp/dental-ipc-faqs/best-practices-dental-unit-water-quality.html';
const OSHA_RECORDKEEPING = 'https://www.osha.gov/recordkeeping';
const OSHA_BBP = 'https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1030';
const OSHA_HAZCOM = 'https://www.osha.gov/hazcom';
const OSHA_HOME = 'https://www.osha.gov';
const EPA_HW = 'https://www.epa.gov/hw';
const ADA_HOME = 'https://www.ada.org';
const CA_CDPH = 'https://www.cdph.ca.gov';
const TX_BOARD = 'https://www.tsbde.texas.gov';
const FL_BOARD = 'https://floridasdentistry.gov';
const FL_OSHA = 'https://www.myfloridacfo.com';
const MA_BOARD = 'https://www.mass.gov/orgs/board-of-registration-in-dentistry';

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // — Shared (federal / national-baseline) items —
  {
    id: 'sterilization-spore-per-cycle',
    section: 'sterilization',
    title: 'Spore test for every sterilizer cycle',
    requirement:
      'Inspectors commonly ask to see biological (spore) test results for the autoclave — a pass/fail result per sterilization cycle, with the date and the unit identified.',
    evidence: 'Dated spore-test log per sterilizer, including positive/negative controls.',
    frequency: 'per cycle',
    source: 'federal',
    referenceUrl: CDC_STERILIZATION,
  },
  {
    id: 'sterilization-clean-flow',
    section: 'sterilization',
    title: 'Soiled-to-clean instrument workflow',
    requirement:
      'A documented clean-to-soiled workflow: cleaning, then high-level disinfection or sterilization, with no backflow between the soiled zone and the clean zone.',
    evidence: 'Written standard operating procedure, observable during the walkthrough.',
    frequency: 'ongoing',
    source: 'federal',
    referenceUrl: CDC_STERILIZATION,
  },
  {
    id: 'waterline-sampling-log',
    section: 'waterline',
    title: 'Dental unit water sampling log',
    requirement:
      'Records of dental unit water sampling — per unit, with the test method and the result against the pass threshold your state applies.',
    evidence: 'Sampling log: date, unit, method (colony count, ATP bioburden, or plate count), and result.',
    frequency: 'per your sampling schedule',
    source: 'federal',
    referenceUrl: CDC_WATER,
  },
  {
    id: 'radiation-alar-shielding',
    section: 'radiation',
    title: 'ALARA practices and shielding',
    requirement:
      'Lead aprons and thyroid collars available and used, image receptor and positioning practices that keep patient exposure as low as reasonably achievable.',
    evidence: 'Written ALARA policy and apron inventory in the operatory.',
    frequency: 'per procedure',
    source: 'federal',
    referenceUrl: ADA_HOME,
  },
  {
    id: 'osha-300-log',
    section: 'osha',
    title: 'OSHA 300 log and 300A annual summary',
    requirement:
      'Covered practices keep an OSHA 300 injury and illness log and post the 300A annual summary where employees can see it during the annual posting window.',
    evidence: 'Forms 300/300A and where the summary was posted (and for what window).',
    frequency: 'annual',
    source: 'federal',
    referenceUrl: OSHA_RECORDKEEPING,
  },
  {
    id: 'osha-bloodborne-plan',
    section: 'osha',
    title: 'Bloodborne pathogen exposure control plan',
    requirement:
      'A written exposure control plan covering tasks with exposure risk, PPE, and post-exposure follow-up, per OSHA 29 CFR 1910.1030.',
    evidence: 'The written plan, plus any sharps-injury incident log.',
    frequency: 'kept current',
    source: 'federal',
    referenceUrl: OSHA_BBP,
  },
  {
    id: 'sharps-containers',
    section: 'waste-sharps',
    title: 'Sharps containers, filled to the limit',
    requirement:
      'Puncture-resistant, labeled sharps containers in use, disposed at or below the fill limit your state applies.',
    evidence: 'Containers in use and the state fill limit — see the sharps item below.',
    frequency: 'continuous',
    source: 'both',
    referenceUrl: OSHA_HOME,
  },
  {
    id: 'sharps-vendor-pickup',
    section: 'waste-sharps',
    title: 'Licensed medical waste pickup records',
    requirement:
      'Manifests or pickup logs showing that medical and sharps waste was picked up by a licensed vendor.',
    evidence: 'Pickup manifests or vendor invoices, per pickup.',
    frequency: 'per pickup',
    source: 'federal',
    referenceUrl: EPA_HW,
  },
  {
    id: 'sds-library',
    section: 'chemicals-sds',
    title: 'Safety data sheet (SDS) library',
    requirement:
      'A safety data sheet for every chemical you use, available to staff on site, per OSHA Hazard Communication.',
    evidence: 'Binder or digital library, current with your chemical inventory.',
    frequency: 'kept current',
    source: 'federal',
    referenceUrl: OSHA_HAZCOM,
  },
  {
    id: 'training-records',
    section: 'credentials-training',
    title: 'Staff training records',
    requirement:
      'Records that staff completed required training — OSHA topics, CPR/BLS, infection control.',
    evidence: 'Signed training rosters or certificates.',
    frequency: 'per requirement',
    source: 'federal',
    referenceUrl: OSHA_HOME,
  },
  {
    id: 'emergency-protocol',
    section: 'policy-emergency',
    title: 'Medical emergency protocol',
    requirement:
      'A written protocol for managing a medical emergency in the operatory — resuscitation, emergency medications, and when to call 911.',
    evidence: 'Written protocol and a checked emergency kit.',
    frequency: 'kept current',
    source: 'federal',
    referenceUrl: ADA_HOME,
  },
  {
    id: 'exposure-incident-response',
    section: 'policy-emergency',
    title: 'Exposure incident response',
    requirement:
      'Documented steps after a needlestick or other exposure: identify the source, risk assessment, follow-up care, and documentation.',
    evidence: 'The procedure inside your exposure control plan.',
    frequency: 'per incident',
    source: 'federal',
    referenceUrl: OSHA_BBP,
  },

  // — California —
  {
    id: 'waterline-ca-threshold',
    section: 'waterline',
    title: 'Water quality pass thresholds (California)',
    requirement:
      'In California, dental unit water results are commonly held to pass thresholds of 300 colony count and 40 ATP bioburden — tighter than the national baseline.',
    evidence: 'Sampling results against those thresholds, per unit.',
    frequency: 'per sampling',
    source: 'state',
    referenceUrl: CA_CDPH,
  },
  {
    id: 'radiation-ca-registration',
    section: 'radiation',
    title: 'X-ray registration and calibration (California)',
    requirement:
      'A state radiation permit is tracked for dental X-ray equipment in California; inspectors may ask for the registration plus calibration or service records within the interval (commonly 12 months).',
    evidence: 'Registration document and per-unit calibration/service certificates.',
    frequency: 'per interval',
    source: 'state',
    referenceUrl: CA_CDPH,
  },
  {
    id: 'sharps-ca-fill-limit',
    section: 'waste-sharps',
    title: 'Sharps container fill limit (California)',
    requirement: 'In California, sharps containers are commonly disposed at 70% full or less.',
    evidence: 'Container fill practice and vendor pickup logs.',
    frequency: 'continuous',
    source: 'state',
    referenceUrl: CA_CDPH,
  },
  {
    id: 'credentials-ca-licensure',
    section: 'credentials-training',
    title: 'Licensure (California)',
    requirement:
      'Active licensure for every dentist and dental hygienist on staff; a state professional permit is tracked in California, so confirm it is current too.',
    evidence: 'License/permit numbers checked against the board’s records.',
    frequency: 'kept current',
    source: 'state',
    referenceUrl: CA_CDPH,
  },

  // — Texas —
  {
    id: 'waterline-tx-threshold',
    section: 'waterline',
    title: 'Water quality pass thresholds (Texas)',
    requirement:
      'In Texas, dental unit water results are commonly held to pass thresholds of 1000 colony count and 100 ATP bioburden — looser than the national baseline.',
    evidence: 'Sampling results against those thresholds, per unit.',
    frequency: 'per sampling',
    source: 'state',
    referenceUrl: TX_BOARD,
  },
  {
    id: 'radiation-tx-registration',
    section: 'radiation',
    title: 'X-ray calibration records (Texas)',
    requirement:
      'No state radiation permit is tracked for dental X-ray in Texas; the equipment is held to calibration and service records within the interval (commonly 12 months) instead.',
    evidence: 'Per-unit calibration/service certificates.',
    frequency: 'per interval',
    source: 'state',
    referenceUrl: TX_BOARD,
  },
  {
    id: 'sharps-tx-fill-limit',
    section: 'waste-sharps',
    title: 'Sharps container fill limit (Texas)',
    requirement: 'In Texas, sharps containers are commonly disposed at 75% full or less.',
    evidence: 'Container fill practice and vendor pickup logs.',
    frequency: 'continuous',
    source: 'state',
    referenceUrl: TX_BOARD,
  },
  {
    id: 'credentials-tx-licensure',
    section: 'credentials-training',
    title: 'Licensure (Texas)',
    requirement:
      'Active licensure by the Texas State Board of Dentistry for every dentist and dental hygienist on staff; inspectors may confirm each license is current.',
    evidence: 'License numbers checked against the board’s records.',
    frequency: 'kept current',
    source: 'state',
    referenceUrl: TX_BOARD,
  },

  // — Florida —
  {
    id: 'waterline-fl-threshold',
    section: 'waterline',
    title: 'Water quality pass thresholds (Florida)',
    requirement:
      'In Florida, dental unit water results are commonly held to pass thresholds of 600 colony count and 60 ATP bioburden.',
    evidence: 'Sampling results against those thresholds, per unit.',
    frequency: 'per sampling',
    source: 'state',
    referenceUrl: FL_BOARD,
  },
  {
    id: 'radiation-fl-registration',
    section: 'radiation',
    title: 'X-ray registration and calibration (Florida)',
    requirement:
      'A state radiation permit is tracked for dental X-ray equipment in Florida; inspectors may ask for the registration plus calibration or service records within the interval (commonly 12 months).',
    evidence: 'Registration document and per-unit calibration/service certificates.',
    frequency: 'per interval',
    source: 'state',
    referenceUrl: FL_BOARD,
  },
  {
    id: 'sharps-fl-fill-limit',
    section: 'waste-sharps',
    title: 'Sharps container fill limit (Florida)',
    requirement: 'In Florida, sharps containers are commonly disposed at 75% full or less.',
    evidence: 'Container fill practice and vendor pickup logs.',
    frequency: 'continuous',
    source: 'state',
    referenceUrl: FL_BOARD,
  },
  {
    id: 'osha-fl-300a-deadline',
    section: 'osha',
    title: '300A posting deadline (Florida)',
    requirement:
      'Florida’s OSHA program sets the 300A annual summary posting deadline at May 15 — outside the federal February 1 – April 30 window.',
    evidence: 'The posted 300A and the posting dates.',
    frequency: 'annual',
    source: 'state',
    referenceUrl: FL_OSHA,
  },
  {
    id: 'credentials-fl-licensure',
    section: 'credentials-training',
    title: 'Licensure (Florida)',
    requirement:
      'Active licensure for every dentist and dental hygienist on staff; a state professional permit is tracked in Florida, so confirm it is current too.',
    evidence: 'License/permit numbers checked against the board’s records.',
    frequency: 'kept current',
    source: 'state',
    referenceUrl: FL_BOARD,
  },

  // — Massachusetts —
  {
    id: 'waterline-ma-threshold',
    section: 'waterline',
    title: 'Water quality pass thresholds (Massachusetts)',
    requirement:
      'In Massachusetts, dental unit water results are commonly held to pass thresholds of 400 colony count and 50 ATP bioburden — tighter than the national baseline.',
    evidence: 'Sampling results against those thresholds, per unit.',
    frequency: 'per sampling',
    source: 'state',
    referenceUrl: MA_BOARD,
  },
  {
    id: 'radiation-ma-registration',
    section: 'radiation',
    title: 'X-ray registration and calibration (Massachusetts)',
    requirement:
      'A state radiation permit is tracked for dental X-ray equipment in Massachusetts; inspectors may ask for the registration plus calibration or service records within the interval (commonly 12 months).',
    evidence: 'Registration document and per-unit calibration/service certificates.',
    frequency: 'per interval',
    source: 'state',
    referenceUrl: MA_BOARD,
  },
  {
    id: 'sharps-ma-fill-limit',
    section: 'waste-sharps',
    title: 'Sharps container fill limit (Massachusetts)',
    requirement: 'In Massachusetts, sharps containers are commonly disposed at 70% full or less.',
    evidence: 'Container fill practice and vendor pickup logs.',
    frequency: 'continuous',
    source: 'state',
    referenceUrl: MA_BOARD,
  },
  {
    id: 'credentials-ma-licensure',
    section: 'credentials-training',
    title: 'Licensure (Massachusetts)',
    requirement:
      'Active licensure for every dentist and dental hygienist on staff; a state professional permit is tracked in Massachusetts, so confirm it is current too.',
    evidence: 'License/permit numbers checked against the board’s records.',
    frequency: 'kept current',
    source: 'state',
    referenceUrl: MA_BOARD,
  },
];

export const CHECKLIST_STATES: StateChecklist[] = [
  {
    state: 'California',
    slug: 'california',
    boardName: 'California Department of Public Health',
    boardUrl: CA_CDPH,
    items: [
      'sterilization-spore-per-cycle',
      'sterilization-clean-flow',
      'waterline-sampling-log',
      'waterline-ca-threshold',
      'radiation-alar-shielding',
      'radiation-ca-registration',
      'osha-300-log',
      'osha-bloodborne-plan',
      'sharps-containers',
      'sharps-ca-fill-limit',
      'sharps-vendor-pickup',
      'sds-library',
      'credentials-ca-licensure',
      'training-records',
      'emergency-protocol',
      'exposure-incident-response',
    ],
    stateNotes:
      'California runs the stricter side: colony-count pass thresholds sit well below the national baseline, a state professional permit is tracked, and the sharps container fill limit is 70%. The California Dental Board handles licensure; the California Department of Public Health conducts dental office inspections.',
    lastReviewedIso: '2026-08-23',
  },
  {
    state: 'Texas',
    slug: 'texas',
    boardName: 'Texas State Board of Dentistry',
    boardUrl: TX_BOARD,
    items: [
      'sterilization-spore-per-cycle',
      'sterilization-clean-flow',
      'waterline-sampling-log',
      'waterline-tx-threshold',
      'radiation-alar-shielding',
      'radiation-tx-registration',
      'osha-300-log',
      'osha-bloodborne-plan',
      'sharps-containers',
      'sharps-tx-fill-limit',
      'sharps-vendor-pickup',
      'sds-library',
      'credentials-tx-licensure',
      'training-records',
      'emergency-protocol',
      'exposure-incident-response',
    ],
    stateNotes:
      'Texas runs the looser side: no state radiation permit is tracked for dental X-ray, and colony-count pass thresholds sit above the national baseline. The Texas State Board of Dentistry handles licensure.',
    lastReviewedIso: '2026-08-23',
  },
  {
    state: 'Florida',
    slug: 'florida',
    boardName: 'Florida Board of Dentistry',
    boardUrl: FL_BOARD,
    items: [
      'sterilization-spore-per-cycle',
      'sterilization-clean-flow',
      'waterline-sampling-log',
      'waterline-fl-threshold',
      'radiation-alar-shielding',
      'radiation-fl-registration',
      'osha-300-log',
      'osha-bloodborne-plan',
      'osha-fl-300a-deadline',
      'sharps-containers',
      'sharps-fl-fill-limit',
      'sharps-vendor-pickup',
      'sds-library',
      'credentials-fl-licensure',
      'training-records',
      'emergency-protocol',
      'exposure-incident-response',
    ],
    stateNotes:
      'Florida follows the standard structure, but its OSHA program sets the 300A annual summary posting deadline at May 15 — outside the federal February 1 – April 30 window. The Florida Board of Dentistry handles licensure.',
    lastReviewedIso: '2026-08-23',
  },
  {
    state: 'Massachusetts',
    slug: 'massachusetts',
    boardName: 'Massachusetts Board of Registration in Dentistry',
    boardUrl: MA_BOARD,
    items: [
      'sterilization-spore-per-cycle',
      'sterilization-clean-flow',
      'waterline-sampling-log',
      'waterline-ma-threshold',
      'radiation-alar-shielding',
      'radiation-ma-registration',
      'osha-300-log',
      'osha-bloodborne-plan',
      'sharps-containers',
      'sharps-ma-fill-limit',
      'sharps-vendor-pickup',
      'sds-library',
      'credentials-ma-licensure',
      'training-records',
      'emergency-protocol',
      'exposure-incident-response',
    ],
    stateNotes:
      'Massachusetts runs the stricter side (it is also the state AudDent’s demo practice runs in): a tighter colony-count threshold, a state professional permit, and a 70% sharps container fill limit. The Board of Registration in Dentistry, under the Massachusetts Department of Public Health, handles licensure.',
    lastReviewedIso: '2026-08-23',
  },
];

export function getChecklistBySlug(slug: string): StateChecklist | undefined {
  return CHECKLIST_STATES.find((c) => c.slug === slug);
}

export function getChecklistByState(state: string): StateChecklist | undefined {
  return CHECKLIST_STATES.find((c) => c.state === state);
}

export const SHIPPED_STATE_SLUGS: string[] = CHECKLIST_STATES.map((c) => c.slug);

export const SHIPPED_STATE_NAMES: string[] = CHECKLIST_STATES.map((c) => c.state);

export function itemById(id: string): ChecklistItem {
  const item = CHECKLIST_ITEMS.find((i) => i.id === id);
  if (!item) throw new Error(`checklist item '${id}' is not defined`);
  return item;
}

/** Guard the data module's own invariants at import time (the unit test
 *  re-checks them against US_STATES membership). */
for (const state of CHECKLIST_STATES) {
  if (!US_STATES.includes(state.state)) {
    throw new Error(`checklist state '${state.state}' is not in US_STATES`);
  }
}
