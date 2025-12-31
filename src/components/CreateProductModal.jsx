import React, { useState } from 'react'
import CrearProductoModal from './CrearProductoModal'

export default function CreateProductModal({
  open,
  onClose,
  categories,
  onCreated,
  pageSize,
  search,
  selectedCategory,
  getSelectedCategoryId,
  api,
  setProducts,
  setTotalProducts,
  setTotalPages,
  setLoadingProducts,
  setErrorProducts,
  setPage
}) {
  // Solo renderiza el modal de creación y maneja la recarga de productos al crear
  return (
    <CrearProductoModal
      open={open}
      onClose={onClose}
      categories={categories}
      onCreated={() => {
        onClose && onClose();
        setPage && setPage(1);
        setLoadingProducts && setLoadingProducts(true);
        setErrorProducts && setErrorProducts(null);
        api.get('/api/products/search', {
          params: {
            page: 0,
            size: pageSize,
            ...(search && search.trim() ? { searchTerm: search.trim() } : {}),
            ...(selectedCategory && selectedCategory !== 'Todos los productos' ? { categoryId: getSelectedCategoryId() } : {})
          }
        })
          .then(res => {
            setProducts && setProducts(res.data.content || res.data || [])
            setTotalProducts && setTotalProducts(res.data.totalElements || (Array.isArray(res.data) ? res.data.length : 0))
            setTotalPages && setTotalPages(res.data.totalPages || 1)
          })
          .catch(() => {
            setErrorProducts && setErrorProducts('Error al cargar productos')
            setProducts && setProducts([])
            setTotalProducts && setTotalProducts(0)
            setTotalPages && setTotalPages(1)
          })
          .finally(() => setLoadingProducts && setLoadingProducts(false))
      }}
    />
  )
}
