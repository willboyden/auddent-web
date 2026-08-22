export const YEARLY_MONTHS = 10; // two months free when billed annually

export function annualMonthlyPrice(monthly: number): number {
  return Math.round((monthly * YEARLY_MONTHS) / 12);
}

export function displayPrice(monthly: number, billing: 'monthly' | 'yearly'): string {
  return billing === 'yearly' ? `$${annualMonthlyPrice(monthly)}` : `$${monthly}`;
}

export function yearlyTotal(monthly: number): number {
  return monthly * YEARLY_MONTHS;
}
