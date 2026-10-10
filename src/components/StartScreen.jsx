import { money } from '../utils/finance.js';

export default function StartScreen({ dispatch }) {
  return (
    <section className="panel start game-start">
      <div className="start-hero" aria-hidden="true">
        <div className="radar-ring ring-1" />
        <div className="radar-ring ring-2" />
        <div className="radar-ring ring-3" />
        <div className="radar-house">🏠</div>
        <div className="radar-flag flag-a">🔎</div>
        <div className="radar-flag flag-b">💸</div>
        <div className="radar-flag flag-c">🎯</div>
      </div>

      <div className="start-copy">
        <span className="eyebrow">PROPERTY PRICING GAME</span>
        <h1>First-Step <span className="title-accent">Price Detective</span></h1>
        <p className="lead">
          Every house has an asking price. Your job is to discover what it is actually worth.
          Read the conditions, inspect the right areas, estimate the hidden costs and submit one final buying price.
        </p>

        <div className="game-rules pricing-rules">
          <div><span>1</span><p><strong>Read the clues.</strong> Old systems, appraisal warnings and seller terms all affect the deal.</p></div>
          <div><span>2</span><p><strong>Inspect smart.</strong> You only get five checks, so use the clues to choose where to look.</p></div>
          <div><span>3</span><p><strong>Set your price.</strong> Start from market value and subtract the repair risk you discover.</p></div>
          <div><span>4</span><p><strong>Hit the winning zone.</strong> Get within {money(2500)} of the true condition-adjusted price to win the round.</p></div>
        </div>

        <div className="objective-box">
          <strong>🏆 The lesson</strong>
          <p>The cheapest price is not automatically the best, and the seller's asking price is not automatically fair. A good buyer uses evidence before deciding what to pay.</p>
        </div>

        <button className="btn primary launch-btn" onClick={() => dispatch({ type: 'START' })}>Start the first property →</button>
      </div>
    </section>
  );
}
