import { describe, expect, it } from 'vitest';
import { annualMonthlyPrice, displayPrice, YEARLY_MONTHS, yearlyTotal } from '../src/lib/pricing';

describe('pricing', () => {
  it('charges 10 months when billed yearly', () => {
    expect(YEARLY_MONTHS).toBe(10);
  });

  it('computes the annualized monthly price (two months free)', () => {
    expect(annualMonthlyPrice(149)).toBe(124);
    expect(annualMonthlyPrice(399)).toBe(333);
    expect(annualMonthlyPrice(899)).toBe(749);
  });

  it('formats monthly and yearly display prices', () => {
    expect(displayPrice(149, 'monthly')).toBe('$149');
    expect(displayPrice(149, 'yearly')).toBe('$124');
    expect(displayPrice(399, 'monthly')).toBe('$399');
    expect(displayPrice(399, 'yearly')).toBe('$333');
  });

  it('computes the yearly total from the monthly price', () => {
    expect(yearlyTotal(149)).toBe(1490);
    expect(yearlyTotal(399)).toBe(3990);
    expect(yearlyTotal(899)).toBe(8990);
  });
});
