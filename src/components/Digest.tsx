import styled from '@emotion/styled';
import { breakpoints, colors } from '../theme';
import { Container, Chip, Section, SectionHeading } from './ui';

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 56px;
  align-items: center;

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

const MailCard = styled.div`
  background: #ffffff;
  border: 1px solid ${colors.border};
  border-radius: 18px;
  box-shadow: ${({ theme }) => theme.shadows.pop};
  overflow: hidden;
  transform: rotate(-1.2deg);
`;

const MailHead = styled.div`
  background: ${colors.navy};
  padding: 14px 20px;
  color: #ffffff;

  strong {
    display: block;
    font-size: 14.5px;
    margin-bottom: 3px;
  }

  span {
    font-size: 12.5px;
    color: #b9cbe0;
  }
`;

const MailBody = styled.div`
  padding: 20px;
`;

const MailScore = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: ${colors.bg};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 14px;

  div:first-child {
    font-size: 14px;
    font-weight: 700;
    color: ${colors.navy};
  }

  span {
    font-size: 24px;
    font-weight: 800;
    color: ${colors.primary};
  }
`;

const MailList = styled.ul`
  list-style: none;
  margin: 0 0 14px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MailItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 13.5px;
  font-weight: 600;
  color: ${colors.text};
`;

const MailFoot = styled.p`
  margin: 0;
  padding-top: 12px;
  border-top: 1px dashed ${colors.border};
  font-size: 12.5px;
  color: ${colors.muted};
`;

const PointList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const PointCopy = styled.p`
  margin: 8px 0 0;
  font-size: 14.5px;
  line-height: 1.6;
  color: ${colors.muted};
`;

export default function Digest() {
  return (
    <Section id="digest" bg="#f5f8fc">
      <Container>
        <Grid>
          <div>
            <SectionHeading
              eyebrow="For the owner"
              title="You run the practice. You don’t need to run compliance."
              lede="Every week, the workbench summarizes itself — so the only compliance meeting you need is the one that doesn’t happen."
            />
            <PointList>
              <li>
                <Chip tone="sky">Weekly email digest</Chip>
                <PointCopy>
                  Top three open items by severity, your compliance score, and how it moved. One read, then back to
                  dentistry.
                </PointCopy>
              </li>
              <li>
                <Chip tone="sky">One-page score report</Chip>
                <PointCopy>
                  A branded, print-ready summary for partners, lenders, or the new associate — score, trend, and open
                  items on a single page.
                </PointCopy>
              </li>
              <li>
                <Chip tone="sky">Escalation that finds the owner</Chip>
                <PointCopy>
                  Items that stay open climb the queue, not your stress. Critical items surface first, every week.
                </PointCopy>
              </li>
            </PointList>
          </div>

          <MailCard aria-label="Example weekly digest email">
            <MailHead>
              <strong>Weekly compliance digest — Brightsmile Dental</strong>
              <span>Monday 7:00 am · sent by AudDent</span>
            </MailHead>
            <MailBody>
              <MailScore>
                <div>Compliance score</div>
                <span>92</span>
              </MailScore>
              <MailList>
                <MailItem>
                  <span>Spore test pending — Autoclave B</span>
                  <Chip tone="amber">Run today</Chip>
                </MailItem>
                <MailItem>
                  <span>OSHA Bloodborne — 2 staff due</span>
                  <Chip tone="amber">10 days left</Chip>
                </MailItem>
                <MailItem>
                  <span>Waterline ATP — Unit 3 over threshold</span>
                  <Chip tone="sky">Retest scheduled</Chip>
                </MailItem>
              </MailList>
              <MailFoot>Score up 2 since last week · 3 items open · report attached</MailFoot>
            </MailBody>
          </MailCard>
        </Grid>
      </Container>
    </Section>
  );
}
