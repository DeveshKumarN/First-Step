import { useEffect, useState } from 'react';
import { LISTINGS } from '../data/listings.js';
import { WAIVER_LABEL } from '../utils/auction.js';
import { money } from '../utils/finance.js';

function OfferCard({ entry, revealed, isWinner, verdict }) {
  if (!revealed) {
    return (
      <div className="offer-card sealed">
        <span>Sealed offer</span>
      </div>
    );
  }
  const waived = Object.keys(WAIVER_LABEL).filter((k) => entry.waive && entry.waive[k]);
  const cls = ['offer-card', 'opened', entry.id === 'you' ? 'mine' : '', verdict && isWinner ? 'winner' : ''].join(' ');
  return (
    <div className={cls}>
      <h3>{entry.name}</h3>
      <p className="muted">{entry.blurb}</p>
      <p className="card-price">{money(entry.price)}</p>
      <ul className="chips">
        {waived.length === 0 && <li className="chip safe">Keeps every contingency</li>}
        {waived.map((k) => <li key={k} className="chip risky">Waives {WAIVER_LABEL[k].toLowerCase()}</li>)}
        <li className="chip">{entry.earnest}% earnest money</li>
      </ul>
      <p className="seller-line">Seller's view: <strong>{money(entry.total)}</strong></p>
    </div>
  );
}

export default function RevealScreen({ state, dispatch }) {
  const { auction } = state;
  const listing = LISTINGS[state.round];
  const entries = [...auction.rivals, auction.player];
  const total = entries.length;
  const [shown, setShown] = useState(0); // shown === total + 1 means the verdict is visible

  useEffect(() => {
    if (shown > total) return undefined;
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 700 : 1100);
    return () => clearTimeout(t);
  }, [shown, total]);

  const done = shown > total;
  const { winner, playerWon, escalated, shortfall, topRivalPrice, effectivePrice } = auction;
  const higherPriceLost = !playerWon && auction.player.price > winner.price;

  const isLastHouse = state.round === LISTINGS.length - 1;
  const continueLabel = playerWon ? 'Start the due diligence' : isLastHouse ? 'See my results' : 'Look at the next house';

  return (
    <section className="panel">
      <h2>The seller opens the offers on {listing.name}</h2>
      <p className="lead">The seller compares each offer's price plus what its terms are worth. Highest total wins.</p>

      <div className="reveal-grid">
        {entries.map((e, i) => (
          <OfferCard key={e.id} entry={e} revealed={i < shown} isWinner={winner.id === e.id} verdict={done} />
        ))}
      </div>

      {done && (
        <div className={playerWon ? 'verdict win' : 'verdict lose'} role="status">
          <p className="stamp">{playerWon ? 'Your offer wins' : `Sold to ${winner.name}`}</p>
          {playerWon && escalated && (
            <p>Your escalation clause kicked in. The best rival price was {money(topRivalPrice)}, so you pay {money(effectivePrice)}.</p>
          )}
          {!playerWon && higherPriceLost && (
            <p>Your price was higher, but {winner.name} had cleaner terms. Waived protections and extra earnest money counted as real money.</p>
          )}
          {!playerWon && !higherPriceLost && (
            <p>You were about {money(shortfall)} short in the seller's view. Price, waivers and earnest money all count.</p>
          )}
        </div>
      )}

      <div className="footer">
        <button className="btn" onClick={() => setShown(total + 1)} disabled={done}>Reveal all</button>
        <button className="btn primary" onClick={() => dispatch({ type: 'AFTER_REVEAL' })} disabled={!done}>{continueLabel}</button>
      </div>
    </section>
  );
}
