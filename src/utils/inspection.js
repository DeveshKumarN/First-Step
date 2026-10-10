import { AREAS } from '../data/listings.js';

export const INSPECTIONS_PER_HOUSE = 5;
export const CREDIT_SHARE = 0.75; // a granted credit covers 75% of the cost

export const SEVERITY = {
  major: { label: 'Major or safety', symbol: '!!' },
  repair: { label: 'Repair needed', symbol: '!' },
  cosmetic: { label: 'Cosmetic', symbol: '~' },
  none: { label: 'No problems', symbol: '✓' },
};

export const CHOICES = [
  { id: 'repair', label: 'Ask seller to repair' },
  { id: 'credit', label: 'Request a credit' },
  { id: 'accept', label: 'Accept as-is' },
];

// Points for how well a response fits the severity of the finding (max 10).
const POINTS = {
  major: { repair: 10, credit: 5, accept: 0 },
  repair: { repair: 10, credit: 10, accept: 4 },
  cosmetic: { accept: 10, credit: 3, repair: 2 },
};

export const IDEAL = {
  major: 'Ask for repairs with proof, or walk away. Never accept a major problem as-is.',
  repair: 'Ask for a repair or a credit. Accepting leaves money on the table.',
  cosmetic: 'Accept as-is. Save your goodwill for the big items.',
};

// Asking costs seller goodwill. Cosmetic requests are the most annoying.
const ASK_COST = { cosmetic: 2, repair: 1, major: 1 };
const ORDER = ['major', 'repair', 'cosmetic'];

export const findingsOf = (listing) => AREAS.map((a) => ({ ...a, ...listing.findings[a.id] }));

export function resolveNegotiation(listing, inspected, decisions) {
  const found = findingsOf(listing)
    .filter((f) => inspected.includes(f.id) && f.severity !== 'none')
    .sort((a, b) => ORDER.indexOf(a.severity) - ORDER.indexOf(b.severity));

  let goodwill = listing.goodwill;
  const rows = found.map((f) => {
    const choice = decisions[f.id] || 'accept';
    let granted = null;
    let youPay = f.cost;
    if (choice !== 'accept') {
      const need = ASK_COST[f.severity];
      granted = listing.goodwill > 0 && goodwill >= need;
      if (granted) {
        goodwill -= need;
        youPay = choice === 'repair' ? 0 : Math.round(f.cost * (1 - CREDIT_SHARE));
      }
    }
    return { finding: f, choice, granted, youPay, points: POINTS[f.severity][choice] ?? 0 };
  });

  return {
    rows,
    goodwillStart: listing.goodwill,
    goodwillLeft: goodwill,
    knownRepairs: rows.reduce((s, r) => s + r.youPay, 0),
    points: rows.reduce((s, r) => s + r.points, 0),
    max: rows.length * 10,
  };
}

// Problems in areas the player never inspected. They surface after move-in.
export function unseenOf(listing, inspected) {
  const list = findingsOf(listing).filter((f) => !inspected.includes(f.id) && f.cost > 0);
  return { list, total: list.reduce((s, f) => s + f.cost, 0), majors: list.filter((f) => f.severity === 'major') };
}

export const hiddenTotal = (listing) => findingsOf(listing).reduce((s, f) => s + f.cost, 0);
