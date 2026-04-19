import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// HashRouter is required for GitHub Pages — it doesn't support
// HTML5 history API routing on static hosts (BrowserRouter would
// 404 on direct URL access). Hash-based routing works everywhere.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
