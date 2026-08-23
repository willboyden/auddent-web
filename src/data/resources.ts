export interface ResourceSection {
  heading: string;
  paragraphs: string[];
}

export interface ResourceArticle {
  slug: string;
  title: string;
  category: string;
  summary: string;
  /** Display month, e.g. "August 2026". */
  updated: string;
  /** ISO date for machine consumers (RSS feed, JSON-LD dateModified). */
  updatedIso: string;
  readTime: string;
  sections: ResourceSection[];
}

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    slug: 'dental-inspection-prep',
    title: 'How to prepare for a state dental board inspection',
    category: 'Inspection prep',
    summary:
      'What state boards typically ask for, a 30-day plan to get ready, and how to handle the day itself without freezing up.',
    updated: 'August 2026',
    updatedIso: '2026-08-10',
    readTime: '7 min read',
    sections: [
      {
        heading: 'Why your practice gets inspected',
        paragraphs: [
          'State boards of dentistry and boards of health run on two triggers: routine cycles and complaints. On a routine cycle, every license and facility in the jurisdiction gets reviewed on a rotating schedule — the practice is never told in advance which year is its year. A complaint changes the cadence and narrows the scope to whatever the complaint alleges.',
          'Either way, the inspectors’ center of gravity is the same: are patients safe in this room, and are the people working here actually qualified and trained? Most of what they ask for is documentation of ordinary work you already do. The practices that struggle are not the ones that were negligent — they are the ones that could not produce the evidence on the spot.',
        ],
      },
      {
        heading: 'What inspectors typically ask to see',
        paragraphs: [
          'The specific list varies by state, but the core is remarkably consistent. Expect requests for: the practice permit and every practitioner’s license; staff training records with completion dates, including bloodborne pathogens; sterilization cycle logs with the matching spore test results; dental unit water quality test results; X-ray equipment registration and calibration records, plus dosimetry badge results where applicable; controlled substance counts where you handle them; sharps container and waste pickup records from your disposal vendor; and your infection control policies with the exposure incident log.',
          'Notice what is missing from that list: opinions. Inspectors do not grade your clinic on vibes. They check dated, attributable records against requirements.',
        ],
      },
      {
        heading: 'The 30-day countdown',
        paragraphs: [
          'Days 30–15: inventory. Pull everything you believe you have and compare it against your state’s checklist. The goal is not to fix anything yet — it is to find the gaps while there is still time to close them properly.',
          'Days 14–7: close the gaps. Retest anything whose spore result has gone stale, refresh any training that has lapsed, reconcile substance counts, and chase the missing vendor pickup records. Every fix should produce a new dated document.',
          'Days 6–1: stage and assign. Pick one point person who will be the only one answering questions. Print or export the full bundle. Walk the rooms the way an inspector will: equipment labeled, containers below the fill line, nothing expired on the shelf.',
        ],
      },
      {
        heading: 'The day of the inspection',
        paragraphs: [
          'Be cooperative, never defensive, and never obstruct. Answer what you know; when you do not know, say “let me get you that” instead of guessing — a followed-up document beats a confident estimate every time.',
          'Have your point person log every request and every observation made, in the moment, on paper or a phone. That contemporaneous note is what makes the follow-up reliable, and it is the single highest-value habit in the entire process.',
        ],
      },
      {
        heading: 'After the inspection',
        paragraphs: [
          'Get the findings in writing. Assign an owner and a due date to every corrective action, and document each fix with the same rigor you would have wanted on inspection day: the retest result, the training completion record, the updated count.',
          'If a finding repeats from a prior cycle, treat it as a process failure, not a diligence failure — the system that produced it once will produce it again unless the system changes.',
        ],
      },
      {
        heading: 'The five findings we see most often',
        paragraphs: [
          'A spore test that has gone stale and was never retested. Dental unit water results that are missing or older than the state’s window. Staff training records that exist somewhere but cannot be tied to a named individual. Waste pickup records that do not line up with the container counts. And exposure incidents that were handled well in the moment and never documented at all. Every one of these is fixable in a week with a system that records the evidence as the work happens — which is precisely the problem AudDent exists to solve.',
        ],
      },
    ],
  },
  {
    slug: 'sterilization-what-inspectors-check',
    title: 'Sterilization & infection control: what inspectors actually check',
    category: 'Infection control',
    summary:
      'The five levels of reprocessing in plain language, why a failed spore test is a record and not a secret, and the water-quality number your state may ask about.',
    updated: 'August 2026',
    updatedIso: '2026-08-08',
    readTime: '6 min read',
    sections: [
      {
        heading: 'The five levels, in plain language',
        paragraphs: [
          'The CDC’s reprocessing hierarchy classifies instruments by how much they contact the patient. Critical instruments penetrate bone or blood — implant instruments, surgical burs, and handpiece components when they contact blood. Semi-critical instruments contact mucous membranes or non-intact skin — mirrors, probes, and dental handpiece inserts. Below those sit non-critical items that touch only intact skin, plus the environment itself.',
          'The classification drives the required treatment: critical instruments must be sterilized; semi-critical items need at least high-level disinfection. An inspector does not need to recite the levels with you — they need to see that your logs show you are treating your instruments according to the hierarchy.',
        ],
      },
      {
        heading: 'Spore tests: what a failure actually means',
        paragraphs: [
          'A biological (spore) indicator confirms that a sterilization cycle achieved the kill level it claims. A failed test means the loads from that cycle cannot be assumed safe until the cause is found and a subsequent test passes. That is not a moral failing — it is the test doing its job.',
          'What inspectors look for after a failure is the chain of response: the failed result recorded, the load quarantined, a root cause identified (loading error, chamber issue, packing), corrective action taken, and a passing retest. A failed spore test that was handled and documented is a positive finding. A missing or unexplained gap in the test record is a negative one.',
        ],
      },
      {
        heading: 'Water quality: the 500 number',
        paragraphs: [
          'The CDC’s 2018 guidance recommends that dental unit water used in procedures where water contacts broken skin or mucous membranes meet the drinking water standard for heterotrophic bacteria: 500 colony-forming units per milliliter. State boards typically set their own testing cadence and may require results on request.',
          'When a result runs over the benchmark, the standard response is to flush and disinfect the lines, then retest — and many state expectations want two consecutive passing samples before the unit returns to full service. The documentation that matters is the sequence: high result, actions taken, retests, resolution.',
        ],
      },
      {
        heading: 'What a complete cycle log looks like',
        paragraphs: [
          'Date, equipment used, load identifier, cycle parameters, the operator, and — for sterilized loads — the corresponding spore test result. The chain of documents is the point. A sterilization claim with no dated, attributable record behind it is an assertion, and assertions are exactly what an inspection is designed to test.',
        ],
      },
      {
        heading: 'Where practices usually fall short',
        paragraphs: [
          'Testing only the loads that look fine. Water quality measured once a year with no per-unit history. Spore tests performed but filed in a drawer with no link to the cycle they certify. And failures that get corrected quietly, with no record of the correction. None of these is hard to fix — they are all the same gap: evidence that was not captured at the moment the work happened.',
        ],
      },
    ],
  },
  {
    slug: 'osha-300-dental-practices',
    title: 'OSHA 300 & 300A: what dental practices need to know',
    category: 'Recordkeeping',
    summary:
      'Which practices must keep the injury log, what the annual summary posts and when, and why your state board will likely ask about incidents anyway.',
    updated: 'August 2026',
    updatedIso: '2026-08-05',
    readTime: '5 min read',
    sections: [
      {
        heading: 'Who has to keep the log',
        paragraphs: [
          'Under OSHA’s recordkeeping rule (29 CFR 1904), employers with more than 100 employees must keep the OSHA 300 log. Employers with 11–99 employees in certain industries — healthcare is among them, which covers dental practices — must as well. Practices with 10 or fewer employees are exempt from keeping the 300 log itself.',
          'Exemption is narrower than it sounds. The duties underneath still apply: reporting certain serious incidents to OSHA, posting the OSHA general duties poster, and maintaining the records behind your bloodborne pathogens program. And state boards of dentistry routinely ask for exposure incident documentation regardless of whether you keep a 300 log.',
        ],
      },
      {
        heading: 'What goes on the 300 log',
        paragraphs: [
          'The log records work-related injuries and illnesses that are recordable — in practice: a death, a hospitalization, loss of vision or hearing, or a significant injury or illness. Each entry captures what happened, when and where, which employee (by ID, not name), and the nature of the case.',
          'The log stays at the practice, available to employees and to authorized representatives on request. It is not posted publicly; the public-facing piece is the annual summary, covered next.',
        ],
      },
      {
        heading: 'The 300A summary and its posting window',
        paragraphs: [
          'Once a year, the prior year’s cases are rolled up onto the OSHA 300A summary form and posted where employees can see it from February 1 through April 30. The 300 log, the individual 301 incident forms, and the 300A summaries must each be retained for five years.',
          'That posting window is one of the most commonly missed obligations in small practices: the summary is not optional in a logging practice, and the window is fixed regardless of when you notice it.',
        ],
      },
      {
        heading: 'The dental-specific wrinkle: sharps',
        paragraphs: [
          'Sharps injuries — needlesticks, suture needle punctures, instrument cuts — are the canonical recordable event in a dental office. The bloodborne pathogens standard requires that each exposure incident be documented with the date and time, what happened, what steps were taken, and how the follow-up went. For a practice exempt from the 300 log, this exposure documentation is still the record your state board will ask to see.',
        ],
      },
      {
        heading: 'Keeping it simple',
        paragraphs: [
          'The whole program reduces to one habit that fires on every exposure: document it the same day, run the follow-up, and — if you are a logging practice — enter it on the 300 log before the week ends. One consistent habit beats a pile of paperwork produced the month before an inspection, and it is the difference between answering “here is our record” and searching for a binder while the inspector waits.',
        ],
      },
    ],
  },
  {
    slug: 'dental-waterline-standards',
    title: 'Dental unit water quality: the numbers to know',
    category: 'Infection control',
    summary:
      'Why dental unit water is its own risk category, where the 500 CFU/mL benchmark comes from, and how to document per-unit results an inspector can follow.',
    updated: 'July 2026',
    updatedIso: '2026-07-15',
    readTime: '5 min read',
    sections: [
      {
        heading: 'Why water lines are their own risk',
        paragraphs: [
          'The water that comes out of a dental handpiece has traveled through narrow, dark internal lines that biofilm colonizes readily. That water is not disinfected by anything between the tap and the patient, and in the procedures it is used for, it lands on broken skin or in an open wound. The supply chain is the problem: even excellent tap water degrades as it sits in the lines.',
        ],
      },
      {
        heading: 'The benchmark: 500 CFU/mL',
        paragraphs: [
          'The CDC’s 2018 guidance recommends that water used in procedures where water contacts broken skin or mucous membranes be treated to drinking water quality for heterotrophic bacteria: 500 colony-forming units per milliliter. State boards set their own testing frequency and may require results on request, but the 500 number is the shared reference point.',
        ],
      },
      {
        heading: 'How to test: three methods, one number',
        paragraphs: [
          'Heterotrophic plate counts are the reference method — a sample incubates for 24–48 hours and the colony count gives the CFU/mL directly. ATP bioluminescence gives a fast relative reading, useful for trend-watching between formal plate counts. Total dye loss (TDL) tests the integrity of the line itself rather than the water. Whichever method you standardize on, consistency and per-unit tracking matter more than the method’s elegance.',
        ],
      },
      {
        heading: 'When a result is high, what to do',
        paragraphs: [
          'Flush the unit and the lines, disinfect per the equipment manufacturer’s instructions, and retest. Many state expectations want two consecutive passing samples before the unit returns to full service. The sequence is what gets documented: the high result, the actions taken, each retest, and the resolution — dated and attributed.',
        ],
      },
      {
        heading: 'What to keep per unit',
        paragraphs: [
          'For every dental unit: the date, the unit identifier, the method used, the result, and who performed the test. A practice that can show six months of per-unit history is in a completely different position from one that can show a single lab report from last spring. Per-unit history is what turns “we test the water” into evidence.',
        ],
      },
    ],
  },
];

export function getResourceBySlug(slug: string): ResourceArticle | undefined {
  return RESOURCE_ARTICLES.find((article) => article.slug === slug);
}
