import styled from '@emotion/styled';
import { breakpoints, colors } from '../theme';
import { Button, Container, Chip } from './ui';

const Wrap = styled.div`
  background:
    radial-gradient(900px 420px at 85% -10%, rgba(14, 119, 224, 0.14), transparent 60%),
    radial-gradient(700px 380px at -10% 30%, rgba(10, 99, 201, 0.08), transparent 55%),
    #f5f8fc;
  padding: 76px 0 84px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 56px;
  align-items: center;

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const H1 = styled.h1`
  font-size: clamp(34px, 4.6vw, 52px);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${colors.navy};
  margin: 0 0 18px;
`;

const Lede = styled.p`
  font-size: 18px;
  line-height: 1.65;
  color: ${colors.muted};
  margin: 0 0 28px;
  max-width: 560px;
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
`;

const ProofLine = styled.p`
  font-size: 14px;
  color: ${colors.muted};
  margin: 0;
`;

const MockCard = styled.aside`
  background: #ffffff;
  border: 1px solid ${colors.border};
  border-radius: 18px;
  box-shadow: 0 2px 6px rgba(11, 37, 69, 0.06), 0 24px 60px rgba(11, 37, 69, 0.14);
  padding: 22px;
`;

const MockHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${colors.border};
  margin-bottom: 14px;

  span:first-of-type {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${colors.muted};
  }
`;

const MockRows = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MockRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: ${colors.bg};
  border: 1px solid ${colors.border};
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
`;

const ScoreLabel = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.navy};
`;

const ScoreTrend = styled.div`
  font-size: 13.5px;
  color: ${colors.muted};
  margin-top: 4px;
`;

const ScoreRing = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: conic-gradient(#0a63c9 0deg 331deg, #dbe7f5 331deg 360deg);
  flex-shrink: 0;

  & > div {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #ffffff;
    display: grid;
    place-items: center;
    font-size: 22px;
    font-weight: 800;
    color: ${colors.navy};
  }
`;

const BundleBadge = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: 1px dashed #93b7e3;
  background: #eef5fd;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 13.5px;
  font-weight: 600;
  color: ${colors.navy};
`;

export default function Hero() {
  return (
    <Wrap>
      <Container>
        <Grid>
          <div>
            <Chip tone="sky">For independent dental practices</Chip>
            <H1>Walk into your next inspection with the evidence already in hand.</H1>
            <Lede>
              AudDent is the compliance workbench built for dental practices — sterilization and spore tests, staff
              training, DEA controlled substances, HIPAA, and a tamper-evident audit trail, in one place.
            </Lede>
            <CtaRow>
              <Button href="/#demo">Book a live demo</Button>
              <Button href="/#features" variant="secondary">
                Explore the features
              </Button>
            </CtaRow>
            <ProofLine>Set up in an afternoon · No spreadsheets · Built for board of health, health dept &amp; DEA visits</ProofLine>
          </div>

          <MockCard aria-label="Example compliance dashboard">
            <MockHead>
              <span>This week at your practice</span>
              <Chip tone="green">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="11" fill="#1e7d4f" />
                  <path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                On track
              </Chip>
            </MockHead>
            <ScoreRow>
              <ScoreRing>
                <div>92</div>
              </ScoreRing>
              <div>
                <ScoreLabel>Compliance score</ScoreLabel>
                <ScoreTrend>Up 2 points since last week</ScoreTrend>
              </div>
            </ScoreRow>
            <MockRows>
              <MockRow>
                <span>Sterilization &amp; spore tests</span>
                <Chip tone="green">All pass</Chip>
              </MockRow>
              <MockRow>
                <span>Training due this week</span>
                <Chip tone="amber">2 assigned</Chip>
              </MockRow>
              <MockRow>
                <span>Controlled substance variance</span>
                <Chip tone="green">Balanced</Chip>
              </MockRow>
              <MockRow>
                <span>Audit chain</span>
                <Chip tone="green">Verified</Chip>
              </MockRow>
            </MockRows>
            <BundleBadge>
              <span>Inspection bundle — ready to print</span>
              <span aria-hidden="true">→</span>
            </BundleBadge>
          </MockCard>
        </Grid>
      </Container>
    </Wrap>
  );
}
