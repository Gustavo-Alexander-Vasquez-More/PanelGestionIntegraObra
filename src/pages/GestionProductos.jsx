import React, { useMemo, useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import CreateProductModal from '../components/CreateProductModal'
import CategoriasBarraFiltro from '../components/CategoriasBarraFiltro'
import EditarProductosModal from '../components/EditarProductosModal'
import CrearCategoriaModal from '../components/CrearCategoriaModal'
import api from '../API/Api.jsx'
import ProductoCard from '../components/ProductoCard'
export default function GestionProductos() {
  const [productIdAEditar, setProductIdAEditar] = useState(null)
  const [showCrearProducto, setShowCrearProducto] = useState(false)
  const [showEditarProducto, setShowEditarProducto] = useState(false)
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
    if (selectedCategory && selectedCategory !== 'Todos los productos') params.categoryId = getSelectedCategoryId()

    api.get('/api/products/search', {
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
        
      </header>

      <main className="w-full">
        <CategoriasBarraFiltro
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setPage={setPage}
          setShowAddCategory={setShowAddCategory}
          showAddCategory={showAddCategory}
          setNewCategoryName={setNewCategoryName}
          newCategoryName={newCategoryName}
          creatingCategory={creatingCategory}
          setCreatingCategory={setCreatingCategory}
          setErrorCreateCategory={setErrorCreateCategory}
          errorCreateCategory={errorCreateCategory}
          categoryObjects={categoryObjects}
          getSelectedCategoryId={getSelectedCategoryId}
          api={api}
          setCategories={setCategories}
          setCategoryObjects={setCategoryObjects}
        />
        <CrearCategoriaModal
          open={showAddCategory}
          onClose={() => { setShowAddCategory(false); setNewCategoryName('') }}
          creating={creatingCategory}
          error={errorCreateCategory}
          onCreate={async (nombre) => {
            setCreatingCategory(true)
            setErrorCreateCategory(null)
            try {
              const res = await api.post('/api/categories', { name: nombre })
              const nueva = res.data?.name || nombre
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
        />
        {/* lista de productos (cards apiladas) */}
        <section className="space-y-4">
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
                <div className="text-sm text-gray-500">de {totalProducts} productos encontrados</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
          <button className="px-3 py-2 bg-[#F48437] text-white rounded-md" onClick={() => setShowCrearProducto(true)}>Añadir producto</button>
        </div>
            <CreateProductModal
              open={showCrearProducto}
              onClose={() => setShowCrearProducto(false)}
              categories={categoryObjects}
              onCreated={() => {}}
              pageSize={pageSize}
              search={search}
              selectedCategory={selectedCategory}
              getSelectedCategoryId={getSelectedCategoryId}
              api={api}
              setProducts={setProducts}
              setTotalProducts={setTotalProducts}
              setTotalPages={setTotalPages}
              setLoadingProducts={setLoadingProducts}
              setErrorProducts={setErrorProducts}
              setPage={setPage}
            />
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
                <ProductoCard
                  key={p.id}
                  producto={p}
                  setProductIdAEditar={setProductIdAEditar}
                  setShowEditarProducto={setShowEditarProducto}
                  setLoadingProducts={setLoadingProducts}
                  setErrorProducts={setErrorProducts}
                  setProducts={setProducts}
                  setTotalProducts={setTotalProducts}
                  setTotalPages={setTotalPages}
                  page={page}
                  pageSize={pageSize}
                  search={search}
                  selectedCategory={selectedCategory}
                  getSelectedCategoryId={getSelectedCategoryId}
                  api={api}
                />
              ))
            )}
          </div>

          {/* paginación simple */}
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
        </section>
      </main>
    </div>
  )
}
