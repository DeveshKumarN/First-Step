import { LISTINGS } from '../data/listings.js';
import { termsStrength, ESCALATION_STEP } from '../utils/auction.js';
import { DOWN_PCT, CLOSING_PCT, DTI_COMFORT, DTI_MAX, dti, dtiBand, money, pct } from '../utils/finance.js';
import ContingencyRow from './ContingencyRow.jsx';
import Meter from './Meter.jsx';

const KINDS = ['inspection', 'appraisal', 'financing'];

export default function OfferScreen({ state, dispatch }) {
  const listing = LISTINGS[state.round];
  const { offer, savings, conditionAnswers, checkSkipped } = state;
  const set = (patch) => dispatch({ type: 'SET_OFFER', patch });

  const minPrice = listing.list - 10000;
  const maxPrice = listing.list + 40000;
  const diff = offer.price - listing.list;

  const loan = Math.round(offer.price * (1 - DOWN_PCT));
  const ratio = dti(offer.price, loan);
  const band = dtiBand(ratio);
  const cashNeeded = Math.round(offer.price * (DOWN_PCT + CLOSING_PCT));
  const cushion = savings - cashNeeded;
  const cashBand = cushion < 0 ? 'danger' : cushion < 8000 ? 'stretch' : 'good';
  const earnest = Math.round((offer.price * offer.earnestPct) / 100);
  const view = termsStrength({ price: offer.price, waive: offer.waive, earnestPct: offer.earnestPct });

  const capOptions = [];
  for (let c = listing.list + 5000; c <= listing.list + 45000; c += 5000) capOptions.push(c);

  const reviewed = Object.keys(conditionAnswers).length;
  const correctlyRead = listing.checks.filter((c) => conditionAnswers[c.id] === c.correct);
  const ignoredWarnings = correctlyRead.filter((c) => c.protection && offer.waive[c.protection]);
  const shields = KINDS.filter((k) => !offer.waive[k]).length;

  return (
    <section className="panel offer-screen">
      <div className="offer-title-row">
        <div>
          <span className="eyebrow">BUILD THE CONTRACT</span>
          <h2>Your offer on {listing.name}</h2>
          <p className="lead">Asking {money(listing.list)}. Make the offer competitive without deleting the protections your own investigation says you may need.</p>
        </div>
        <div className={`shield-counter ${shields <= 1 ? 'danger' : ''}`}>
          <span>Protection shields</span>
          <strong>{'🛡️'.repeat(shields)}{'○'.repeat(3 - shields)}</strong>
          <small>{shields}/3 kept</small>
        </div>
      </div>

      {checkSkipped ? (
        <div className="rush-warning">
          <span>⚠️</span>
          <div>
            <strong>You rushed past the condition check.</strong>
            <p>You are about to make a major purchase without reviewing the property, value, seller terms or budget risks first. You can still bid, but you are choosing with less information.</p>
          </div>
        </div>
      ) : (
        <div className="intel-strip">
          <div><span>Files reviewed</span><strong>{reviewed}/{listing.checks.length}</strong></div>
          <div><span>Correct reads</span><strong>{correctlyRead.length}/{listing.checks.length}</strong></div>
          <div><span>Buyer IQ earned</span><strong>+{correctlyRead.length * 10}</strong></div>
          <div><span>Warnings ignored</span><strong className={ignoredWarnings.length ? 'text-danger' : 'text-good'}>{ignoredWarnings.length}</strong></div>
        </div>
      )}

      {ignoredWarnings.length > 0 && (
        <div className="ignored-alert" role="alert">
          <strong>🚨 You are overriding your own investigation</strong>
          <ul>
            {ignoredWarnings.map((c) => (
              <li key={c.id}>You identified <strong>{c.title.toLowerCase()}</strong> risk, then chose to waive the <strong>{c.protection}</strong> protection.</li>
            ))}
          </ul>
        </div>
      )}

      <div className="offer-layout">
        <div className="offer-form">
          <fieldset>
            <legend>1. Offer price</legend>
            <div className="price-row">
              <button className="btn small" aria-label="Lower price by $1,000" onClick={() => set({ price: Math.max(minPrice, offer.price - 1000) })}>-$1,000</button>
              <strong className="price-big">{money(offer.price)}</strong>
              <button className="btn small" aria-label="Raise price by $1,000" onClick={() => set({ price: Math.min(maxPrice, offer.price + 1000) })}>+$1,000</button>
            </div>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={1000}
              value={offer.price}
              aria-label="Offer price"
              onChange={(e) => set({ price: Number(e.target.value) })}
            />
            <p className="muted">
              {diff === 0 ? 'At asking price.' : diff > 0 ? `${money(diff)} over asking.` : `${money(-diff)} under asking.`}
            </p>
          </fieldset>

          <fieldset>
            <legend>2. Earnest money</legend>
            <p className="muted">This deposit makes you look serious. If you back out without a condition that protects you, the seller can keep it.</p>
            <div className="segmented wide" role="group" aria-label="Earnest money">
              {[1, 2, 3].map((p) => (
                <button key={p} className={offer.earnestPct === p ? 'seg active' : 'seg'} aria-pressed={offer.earnestPct === p} onClick={() => set({ earnestPct: p })}>
                  {p}% ({money((offer.price * p) / 100)})
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="protection-fieldset">
            <legend>3. Conditions / contingencies</legend>
            <div className="shield-explainer">🛡️ <strong>Think of these as shields:</strong> waiving one makes the seller like your offer more, but moves that risk from the seller/contract onto you.</div>
            {KINDS.map((k) => (
              <ContingencyRow key={k} kind={k} waived={offer.waive[k]} onChange={(w) => set({ waive: { [k]: w } })} />
            ))}
          </fieldset>

          <fieldset>
            <legend>4. Escalation clause</legend>
            <label className="check">
              <input type="checkbox" checked={offer.escalation.on} onChange={(e) => set({ escalation: { on: e.target.checked } })} />
              Beat the best competing offer by {money(ESCALATION_STEP)}, up to a maximum
            </label>
            {offer.escalation.on && (
              <div className="cap-row">
                <label htmlFor="cap">Maximum price</label>
                <select id="cap" value={offer.escalation.cap} onChange={(e) => set({ escalation: { cap: Number(e.target.value) } })}>
                  {capOptions.map((c) => <option key={c} value={c}>{money(c)}</option>)}
                </select>
                {offer.escalation.cap <= offer.price && <p className="muted text-danger">The maximum is not above your offer price, so this clause cannot help.</p>}
              </div>
            )}
          </fieldset>
        </div>

        <aside className="offer-summary" aria-live="polite">
          <span className="eyebrow">LIVE DEAL METER</span>
          <h3>Seller strength</h3>
          <p className="seller-view">{money(view.total)}</p>
          <ul className="parts">
            {view.parts.map((p) => (
              <li key={p.label}><span>{p.label}</span><span>{money(p.amount)}</span></li>
            ))}
          </ul>

          <h3>Your risk</h3>
          <Meter
            label="Debt-to-income"
            valueText={pct(ratio)}
            fraction={ratio / 0.5}
            band={band}
            markers={[DTI_COMFORT / 0.5, DTI_MAX / 0.5]}
            note={`Comfortable up to ${pct(DTI_COMFORT)}. Lenders usually stop at ${pct(DTI_MAX)}.`}
          />
          <Meter
            label="Cash cushion after closing"
            valueText={money(cushion)}
            fraction={cashNeeded / savings}
            band={cashBand}
            note={`Down payment and closing costs take ${money(cashNeeded)} of your ${money(savings)} before repairs.`}
          />
          <p className="earnest-risk">💸 At risk if you back out without cover: <strong>{money(earnest)}</strong></p>

          <button className="btn primary block" onClick={() => dispatch({ type: 'SUBMIT_OFFER' })}>Seal and submit offer</button>
          <button className="btn block" onClick={() => dispatch({ type: 'PASS' })}>Pass — this deal is not worth it</button>
        </aside>
      </div>
    </section>
  );
}
