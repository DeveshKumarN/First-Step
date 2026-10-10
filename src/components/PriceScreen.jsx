import { LISTINGS } from '../data/listings.js';
import { findingsOf } from '../utils/inspection.js';
import { money } from '../utils/finance.js';
import { visibleEstimate, visibleRepairTotal } from '../utils/valuation.js';

export default function PriceScreen({ state, dispatch }) {
  const listing = LISTINGS[state.round];
  const inspectedFindings = findingsOf(listing).filter((f) => state.inspected.includes(f.id));
  const problems = inspectedFindings.filter((f) => f.cost > 0);
  const foundCost = visibleRepairTotal(listing, state.inspected);
  const evidenceEstimate = visibleEstimate(listing, state.inspected);
  const min = Math.max(150000, listing.list - 45000);
  const max = listing.list + 25000;
  const guess = state.priceGuess;

  return (
    <section className="panel price-game-screen">
      <div className="mission-head">
        <div>
          <span className="eyebrow">FINAL DECISION</span>
          <h2>Name your maximum buying price</h2>
          <p className="lead">This is the game: turn your findings into a number. Get within <strong>{money(2500)}</strong> of the true condition-adjusted value to win this property.</p>
        </div>
        <div className="mission-score">
          <span>Seller asks</span>
          <strong>{money(listing.list)}</strong>
          <small>Do not anchor blindly</small>
        </div>
      </div>

      {state.checkSkipped ? (
        <div className="rush-warning">
          <span>⚠️</span><div><strong>You skipped the investigation.</strong><p>You have the asking price, but almost none of the information needed to know whether it is fair.</p></div>
        </div>
      ) : null}

      <div className="price-game-layout">
        <div className="evidence-board">
          <h3>🗂️ Your evidence board</h3>
          <div className="evidence-line"><span>Seller asking price</span><strong>{money(listing.list)}</strong></div>
          <div className="evidence-line"><span>Independent market benchmark unlocked</span><strong>{money(listing.appraised)}</strong></div>
          <div className="evidence-line danger-line"><span>Repair costs you actually discovered</span><strong>-{money(foundCost)}</strong></div>
          <div className="evidence-line estimate-line"><span>Estimate using only what you know</span><strong>{money(evidenceEstimate)}</strong></div>

          <h4>Inspection findings</h4>
          {problems.length ? (
            <ul className="finding-price-list">
              {problems.map((f) => <li key={f.id}><span>{f.icon} {f.label}</span><strong>-{money(f.cost)}</strong></li>)}
            </ul>
          ) : (
            <p className="muted">No repair costs were discovered. That can mean the property is clean — or that the important areas were never checked.</p>
          )}

          <div className="detective-tip compact-tip"><span>🧠</span><p><strong>Remember:</strong> your estimate is only as good as your investigation. Any missed defect is still real even if it is not on your board.</p></div>
        </div>

        <div className="price-console">
          <span className="eyebrow">YOUR FINAL PRICE</span>
          <div className="final-price">{money(guess)}</div>
          <input
            className="price-slider"
            type="range"
            min={min}
            max={max}
            step="500"
            value={guess}
            onChange={(e) => dispatch({ type: 'SET_PRICE', price: Number(e.target.value) })}
            aria-label="Maximum buying price"
          />
          <div className="range-labels"><span>{money(min)}</span><span>{money(max)}</span></div>
          <div className="price-adjust-buttons">
            <button className="btn small" onClick={() => dispatch({ type: 'SET_PRICE', price: Math.max(min, guess - 5000) })}>− {money(5000)}</button>
            <button className="btn small" onClick={() => dispatch({ type: 'SET_PRICE', price: Math.max(min, guess - 1000) })}>− {money(1000)}</button>
            <button className="btn small" onClick={() => dispatch({ type: 'SET_PRICE', price: Math.min(max, guess + 1000) })}>+ {money(1000)}</button>
            <button className="btn small" onClick={() => dispatch({ type: 'SET_PRICE', price: Math.min(max, guess + 5000) })}>+ {money(5000)}</button>
          </div>

          <div className="price-vs-ask">
            <span>Compared with asking</span>
            <strong className={guess > listing.list ? 'text-danger' : 'text-good'}>
              {guess === listing.list ? 'At asking' : guess > listing.list ? `${money(guess - listing.list)} above` : `${money(listing.list - guess)} below`}
            </strong>
          </div>

          <button className="btn primary block lock-price" onClick={() => dispatch({ type: 'SUBMIT_PRICE' })}>🔒 Lock this price</button>
          <p className="muted center-text">Once locked, the game reveals every hidden condition and the true winning price.</p>
        </div>
      </div>
    </section>
  );
}
