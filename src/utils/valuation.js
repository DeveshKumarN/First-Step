import { hiddenTotal, findingsOf } from './inspection.js';

const round500 = (n) => Math.round(n / 500) * 500;

export function smartPrice(listing) {
  return round500(listing.appraised - hiddenTotal(listing));
}

export function visibleRepairTotal(listing, inspected = []) {
  return findingsOf(listing)
    .filter((f) => inspected.includes(f.id))
    .reduce((sum, f) => sum + f.cost, 0);
}

export function visibleEstimate(listing, inspected = []) {
  return round500(listing.appraised - visibleRepairTotal(listing, inspected));
}

export function priceVerdict(listing, guess) {
  const target = smartPrice(listing);
  const delta = guess - target;
  const distance = Math.abs(delta);
  const won = distance <= 2500;

  let label = 'Far from fair value';
  let tone = 'danger';
  let points = 10;
  let message = delta > 0
    ? 'You paid too much for the risk hidden in this house.'
    : 'Your price is so low that the seller is unlikely to accept it.';

  if (won) {
    label = 'Winning price';
    tone = 'good';
    points = 100;
    message = 'You priced the house close to its condition-adjusted value. This is the sweet spot: competitive without ignoring the risks.';
  } else if (distance <= 5000) {
    label = delta > 0 ? 'Small overpay' : 'Strong low offer';
    tone = 'warn';
    points = delta > 0 ? 70 : 80;
    message = delta > 0
      ? 'You are close, but you still paid more than the evidence supports.'
      : 'You protected yourself well, but the offer may be a little too low to win.';
  } else if (distance <= 10000) {
    label = delta > 0 ? 'Risky overpay' : 'Likely rejected';
    tone = 'warn';
    points = delta > 0 ? 45 : 50;
    message = delta > 0
      ? 'You are paying a noticeable premium even after the condition problems are considered.'
      : 'You protected your money, but the gap is large enough that the seller would probably reject the offer.';
  }

  return { target, delta, distance, won, label, tone, points, message };
}

export function missedFindings(listing, inspected = []) {
  return findingsOf(listing).filter((f) => !inspected.includes(f.id) && f.cost > 0);
}
