import { LISTINGS } from '../data/listings.js';
import { money } from '../utils/finance.js';
import { missedFindings } from '../utils/valuation.js';

function rankFor(wins, avg, total) {
  if (wins === total && avg >= 90) return { icon: '🏆', title: 'Master Price Detective', note: 'You consistently converted condition evidence into disciplined buying prices.' };
  if (wins >= 2) return { icon: '🦅', title: 'Sharp Buyer', note: 'You priced most properties intelligently and avoided getting anchored to the asking price.' };
  if (wins >= 1) return { icon: '🔎', title: 'Developing Detective', note: 'You found some good prices, but hidden conditions still changed the value more than expected.' };
  return { icon: '🎲', title: 'Price Chaser', note: 'The asking price influenced you more than the evidence. More condition checking would improve your decisions.' };
}

export default function ResultScreen({ state, dispatch }) {
  const total = state.history.length;
  const wins = state.history.filter((h) => h.priceResult?.won).length;
  const avg = total ? Math.round(state.history.reduce((s, h) => s + (h.priceResult?.points || 0), 0) / total) : 0;
  const rank = rankFor(wins, avg, total);
  const totalChecked = state.history.reduce((s, h) => s + h.checked, 0);
  const totalCorrect = state.history.reduce((s, h) => s + h.correct, 0);
  const accuracy = totalChecked ? Math.round((totalCorrect / totalChecked) * 100) : 0;

  return (
    <section className="panel result-screen price-final-screen">
      <div className="result-hero">
        <div>
          <span className="eyebrow">GAME COMPLETE</span>
          <h1 className="result-title">{rank.icon} {rank.title}</h1>
          <p className="lead">{rank.note}</p>
        </div>
        <div className="deal-score"><span>Average pricing score</span><strong>{avg}</strong><small>/100</small></div>
      </div>

      <div className="final-stat-grid">
        <div><span>Winning prices</span><strong>{wins}/{total}</strong></div>
        <div><span>Buyer IQ</span><strong>{state.buyerIQ}</strong></div>
        <div><span>Condition quiz accuracy</span><strong>{totalChecked ? `${accuracy}%` : '—'}</strong></div>
        <div><span>Total pricing points</span><strong>{state.pricingPoints}</strong></div>
      </div>

      <h3>Property-by-property scorecard</h3>
      <div className="property-scorecards">
        {state.history.map((h, i) => {
          const listing = LISTINGS[i];
          const missed = missedFindings(listing, h.inspected);
          const missedCost = missed.reduce((s, f) => s + f.cost, 0);
          return (
            <article key={h.id} className={h.priceResult.won ? 'property-card won-card' : 'property-card'}>
              <div className="property-card-head">
                <div><span>{h.priceResult.won ? '🏆 WIN' : '📚 LEARN'}</span><h4>{h.name}</h4></div>
                <strong>{h.priceResult.points}/100</strong>
              </div>
              <div className="mini-price-grid">
                <span>Your price <b>{money(h.guess)}</b></span>
                <span>Smart price <b>{money(h.priceResult.target)}</b></span>
              </div>
              <p>{h.priceResult.label}. You were {money(h.priceResult.distance)} away from the condition-adjusted value.</p>
              <p className="muted">Missed condition cost: <strong>{money(missedCost)}</strong> · Condition reads: {h.correct}/{h.checked || 0}</p>
            </article>
          );
        })}
      </div>

      <div className="final-lesson">
        <h3>What this game is teaching</h3>
        <p><strong>Do not decide the price first and inspect later.</strong> Start with evidence: market value, physical condition, repair costs, seller terms and your own limits. Then turn those findings into the maximum amount you are willing to pay.</p>
        <p>The seller controls the <em>asking price</em>. You control your <em>buying price</em>.</p>
      </div>

      <div className="footer result-actions"><span /><button className="btn primary" onClick={() => dispatch({ type: 'RESET' })}>Play again ↻</button></div>
    </section>
  );
}
