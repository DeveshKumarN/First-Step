import { SEVERITY } from '../utils/inspection.js';

export default function Hotspot({ finding, revealed, selected, disabled, onClick }) {
  const cls = ['hotspot', revealed ? `sev-${finding.severity}` : '', selected ? 'selected' : ''].join(' ');
  return (
    <button className={cls} onClick={onClick} disabled={disabled && !revealed}>
      <span className="hs-icon" aria-hidden="true">{finding.icon}</span>
      <span className="hs-label">{finding.label}</span>
      <span className="hs-badge">
        {revealed ? `${SEVERITY[finding.severity].symbol} ${SEVERITY[finding.severity].label}` : 'Not inspected'}
      </span>
    </button>
  );
}
