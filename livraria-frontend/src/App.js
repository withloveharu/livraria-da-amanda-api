import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Autores from './pages/Autores'
import Livros from './pages/Livros'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <span className="navbar-brand">📚 Livraria da Amanda</span>
        <div className="navbar-links">
          <Link to="/autores">Autores</Link>
          <Link to="/livros">Livros</Link>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/autores" element={<Autores />} />
          <Route path="/livros" element={<Livros />} />
          <Route path="/" element={<Autores />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App