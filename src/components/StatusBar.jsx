import { LISTINGS } from '../data/listings.js';

export default function StatusBar({ state }) {
  const wins = state.history.filter((h) => h.priceResult?.won).length + (state.priceResult?.won && state.phase === 'priceReveal' ? 1 : 0);
  return (
    <header className="statusbar">
      <span className="brand">🏠 Offer to Keys <b>Price Detective</b></span>
      <div className="status-items">
        <span><small>Property</small> <strong>{state.round + 1}/{LISTINGS.length}</strong></span>
        <span><small>Buyer IQ</small> <strong>{state.buyerIQ}</strong></span>
        <span><small>Pricing score</small> <strong>{state.pricingPoints}</strong></span>
        <span><small>Wins</small> <strong>{wins}</strong></span>
      </div>
    </header>
  );
}
