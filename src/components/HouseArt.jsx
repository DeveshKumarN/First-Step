// Small hand-drawn SVG of each house. Style decides the silhouette.

export default function HouseArt({ art }) {
  const { style, wall, roof, door } = art;
  return (
    <svg className="house-art" viewBox="0 0 320 190" role="img" aria-label="Illustration of the house">
      <rect x="0" y="150" width="320" height="40" fill="#a9d3a8" />
      <rect x="0" y="150" width="320" height="4" fill="#8cc08b" />

      {style === 'gable' && (
        <g>
          <rect x="70" y="80" width="180" height="72" fill={wall} stroke="#14213d" strokeWidth="3" />
          <polygon points="58,84 160,28 262,84" fill={roof} stroke="#14213d" strokeWidth="3" strokeLinejoin="round" />
          <rect x="204" y="36" width="16" height="32" fill="#7a2e22" stroke="#14213d" strokeWidth="3" />
          <rect x="146" y="106" width="28" height="46" fill={door} stroke="#14213d" strokeWidth="3" />
          <rect x="92" y="102" width="34" height="28" fill="#cfe8f7" stroke="#14213d" strokeWidth="3" />
          <rect x="194" y="102" width="34" height="28" fill="#cfe8f7" stroke="#14213d" strokeWidth="3" />
        </g>
      )}

      {style === 'row' && (
        <g>
          <rect x="84" y="46" width="152" height="106" fill={wall} stroke="#14213d" strokeWidth="3" />
          <rect x="76" y="34" width="168" height="16" fill={roof} stroke="#14213d" strokeWidth="3" />
          <line x1="160" y1="50" x2="160" y2="152" stroke="#14213d" strokeWidth="3" />
          <rect x="102" y="64" width="40" height="26" fill="#cfe8f7" stroke="#14213d" strokeWidth="3" />
          <rect x="178" y="64" width="40" height="26" fill="#cfe8f7" stroke="#14213d" strokeWidth="3" />
          <rect x="108" y="104" width="28" height="48" fill={door} stroke="#14213d" strokeWidth="3" />
          <rect x="184" y="108" width="34" height="28" fill="#cfe8f7" stroke="#14213d" strokeWidth="3" />
        </g>
      )}

      {style === 'ranch' && (
        <g>
          <rect x="36" y="86" width="248" height="66" fill={wall} stroke="#14213d" strokeWidth="3" />
          <polygon points="22,90 100,50 220,50 298,90" fill={roof} stroke="#14213d" strokeWidth="3" strokeLinejoin="round" />
          <rect x="196" y="104" width="64" height="48" fill="#bfb7a8" stroke="#14213d" strokeWidth="3" />
          <line x1="196" y1="120" x2="260" y2="120" stroke="#14213d" strokeWidth="2" />
          <line x1="196" y1="136" x2="260" y2="136" stroke="#14213d" strokeWidth="2" />
          <rect x="116" y="106" width="26" height="46" fill={door} stroke="#14213d" strokeWidth="3" />
          <rect x="56" y="104" width="40" height="28" fill="#cfe8f7" stroke="#14213d" strokeWidth="3" />
          <path d="M70 132 L66 150" stroke="#14213d" strokeWidth="2" fill="none" />
        </g>
      )}

      <circle cx="40" cy="128" r="18" fill="#6aa86a" stroke="#14213d" strokeWidth="3" />
      <rect x="37" y="140" width="6" height="12" fill="#6b4a2b" />
    </svg>
  );
}
