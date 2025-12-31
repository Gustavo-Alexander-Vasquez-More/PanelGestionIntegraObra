import React, { useState, useEffect } from 'react'
import api from '../API/Api'
import CreateClientModal from '../components/clients/CreateClientModal'

export default function GestionClientes() {
  // Estados para clientes ficticios, paginación y búsqueda
  const [clientes, setClientes] = useState([])
  const [totalClientes, setTotalClientes] = useState(0)
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [errorClientes, setErrorClientes] = useState(null)
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(5)
  const [page, setPage] = useState(1)
  const [showCrearCliente, setShowCrearCliente] = useState(false)

  // Cargar clientes desde la API paginada
  useEffect(() => {
    setLoadingClientes(true)
    setErrorClientes(null)
    api.get('/api/clients/all-clients', {
      params: {
        page: page - 1,
        size: pageSize,
        // El backend puede soportar búsqueda, si no, filtrar en frontend
      }
    })
      .then(res => {
        const content = res.data.content || []
        setClientes(content)
        setTotalClientes(res.data.totalElements || content.length)
      })
      .catch(() => {
        setErrorClientes('Error al cargar clientes')
        setClientes([])
        setTotalClientes(0)
      })
      .finally(() => setLoadingClientes(false))
  }, [page, pageSize])

  // Filtrado por búsqueda (solo frontend)
  const clientesFiltrados = search.trim()
    ? clientes.filter(c =>
        (c.name || c.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.phone || c.telefono || '').includes(search) ||
        (c.email || c.correo || '').toLowerCase().includes(search.toLowerCase())
      )
    : clientes
  const totalPages = Math.ceil((search.trim() ? clientesFiltrados.length : totalClientes) / pageSize)
  const pageItems = clientesFiltrados.slice(0, pageSize)

  const handlePageSize = (e) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }

  return (
    <div className="w-full p-6 space-y-6">
      <header className="flex lg:flex-row flex-col lg:gap-0 gap-5 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
          <p className="text-sm text-gray-500">Agregar, buscar y revisar clientes</p>
        </div>
      </header>

      <main className="w-full">
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex lg:flex-row flex-col items-center gap-3">
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="px-3 py-2 border rounded w-72"
              />
              <div className="flex items-center gap-2 text-sm">
                <label className="text-gray-600">Mostrar:</label>
                <select value={pageSize} onChange={handlePageSize} className="p-2 border rounded">
                  {[5,10,15,20].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <div className="text-sm text-gray-500">de {clientesFiltrados.length} clientes encontrados</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-3 py-2 bg-[#F48437] text-white rounded-md" onClick={() => setShowCrearCliente(true)}>Añadir cliente</button>
            </div>
            <CreateClientModal 
              open={showCrearCliente} 
              onClose={() => setShowCrearCliente(false)}
              onCreated={() => {
                // Refrescar la página actual de clientes tras crear uno nuevo
                setLoadingClientes(true)
                api.get('/api/clients/all-clients', {
                  params: {
                    page: page - 1,
                    size: pageSize,
                  }
                })
                  .then(res => {
                    const content = res.data.content || []
                    setClientes(content)
                    setTotalClientes(res.data.totalElements || content.length)
                  })
                  .catch(() => {
                    setErrorClientes('Error al cargar clientes')
                    setClientes([])
                    setTotalClientes(0)
                  })
                  .finally(() => setLoadingClientes(false))
              }}
            />
          </div>

          {/* paginación simple abajo */}
        </section>
        {/* Cards de clientes */}
        <div className="space-y-3 mt-6">
          {loadingClientes ? (
            <div className="text-gray-400 text-sm">Cargando clientes...</div>
          ) : errorClientes ? (
            <div className="text-red-500 text-sm">{errorClientes}</div>
          ) : pageItems.length === 0 ? (
            <div className="text-gray-400 text-sm">No hay clientes para mostrar.</div>
          ) : (
            pageItems.map(cliente => (
              <div key={cliente.id} className="flex items-center gap-4 bg-white rounded shadow p-4">
                {/* SVG de cliente neutro */}
                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 19.125a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21c-2.676 0-5.216-.584-7.499-1.875z" />
                  </svg>
                </div>
                {/* Datos del cliente */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mt-1 mb-1">
                    {(cliente.reputation === 'MOROSO' || cliente.reputacion === 'MOROSO') && (
                      <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium border border-red-200 text-xs" style={{fontSize:'0.70rem'}}>Moroso</span>
                    )}
                    {(cliente.reputation === 'CUMPLIDOR' || cliente.reputacion === 'CUMPLIDOR') && (
                      <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium border border-green-200 text-xs" style={{fontSize:'0.70rem'}}>Cumplidor</span>
                    )}
                    {(!cliente.reputation && !cliente.reputacion) && (
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 text-xs" style={{fontSize:'0.70rem'}}>Sin reputación</span>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#F48437]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15l2.25-2.25a1.5 1.5 0 00-.375-2.414l-4.125-2.062a1.5 1.5 0 00-1.636.176l-1.125.9a12.035 12.035 0 01-5.25-5.25l.9-1.125a1.5 1.5 0 00.176-1.636L5.914 3.375A1.5 1.5 0 003.5 3.75L2.25 6z" />
                    </svg>
                    <a href={`tel:${cliente.phone || cliente.telefono || ''}`} className="hover:underline" title="Llamar">{cliente.phone || cliente.telefono || ''}</a>
                  </div>
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#F48437]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.879 1.775l-7.5 5.625a2.25 2.25 0 01-2.742 0l-7.5-5.625A2.25 2.25 0 012.25 6.993V6.75" />
                    </svg>
                    <a href={`mailto:${cliente.email || cliente.correo || ''}`} className="hover:underline" title="Enviar correo">{cliente.email || cliente.correo || ''}</a>
                  </div>
                </div>
                {/* Botones editar y eliminar */}
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Editar</button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Eliminar</button>
                  <button className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">Revisar actividad</button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* paginación simple abajo */}
        <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 items-center justify-between mt-4">
          <div className="text-sm text-gray-600">Página {page} de {totalPages}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 bg-white/5 rounded" disabled={page === 1}>Anterior</button>
            <div className="flex items-center gap-1">
              {(() => {
                const btns = [];
                const maxBtns = 5;
                const showFirst = page > 3;
                const showLast = page < totalPages - 2;
                if (showFirst) {
                  btns.push(<button key={1} onClick={() => setPage(1)} className={`w-8 h-8 rounded ${page===1 ? 'bg-[#F48437] text-white' : 'bg-white/5'}`}>1</button>);
                  if (page > 4) btns.push(<span key="start-ellipsis" className="px-1">...</span>);
                }
                let start = Math.max(1, page-2);
                let end = Math.min(totalPages, page+2);
                if (page <= 3) end = Math.min(totalPages, 5);
                if (page >= totalPages-2) start = Math.max(1, totalPages-4);
                for (let i = start; i <= end; i++) {
                  if (i === 1 && showFirst) continue;
                  if (i === totalPages && showLast) continue;
                  btns.push(<button key={i} onClick={() => setPage(i)} className={`w-8 h-8 rounded ${page===i ? 'bg-[#F48437] text-white' : 'bg-white/5'}`}>{i}</button>);
                }
                if (showLast) {
                  if (page < totalPages-3) btns.push(<span key="end-ellipsis" className="px-1">...</span>);
                  btns.push(<button key={totalPages} onClick={() => setPage(totalPages)} className={`w-8 h-8 rounded ${page===totalPages ? 'bg-[#F48437] text-white' : 'bg-white/5'}`}>{totalPages}</button>);
                }
                return btns;
              })()}
            </div>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} className="px-3 py-1 bg-white/5 rounded" disabled={page === totalPages}>Siguiente</button>
          </div>
        </div>
      </main>
    </div>
  )
}