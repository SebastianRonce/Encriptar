const ICONS = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '⛔'
}

const CLASS_NAMES = {
  info: 'alert alert-info',
  success: 'alert alert-success',
  warning: 'alert alert-warning',
  error: 'alert alert-error'
}

export default function Alert({ variant = 'info', title, children, style }) {
  return (
    <div className={CLASS_NAMES[variant]} role="alert" style={style}>
      <span className="alert-icon" aria-hidden="true">
        {ICONS[variant]}
      </span>
      <div>
        {title && <strong>{title}</strong>}
        {children && <span>{children}</span>}
      </div>
    </div>
  )
}