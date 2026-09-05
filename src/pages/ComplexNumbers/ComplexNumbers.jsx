import ComplexNumberVisualizer from '../../components/ComplexNumberVisualizer/ComplexNumberVisualizer.jsx'
import StepGuide from '../../components/StepGuide/StepGuide.jsx'

export default function ComplexNumbers() {
  return (
    <div>
      <header className="page-header">
        <h1>Números complejos</h1>
        <p>
          Un número complejo se compone de una parte real y una parte
          imaginaria. Se representa como <code className="mono">z = a + bi</code>,
          donde <code className="mono">i² = -1</code>. Aquí puedes
          visualizarlo y operar con él.
        </p>
      </header>

      <ComplexNumberVisualizer />

      <StepGuide
        title="Conceptos clave"
        steps={[
          'Parte real (a): el valor en el eje horizontal',
          'Parte imaginaria (b): el valor en el eje vertical, multiplicado por la unidad imaginaria i.',
          'Módulo |z|: la distancia del punto al origen, igual a √(a² + b²).',
          'Conjugado z̄: se cambia el signo de la parte imaginaria (a - bi).',
          'En el cifrado educativo, la multiplicación y la división de complejos transforman cada carácter del mensaje usando una clave.'
        ]}
      />
    </div>
  )
}