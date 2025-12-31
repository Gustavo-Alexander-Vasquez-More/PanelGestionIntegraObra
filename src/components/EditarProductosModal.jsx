
import React, { use, useEffect, useState } from 'react'
import api from '../API/Api'
import { uploadToSupabase } from '../supabase/upload'
import Swal from 'sweetalert2'

export default function EditarProductosModal({ open, onClose, productId, onUpdated, existingCategoryObjects = [] }) {
    const [loading, setLoading] = useState(false)
  const [originalProduct, setOriginalProduct] = useState(null)
  const [form, setForm] = useState({
      
    name: '',
    cardImageUrl: '',
    imageFile: null,
    sku: '',
    stock: 0,
    description: '',
    tags: [],
    newTag: '',
    salePrice: '',
    rentPrice: '',
    isForSale: false,
    isForRent: true,
    priceVisibleForSale: false,
    priceVisibleForRent: true,
  })
  const [allCategories, setAllCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  // Las categorías ya agregadas se reciben como prop
  const [removedCategoryDetailIds, setRemovedCategoryDetailIds] = useState([])

  // Handler para quitar una categoría ya agregada
  const handleRemoveExistingCategory = (categoryDetailId) => {
    setRemovedCategoryDetailIds(ids => [...ids, categoryDetailId])
  }

  // Fetch de todas las categorías al abrir el modal
  useEffect(() => {
    if (open) {
      setLoadingCategories(true)
      api.get('/api/categories')
        .then(res => {
          setAllCategories(Array.isArray(res.data) ? res.data : [])
        })
        .catch(() => setAllCategories([]))
        .finally(() => setLoadingCategories(false))
      setSelectedCategoryIds([])
      setRemovedCategoryDetailIds([])
      // No se hace fetch de categorías existentes, se usan las recibidas por prop
    }
  }, [open])
  // Handler para agregar categoría seleccionada
  const handleAddCategory = e => {
    const value = Number(e.target.value)
    if (value && !selectedCategoryIds.includes(value)) {
      setSelectedCategoryIds(ids => [...ids, value])
    }
  }

  // Handler para quitar categoría
  const handleRemoveCategory = id => {
    setSelectedCategoryIds(ids => ids.filter(cid => cid !== id))
  }

  useEffect(() => {
    if (productId) {
      setLoading(true)
      api.get(`/api/products/${productId}`)
        .then(res => {
          const prod = res.data
          setOriginalProduct(prod)
          setForm({
            name: prod.name || '',
            cardImageUrl: prod.cardImageUrl || '',
            imageFile: null,
            sku: prod.sku || '',
            stock: prod.stock ?? 0,
            description: prod.description || '',
            tags: Array.isArray(prod.tags) ? prod.tags : [],
            newTag: '',
            salePrice: prod.salePrice ?? '',
            rentPrice: prod.rentPrice ?? '',
            isForSale: prod.isForSale ?? false,
            isForRent: prod.isForRent ?? true,
            priceVisibleForSale: prod.priceVisibleForSale ?? false,
            priceVisibleForRent: prod.priceVisibleForRent ?? true,
          })
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [productId])



  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)



  const handleChange = e => {
    const { name, value, type, checked, files } = e.target
    if (name === 'imageFile') {
      setForm(f => ({ ...f, imageFile: files[0] }))
    } else {
      setForm(f => ({
        ...f,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleAddTag = () => {
    const tag = form.newTag.trim()
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag], newTag: '' }))
    }
  }

  const handleRemoveTag = tag => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      let imageUrl = form.cardImageUrl
      if (form.imageFile) {
        imageUrl = await uploadToSupabase(form.imageFile)
        if (!imageUrl) {
          setError('No se pudo obtener la URL de la imagen')
          setSubmitting(false)
          return
        }
      }
      // Solo enviar campos que cambiaron respecto al producto original
      const patch = {}
      if (!originalProduct) {
        setError('No se pudo cargar el producto original')
        setSubmitting(false)
        return
      }
      if (form.name !== originalProduct.name) patch.name = form.name
      if (imageUrl !== originalProduct.cardImageUrl) patch.cardImageUrl = imageUrl
      if (form.sku !== originalProduct.sku) patch.sku = form.sku
      if (form.stock !== originalProduct.stock) patch.stock = Number(form.stock)
      if (form.description !== originalProduct.description) patch.description = form.description
      // Tags: solo si hay diferencia
      if (JSON.stringify(form.tags) !== JSON.stringify(originalProduct.tags)) patch.tags = form.tags
      if (form.salePrice !== originalProduct.salePrice) patch.salePrice = form.salePrice === '' ? null : Number(form.salePrice)
      if (form.rentPrice !== originalProduct.rentPrice) patch.rentPrice = form.rentPrice === '' ? null : Number(form.rentPrice)
      if (form.isForSale !== originalProduct.isForSale) patch.isForSale = form.isForSale
      if (form.isForRent !== originalProduct.isForRent) patch.isForRent = form.isForRent
      if (form.priceVisibleForSale !== originalProduct.priceVisibleForSale) patch.priceVisibleForSale = form.priceVisibleForSale
      if (form.priceVisibleForRent !== originalProduct.priceVisibleForRent) patch.priceVisibleForRent = form.priceVisibleForRent
      if (Object.keys(patch).length === 0 && selectedCategoryIds.length === 0 && removedCategoryDetailIds.length === 0) {
        setError('No hay cambios para guardar')
        setSubmitting(false)
        return
      }
      // Usar siempre el id del producto que se pasó al abrir el modal
      await api.patch(`/api/products/${productId}`, patch)

      // Crear category-details para cada categoría seleccionada
      for (const categoryId of selectedCategoryIds) {
        await api.post('/api/category-details', { productId, categoryId })
      }

      // Eliminar category-details para cada categoría quitada
      for (const detailId of removedCategoryDetailIds) {
        await api.delete(`/api/category-details/${detailId}`)
      }

      Swal.fire('¡Producto actualizado!', 'Los cambios se han guardado.', 'success')
      if (onUpdated) onUpdated()
      onClose && onClose()
    } catch (err) {
      let apiMsg = err?.response?.data?.message
      if (!apiMsg && err?.response?.data?.description) apiMsg = err.response.data.description
      if (!apiMsg && Array.isArray(err?.response?.data)) apiMsg = err.response.data.join(', ')
      setError(apiMsg || 'Error al editar el producto')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  if (loading || !originalProduct) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000033]">
        <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-2xl p-6 relative animate-fade-in flex flex-col items-center justify-center" style={{ maxHeight: '90vh', minHeight: 500, minWidth: 350, overflowY: 'auto' }}>
          <div className="flex flex-col items-center justify-center h-full w-full" style={{ minHeight: 350 }}>
            <svg className="animate-spin h-14 w-14 text-[#066396] mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-[#066396] font-semibold text-lg">Cargando producto...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000033]">
      <div className="bg-white rounded-xl shadow-xl w-[90%] p-6 relative animate-fade-in" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        {submitting && (
          <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center" style={{backdropFilter: 'blur(2px)'}}>
            <svg className="animate-spin h-12 w-12 text-[#066396] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-[#066396] font-semibold text-lg">Guardando cambios...</span>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-[#F48437] text-white hover:bg-[#d96a1c] transition-colors rounded-full w-12 h-12 flex items-center justify-center shadow-lg text-3xl font-bold border-4 border-white z-10"
          title="Cerrar"
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#066396]">Editar producto</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Nombre *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Imagen <span className="text-gray-400 font-normal">(Formatos permitidos: png, jpg, jpeg)</span></label>
            <input type="file" accept="image/*" name="imageFile" onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
            {form.cardImageUrl && !form.imageFile && (
              <div className="mt-2"><img src={form.cardImageUrl} alt="preview" className="h-24 rounded" /></div>
            )}
            {form.imageFile && (
              <div className="mt-2"><img src={URL.createObjectURL(form.imageFile)} alt="preview" className="h-24 rounded" /></div>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium">SKU *</label>
              <input name="sku" value={form.sku} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium">Stock *</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Descripción *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full border rounded px-3 py-2 mt-1" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Tags <span className="text-gray-400 font-normal">(opcional)</span></label>
            <div className="flex gap-2 mb-2">
              <input name="newTag" value={form.newTag} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Agregar tag" />
              <button type="button" onClick={handleAddTag} className="px-3 py-2 bg-[#066396] text-white rounded">Agregar</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map(tag => (
                <span key={tag} className="bg-[#F48437]/10 text-[#F48437] px-2 py-1 rounded-full text-xs border border-[#F48437]/30 font-medium flex items-center gap-1">
                  {tag}
                  <button type="button" className="ml-1 text-[#F48437] hover:text-red-500" onClick={() => handleRemoveTag(tag)} title="Quitar tag">×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {form.isForSale && (
              <div className="flex-1">
                <label className="block text-sm font-medium">Precio venta</label>
                <input name="salePrice" type="number" min="0" step="0.01" value={form.salePrice} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
              </div>
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium">Precio renta</label>
              <input name="rentPrice" type="number" min="0" step="0.01" value={form.rentPrice} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
          </div>
          <div className="flex gap-2">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="isForSale" checked={form.isForSale} onChange={handleChange} /> Venta
            </label>
            {form.isForSale && (
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" name="priceVisibleForSale" checked={form.priceVisibleForSale} onChange={handleChange} /> Mostrar precio venta
              </label>
            )}
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="priceVisibleForRent" checked={form.priceVisibleForRent} onChange={handleChange} /> Mostrar precio renta
            </label>
          </div>
          {/* Selector de categorías para agregar */}
          <div>
            <label className="block text-sm font-medium mb-1">Agregar categoría</label>
            <select className="w-full border rounded px-3 py-2" disabled={loadingCategories || allCategories.length === 0} onChange={handleAddCategory} value="">
              <option value="">{loadingCategories ? 'Cargando categorías...' : 'Selecciona una categoría'}</option>
              {allCategories
                .filter(cat =>
                  !selectedCategoryIds.includes(cat.id) &&
                  !(Array.isArray(existingCategoryObjects) && existingCategoryObjects.some(ec => ec.categoryDetailId === cat.id))
                )
                .map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            {/* Mostrar categorías seleccionadas */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategoryIds.map(cid => {
                const cat = allCategories.find(c => c.id === cid)
                return cat ? (
                  <span key={cid} className="bg-[#F48437]/10 text-[#F48437] px-2 py-1 rounded-full text-xs border border-[#F48437]/30 font-medium flex items-center gap-1">
                    {cat.name}
                    <button type="button" className="ml-1 text-[#F48437] hover:text-red-500" onClick={() => handleRemoveCategory(cid)} title="Quitar categoría">×</button>
                  </span>
                ) : null
              })}
            </div>
            {/* Mostrar categorías ya agregadas al producto */}
            <div className="flex flex-wrap gap-2 mt-4">
              {Array.isArray(existingCategoryObjects) && existingCategoryObjects.length > 0 && (
                <span className="text-xs text-gray-500 w-full">Categorías ya agregadas:</span>
              )}
              {Array.isArray(existingCategoryObjects) && existingCategoryObjects
                .filter(catObj => !removedCategoryDetailIds.includes(catObj.categoryDetailId))
                .map(catObj => (
                  <span key={catObj.categoryDetailId} className="bg-[#066396]/10 text-[#066396] px-2 py-1 rounded-full text-xs border border-[#066396]/30 font-medium flex items-center gap-1">
                    {catObj.name}
                    <button type="button" className="ml-1 text-[#066396] hover:text-red-500 font-bold" title="Quitar categoría"
                      onClick={() => handleRemoveExistingCategory(catObj.categoryDetailId)}>
                      ×
                    </button>
                  </span>
                ))}
            </div>
            <span className="text-xs text-gray-400 block mt-1">Puedes agregar varias categorías</span>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-700">Cancelar</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-[#066396] text-white font-semibold disabled:opacity-50">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  )
}
