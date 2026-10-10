// A horizontal gauge. `band` is good | stretch | danger and controls the color.

export default function Meter({ label, valueText, fraction, band, markers = [], note }) {
  const width = `${Math.min(1, Math.max(0, fraction)) * 100}%`;
  return (
    <div className="meter">
      <div className="meter-head">
        <span>{label}</span>
        <strong className={`text-${band}`}>{valueText}</strong>
      </div>
      <div className="meter-track">
        <div className={`meter-fill bg-${band}`} style={{ width }} />
        {markers.map((m) => (
          <i key={m} className="meter-mark" style={{ left: `${m * 100}%` }} />
        ))}
      </div>
      {note && <p className="meter-note">{note}</p>}
    </div>
  );
}
