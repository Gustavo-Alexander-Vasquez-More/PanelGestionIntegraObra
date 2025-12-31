import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import EditarProductosModal from './EditarProductosModal'

export default function ProductoCard({
  producto,
  setLoadingProducts,
  setErrorProducts,
  setProducts,
  setTotalProducts,
  setTotalPages,
  page,
  pageSize,
  search,
  selectedCategory,
  getSelectedCategoryId,
  api
}) {
  const [showEditModal, setShowEditModal] = useState(false)
    // Removed categories state and useEffect for fetching categories

  const handleEditar = () => {
    setShowEditModal(true)
  }

  const handleEliminar = async () => {
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
        await api.delete(`/api/products/${producto.id}`)
        Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success')
        setLoadingProducts(true)
        setErrorProducts(null)
        api.get('/api/products/search', {
          params: {
            page: page - 1,
            size: pageSize,
            ...(search.trim() ? { searchTerm: search.trim() } : {}),
            ...(selectedCategory && selectedCategory !== 'Todos los productos' ? { categoryId: getSelectedCategoryId() } : {})
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
        Swal.fire('Error', 'Error al eliminar el producto', 'error')
      }
    }
  }

  return (
    <article className="p-4 bg-white rounded-xl shadow-md flex flex-col sm:flex-row items-center sm:items-stretch gap-4 border border-gray-100 hover:shadow-lg transition-shadow w-full">
      {/* Imagen a la izquierda */}
      <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 overflow-hidden shadow-sm border border-gray-200 min-w-[8rem] min-h-[8rem]">
        {producto.cardImageUrl ? (
          <img src={producto.cardImageUrl} alt={producto.name} className="object-cover w-full h-full" />
        ) : (
          <span className="text-3xl font-bold text-gray-300">IMG</span>
        )}
      </div>
      {/* Datos a la derecha */}
      <div className="flex-1 min-w-0 flex flex-col justify-start">
        <h3 className="font-semibold text-lg text-gray-800 truncate mb-1">{producto.name}</h3>
        {producto.description && (
          <div className="text-xs text-gray-500 mb-1 line-clamp-2">{producto.description}</div>
        )}
        <div className="flex flex-wrap gap-2 items-center mb-1">
          <span className="text-xs text-gray-500"><span className="font-medium">SKU:</span> {producto.sku ?? '-'}</span>
          <span className="text-xs text-gray-500"><span className="font-medium">Stock:</span> {producto.stock ?? '-'}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
            {(Array.isArray(producto.categories) && producto.categories.length > 0
              ? producto.categories.map(cat => (
                  <span key={cat.categoryDetailId} className="bg-[#F48437]/10 text-[#F48437] px-2 py-0.5 rounded-full text-xs border border-[#F48437]/30 font-medium">
                    {cat.name}
                  </span>
                ))
              : [<span key="ninguna" className="bg-[#F48437]/10 text-[#F48437] px-2 py-0.5 rounded-full text-xs border border-[#F48437]/30 font-medium">Ninguna</span>]
            )}
        </div>
      </div>
      {/* Botones al final */}
      <div className="flex flex-row sm:flex-col flex-wrap items-center justify-center gap-2 mt-3 sm:mt-0 sm:justify-end">
        <button
          className="px-4 py-2 bg-[#066396]/10 text-[#066396] rounded-lg font-semibold hover:bg-[#066396]/20 transition w-full sm:w-auto text-base"
          onClick={handleEditar}
        >
          <span className="inline-block align-middle mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M4 13v7h7l11-11a2.828 2.828 0 00-4-4L4 13z" />
            </svg>
          </span>
          Editar
        </button>
        <button
          className="px-4 py-2 bg-red-100 text-red-500 rounded-lg font-semibold hover:bg-red-200 transition w-full sm:w-auto text-base"
          onClick={handleEliminar}
        >
          <span className="inline-block align-middle mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3" />
            </svg>
          </span>
          Eliminar
        </button>
        {showEditModal && (
          <EditarProductosModal
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
            productId={producto.id}
            existingCategoryObjects={producto.categories}
            onUpdated={() => {
              setShowEditModal(false)
              setLoadingProducts(true)
              setErrorProducts(null)
              api.get('/api/products/search', {
                params: {
                  page: page - 1,
                  size: pageSize,
                  ...(search.trim() ? { searchTerm: search.trim() } : {}),
                  ...(selectedCategory && selectedCategory !== 'Todos los productos' ? { categoryId: getSelectedCategoryId() } : {})
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
        )}
      </div>
    </article>
  )
}
