import styled from '@emotion/styled';
import { Card, Container, Grid, Section, SectionHeading } from './ui';

const CardTitle = styled.h3`
  font-size: 19px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0 0 10px;
`;

const CardBody = styled.p`
  font-size: 15.5px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
`;

const Note = styled.p`
  margin: 36px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  max-width: 720px;
`;

const CARDS = [
  {
    title: 'Runs where you point it',
    body: 'BrightGuard is self-hosted: one application and one single-file database on infrastructure you control. Your records are not sitting in a vendor cloud you rent — there is no third party to subpoena, leak, or lock you out of.',
  },
  {
    title: 'Every record is chained',
    body: 'Each audit entry carries the hash of the one before it, from the genesis record forward. If anyone alters a past entry, the chain breaks and you can see exactly where — integrity is something you verify, not something you are asked to trust.',
  },
  {
    title: 'You can leave with everything',
    body: 'Export the full audit bundle any time you like — every record, hash-verified, in the format an auditor expects. If you cancel, your data is not held hostage; you take it with you.',
  },
];

export default function DataControl() {
  return (
    <Section id="data">
      <Container>
        <SectionHeading
          eyebrow="Data & trust"
          title="Your data, your practice"
          lede="Compliance software should lower your risk, not add a vendor to it. Here is what that means in practice."
        />
        <Grid cols={3}>
          {CARDS.map((card) => (
            <Card key={card.title}>
              <CardTitle>{card.title}</CardTitle>
              <CardBody>{card.body}</CardBody>
            </Card>
          ))}
        </Grid>
        <Note>
          We do not claim certifications we do not have. What we can show you is the architecture above — and the
          audit bundle that proves it works — on a 30-minute demo.
        </Note>
      </Container>
    </Section>
  );
}
