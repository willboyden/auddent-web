import { useEffect } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import SiteShell from '../app/Shell';
import {
  CHECKLIST_SECTIONS,
  itemById,
  type StateChecklist as StateChecklistData,
} from '../data/checklists';
import { PRODUCT_NAME } from '../data/content';
import { trackEvent } from '../lib/analytics';
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
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
`;

const BoardLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
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

const Notes = styled.aside`
  margin: 20px 0 8px;
  padding: 16px 18px;
  background: #eef4ff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  font-size: 14.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};

  & strong {
    color: ${({ theme }) => theme.colors.navy};
  }
`;

const H2 = styled.h2`
  font-size: 22px;
  line-height: 1.25;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin: 40px 0 12px;

  @media print {
    break-before: auto;
    margin-top: 24px;
  }
`;

const Item = styled.li`
  position: relative;
  padding: 14px 16px 14px 44px;
  margin: 0 0 10px;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;

  @media print {
    break-inside: avoid;
    border-color: #c9d4e0;
  }
`;

const Checkbox = styled.span`
  position: absolute;
  top: 16px;
  left: 15px;
  width: 18px;
  height: 18px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  background: #ffffff;
`;

const ItemTitle = styled.h3`
  font-size: 16.5px;
  font-weight: 700;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0 0 6px;
`;

const ItemRequirement = styled.p`
  font-size: 14.5px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const ItemEvidence = styled.p`
  font-size: 13.5px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 8px;
`;

const ItemMeta = styled.p`
  margin: 0;
  font-size: 12.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  align-items: center;
`;

const SourceChip = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  background: #eef4ff;
  border: 1px solid rgba(10, 99, 201, 0.25);
`;

const SourceLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  overflow-wrap: anywhere;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

const Disclaimer = styled.section`
  margin-top: 56px;
  padding: 24px;
  background: #f6f8fb;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
`;

const DisclaimerTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0 0 10px;
`;

const DisclaimerP = styled.p`
  font-size: 13.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 12px;
`;

// Print stylesheet: the page prints without the site chrome, with a compact
// document header (brand, state, review date) in place of the header.
// Plain class hooks (not emotion interpolations — they are not valid inside
// a Global styles template).
const PrintStyles = css`
  @page {
    margin: 14mm;
  }

  .sc-print-bar {
    display: none;
  }

  @media print {
    header,
    footer {
      display: none !important;
    }

    .sc-print-bar {
      display: block !important;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #0a63c9;
      font-size: 13px;
      font-weight: 700;
      color: #0a63c9;
    }

    .sc-wrap {
      padding: 0;
      max-width: none;
    }

    .sc-item {
      box-shadow: none;
    }
  }
`;

const SOURCE_LABEL: Record<string, string> = {
  state: 'State rule',
  federal: 'Federal baseline',
  both: 'State + federal',
};

export default function StateChecklist({ checklist }: { checklist: StateChecklistData }) {
  useEffect(() => {
    document.title = `Inspection checklist for ${checklist.state} | ${PRODUCT_NAME}`;
    trackEvent('checklist_page_view', { state: checklist.state });
  }, [checklist]);

  const reviewed = new Date(`${checklist.lastReviewedIso}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SiteShell>
      <Global styles={PrintStyles} />
      <Wrap className="sc-wrap">
        <div className="sc-print-bar">
          {PRODUCT_NAME} — Inspection checklist for {checklist.state} · Last reviewed {reviewed} ·
          auditdent.example
        </div>
        <BackLink href="/#checklist">← Request another state’s checklist</BackLink>
        <Title>Inspection checklist for {checklist.state}</Title>
        <Meta>Last reviewed {reviewed}</Meta>
        <Meta>
          Licensing authority:{' '}
          <BoardLink href={checklist.boardUrl} rel="noopener noreferrer">
            {checklist.boardName}
          </BoardLink>
        </Meta>
        <Notes>
          <strong>About {checklist.state}.</strong> {checklist.stateNotes}
        </Notes>
        {CHECKLIST_SECTIONS.map((section) => {
          const items = checklist.items
            .filter((id) => itemById(id).section === section.id)
            .map(itemById);
          if (items.length === 0) return null;
          return (
            <section key={section.id} aria-labelledby={`sc-section-${section.id}`}>
              <H2 id={`sc-section-${section.id}`}>{section.title}</H2>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {items.map((item) => (
                  <Item key={item.id} className="sc-item">
                    <Checkbox aria-hidden="true" />
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemRequirement>{item.requirement}</ItemRequirement>
                    <ItemEvidence>What proves it: {item.evidence}</ItemEvidence>
                    <ItemMeta>
                      <SourceChip>{SOURCE_LABEL[item.source]}</SourceChip>
                      <span>{item.frequency}</span>
                      <span>
                        Source:{' '}
                        <SourceLink href={item.referenceUrl} rel="noopener noreferrer">
                          {new URL(item.referenceUrl).hostname.replace('www.', '')}
                        </SourceLink>
                      </span>
                    </ItemMeta>
                  </Item>
                ))}
              </ul>
            </section>
          );
        })}
        <Disclaimer>
          <DisclaimerTitle>What this is (and isn’t)</DisclaimerTitle>
          <DisclaimerP>
            These items describe what inspectors <strong>commonly</strong> check in{' '}
            {checklist.state}. They are a preparation aid, not a guarantee: completing every item
            does not guarantee a particular inspection outcome.
          </DisclaimerP>
          <DisclaimerP>
            Regulatory requirements vary by state and change over time. {PRODUCT_NAME} organizes and
            evidences your compliance work; it does not provide legal advice. Confirm your specific
            obligations with your compliance counsel or your state’s board of dentistry.
          </DisclaimerP>
          <Button href="/#demo" variant="secondary" onClick={() => trackEvent('cta_click', { source: 'checklist_page_demo' })}>
            Book the 30-minute demo
          </Button>
        </Disclaimer>
      </Wrap>
    </SiteShell>
  );
}
