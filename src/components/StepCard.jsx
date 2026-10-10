// One due-diligence check. `status` is ok | warn | bad.

const STATUS_TEXT = { ok: 'Passed', warn: 'Costs you', bad: 'Problem' };

export default function StepCard({ title, status, children, impact }) {
  return (
    <article className={`step step-${status}`}>
      <div className="step-head">
        <h3>{title}</h3>
        <span className={`badge badge-${status}`}>{STATUS_TEXT[status]}</span>
      </div>
      <div className="step-body">{children}</div>
      {impact && <p className="step-impact">{impact}</p>}
    </article>
  );
}
