import React, { useState } from 'react'

export default function CrearCategoriaModal({ open, onClose, onCreate, creating, error }) {
  const [nombre, setNombre] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!nombre.trim()) return
    await onCreate(nombre.trim())
    setNombre('')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-[#F48437]/30 p-7 w-full max-w-sm relative animate-modalPop">
        {/* Icono superior */}
        <div className="flex justify-center mb-2">
          <span className="bg-[#F48437] rounded-full p-3 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-[#F48437] text-center mb-4 tracking-tight">Crear nueva categoría</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre de la categoría"
            className="w-full px-3 py-2 rounded-lg border-2 border-[#F48437]/40 focus:border-[#F48437] text-base mb-1 outline-none transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={creating || !nombre.trim()}
            className="w-full px-3 py-2 bg-gradient-to-r from-[#F48437] to-[#066396] text-white rounded-lg text-base font-bold shadow-md hover:scale-[1.03] transition-transform disabled:opacity-50"
          >{creating ? 'Creando...' : 'Crear categoría'}</button>
        </form>
        {error && <div className="text-xs text-red-500 mt-2 text-center">{error}</div>}
        <button className="mt-5 w-full text-sm text-[#066396] hover:underline font-medium" onClick={onClose}>Cancelar</button>
        {/* Animación CSS */}
        <style>{`
          .animate-fadeIn { animation: fadeIn .3s; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-modalPop { animation: modalPop .25s cubic-bezier(.5,1.5,.5,1); }
          @keyframes modalPop { from { transform: scale(.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `}</style>
      </div>
    </div>
  )
}
