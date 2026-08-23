import { useEffect } from 'react';
import styled from '@emotion/styled';
import SiteShell from '../app/Shell';
import { RESOURCE_ARTICLES } from '../data/resources';
import { breakpoints } from '../theme';
import { Chip, Container, Section } from '../components/ui';


const PageTitle = styled.h1`
  font-size: clamp(28px, 3.6vw, 40px);
  line-height: 1.15;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0 0 14px;
`;

const PageLede = styled.p`
  font-size: 17px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 44px;
  max-width: 640px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.a`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 26px;
  text-decoration: none;
  color: inherit;
  transition:
    box-shadow 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    border-color: #93b7e3;
    box-shadow: ${({ theme }) => theme.shadows.pop};
  }

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
  }
`;

const CardTitle = styled.h2`
  font-size: 20px;
  line-height: 1.3;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0;
`;

const CardSummary = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
`;

const CardMeta = styled.p`
  margin: auto 0 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate};
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
`;

export default function Resources() {
  useEffect(() => {
    document.title = 'Resources — Inspection prep guides | AudDent';
  }, []);

  return (
    <SiteShell>
      <Section pad="72px 0 88px">
        <Container>
          <Eyebrow>Resources</Eyebrow>
          <PageTitle>Inspection prep, without the guesswork</PageTitle>
          <PageLede>
            Plain-language guides on what state boards and OSHA actually check, written for busy practices — not
            compliance vendors.
          </PageLede>
          <Grid>
            {RESOURCE_ARTICLES.map((article) => (
              <Card key={article.slug} href={`/resources/${article.slug}`}>
                <Chip tone="sky">{article.category}</Chip>
                <CardTitle>{article.title}</CardTitle>
                <CardSummary>{article.summary}</CardSummary>
                <CardMeta>
                  {article.updated} · {article.readTime}
                </CardMeta>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </SiteShell>
  );
}
