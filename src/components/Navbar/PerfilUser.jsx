import React, { useState, useRef, useEffect } from 'react'

export default function PerfilUser() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const name = 'Juan Pérez'
  const email = 'juan.perez@example.com'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-3 px-3 py-1 rounded-md hover:bg-white/5 transition"
      >
        <div className="w-10 h-10 rounded-full bg-[#066396] flex items-center justify-center text-white font-semibold">JP</div>
        <div className="text-left">
          <div className="text-white font-medium text-sm">{name}</div>
          <div className="text-white/70 text-xs truncate" style={{maxWidth: 160}}>{email}</div>
        </div>
        <svg
          className={`w-4 h-4 text-white ml-1 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white/5 backdrop-blur-sm rounded-md shadow-lg py-1 z-50">
          <button className="w-full text-left px-4 py-2 text-white hover:bg-white/10" onClick={() => console.log('Ir a perfil')}>Mi perfil</button>
          <button className="w-full text-left px-4 py-2 text-white hover:bg-white/10" onClick={() => console.log('Ajustes')}>Ajustes</button>
          <div className="border-t border-white/10 my-1" />
          <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5" onClick={() => console.log('Cerrar sesión')}>Cerrar sesión</button>
        </div>
      )}
    </div>
  )
}
