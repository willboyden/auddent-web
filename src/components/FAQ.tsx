import { useState } from 'react';
import styled from '@emotion/styled';
import { FAQ_ITEMS } from '../data/content';
import { Container, Section, SectionHeading } from './ui';

const List = styled.div`
  max-width: 780px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md + 4}px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-family: inherit;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  background: none;
  border: none;
  padding: 18px 22px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.bg};
  }

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: -3px;
  }
`;

const Chevron = styled.span<{ open: boolean }>`
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: ${({ theme, open }) => (open ? theme.colors.sky : theme.colors.bg)};
  color: ${({ theme }) => theme.colors.primary};
  transition: transform 0.18s ease;
  transform: ${({ open }) => (open ? 'rotate(45deg)' : 'none')};
  font-size: 16px;
  line-height: 1;
`;

const Answer = styled.div`
  padding: 16px 22px 20px;
  font-size: 15px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.muted};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  & > p {
    margin: 0;
  }
`;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq">
      <Container>
        <SectionHeading
          eyebrow="Questions owners ask"
          title="Frequently asked questions"
          center
        />
        <List>
          {FAQ_ITEMS.map((item, i) => {
            const open = openIndex === i;
            return (
              <Item key={item.q}>
                <Question type="button" aria-expanded={open} aria-controls={`faq-answer-${i}`} onClick={() => setOpenIndex(open ? null : i)}>
                  <span>{item.q}</span>
                  <Chevron open={open} aria-hidden="true">
                    +
                  </Chevron>
                </Question>
                <div id={`faq-answer-${i}`} role="region" aria-label={item.q} hidden={!open}>
                  <Answer>
                    <p>{item.a}</p>
                  </Answer>
                </div>
              </Item>
            );
          })}
        </List>
      </Container>
    </Section>
  );
}
