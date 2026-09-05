import './StepGuide.css'

export default function StepGuide({ title, steps }) {
  return (
    <div className="step-guide">
      {title && <strong className="step-guide-title">{title}</strong>}
      <ol>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  )
}