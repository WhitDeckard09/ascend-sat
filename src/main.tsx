import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { load } from './store/store'
import './index.css'

load()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* A phone-shaped frame on desktop; edge to edge on an actual phone. */}
    <div className="flex h-full justify-center bg-[#d9d9d9]">
      <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-white shadow-[0_0_40px_rgba(0,0,0,.18)]">
        <App />
      </div>
    </div>
  </StrictMode>,
)
