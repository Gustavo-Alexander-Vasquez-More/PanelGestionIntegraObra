import React from 'react'

export default function ProductoCard({ producto, onEditar, onEliminar }) {
  return (
    <article className="p-4 bg-white rounded-xl shadow-md flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4 border border-gray-100 hover:shadow-lg transition-shadow w-full">
      <div className="flex flex-col xs:flex-row items-center gap-4 w-full md:w-auto">
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden shadow-sm border border-gray-200 min-w-[5rem] min-h-[5rem]">
          {producto.cardImageUrl ? (
            <img src={producto.cardImageUrl} alt={producto.name} className="object-cover w-full h-full" />
          ) : 'IMG'}
        </div>
        <div className="flex-1 min-w-0 text-center md:text-left">
          <h3 className="font-semibold text-lg text-gray-800 truncate">{producto.name}</h3>
          {producto.description && (
            <div className="text-xs text-gray-500 mb-1 line-clamp-2">{producto.description}</div>
          )}
          <div className="text-xs text-gray-500 mb-1">
            <span className="font-medium">SKU:</span> {producto.sku ?? '-'}
          </div>
          <div className="flex flex-wrap gap-1 mt-1 justify-center md:justify-start">
            {(Array.isArray(producto.categories) && producto.categories.length > 0
              ? producto.categories
              : ['Ninguna']
            ).map((cat, idx) => (
              <span key={cat + idx} className="bg-[#F48437]/10 text-[#F48437] px-2 py-0.5 rounded-full text-xs border border-[#F48437]/30 font-medium">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center gap-2 mt-3 md:mt-0 md:flex-col md:justify-end">
        <button
          className="px-3 py-2 bg-[#066396]/10 text-[#066396] rounded-lg font-semibold hover:bg-[#066396]/20 transition w-full md:w-auto"
          onClick={onEditar}
        >Editar</button>
        <button
          className="px-3 py-2 bg-red-100 text-red-500 rounded-lg font-semibold hover:bg-red-200 transition w-full md:w-auto"
          onClick={onEliminar}
        >Eliminar</button>
      </div>
    </article>
  )
}
