import styled from '@emotion/styled';
import { FEATURES } from '../data/content';
import { colors } from '../theme';
import { Container, Grid, Section, SectionHeading } from './ui';

const Mark = styled.span`
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.sky};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.02em;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
`;

const CardBody = styled.p`
  margin: 0;
  font-size: 14.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
`;

const FeatureCard = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg}px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 24px;
  height: 100%;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.pop};
  }
`;

const FootNote = styled.p`
  margin: 28px 0 0;
  font-size: 14px;
  color: ${colors.muted};
  text-align: center;
`;

export default function Features() {
  return (
    <Section id="features" bg="#f5f8fc">
      <Container>
        <SectionHeading
          eyebrow="Every module, one workbench"
          title="Built around the checklist your state hands you"
          lede="Each module maps to a section of the inspection — so “show me” has a button instead of a weekend behind it."
        />
        <Grid cols={2}>
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id}>
              <Mark aria-hidden="true">{feature.mark}</Mark>
              <CardTitle>{feature.title}</CardTitle>
              <CardBody>{feature.body}</CardBody>
            </FeatureCard>
          ))}
        </Grid>
        <FootNote>
          Every module ships with guided demo data, so you can explore the whole system before entering a real record.
        </FootNote>
      </Container>
    </Section>
  );
}
