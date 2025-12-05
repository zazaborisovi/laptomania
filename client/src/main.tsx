// @ts-nocheck
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthProvider from './context/auth.context.tsx'
import { BrowserRouter } from 'react-router'
import LaptopProvider from './context/laptops.context.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <LaptopProvider>
        <App />
      </LaptopProvider>
    </AuthProvider>
  </BrowserRouter>,
)
