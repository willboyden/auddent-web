import styled from '@emotion/styled';
import { Card, Container, Grid, Section, SectionHeading } from './ui';

const PAINS = [
  {
    title: 'Evidence scattered across binders and four spreadsheets',
    body: 'Sterilization logs on the sterilizer, training certs in a drawer, substance counts in a notebook, licenses on a whiteboard. Ask for last year and it becomes a project.',
  },
  {
    title: 'Certificates that expire silently',
    body: 'Nobody watches the dates. The training lapsed in June, the license in September, and the first anyone hears about it is the inspector — with a camera.',
  },
  {
    title: 'The binder assembled at 9 p.m. the night before',
    body: 'You know the visit is coming. So you spend the week before re-typing what should have been recorded all along — after full days of dentistry.',
  },
];

const PainTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  line-height: 1.3;
`;

const PainBody = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
`;

const Punch = styled.p`
  margin: 36px 0 0;
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};
  max-width: 760px;

  span {
    background: linear-gradient(transparent 62%, #cfe3fa 62%);
  }
`;

export default function Problem() {
  return (
    <Section id="problem">
      <Container>
        <SectionHeading
          eyebrow="The old way"
          title="Inspection day used to be a stack of binders and a prayer."
          lede="The auditor’s checklist is the same every year. The problem is where the evidence lives."
        />
        <Grid cols={3}>
          {PAINS.map((pain) => (
            <Card key={pain.title}>
              <PainTitle>{pain.title}</PainTitle>
              <PainBody>{pain.body}</PainBody>
            </Card>
          ))}
        </Grid>
        <Punch>
          BrightGuard turns that stack into <span>one workbench</span> — and the week before the visit becomes
          &ldquo;where was that again?&rdquo;
        </Punch>
      </Container>
    </Section>
  );
}
