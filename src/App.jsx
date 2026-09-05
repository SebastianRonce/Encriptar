import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Encrypt from './pages/Encrypt/Encrypt.jsx'
import Decrypt from './pages/Decrypt/Decrypt.jsx'
import PasswordSecurity from './pages/PasswordSecurity/PasswordSecurity.jsx'
import ComplexNumbers from './pages/ComplexNumbers/ComplexNumbers.jsx'
import About from './pages/About/About.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/encrypt" element={<Encrypt />} />
          <Route path="/decrypt" element={<Decrypt />} />
          <Route path="/password" element={<PasswordSecurity />} />
          <Route path="/complex" element={<ComplexNumbers />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}