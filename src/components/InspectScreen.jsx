import { LISTINGS } from '../data/listings.js';
import { INSPECTIONS_PER_HOUSE, findingsOf } from '../utils/inspection.js';
import { money } from '../utils/finance.js';
import Hotspot from './Hotspot.jsx';
import FindingCard from './FindingCard.jsx';

export default function InspectScreen({ state, dispatch }) {
  const listing = LISTINGS[state.round];
  const { inspectLeft, inspected, selected } = state;
  const all = findingsOf(listing);
  const out = inspectLeft === 0;
  const selectedFinding = all.find((f) => f.id === selected);
  const found = all.filter((f) => inspected.includes(f.id) && f.severity !== 'none');
  const exposure = found.reduce((s, f) => s + f.cost, 0);

  return (
    <section className="panel inspect-price-stage">
      <div className="mission-head">
        <div>
          <span className="eyebrow">EVIDENCE ROUND</span>
          <h2>Inspect before you name a price</h2>
          <p className="lead">You can inspect only {INSPECTIONS_PER_HOUSE} of {all.length} areas. Use the open-house clues to hunt for the expensive problems first.</p>
        </div>
        <div className="mission-score">
          <span>Repair cost found</span>
          <strong>{money(exposure)}</strong>
          <small>{inspectLeft} inspections left</small>
        </div>
      </div>

      <div className="scorebar" aria-live="polite">
        <div><span className="stat-label">Checks used</span><strong>{inspected.length}/{INSPECTIONS_PER_HOUSE}</strong></div>
        <div><span className="stat-label">Problems discovered</span><strong>{found.length}</strong></div>
        <div><span className="stat-label">Known repair exposure</span><strong>{money(exposure)}</strong></div>
      </div>

      <div className="inspect-layout">
        <div className="house-grid">
          {all.map((f) => (
            <Hotspot key={f.id} finding={f} revealed={inspected.includes(f.id)} selected={selected === f.id} disabled={out} onClick={() => dispatch({ type: 'INSPECT', id: f.id })} />
          ))}
        </div>
        <div>
          <FindingCard finding={selectedFinding} />
          <div className="recap-box">
            <h3>Evidence from the listing</h3>
            <ul className="notes">{listing.notes.map((n) => <li key={n.topic}><strong>{n.topic}:</strong> {n.text}</li>)}</ul>
          </div>
        </div>
      </div>

      <div className="detective-tip">
        <span>💡</span>
        <p><strong>Pricing hint:</strong> a defect is not just a red flag — it has a dollar cost. The more expensive problems you find, the less the house should be worth to you.</p>
      </div>

      <div className="footer">
        <span className="muted">You may stop early, but uninspected problems can still hurt your final price.</span>
        <button className="btn primary" disabled={inspected.length === 0} onClick={() => dispatch({ type: 'GO_PRICE' })}>
          Set my buying price →
        </button>
      </div>
    </section>
  );
}
