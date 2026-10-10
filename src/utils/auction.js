import { LISTINGS } from '../data/listings.js';
import { PLAYER, DOWN_PCT, CLOSING_PCT, DTI_MAX, monthlyHousing } from './finance.js';

// How much each term is worth in the seller's eyes, in dollars.
export const WAIVER_VALUE = { inspection: 2500, appraisal: 3500, financing: 4000 };
export const WAIVER_LABEL = { inspection: 'Inspection', appraisal: 'Appraisal', financing: 'Financing' };
export const EARNEST_VALUE_PER_PCT = 1500;
export const ESCALATION_STEP = 1000;
export const APPRAISAL_HAIRCUT = 0.9; // lender lends 90% of the appraised value

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function defaultOffer(listing) {
  return {
    price: listing.list,
    earnestPct: 1,
    waive: { inspection: false, appraisal: false, financing: false },
    escalation: { on: false, cap: listing.list + 15000 },
  };
}

// Price plus the dollar value of every term. This is "the seller's view".
export function termsStrength({ price, waive = {}, earnestPct }) {
  const parts = [{ label: 'Offer price', amount: price }];
  Object.keys(WAIVER_VALUE).forEach((k) => {
    if (waive[k]) parts.push({ label: `Waived ${WAIVER_LABEL[k].toLowerCase()} contingency`, amount: WAIVER_VALUE[k] });
  });
  const extra = Math.max(0, earnestPct - 1) * EARNEST_VALUE_PER_PCT;
  if (extra > 0) parts.push({ label: `Extra earnest money (${earnestPct}%)`, amount: extra });
  return { total: parts.reduce((s, p) => s + p.amount, 0), parts };
}

export function buildRivals(listing, seed, round) {
  const rng = mulberry32(seed + round * 7919);
  return listing.rivals.map((r) => {
    const jitter = Math.round(((rng() * 2 - 1) * r.jitter) / 500) * 500;
    const price = listing.list + r.delta + jitter;
    const { total, parts } = termsStrength({ price, waive: r.waive, earnestPct: r.earnest });
    return { ...r, price, total, parts };
  });
}

export function runAuction(listing, offer, seed, round) {
  const rivals = buildRivals(listing, seed, round);
  const topRivalPrice = Math.max(...rivals.map((r) => r.price));

  let effectivePrice = offer.price;
  let escalated = false;
  if (offer.escalation.on && topRivalPrice >= offer.price) {
    const bumped = Math.min(offer.escalation.cap, topRivalPrice + ESCALATION_STEP);
    if (bumped > offer.price) {
      effectivePrice = bumped;
      escalated = true;
    }
  }

  const { total, parts } = termsStrength({ price: effectivePrice, waive: offer.waive, earnestPct: offer.earnestPct });
  const player = {
    id: 'you',
    name: 'Your offer',
    blurb: escalated ? 'Your escalation clause raised the price.' : 'Your sealed offer.',
    price: effectivePrice,
    waive: offer.waive,
    earnest: offer.earnestPct,
    total,
    parts,
  };

  const bestRival = rivals.reduce((best, r) => (r.total > best.total ? r : best), rivals[0]);
  const playerWon = player.total > bestRival.total; // ties go to the other buyer
  const winner = playerWon ? player : bestRival;
  const shortfall = playerWon ? 0 : Math.ceil((bestRival.total - player.total + 1) / 500) * 500;

  return { rivals, player, effectivePrice, escalated, topRivalPrice, bestRival, winner, playerWon, shortfall };
}

// What happens after inspection: appraisal, lender and cash checks.
// `knownRepairs` is what the player agreed to pay for problems found in the inspection.
export function runDiligence(listing, offer, offerPrice, savings, knownRepairs = 0) {
  const appraised = listing.appraised;
  const waived = offer.waive;
  const earnest = Math.round((offer.price * offer.earnestPct) / 100);

  // Appraisal. The lender lends on the lower of price and appraised value.
  const gap = Math.max(0, offerPrice - appraised);
  const price = waived.appraisal ? offerPrice : offerPrice - Math.round(gap / 2); // seller meets you halfway
  const loan = Math.round(APPRAISAL_HAIRCUT * Math.min(offerPrice, appraised));
  const downPayment = price - loan;
  const apprExtra = Math.max(0, downPayment - Math.round(price * DOWN_PCT));

  // Lender and cash
  const closingCosts = Math.round(price * CLOSING_PCT);
  const cashNeeded = downPayment + closingCosts + knownRepairs;
  const buffer = savings - cashNeeded;
  const payment = Math.round(monthlyHousing(price, loan));
  const ratio = (payment + PLAYER.carPayment) / PLAYER.income;
  const loanOk = ratio <= DTI_MAX;
  const cashOk = buffer >= 0;
  const canClose = loanOk && cashOk;

  // Walking away is free only if a contingency you kept covers a problem that really happened.
  const exitReasons = [];
  if (!waived.appraisal && gap > 0) exitReasons.push('appraisal');
  if (!waived.financing && !canClose) exitReasons.push('financing');
  const exitFree = exitReasons.length > 0;

  return {
    earnest, appraised, gap, price, loan, downPayment, apprExtra, knownRepairs,
    closingCosts, cashNeeded, buffer, payment, ratio, loanOk, cashOk, canClose,
    exitReasons, exitFree, walkPenalty: exitFree ? 0 : earnest,
    listPrice: listing.list,
  };
}

export const getListing = (round) => LISTINGS[round];
