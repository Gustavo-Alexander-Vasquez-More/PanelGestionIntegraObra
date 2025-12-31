// Export por defecto para compatibilidad legacy
export default MenuHamburguesa;

import React from 'react'

export function MenuHamburguesa({ onClick }) {
  return (
    <button
      className="p-2 focus:outline-none"
      aria-label="Abrir menú de navegación"
      onClick={onClick}
    >
      <svg className="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )
}

export function MenuPanelLateral({ open, setOpen }) {
  if (!open) return null
  return (
    <div>
      {/* Fondo oscuro desenfocado para cerrar */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setOpen(false)}
        aria-label="Cerrar menú"
      />
      {/* Panel */}
      <aside
        className="fixed top-0 left-0 z-50 bg-[#066396] w-72 max-w-full h-screen shadow-2xl transition-transform duration-300 ease-in-out transform translate-x-0 border-r border-[#04496b]/40"
        style={{boxShadow:'0 8px 32px 0 rgba(2,30,60,0.25)'}}
      >
        <button
          className="absolute top-4 right-4 p-2 text-white hover:text-[#F48437] transition-colors"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Logo y separador */}
        <div className="flex flex-col items-center mt-8 mb-2">
          <img src="/logoMenu.webp" alt="Logo" className="w-20 h-20 mb-2 drop-shadow-lg" />
          <div className="w-16 h-1 bg-gradient-to-r from-[#F48437]/70 to-white/10 rounded-full mb-2" />
        </div>
        <nav className="px-6">
          <ul className="space-y-2 mt-4">
            <li>
              <a href="/Dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#F48437]/90 hover:text-white font-medium transition-colors group">
                <svg className="w-5 h-5 text-[#F48437] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" /></svg>
                Dashboard
              </a>
            </li>
            <li>
              <a href="/notas-remision" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#F48437]/90 hover:text-white font-medium transition-colors group">
                <svg className="w-5 h-5 text-[#F48437] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Notas de Remisión
              </a>
            </li>
            <li>
              <a href="/rentas" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#F48437]/90 hover:text-white font-medium transition-colors group">
                <svg className="w-5 h-5 text-[#F48437] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3v2a1 1 0 001 1h4a1 1 0 001-1v-2h3a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1z" /></svg>
                Rentas
              </a>
            </li>
            <li>
              <a href="/mis-ingresos" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#F48437]/90 hover:text-white font-medium transition-colors group">
                <svg className="w-5 h-5 text-[#F48437] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V6a2 2 0 012-2h12a2 2 0 012 2v8c0 2.21-3.582 4-8 4z" /></svg>
                Mis ingresos
              </a>
            </li>
            <li>
              <a href="/gestion-productos" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#F48437]/90 hover:text-white font-medium transition-colors group">
                <svg className="w-5 h-5 text-[#F48437] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" /></svg>
                Productos y categorías
              </a>
            </li>
            <li>
              <a href="/gestion-clientes" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-[#F48437]/90 hover:text-white font-medium transition-colors group">
                <svg className="w-5 h-5 text-[#F48437] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Clientes
              </a>
            </li>
          </ul>
          {/* Cerrar sesión */}
          <div className="mt-8 border-t border-white/10 pt-4">
            <button
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-red-500/90 hover:text-white font-medium transition-colors w-full group"
              onClick={() => {/* Aquí va la lógica de logout */}}
            >
              <svg className="w-5 h-5 text-red-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
              Cerrar sesión
            </button>
          </div>
        </nav>
        <div className="absolute bottom-0 left-0 w-full p-4 text-xs text-white/60 text-center select-none">
          IntegraObra &copy; 2025
        </div>
      </aside>
    </div>
  )
}
