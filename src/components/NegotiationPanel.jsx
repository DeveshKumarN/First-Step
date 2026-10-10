import { LISTINGS } from '../data/listings.js';
import { CHOICES, findingsOf } from '../utils/inspection.js';
import { money } from '../utils/finance.js';

const ORDER = ['major', 'repair', 'cosmetic'];

export default function NegotiationPanel({ state, dispatch }) {
  const listing = LISTINGS[state.round];
  const { inspected, decisions } = state;
  const all = findingsOf(listing).filter((f) => inspected.includes(f.id));
  const issues = all.filter((f) => f.severity !== 'none').sort((a, b) => ORDER.indexOf(a.severity) - ORDER.indexOf(b.severity));
  const clean = all.filter((f) => f.severity === 'none');
  const asIs = listing.goodwill === 0;
  const decided = issues.filter((f) => decisions[f.id]).length;

  return (
    <section className="panel">
      <h2>Negotiate the repairs</h2>
      <p className="lead">
        {asIs
          ? 'This is an as-is sale. The seller refuses every repair and credit, so your only choices are to accept a problem or walk away.'
          : 'Respond to each problem. Every request uses up seller patience, and the seller handles the biggest problems first.'}
      </p>

      <div className="patience">
        <span className="stat-label">Seller patience</span>
        <span className="pips" aria-label={`${listing.goodwill} patience`}>
          {Array.from({ length: listing.goodwill }, (_, i) => <i key={i} className="pip on" />)}
          {asIs && <strong>None</strong>}
        </span>
        {!asIs && <span className="muted">Cosmetic requests use 2. Repair and safety requests use 1.</span>}
      </div>

      <ul className="neg-list">
        {issues.map((f) => (
          <li key={f.id} className={`neg-row sev-${f.severity}`}>
            <div className="neg-info">
              <strong>{f.icon} {f.label}</strong> <span className="muted">{money(f.cost)} to fix</span>
              <p>{f.text}</p>
            </div>
            <div className="choices" role="group" aria-label={`Response for ${f.label}`}>
              {CHOICES.map((c) => {
                const blocked = asIs && c.id !== 'accept';
                return (
                  <button
                    key={c.id}
                    className={decisions[f.id] === c.id ? 'choice active' : 'choice'}
                    aria-pressed={decisions[f.id] === c.id}
                    disabled={blocked}
                    onClick={() => dispatch({ type: 'DECIDE', id: f.id, choice: c.id })}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      {clean.length > 0 && (
        <p className="muted">No problems found in: {clean.map((f) => f.label.toLowerCase()).join(', ')}.</p>
      )}

      <div className="footer">
        <button className="btn" onClick={() => dispatch({ type: 'WALK_INSPECTION' })}>Walk away and keep my earnest money</button>
        <div className="footer-right">
          <p className="muted">{decided} of {issues.length} answered</p>
          <button className="btn primary" disabled={decided !== issues.length} onClick={() => dispatch({ type: 'SEND_REQUESTS' })}>
            Send to the seller
          </button>
        </div>
      </div>
    </section>
  );
}
