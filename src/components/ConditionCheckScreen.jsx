import { LISTINGS } from '../data/listings.js';

const RISK_LABEL = {
  low: 'LOW RISK',
  medium: 'WATCH THIS',
  high: 'HIGH RISK',
  critical: 'RED FLAG',
};

export default function ConditionCheckScreen({ state, dispatch }) {
  const listing = LISTINGS[state.round];
  const answers = state.conditionAnswers;
  const answered = Object.keys(answers).length;
  const correct = listing.checks.filter((c) => answers[c.id] === c.correct).length;
  const complete = answered === listing.checks.length;

  return (
    <section className="panel check-screen">
      <div className="mission-head">
        <div>
          <span className="eyebrow">PRE-BUY MISSION</span>
          <h2>Run the condition check</h2>
          <p className="lead">
            The listing looks exciting. Your job is to slow down and read what could cost you later.
            Review all four files before you decide what the house is actually worth to you.
          </p>
        </div>
        <div className="mission-score" aria-live="polite">
          <span>Buyer IQ</span>
          <strong>+{correct * 10}</strong>
          <small>{answered}/{listing.checks.length} files reviewed</small>
        </div>
      </div>

      <div className="case-grid">
        {listing.checks.map((check, index) => {
          const choice = answers[check.id];
          const done = Boolean(choice);
          const right = choice === check.correct;
          return (
            <article key={check.id} className={`case-card risk-${done ? check.risk : 'locked'} ${done ? 'revealed' : ''}`}>
              <div className="case-top">
                <span className="case-number">FILE {index + 1}</span>
                <span className="case-icon" aria-hidden="true">{check.icon}</span>
              </div>
              <h3>{check.title}</h3>
              <p className="case-clue">{check.clue}</p>
              <p className="case-question"><strong>{check.question}</strong></p>

              <div className="case-options" role="group" aria-label={check.question}>
                {check.options.map((option) => {
                  const selected = choice === option.id;
                  const optionRight = option.id === check.correct;
                  const cls = [
                    'case-option',
                    selected ? 'selected' : '',
                    done && optionRight ? 'correct' : '',
                    done && selected && !optionRight ? 'wrong' : '',
                  ].join(' ');
                  return (
                    <button
                      type="button"
                      key={option.id}
                      className={cls}
                      disabled={done}
                      onClick={() => dispatch({ type: 'ANSWER_CHECK', id: check.id, choice: option.id })}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {done && (
                <div className={`case-feedback ${right ? 'good' : 'bad'}`} role="status">
                  <div className="risk-row">
                    <strong>{right ? '✓ Good read' : '✕ Risk missed'}</strong>
                    <span className={`risk-pill risk-${check.risk}`}>{RISK_LABEL[check.risk]}</span>
                  </div>
                  <p>{check.lesson}</p>
                  {check.protection && (
                    <p className="protection-note">🛡️ Relevant protection: <strong>{check.protection} contingency</strong></p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="detective-tip">
        <span aria-hidden="true">🧠</span>
        <p><strong>Game rule:</strong> the seller gives you an asking price; your job is to decide whether the condition of the house supports it. Every clue should influence what you are willing to pay.</p>
      </div>

      <div className="footer">
        <button className="btn" onClick={() => dispatch({ type: 'RUSH_TO_PRICE' })}>Skip inspection and price now</button>
        <button className="btn primary" disabled={!complete} onClick={() => dispatch({ type: 'GO_INSPECT' })}>
          {complete ? 'Use the clues to inspect →' : `Review ${listing.checks.length - answered} more file${listing.checks.length - answered === 1 ? '' : 's'}`}
        </button>
      </div>
    </section>
  );
}
