import styled from '@emotion/styled';
import { breakpoints, colors } from '../theme';
import { BUNDLE_SECTIONS } from '../data/content';
import { Container, Section } from './ui';

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 56px;
  align-items: start;

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 40px;
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

const Title = styled.h2`
  font-size: clamp(26px, 3.4vw, 38px);
  line-height: 1.15;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 16px;
`;

const Lede = styled.p`
  font-size: 16.5px;
  line-height: 1.65;
  color: #b9cbe0;
  margin: 0 0 28px;
  max-width: 540px;
`;

const Points = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Point = styled.li`
  display: flex;
  gap: 14px;
  align-items: flex-start;
`;

const PointDot = styled.span`
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(127, 177, 232, 0.18);
  border: 1px solid rgba(127, 177, 232, 0.4);
  display: grid;
  place-items: center;
  margin-top: 2px;
`;

const PointTitle = styled.strong`
  display: block;
  font-size: 15.5px;
  color: #ffffff;
  margin-bottom: 4px;
`;

const PointBody = styled.span`
  font-size: 14.5px;
  line-height: 1.6;
  color: #b9cbe0;
`;

const BundleCard = styled.div`
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  padding: 24px;
  color: ${colors.text};
`;

const BundleHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${colors.border};
  margin-bottom: 14px;

  span:first-child {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${colors.muted};
  }
`;

const BundleChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  background: ${colors.greenBg};
  color: ${colors.green};
`;

const ChainRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const HashChip = styled.span`
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  background: ${colors.bg};
  border: 1px solid ${colors.border};
  color: ${colors.navy};
  border-radius: 8px;
  padding: 6px 10px;
`;

const Arrow = styled.span`
  color: ${colors.slate};
  font-size: 14px;
`;

const SectionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const SectionItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 600;
  color: ${colors.text};
`;

const BundleFoot = styled.div`
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid ${colors.border};
  font-size: 13px;
  color: ${colors.muted};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

function MiniCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1e7d4f" />
      <path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const POINTS = [
  {
    title: 'Hash-chained & tamper-evident',
    body: 'Every record links to the one before it. A changed or missing entry breaks the chain — and the system says so.',
  },
  {
    title: 'One-click inspection bundle',
    body: 'A print-ready packet covering every module for any date range. The auditor picks the window; you pick print.',
  },
  {
    title: 'Integrity you can verify',
    body: 'The bundle recomputes the chain over the exact range requested. “Chain intact” is a reported fact, not a hope.',
  },
];

export default function AuditTrail() {
  return (
    <Section id="audit-trail" bg="#0b2545">
      <Container>
        <Grid>
          <div>
            <Eyebrow>The differentiator</Eyebrow>
            <Title>The audit trail your inspector will trust</Title>
            <Lede>
              Compliance software is only as good as the record it produces. AudDent keeps that record
              provable.
            </Lede>
            <Points>
              {POINTS.map((point) => (
                <Point key={point.title}>
                  <PointDot aria-hidden="true">
                    <MiniCheck />
                  </PointDot>
                  <div>
                    <PointTitle>{point.title}</PointTitle>
                    <PointBody>{point.body}</PointBody>
                  </div>
                </Point>
              ))}
            </Points>
          </div>

          <BundleCard aria-label="Example inspection bundle">
            <BundleHead>
              <span>Inspection bundle · Jan 2025 – Dec 2025</span>
              <BundleChip>
                <MiniCheck />
                Chain intact
              </BundleChip>
            </BundleHead>
            <ChainRow>
              <HashChip>genesis</HashChip>
              <Arrow aria-hidden="true">→</Arrow>
              <HashChip>#a41f…9c2e</HashChip>
              <Arrow aria-hidden="true">→</Arrow>
              <HashChip>#7d08…e3b1</HashChip>
              <Arrow aria-hidden="true">→</Arrow>
              <HashChip>…</HashChip>
            </ChainRow>
            <SectionList>
              {BUNDLE_SECTIONS.map((section) => (
                <SectionItem key={section}>
                  <MiniCheck />
                  {section}
                </SectionItem>
              ))}
            </SectionList>
            <BundleFoot>
              <span>13 sections · every row dated &amp; signed</span>
              <span aria-hidden="true">PDF</span>
            </BundleFoot>
          </BundleCard>
        </Grid>
      </Container>
    </Section>
  );
}
