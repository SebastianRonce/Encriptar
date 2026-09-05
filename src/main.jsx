import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import './components/Navbar/Navbar.css'
import './components/Footer/Footer.css'
import './components/Alert/Alert.css'
import './components/SecurityMeter/SecurityMeter.css'
import './components/Tabs/Tabs.css'
import './components/StepGuide/StepGuide.css'
import './components/PasswordAnalyzer/PasswordAnalyzer.css'
import './components/PasswordGenerator/PasswordGenerator.css'
import './components/ComplexNumberVisualizer/ComplexNumberVisualizer.css'
import './pages/Home/Home.css'
import './pages/About/About.css'
import './pages/PasswordSecurity/PasswordSecurity.css'

const container = document.getElementById('root')

createRoot(container).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)