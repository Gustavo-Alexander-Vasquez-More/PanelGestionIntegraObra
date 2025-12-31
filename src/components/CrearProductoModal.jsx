import React, { useState, useEffect } from 'react'
import api from '../API/Api'
import { uploadToSupabase } from '../supabase/upload'
import Swal from 'sweetalert2'

export default function CrearProductoModal({ open, onClose, categories, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    cardImageUrl: '', // URL final
    imageFile: null,   // archivo temporal
    sku: '',
    stock: 0,
    description: '',
    tags: '',
    salePrice: '',
    rentPrice: '',
    isForSale: false,
    priceVisibleForSale: false,
    priceVisibleForRent: true,
    categoryIds: [],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Cierra y limpia el formulario
  const handleClose = () => {
    setForm({
      name: '', cardImageUrl: '', sku: '', stock: 0, description: '', tags: '', salePrice: '', rentPrice: '', isForSale: false, priceVisibleForSale: false, priceVisibleForRent: true, categoryIds: []
    })
    setError(null)
    setSubmitting(false)
    onClose && onClose()
  }

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

  const handleCategoryChange = e => {
    const value = Number(e.target.value)
    if (!form.categoryIds.includes(value)) {
      setForm(f => ({ ...f, categoryIds: [...f.categoryIds, value] }))
    }
  }

  const handleRemoveCategory = id => {
    setForm(f => ({ ...f, categoryIds: f.categoryIds.filter(cid => cid !== id) }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      let imageUrl = ''
      // Solo permitir archivo y subir a Supabase
      if (form.imageFile) {
        imageUrl = await uploadToSupabase(form.imageFile)
        if (!imageUrl) {
          setError('No se pudo obtener la URL de la imagen')
          setSubmitting(false)
          return
        }
      } else {
        setError('Debes seleccionar una imagen')
        setSubmitting(false)
        return
      }
      // Crear producto
      const tagsArr = form.tags.split(',').map(t => t.trim()).filter(Boolean)
      const body = {
        ...form,
        cardImageUrl: imageUrl,
        isForRent: true, // Siempre true
        tags: tagsArr.length > 0 ? tagsArr : undefined,
        salePrice: form.salePrice === '' ? null : Number(form.salePrice),
        rentPrice: form.rentPrice === '' ? null : Number(form.rentPrice),
      }
      delete body.categoryIds
      delete body.imageFile
      const res = await api.post('/api/products', body)
      const productId = res.data.id
      // Crear category-details para cada categoría seleccionada
      for (const catId of form.categoryIds) {
        await api.post('/api/category-details', { categoryId: catId, productId })
      }
      Swal.fire('¡Producto creado!', 'El producto se ha creado correctamente.', 'success')
      if (onCreated) onCreated()
      handleClose()
    } catch (err) {
      // Intenta mostrar el mensaje de validación más claro posible
      let apiMsg = err?.response?.data?.message
      // Si el backend manda un objeto con descripción de error
      if (!apiMsg && err?.response?.data?.description) {
        apiMsg = err.response.data.description
      }
      // Si el backend manda un array de errores
      if (!apiMsg && Array.isArray(err?.response?.data)) {
        apiMsg = err.response.data.join(', ')
      }
      setError(apiMsg || 'Error al crear el producto')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-fade-in" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={handleClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl">×</button>
        <h2 className="text-xl font-bold mb-4 text-[#066396]">Crear nuevo producto</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Nombre *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Imagen <span className="text-gray-400 font-normal">(Formatos permitidos: png, jpg, jpeg)</span></label>
            <input type="file" accept="image/*" name="imageFile" onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
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
            <label className="block text-sm font-medium">Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Tags (separados por coma) <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input name="tags" value={form.tags} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
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
          <div>
            <label className="block text-sm font-medium mb-1">Categorías *</label>
            <div className="flex gap-2">
              <select name="categoryIds" value="" onChange={handleCategoryChange} className="border rounded px-3 py-2 flex-1">
                <option value="" disabled>Selecciona una categoría</option>
                {categories && categories.length > 0 && categories
                  .filter(cat => !form.categoryIds.includes(cat.id))
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.categoryIds.map(cid => {
                const cat = categories.find(c => c.id === cid)
                return cat ? (
                  <span key={cid} className="bg-[#F48437]/10 text-[#F48437] px-2 py-1 rounded-full text-xs border border-[#F48437]/30 font-medium flex items-center gap-1">
                    {cat.name}
                    <button type="button" className="ml-1 text-[#F48437] hover:text-red-500" onClick={() => handleRemoveCategory(cid)} title="Quitar categoría">×</button>
                  </span>
                ) : null
              })}
            </div>
            <span className="text-xs text-gray-400 block mt-1">Puedes agregar varias categorías</span>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 rounded bg-gray-100 text-gray-700">Cancelar</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-[#066396] text-white font-semibold disabled:opacity-50">Crear producto</button>
          </div>
        </form>
      </div>
    </div>
  )
}
