import React, { useMemo, useState } from 'react'

export default function GestionProductos() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const categories = useMemo(() => ['Todas', 'Materiales', 'Herramientas', 'Electricidad', 'Plomería'], [])

  const products = useMemo(() => {
    // datos ficticios
    const arr = []
    for (let i = 1; i <= 42; i++) {
      arr.push({
        id: i,
        name: `Producto ${i}`,
        category: categories[(i % (categories.length - 1)) + 1 - 0],
        price: (Math.random() * 200).toFixed(2),
      })
    }
    return arr
  }, [categories])

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handlePageSize = (e) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }

  return (
    <div className="w-full p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Productos</h1>
          <p className="text-sm text-gray-500">Agregar, filtrar y revisar productos (ficticio)</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 bg-[#F48437] text-white rounded-md">Añadir producto</button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* panel de categorías */}
        <aside className="lg:col-span-1">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Categorías</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => console.log('Añadir categoría')}
                  className="px-3 py-1 bg-[#066396] text-white rounded-md text-sm"
                  aria-label="Añadir categoría"
                >
                  <svg className="w-4 h-4 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Añadir
                </button>
                <button
                  onClick={() => console.log('Editar categoría', selectedCategory)}
                  disabled={selectedCategory === 'Todas'}
                  className={`p-2 rounded ${selectedCategory === 'Todas' ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/5'}`}
                  aria-label="Editar categoría"
                >
                  <svg className="w-4 h-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M4 13v7h7l11-11a2.828 2.828 0 00-4-4L4 13z" />
                  </svg>
                </button>
                <button
                  onClick={() => console.log('Eliminar categoría', selectedCategory)}
                  disabled={selectedCategory === 'Todas'}
                  className={`p-2 rounded ${selectedCategory === 'Todas' ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/5'}`}
                  aria-label="Eliminar categoría"
                >
                  <svg className="w-4 h-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2" role="radiogroup" aria-label="Categorías">
              {categories.map(c => (
                <button
                  key={c}
                  role="radio"
                  aria-checked={selectedCategory === c}
                  onClick={() => { setSelectedCategory(c); setPage(1) }}
                  className={`flex items-center gap-3 text-left px-3 py-2 rounded transition-colors focus:outline-none ${selectedCategory === c ? 'bg-[#F48437] text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  <span className={`w-4 h-4 inline-flex items-center justify-center rounded border ${selectedCategory === c ? 'bg-white text-[#F48437] border-transparent' : 'bg-white/0 border-gray-300'}`}>
                    {selectedCategory === c ? (
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
                      </svg>
                    ) : null}
                  </span>
                  <span className="flex-1 truncate">{c}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* lista de productos (cards apiladas) */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="px-3 py-2 border rounded w-72"
              />
              <div className="flex items-center gap-2 text-sm">
                <label className="text-gray-600">Mostrar:</label>
                <select value={pageSize} onChange={handlePageSize} className="p-2 border rounded">
                  {[10,20,30,40,50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500">{filtered.length} productos encontrados</div>
          </div>

          <div className="space-y-3">
            {pageItems.map(p => (
              <article key={p.id} className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">IMG</div>
                  <div>
                    <h3 className="font-semibold">{p.name}</h3>
                    <div className="text-sm text-gray-500">{p.category} • ${p.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 bg-white/5 text-[#066396] rounded">Editar</button>
                  <button className="px-3 py-2 bg-white/5 text-red-400 rounded">Eliminar</button>
                </div>
              </article>
            ))}
          </div>

          {/* paginación simple */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">Página {page} de {totalPages}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 bg-white/5 rounded">Anterior</button>
              <div className="flex items-center gap-1">
                {Array.from({length: totalPages}).map((_, i) => (
                  <button key={i} onClick={() => setPage(i+1)} className={`w-8 h-8 rounded ${page===i+1 ? 'bg-[#F48437] text-white' : 'bg-white/5'}`}>{i+1}</button>
                ))}
              </div>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} className="px-3 py-1 bg-white/5 rounded">Siguiente</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
