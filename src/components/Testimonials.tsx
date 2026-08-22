import styled from '@emotion/styled';
import { TESTIMONIALS } from '../data/content';
import { Container, Grid, Section, SectionHeading } from './ui';

const QuoteCard = styled.figure`
  margin: 0;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg}px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 26px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Quote = styled.blockquote`
  margin: 0;
  font-size: 15.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};

  &::before {
    content: '“';
    display: block;
    font-size: 44px;
    line-height: 0.6;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 14px;
    font-weight: 800;
  }
`;

const Who = styled.figcaption`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    font-size: 14.5px;
    color: ${({ theme }) => theme.colors.navy};
  }

  span {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

export default function Testimonials() {
  return (
    <Section id="testimonials">
      <Container>
        <SectionHeading
          eyebrow="From the operator’s chair"
          title="What practice owners tell us after the first inspection"
          center
        />
        <Grid cols={3}>
          {TESTIMONIALS.map((t) => (
            <QuoteCard key={t.name}>
              <Quote>{t.quote}</Quote>
              <Who>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </Who>
            </QuoteCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
