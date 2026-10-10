import { LISTINGS } from '../data/listings.js';
import { findingsOf, hiddenTotal } from '../utils/inspection.js';
import { money } from '../utils/finance.js';
import { missedFindings } from '../utils/valuation.js';

export default function PriceRevealScreen({ state, dispatch }) {
  const listing = LISTINGS[state.round];
  const result = state.priceResult;
  const missed = missedFindings(listing, state.inspected);
  const allProblems = findingsOf(listing).filter((f) => f.cost > 0);
  const over = result.delta > 0;

  return (
    <section className="panel price-reveal-screen">
      <div className={`price-verdict verdict-${result.tone}`}>
        <div className="verdict-icon">{result.won ? '🏆' : over ? '💸' : '🚪'}</div>
        <div>
          <span className="eyebrow">PRICE REVEAL</span>
          <h1>{result.label}</h1>
          <p>{result.message}</p>
        </div>
        <div className="round-points"><span>Round score</span><strong>{result.points}</strong><small>/100</small></div>
      </div>

      <div className="price-comparison">
        <div><span>Seller asked</span><strong>{money(listing.list)}</strong></div>
        <div><span>You offered</span><strong>{money(state.priceGuess)}</strong></div>
        <div className="winning-card"><span>Winning smart price</span><strong>{money(result.target)}</strong><small>Winning zone: ±{money(2500)}</small></div>
      </div>

      <div className="formula-card">
        <h3>How the winning price was calculated</h3>
        <div className="formula-row"><span>Independent condition-free market value</span><strong>{money(listing.appraised)}</strong></div>
        <div className="formula-row minus"><span>All real repair / defect costs</span><strong>− {money(hiddenTotal(listing))}</strong></div>
        <div className="formula-total"><span>Condition-adjusted fair price</span><strong>{money(result.target)}</strong></div>
      </div>

      <div className="reveal-columns">
        <div>
          <h3>What existed in the house</h3>
          <ul className="finding-price-list full-list">
            {allProblems.map((f) => (
              <li key={f.id} className={state.inspected.includes(f.id) ? 'found-row' : 'missed-row'}>
                <span>{state.inspected.includes(f.id) ? '✅' : '❌'} {f.icon} {f.label}<small>{state.inspected.includes(f.id) ? 'You found this' : 'You missed this'}</small></span>
                <strong>-{money(f.cost)}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="lesson-panel">
          <h3>Why checking conditions matters</h3>
          {missed.length === 0 ? (
            <p>Excellent investigation. You uncovered every problem that carried a real cost, so your price could be based on nearly complete information.</p>
          ) : (
            <p>You missed <strong>{missed.length}</strong> costly condition{missed.length > 1 ? 's' : ''} worth <strong>{money(missed.reduce((s, f) => s + f.cost, 0))}</strong>. If you priced only from the issues you saw, you could easily overpay.</p>
          )}
          <p className="price-gap-text">Your price was <strong>{money(result.distance)}</strong> {over ? 'above' : 'below'} the smart price.</p>
          <div className="win-rule"><strong>🏆 Winning rule</strong><span>Within {money(2500)} of fair value</span></div>
        </div>
      </div>

      <div className="footer">
        <span className="muted">{result.won ? 'You balanced price and condition correctly.' : 'Use the missed clues to price the next property better.'}</span>
        <button className="btn primary" onClick={() => dispatch({ type: 'NEXT_CASE' })}>
          {state.round === LISTINGS.length - 1 ? 'See final score →' : 'Next property →'}
        </button>
      </div>
    </section>
  );
}
