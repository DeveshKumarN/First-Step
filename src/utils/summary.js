import { DTI_COMFORT, DTI_MAX, money, pct } from './finance.js';

export function scoreClosed(c) {
  if (!c) return { total: 0, parts: [] };
  const surprises = c.unseenCost + c.apprExtra;

  // Inspection and negotiation smarts (25 points)
  let insp;
  let inspNote;
  if (!c.inspectionKept) {
    insp = c.hiddenTotal <= 3000 ? 25 : c.hiddenTotal <= 8000 ? 10 : 0;
    inspNote = `You skipped the inspection. The house was hiding ${money(c.hiddenTotal)} of problems.`;
  } else if (c.negMax === 0) {
    insp = c.missedMajors === 0 ? 25 : 0;
    inspNote = c.missedMajors === 0 ? 'Your inspections found nothing to fight over.' : 'Your inspections missed a major problem.';
  } else {
    insp = Math.max(0, Math.round((25 * c.negPoints) / c.negMax) - 8 * c.missedMajors);
    inspNote = `Your responses scored ${c.negPoints} of ${c.negMax}${c.missedMajors ? `, and you never inspected ${c.missedMajors} major problem${c.missedMajors > 1 ? 's' : ''}` : ''}.`;
  }

  const parts = [
    { label: 'Home secured', pts: 20, max: 20, note: `You closed on ${c.name}.` },
    {
      label: 'Affordable payment',
      pts: c.ratio <= DTI_COMFORT ? 15 : c.ratio <= DTI_MAX ? 7 : 0,
      max: 15,
      note: `Debt-to-income ${pct(c.ratio)} (comfortable is ${pct(DTI_COMFORT)} or less).`,
    },
    {
      label: 'Cash cushion',
      pts: c.finalCushion >= 8000 ? 15 : c.finalCushion >= 3000 ? 10 : c.finalCushion > 0 ? 5 : 0,
      max: 15,
      note: c.finalCushion >= 0 ? `${money(c.finalCushion)} left after closing and move-in surprises.` : `You ended ${money(-c.finalCushion)} in debt after move-in surprises.`,
    },
    { label: 'Inspection and negotiation', pts: insp, max: 25, note: inspNote },
    {
      label: 'Few surprises',
      pts: surprises <= 3000 ? 25 : surprises <= 6000 ? 15 : surprises <= 9000 ? 6 : 0,
      max: 25,
      note: `${money(surprises)} in problems and appraisal costs you did not plan for.`,
    },
  ];
  return { total: parts.reduce((s, p) => s + p.pts, 0), parts };
}

export function getRank(total, closed) {
  if (!closed) return { title: 'Still renting', note: 'No house this time, but you also avoided a deal that would have hurt.' };
  if (total >= 80) return { title: 'Smart buyer', note: 'You won a home you can afford and protected yourself at every step.' };
  if (total >= 60) return { title: 'Solid buyer', note: 'You got the house, with a few costs or risks you could trim next time.' };
  return { title: 'Close call', note: 'You got the keys, but the deal stretched your finances. Try a safer mix of terms.' };
}

export function lessonsFor(history, closed) {
  const out = [];
  if (history.some((h) => h.outcome === 'lost')) {
    out.push("Sellers compare whole offers, not just price. A waived contingency or extra earnest money counted as real dollars in the seller's view.");
  }
  history.filter((h) => h.outcome === 'walked-free').forEach((h) => {
    out.push(
      h.reason === 'inspection'
        ? `At ${h.name} you walked away after the inspection and kept your earnest money. That is exactly what the inspection contingency is for.`
        : `At ${h.name} you walked away and kept your earnest money because a contingency you kept covered the problem.`
    );
  });
  history.filter((h) => h.outcome === 'walked-penalty').forEach((h) => {
    out.push(`At ${h.name} you lost ${money(h.penalty)} in earnest money. When you waive a protection, backing out costs you.`);
  });

  if (closed) {
    if (!closed.inspectionKept && closed.hiddenTotal > 3000) {
      out.push(`Skipping the inspection left ${money(closed.unseenCost)} of problems for after move-in. Waive it only when the house looks low risk.`);
    }
    if (!closed.inspectionKept && closed.hiddenTotal <= 3000) {
      out.push('Waiving the inspection worked here because the clues pointed to a low-risk house. Read the tour notes before deciding what to give up.');
    }
    if (closed.inspectionKept && closed.missedMajors === 0 && closed.negMax > 0 && closed.negPoints / closed.negMax >= 0.8) {
      out.push('Your inspections found the problems that mattered, and you answered each one well. That is how limited inspections should be spent.');
    }
    if (closed.inspectionKept && closed.missedMajors > 0) {
      out.push('You only get a few inspections, and you never checked a major problem. Use the tour clues to inspect the scariest areas first.');
    }
    if (closed.rows.some((r) => r.finding.severity === 'cosmetic' && r.choice !== 'accept')) {
      out.push('Asking for cosmetic fixes spent seller goodwill. Save your requests for repairs and safety problems.');
    }
    if (closed.rows.some((r) => r.finding.severity === 'major' && r.choice === 'accept')) {
      out.push('You accepted a major problem as-is. Safety and structural issues deserve a repair request, with proof, or a walk away.');
    }
    if (closed.waive.appraisal && closed.apprExtra >= 3000) {
      out.push(`Waiving the appraisal meant ${money(closed.apprExtra)} of extra cash to cover the gap between price and appraised value.`);
    }
    if (closed.overAsking > 0) {
      out.push(`You paid ${money(closed.overAsking)} over asking. Check that the payment and your cash cushion still work at that price.`);
    }
    out.push(`Your debt-to-income ratio was ${pct(closed.ratio)}. Lenders like ${pct(DTI_COMFORT)} or less and rarely approve above ${pct(DTI_MAX)}.`);
  } else {
    out.push('Know your debt-to-income limit before you bid: about 36% is comfortable, and above 43% most lenders say no.');
    out.push('Keep a cash cushion beyond the down payment and closing costs. Repairs and appraisal gaps arrive after you win.');
  }
  return out.slice(0, 4);
}
