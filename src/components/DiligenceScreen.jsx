import { LISTINGS, AREAS } from '../data/listings.js';
import { DTI_COMFORT, DTI_MAX, dtiBand, money, pct } from '../utils/finance.js';
import StepCard from './StepCard.jsx';

const CHOICE_TEXT = { repair: 'asked for a repair', credit: 'asked for a credit', accept: 'accepted it as-is' };

function RecapLine({ row }) {
  const { finding, choice, granted, youPay } = row;
  const result = granted === null ? '' : granted ? ' The seller agreed.' : ' The seller refused.';
  return (
    <li>
      <strong>{finding.icon} {finding.label}:</strong> you {CHOICE_TEXT[choice]}.{result} You pay {money(youPay)}.
    </li>
  );
}

export default function DiligenceScreen({ state, dispatch }) {
  const { dil, offer, auction, savings, neg, inspected } = state;
  const listing = LISTINGS[state.round];
  const skippedInspection = offer.waive.inspection;

  const inspStatus = skippedInspection ? 'warn' : neg.knownRepairs >= 3000 ? 'bad' : neg.knownRepairs > 0 ? 'warn' : 'ok';
  const apprStatus = dil.gap === 0 ? 'ok' : dil.apprExtra >= 3000 ? 'bad' : 'warn';
  const lendStatus = !dil.canClose ? 'bad' : dil.buffer < 3000 ? 'warn' : 'ok';
  const ratioBand = dtiBand(dil.ratio);

  const walkNote = dil.exitFree
    ? `You keep your ${money(dil.earnest)} earnest money, because the ${dil.exitReasons.join(' and ')} contingency you kept covers this.`
    : `You lose your ${money(dil.earnest)} earnest money. No contingency you kept covers this problem.`;

  const isLastHouse = state.round === LISTINGS.length - 1;

  return (
    <section className="panel">
      <h2>Almost at the closing table: {listing.name}</h2>
      <p className="lead">
        The seller accepted {money(auction.effectivePrice)}. Three checks decide whether you can close.
      </p>

      <div className="steps">
        {skippedInspection ? (
          <StepCard title="Inspection" status="warn" impact="Cost to you: unknown until after you move in.">
            <p>You waived the inspection contingency, so nobody looked inside this house.</p>
            <p>Any problems will show up after you move in, and every one of them will be yours.</p>
          </StepCard>
        ) : (
          <StepCard
            title="Inspection and negotiation"
            status={inspStatus}
            impact={neg.knownRepairs > 0 ? `You pay ${money(neg.knownRepairs)} in repairs before closing.` : 'No repair costs for you.'}
          >
            <p>You inspected {inspected.length} of {AREAS.length} areas and found {neg.rows.length} {neg.rows.length === 1 ? 'problem' : 'problems'}.</p>
            {neg.rows.length > 0 && <ul className="recap-list">{neg.rows.map((r) => <RecapLine key={r.finding.id} row={r} />)}</ul>}
            <p className="muted">Areas you did not inspect stay a mystery until after you close.</p>
          </StepCard>
        )}

        <StepCard
          title="Appraisal"
          status={apprStatus}
          impact={dil.gap > 0 ? `Extra cash needed: ${money(dil.apprExtra)}.` : 'No extra cash needed.'}
        >
          <p>The lender's appraiser values the home at <strong>{money(dil.appraised)}</strong>. Your price was {money(auction.effectivePrice)}.</p>
          {dil.gap === 0 && <p>The appraisal supports your price. The lender will fund the full loan.</p>}
          {dil.gap > 0 && offer.waive.appraisal && (
            <p>That is a {money(dil.gap)} gap. You waived the appraisal contingency, so you cover the gap in cash.</p>
          )}
          {dil.gap > 0 && !offer.waive.appraisal && (
            <p>That is a {money(dil.gap)} gap. You kept the contingency, so the seller dropped the price by {money(Math.round(dil.gap / 2))} to meet you halfway.</p>
          )}
        </StepCard>

        <StepCard
          title="Lender and cash"
          status={lendStatus}
          impact={dil.canClose ? `Cash left after closing: ${money(dil.buffer)}.` : 'You cannot close on these numbers.'}
        >
          <p>
            Payment {money(dil.payment)} a month. Debt-to-income <strong className={`text-${ratioBand}`}>{pct(dil.ratio)}</strong>{' '}
            ({pct(DTI_COMFORT)} is comfortable, {pct(DTI_MAX)} is the usual limit).
          </p>
          <p>
            Cash to close: {money(dil.cashNeeded)} (down payment {money(dil.downPayment)}, closing costs {money(dil.closingCosts)}
            {dil.knownRepairs > 0 ? `, repairs ${money(dil.knownRepairs)}` : ''}). You have {money(savings)}.
          </p>
          {!dil.loanOk && <p className="text-danger">The lender denies the loan: your debt-to-income is too high.</p>}
          {!dil.cashOk && <p className="text-danger">You are {money(-dil.buffer)} short of the cash you need to close.</p>}
        </StepCard>
      </div>

      <div className="decision">
        <div>
          <button className="btn primary block" disabled={!dil.canClose} onClick={() => dispatch({ type: 'CLOSE' })}>
            Close on the house
          </button>
          {!dil.canClose && <p className="muted">Closing is not possible on these numbers.</p>}
        </div>
        <div>
          <button className="btn block" onClick={() => dispatch({ type: 'WALK' })}>
            {isLastHouse ? 'Walk away and see results' : 'Walk away and keep looking'}
          </button>
          <p className={dil.exitFree ? 'muted' : 'muted text-danger'}>{walkNote}</p>
        </div>
      </div>
    </section>
  );
}
