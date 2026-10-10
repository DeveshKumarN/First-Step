import { WAIVER_VALUE } from '../utils/auction.js';
import { money } from '../utils/finance.js';

const WAIVED_NOTE = {
  inspection: 'No inspection at all. Every hidden problem becomes yours after you move in.',
};

const COPY = {
  inspection: {
    title: 'Inspection',
    keep: 'You get an inspection of 5 of the 8 areas. Then you can ask for repairs or credits, or walk away.',
  },
  appraisal: {
    title: 'Appraisal',
    keep: 'If the appraiser values the house below your price, you can renegotiate or walk away.',
  },
  financing: {
    title: 'Financing',
    keep: 'If your loan or cash falls through, you can walk away with your earnest money.',
  },
};

export default function ContingencyRow({ kind, waived, onChange }) {
  const copy = COPY[kind];
  return (
    <div className="cont-row">
      <div className="cont-text">
        <strong>{copy.title} contingency</strong>
        <p>
          {waived
            ? `Waived. Worth ${money(WAIVER_VALUE[kind])} to the seller. ${WAIVED_NOTE[kind] || 'You are on your own if it goes wrong.'}`
            : copy.keep}
        </p>
      </div>
      <div className="segmented" role="group" aria-label={`${copy.title} contingency`}>
        <button className={!waived ? 'seg active' : 'seg'} aria-pressed={!waived} onClick={() => onChange(false)}>Keep</button>
        <button className={waived ? 'seg active warn' : 'seg'} aria-pressed={waived} onClick={() => onChange(true)}>Waive</button>
      </div>
    </div>
  );
}
