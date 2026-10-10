import { LISTINGS } from '../data/listings.js';
import { money } from '../utils/finance.js';
import HouseArt from './HouseArt.jsx';

export default function ListingScreen({ state, dispatch }) {
  const listing = LISTINGS[state.round];

  return (
    <section className="panel listing game-listing">
      <div className="listing-visual">
        <div className="mission-chip">PROPERTY {state.round + 1} / {LISTINGS.length}</div>
        <HouseArt art={listing.art} />
        <div className="pressure-card">
          <span>⚡ SELLER PRESSURE</span>
          <strong>{listing.pitch}</strong>
        </div>
      </div>

      <div className="listing-body">
        <span className="eyebrow">NEW PRICING CASE</span>
        <h2>{listing.name}</h2>
        <p className="address">{listing.address}</p>
        <ul className="facts">{listing.facts.map((f) => <li key={f}>{f}</li>)}</ul>
        <p className="asking">Seller asks <strong>{money(listing.list)}</strong></p>

        <div className="objective-box">
          <strong>🎯 Your mission</strong>
          <p>Figure out the maximum price this house deserves after its real condition is considered. You win by pricing the risk correctly — not by blindly matching the seller.</p>
        </div>

        <h3>Open-house clues</h3>
        <ul className="notes clue-list">
          {listing.notes.map((n) => <li key={n.topic}><strong>{n.topic}:</strong> {n.text}</li>)}
        </ul>

        <div className="choice-zone">
          <button className="btn primary detective-btn" onClick={() => dispatch({ type: 'GO_CHECK' })}>
            🔎 Investigate before pricing
            <small>Read the conditions, then inspect the house</small>
          </button>
          <button className="btn rush-btn" onClick={() => dispatch({ type: 'RUSH_TO_PRICE' })}>
            ⚡ Guess the price now
            <small>Possible, but you will be pricing with almost no evidence</small>
          </button>
        </div>
      </div>
    </section>
  );
}
