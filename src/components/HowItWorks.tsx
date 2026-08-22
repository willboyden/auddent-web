import styled from '@emotion/styled';
import { colors } from '../theme';
import { STEPS } from '../data/content';
import { Container, Grid, Section, SectionHeading } from './ui';

const StepCard = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg}px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 26px;
  height: 100%;
`;

const StepNumber = styled.span`
  display: inline-grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${colors.primary};
  color: #ffffff;
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 16px;
`;

const StepTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 700;
  color: ${colors.navy};
`;

const StepBody = styled.p`
  margin: 0;
  font-size: 14.5px;
  line-height: 1.6;
  color: ${colors.muted};
`;

export default function HowItWorks() {
  return (
    <Section id="how-it-works">
      <Container>
        <SectionHeading eyebrow="How it works" title="Three steps between you and an uneventful inspection" />
        <Grid cols={3}>
          {STEPS.map((step) => (
            <StepCard key={step.n}>
              <StepNumber aria-hidden="true">{step.n}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepBody>{step.body}</StepBody>
            </StepCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
