import { useState } from 'react';
import styled from '@emotion/styled';
import { breakpoints, colors, radii, shadows } from '../theme';
import { PRICING_TIERS } from '../data/content';
import { displayPrice, yearlyTotal } from '../lib/pricing';
import { Button, CheckIcon, Chip, Container, Section, SectionHeading } from './ui';

type Billing = 'monthly' | 'yearly';

const ToggleWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 40px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  padding: 9px 18px;
  border-radius: 999px;
  cursor: pointer;
  border: 1px solid ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.border)};
  background: ${({ active }) => (active ? colors.primary : '#ffffff')};
  color: ${({ active }) => (active ? '#ffffff' : colors.navy)};
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:focus-visible {
    outline: 3px solid rgba(10, 99, 201, 0.45);
    outline-offset: 2px;
  }
`;

const SaveNote = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.green};
`;

const TierGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  align-items: stretch;

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr;
    max-width: 520px;
    margin: 0 auto;
  }
`;

const TierCard = styled.div<{ highlighted: boolean }>`
  position: relative;
  background: #ffffff;
  border: ${({ highlighted, theme }) =>
    highlighted ? `2px solid ${theme.colors.primary}` : `1px solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radii.lg}px;
  box-shadow: ${({ theme, highlighted }) => (highlighted ? theme.shadows.pop : theme.shadows.card)};
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Badge = styled.span`
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  background: ${colors.primary};
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 999px;
  white-space: nowrap;
`;

const TierName = styled.h3`
  margin: 6px 0 0;
  font-size: 19px;
  font-weight: 800;
  color: ${colors.navy};
`;

const TierBlurb = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: ${colors.muted};
  min-height: 42px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const Price = styled.div`
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${colors.navy};
`;

const Per = styled.span`
  font-size: 14px;
  color: ${colors.muted};
  font-weight: 600;
`;

const BilledNote = styled.p`
  margin: -10px 0 0;
  font-size: 12.5px;
  color: ${colors.muted};
  min-height: 18px;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    color: ${colors.text};
  }
`;

const CtaSlot = styled.div`
  margin-top: auto;
`;

const Guarantee = styled.div`
  margin-top: 40px;
  background: #ffffff;
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg}px;
  box-shadow: ${shadows.card};
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
`;

const GuaranteeTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: ${colors.navy};
`;

const GuaranteeBody = styled.p`
  margin: 0;
  font-size: 14.5px;
  line-height: 1.6;
  color: ${colors.muted};
  max-width: 560px;
`;

const GuaranteeChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
`;

const Foot = styled.p`
  margin: 34px 0 0;
  text-align: center;
  font-size: 14px;
  line-height: 1.6;
  color: ${colors.muted};
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
`;

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>('monthly');

  return (
    <Section id="pricing" bg="#f5f8fc">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Priced for a practice, not an enterprise"
          lede="Every plan includes every module — you are paying for scale, not for access to the checklist your state already requires."
          center
        />

        <ToggleWrap role="group" aria-label="Billing period">
          <ToggleButton
            type="button"
            active={billing === 'monthly'}
            aria-pressed={billing === 'monthly'}
            onClick={() => setBilling('monthly')}
          >
            Monthly
          </ToggleButton>
          <ToggleButton
            type="button"
            active={billing === 'yearly'}
            aria-pressed={billing === 'yearly'}
            onClick={() => setBilling('yearly')}
          >
            Yearly
          </ToggleButton>
          <SaveNote>Save two months, billed yearly</SaveNote>
        </ToggleWrap>

        <TierGrid>
          {PRICING_TIERS.map((tier) => (
            <TierCard key={tier.id} highlighted={Boolean(tier.highlighted)}>
              {tier.highlighted ? <Badge>Most popular</Badge> : null}
              <TierName>{tier.name}</TierName>
              <TierBlurb>{tier.blurb}</TierBlurb>
              <PriceRow>
                <Price data-testid={`price-${tier.id}`}>{displayPrice(tier.monthly, billing)}</Price>
                <Per>/mo</Per>
              </PriceRow>
              <BilledNote data-testid={`billed-${tier.id}`}>
                {billing === 'yearly' ? `Billed $${yearlyTotal(tier.monthly)} once a year` : 'Billed month to month'}
              </BilledNote>
              <FeatureList>
                {tier.features.map((feature) => (
                  <li key={feature}>
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </FeatureList>
              <CtaSlot>
                <Button href="#demo" variant={tier.highlighted ? 'primary' : 'secondary'}>
                  {tier.cta}
                </Button>
              </CtaSlot>
            </TierCard>
          ))}
        </TierGrid>

        <Guarantee aria-label="Money-back guarantee">
          <GuaranteeTitle>If it doesn’t save you prep time, you don’t pay</GuaranteeTitle>
          <GuaranteeBody>
            Every plan starts with a full 30-day trial of the real product — not a demo. If inspection prep doesn’t get
            measurably easier, cancel and we refund you in full.
          </GuaranteeBody>
          <GuaranteeChips>
            <Chip tone="green">No setup fees</Chip>
            <Chip tone="green">30-day money-back guarantee</Chip>
            <Chip tone="green">Cancel anytime — full data export</Chip>
          </GuaranteeChips>
        </Guarantee>

        <Foot>
          All plans include the full module set, the inspection bundle, and the weekly digest. No per-record charges,
          ever.
        </Foot>
      </Container>
    </Section>
  );
}
