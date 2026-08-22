import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import type { ReactNode } from 'react';
import { breakpoints, maxWidth, radii } from '../theme';

export const Container = styled.div`
  width: 100%;
  max-width: ${maxWidth};
  margin: 0 auto;
  padding: 0 24px;
`;

export const Section = styled.section<{ bg?: string; pad?: string }>`
  background: ${({ bg }) => bg ?? 'transparent'};
  padding: ${({ pad }) => pad ?? '88px 0'};
  scroll-margin-top: 72px;
`;

export const Eyebrow = styled.span`
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
`;

export const SectionTitle = styled.h2`
  font-size: clamp(26px, 3.4vw, 38px);
  line-height: 1.15;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0 0 14px;
`;

export const SectionLede = styled.p`
  font-size: 17px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
  max-width: 640px;
`;

const HeadingWrap = styled.div<{ center?: boolean }>`
  margin-bottom: 44px;

  ${({ center }) =>
    center &&
    css`
      text-align: center;
      & > p {
        margin-left: auto;
        margin-right: auto;
      }
    `}
`;

export function SectionHeading({
  eyebrow,
  title,
  lede,
  center,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  center?: boolean;
}) {
  return (
    <HeadingWrap center={center}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionTitle>{title}</SectionTitle>
      {lede ? <SectionLede>{lede}</SectionLede> : null}
    </HeadingWrap>
  );
}

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  border-radius: ${radii.sm + 2}px;
  padding: 13px 22px;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid transparent;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
  }
`;

type ButtonVariant = 'primary' | 'secondary' | 'light';

export const Button = styled.a<{ variant?: ButtonVariant }>`
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return css`
          ${buttonBase}
          background: ${'transparent'};
          color: #0a63c9;
          border-color: #b7d0ee;

          &:hover {
            background: #eef5fd;
            border-color: #93b7e3;
          }
        `;
      case 'light':
        return css`
          ${buttonBase}
          background: #ffffff;
          color: #0b2545;

          &:hover {
            background: #eef5fd;
          }
        `;
      default:
        return css`
          ${buttonBase}
          background: #0a63c9;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(10, 99, 201, 0.35);

          &:hover {
            background: #0852a3;
          }
        `;
    }
  }}
`;

export const Card = styled.div<{ padded?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg}px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ padded = true }) => (padded ? '26px' : '0')};
`;

const ChipSpan = styled.span<{ bg: string; fg: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.pill}px;
  font-size: 13px;
  font-weight: 600;
  background: ${({ bg }) => bg};
  color: ${({ fg }) => fg};
`;

export function Chip({ children, tone = 'sky' }: { children: ReactNode; tone?: 'sky' | 'green' | 'amber' }) {
  const t = useTheme();
  const palette: Record<string, { bg: string; fg: string }> = {
    sky: { bg: t.colors.sky, fg: t.colors.navy },
    green: { bg: t.colors.greenBg, fg: t.colors.green },
    amber: { bg: t.colors.amberBg, fg: t.colors.amber },
  };
  const p = palette[tone];
  return (
    <ChipSpan bg={p.bg} fg={p.fg}>
      {children}
    </ChipSpan>
  );
}

export const SrOnly = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

const CheckSvg = styled.svg`
  flex-shrink: 0;
`;

export function CheckIcon() {
  const t = useTheme();
  return (
    <CheckSvg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill={t.colors.green} />
      <path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </CheckSvg>
  );
}

export const Grid = styled.div<{ cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ cols = 3 }) => cols}, 1fr);
  gap: 20px;

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(${({ cols = 3 }) => (cols > 2 ? 2 : cols)}, 1fr);
  }
  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;
