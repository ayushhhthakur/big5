import React from 'react'
import ReactDOM from 'react-dom/client'
import { EmbedTest } from './components/EmbedTest'
import './index.css'

ReactDOM.createRoot(document.getElementById('big-five-embed')!).render(
  <React.StrictMode>
    <EmbedTest />
  </React.StrictMode>,
)
