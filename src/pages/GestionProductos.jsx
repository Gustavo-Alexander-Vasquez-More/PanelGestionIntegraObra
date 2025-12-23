import React, { useMemo, useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import CrearProductoModal from '../components/CrearProductoModal'
import EditarProductosModal from '../components/EditarProductosModal'
import api from '../API/Api.jsx'
export default function GestionProductos() {
  const [showCrearProducto, setShowCrearProducto] = useState(false)
  const [showEditarProducto, setShowEditarProducto] = useState(false)
  const [productoAEditar, setProductoAEditar] = useState(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [errorCreateCategory, setErrorCreateCategory] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos los productos')
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState(['Todos los productos'])
  const [categoryObjects, setCategoryObjects] = useState([])
  const getSelectedCategoryId = () => {
    const idx = categories.indexOf(selectedCategory)
    if (idx > 0 && categoryObjects[idx - 1]) return categoryObjects[idx - 1].id
    return null
  }
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [errorCategories, setErrorCategories] = useState(null)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [errorProducts, setErrorProducts] = useState(null)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setLoadingCategories(true)
    api.get('/api/categories')
      .then(res => {
        if (Array.isArray(res.data)) {
          setCategoryObjects(res.data)
          setCategories(['Todos los productos', ...res.data.map(c => c.name || c.nombre || c)]);
        } else {
          setCategories(['Todos los productos'])
          setCategoryObjects([])
        }
        setErrorCategories(null)
      })
      .catch(err => {
        console.log(err)
        setErrorCategories('error.')
        setCategories(['Todos los productos'])
        setCategoryObjects([])
      })
      .finally(() => setLoadingCategories(false))
  }, [])

  useEffect(() => {
    setLoadingProducts(true)
    setErrorProducts(null)
    const params = {
      page: page - 1,
      size: pageSize,
    }
    if (search.trim()) params.searchTerm = search.trim()
    if (selectedCategory && selectedCategory !== 'Todos los productos') params.category = selectedCategory

    api.get('/api/products', {
      params,
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => {
        setProducts(res.data.content || res.data || [])
        setTotalProducts(res.data.totalElements || (Array.isArray(res.data) ? res.data.length : 0))
        setTotalPages(res.data.totalPages || 1)
      })
      .catch(err => {
        setErrorProducts('Error al cargar productos')
        setProducts([])
        setTotalProducts(0)
        setTotalPages(1)
      })
      .finally(() => setLoadingProducts(false))
  }, [page, pageSize, search, selectedCategory])

  const pageItems = products
  const handlePageSize = (e) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }

  return (
    <div className="w-full p-6 space-y-6">
      <header className="flex lg:flex-row flex-col lg:gap-0 gap-5 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Productos</h1>
          <p className="text-sm text-gray-500">Agregar, filtrar y revisar productos</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 bg-[#F48437] text-white rounded-md" onClick={() => setShowCrearProducto(true)}>Añadir producto</button>
        </div>
            <CrearProductoModal
              open={showCrearProducto}
              onClose={() => setShowCrearProducto(false)}
              categories={categoryObjects}
              onCreated={() => {
                setShowCrearProducto(false)
                setPage(1) // Opcional: vuelve a la primera página
                // Forzar recarga de productos
                setLoadingProducts(true)
                setErrorProducts(null)
                api.get('/api/products', {
                  params: {
                    page: 0,
                    size: pageSize,
                    ...(search.trim() ? { searchTerm: search.trim() } : {}),
                    ...(selectedCategory && selectedCategory !== 'Todos los productos' ? { category: selectedCategory } : {})
                  }
                })
                  .then(res => {
                    setProducts(res.data.content || res.data || [])
                    setTotalProducts(res.data.totalElements || (Array.isArray(res.data) ? res.data.length : 0))
                    setTotalPages(res.data.totalPages || 1)
                  })
                  .catch(() => {
                    setErrorProducts('Error al cargar productos')
                    setProducts([])
                    setTotalProducts(0)
                    setTotalPages(1)
                  })
                  .finally(() => setLoadingProducts(false))
              }}
            />
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* panel de categorías */}
        <aside className="lg:col-span-1">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Categorías</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddCategory(v => !v)}
                  className="px-3 py-1 bg-[#066396] text-white rounded-md text-sm"
                  aria-label="Añadir categoría"
                >
                  <svg className="w-4 h-4 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Añadir
                </button>
                <button
                  onClick={async () => {
                    const idx = categories.indexOf(selectedCategory)
                    if (selectedCategory === 'Todos los productos' || idx < 1) return
                    const catObj = categoryObjects[idx - 1]
                    const { value: newName } = await Swal.fire({
                      title: 'Editar categoría',
                      input: 'text',
                      inputValue: selectedCategory,
                      showCancelButton: true,
                      confirmButtonText: 'Editar',
                      cancelButtonText: 'Cancelar',
                      inputValidator: (value) => {
                        if (!value || !value.trim()) {
                          return 'El nombre no puede estar vacío'
                        }
                        return null
                      }
                    })
                    if (newName && newName.trim() && newName !== selectedCategory) {
                      try {
                        await api.put(`/api/categories/${catObj.id}`, { name: newName.trim() })
                        setCategories(prev => prev.map((cat, i) => i === idx ? newName.trim() : cat))
                        setCategoryObjects(prev => prev.map((obj, i) => i === (idx - 1) ? { ...obj, name: newName.trim() } : obj))
                        setSelectedCategory(newName.trim())
                        Swal.fire('Editada', 'La categoría ha sido actualizada.', 'success')
                      } catch (err) {
                        const apiMsg = err?.response?.data?.message
                        Swal.fire('Error', apiMsg || 'Error al editar la categoría', 'error')
                      }
                    }
                  }}
                  disabled={selectedCategory === 'Todos los productos'}
                  className={`p-2 rounded ${selectedCategory === 'Todos los productos' ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/5'}`}
                  aria-label="Editar categoría"
                >
                  <svg className="w-4 h-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M4 13v7h7l11-11a2.828 2.828 0 00-4-4L4 13z" />
                  </svg>
                </button>
                <button
                  onClick={async () => {
                    const id = getSelectedCategoryId()
                    if (!id) return
                    const result = await Swal.fire({
                      title: '¿Estás seguro de eliminar esta categoría?',
                      text: 'Esta acción no se puede revertir.',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#d33',
                      cancelButtonColor: '#3085d6',
                      confirmButtonText: 'Sí, eliminar',
                      cancelButtonText: 'Cancelar',
                    })
                    if (result.isConfirmed) {
                      try {
                        await api.delete(`/api/categories/${id}`)
                        const idx = categories.indexOf(selectedCategory)
                        setCategories(prev => prev.filter((_, i) => i !== idx))
                        setCategoryObjects(prev => prev.filter((_, i) => i !== (idx - 1)))
                        setSelectedCategory('Todos los productos')
                        Swal.fire('Eliminada', 'La categoría ha sido eliminada.', 'success')
                      } catch (err) {
                        Swal.fire('Error', 'Error al eliminar la categoría', 'error')
                      }
                    }
                  }}
                  disabled={selectedCategory === 'Todos los productos'}
                  className={`p-2 rounded ${selectedCategory === 'Todos los productos' ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/5'}`}
                  aria-label="Eliminar categoría"
                >
                  <svg className="w-4 h-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2" role="radiogroup" aria-label="Categorías">
              {showAddCategory && (
                <div className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="Nombre de la categoría"
                    className="w-full px-2 py-1 rounded border border-gray-300 text-xs mb-2"
                  />
                  <button
                    disabled={creatingCategory || !newCategoryName.trim()}
                    onClick={async () => {
                      setCreatingCategory(true)
                      setErrorCreateCategory(null)
                      try {
                        const res = await api.post('/api/categories', { name: newCategoryName })
                        // Si la API responde con la nueva categoría, la agregamos a la lista
                        const nueva = res.data?.name || newCategoryName
                        setCategories(prev => [...prev, nueva])
                        setCategoryObjects(prev => [...prev, res.data])
                        setNewCategoryName('')
                        setShowAddCategory(false)
                        setCreatingCategory(false)
                      } catch (err) {
                        const apiMsg = err?.response?.data?.message
                        setErrorCreateCategory(apiMsg || 'Error al crear categoría')
                        setCreatingCategory(false)
                      }
                    }}
                    className="w-full px-2 py-1 bg-[#F48437] text-white rounded text-xs font-semibold disabled:opacity-50"
                  >Crear categoría</button>
                  {errorCreateCategory && <div className="text-xs text-red-500 mt-1">{errorCreateCategory}</div>}
                </div>
              )}
              {loadingCategories ? (
                <div className="text-gray-400 text-sm">Cargando categorías...</div>
              ) : errorCategories ? (
                <div className="text-red-500 text-sm">{errorCategories}</div>
              ) : (
                categories.map((c, idx) => {
                  return (
                    <button
                      key={c}
                      role="radio"
                      aria-checked={selectedCategory === c}
                      onClick={() => { setSelectedCategory(c); setPage(1) }}
                      className={`flex items-center gap-3 text-left px-3 py-2 rounded transition-colors focus:outline-none text-xs sm:text-sm ${selectedCategory === c ? 'bg-[#F48437] text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
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
                  )
                })
              )}
            </div>
          </div>
        </aside>

        {/* lista de productos (cards apiladas) */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex lg:flex-row flex-col items-center gap-3">
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
            <div className="text-sm text-gray-500">{totalProducts} productos encontrados</div>
          </div>

          <div className="space-y-3">
            {loadingProducts ? (
              <div className="text-gray-400 text-sm">Cargando productos...</div>
            ) : errorProducts ? (
              <div className="text-red-500 text-sm">{errorProducts}</div>
            ) : pageItems.length === 0 ? (
              <div className="text-gray-400 text-sm">No hay productos para mostrar.</div>
            ) : (
              pageItems.map(p => (
                <article key={p.id} className="p-4 bg-white rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden shadow-sm border border-gray-200">
                      {p.cardImageUrl ? (
                        <img src={p.cardImageUrl} alt={p.name} className="object-cover w-full h-full" />
                      ) : 'IMG'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-800 truncate">{p.name}</h3>
                      {p.description && (
                        <div className="text-xs text-gray-500 mb-1 line-clamp-2">{p.description}</div>
                      )}
                      <div className="text-xs text-gray-500 mb-1">
                        <span className="font-medium">SKU:</span> {p.sku ?? '-'}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(Array.isArray(p.categories) && p.categories.length > 0
                          ? p.categories
                          : ['Ninguna']
                        ).map((cat, idx) => (
                          <span key={cat + idx} className="bg-[#F48437]/10 text-[#F48437] px-2 py-0.5 rounded-full text-xs border border-[#F48437]/30 font-medium">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <button
                      className="px-3 py-2 bg-[#066396]/10 text-[#066396] rounded-lg font-semibold hover:bg-[#066396]/20 transition"
                      onClick={() => {
                        setProductoAEditar(p)
                        setShowEditarProducto(true)
                      }}
                    >Editar</button>
                          <EditarProductosModal
                            open={showEditarProducto}
                            onClose={() => setShowEditarProducto(false)}
                            product={productoAEditar}
                            onUpdated={() => {
                              setShowEditarProducto(false)
                              setLoadingProducts(true)
                              setErrorProducts(null)
                              api.get('/api/products', {
                                params: {
                                  page: page - 1,
                                  size: pageSize,
                                  ...(search.trim() ? { searchTerm: search.trim() } : {}),
                                  ...(selectedCategory && selectedCategory !== 'Todos los productos' ? { category: selectedCategory } : {})
                                }
                              })
                                .then(res => {
                                  setProducts(res.data.content || res.data || [])
                                  setTotalProducts(res.data.totalElements || (Array.isArray(res.data) ? res.data.length : 0))
                                  setTotalPages(res.data.totalPages || 1)
                                })
                                .catch(() => {
                                  setErrorProducts('Error al cargar productos')
                                  setProducts([])
                                  setTotalProducts(0)
                                  setTotalPages(1)
                                })
                                .finally(() => setLoadingProducts(false))
                            }}
                          />
                    <button
                      className="px-3 py-2 bg-red-100 text-red-500 rounded-lg font-semibold hover:bg-red-200 transition"
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: '¿Estás seguro de eliminar este producto?',
                          text: 'Esta acción no se puede deshacer.',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonText: 'Sí, eliminar',
                          cancelButtonText: 'Cancelar',
                          confirmButtonColor: '#d33',
                        })
                        if (result.isConfirmed) {
                          try {
                            await api.delete(`/api/products/${p.id}`)
                            Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success')
                            // Recargar productos
                            setLoadingProducts(true)
                            setErrorProducts(null)
                            api.get('/api/products', {
                              params: {
                                page: page - 1,
                                size: pageSize,
                                ...(search.trim() ? { searchTerm: search.trim() } : {}),
                                ...(selectedCategory && selectedCategory !== 'Todos los productos' ? { category: selectedCategory } : {})
                              }
                            })
                              .then(res => {
                                setProducts(res.data.content || res.data || [])
                                setTotalProducts(res.data.totalElements || (Array.isArray(res.data) ? res.data.length : 0))
                                setTotalPages(res.data.totalPages || 1)
                              })
                              .catch(() => {
                                setErrorProducts('Error al cargar productos')
                                setProducts([])
                                setTotalProducts(0)
                                setTotalPages(1)
                              })
                              .finally(() => setLoadingProducts(false))
                          } catch (err) {
                            console.log('Error al eliminar producto:', err)
                            Swal.fire('Error', 'Error al eliminar el producto', 'error')
                          }
                        }
                      }}
                    >Eliminar</button>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* paginación simple */}
          <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 items-center justify-between mt-4">
            <div className="text-sm text-gray-600">Página {page} de {totalPages}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 bg-white/5 rounded" disabled={page === 1}>Anterior</button>
              <div className="flex items-center gap-1">
                {Array.from({length: totalPages}).map((_, i) => (
                  <button key={i} onClick={() => setPage(i+1)} className={`w-8 h-8 rounded ${page===i+1 ? 'bg-[#F48437] text-white' : 'bg-white/5'}`}>{i+1}</button>
                ))}
              </div>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} className="px-3 py-1 bg-white/5 rounded" disabled={page === totalPages}>Siguiente</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
