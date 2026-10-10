// Mortgage math and the player's fixed financial profile.

export const PLAYER = { income: 7000, carPayment: 350, savings: 50000 };

export const RATE = 0.065; // 30-year fixed
export const DOWN_PCT = 0.1;
export const CLOSING_PCT = 0.03;
export const TAX_INS_MONTHLY_PCT = 0.015 / 12; // property tax + insurance
export const DTI_COMFORT = 0.36;
export const DTI_MAX = 0.43;

export const money = (n) => (n < 0 ? '-' : '') + '$' + Math.abs(Math.round(n)).toLocaleString('en-US');
export const pct = (r) => `${Math.round(r * 1000) / 10}%`;

export function loanPayment(loan) {
  const r = RATE / 12;
  const n = 360;
  return (loan * r) / (1 - Math.pow(1 + r, -n));
}

export function monthlyHousing(price, loan) {
  return loanPayment(loan) + price * TAX_INS_MONTHLY_PCT;
}

// Debt-to-income: housing payment plus the car payment, divided by gross income.
export function dti(price, loan) {
  return (monthlyHousing(price, loan) + PLAYER.carPayment) / PLAYER.income;
}

export function dtiBand(ratio) {
  if (ratio <= DTI_COMFORT) return 'good';
  if (ratio <= DTI_MAX) return 'stretch';
  return 'danger';
}
