import { SEVERITY } from '../utils/inspection.js';
import { money } from '../utils/finance.js';

export default function FindingCard({ finding }) {
  if (!finding) {
    return <aside className="card empty">Select an area to inspect it. Each new area uses one of your inspections.</aside>;
  }
  return (
    <aside className={`card sev-${finding.severity}`} key={finding.id}>
      <h3>{finding.icon} {finding.label}</h3>
      <p className="tag">{SEVERITY[finding.severity].symbol} {SEVERITY[finding.severity].label}</p>
      <p>{finding.text}</p>
      {finding.cost > 0 && <p className="muted">Estimated cost to fix: <strong>{money(finding.cost)}</strong></p>}
    </aside>
  );
}
