import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' // 👈 Importamos el componente de enrutamiento

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* 👈 Envolvemos la App con el Router */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)