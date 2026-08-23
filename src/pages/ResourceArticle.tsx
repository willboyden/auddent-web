import { useEffect } from 'react';
import styled from '@emotion/styled';
import SiteShell from '../app/Shell';
import { RESOURCE_ARTICLES, type ResourceArticle } from '../data/resources';
import { PRODUCT_NAME } from '../data/content';
import { trackEvent } from '../lib/analytics';
import { breakpoints } from '../theme';
import { Button } from '../components/ui';

const Wrap = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 64px 24px 88px;
`;

const BackLink = styled.a`
  display: inline-block;
  margin-bottom: 28px;
  font-size: 14.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

const Title = styled.h1`
  font-size: clamp(28px, 4vw, 38px);
  line-height: 1.15;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0 0 14px;
`;

const Meta = styled.p`
  margin: 0 0 40px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate};
`;

const H2 = styled.h2`
  font-size: 24px;
  line-height: 1.25;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin: 40px 0 12px;
`;

const P = styled.p`
  font-size: 16.5px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 18px;
`;

const RelatedHeading = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin: 56px 0 0;
`;

const RelatedList = styled.ul`
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const RelatedCard = styled.li`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RelatedLink = styled.a`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.navy};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

const RelatedMeta = styled.p`
  margin: auto 0 0;
  font-size: 12.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate};
`;

const CtaCard = styled.div`
  margin-top: 56px;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 32px;
`;

const CtaTitle = styled.h2`
  font-size: 21px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0 0 8px;
`;

const CtaBody = styled.p`
  font-size: 15.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 20px;
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export default function ResourceArticle({ article }: { article: ResourceArticle }) {
  useEffect(() => {
    document.title = `${article.title} | ${PRODUCT_NAME} Resources`;
  }, [article]);

  const related = RESOURCE_ARTICLES.filter((entry) => entry.slug !== article.slug);

  return (
    <SiteShell>
      <Wrap>
        <BackLink href="/resources">← All resources</BackLink>
        <Title>{article.title}</Title>
        <Meta>
          {article.category} · Updated {article.updated} · {article.readTime}
        </Meta>
        {article.sections.map((section) => (
          <section key={section.heading}>
            <H2>{section.heading}</H2>
            {section.paragraphs.map((paragraph) => (
              <P key={paragraph.slice(0, 40)}>{paragraph}</P>
            ))}
          </section>
        ))}
        {related.length > 0 ? (
          <>
            <RelatedHeading>More from resources</RelatedHeading>
            <RelatedList>
              {related.map((entry) => (
                <RelatedCard key={entry.slug}>
                  <RelatedLink href={`/resources/${entry.slug}`}>{entry.title}</RelatedLink>
                  <RelatedMeta>
                    {entry.category} · {entry.readTime}
                  </RelatedMeta>
                </RelatedCard>
              ))}
            </RelatedList>
          </>
        ) : null}
        <CtaCard>
          <CtaTitle>See it on your own state’s checklist</CtaTitle>
          <CtaBody>
            These guides cover the general requirements. Your state adds its own rules, testing windows, and
            formats — start with the checklist for your jurisdiction, then watch a 30-minute demo of AudDent
            organizing the evidence.
          </CtaBody>
          <CtaRow>
            <Button
              href="/#checklist"
              onClick={() => trackEvent('cta_click', { source: 'article_checklist' })}
            >
              Get the state checklist
            </Button>
            <Button
              href="/#demo"
              variant="secondary"
              onClick={() => trackEvent('cta_click', { source: 'article_demo' })}
            >
              Book a 30-minute demo
            </Button>
          </CtaRow>
        </CtaCard>
      </Wrap>
    </SiteShell>
  );
}
