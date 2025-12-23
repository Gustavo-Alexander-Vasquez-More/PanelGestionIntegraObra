import React, { useState } from 'react'
import api from '../API/Api'
import { uploadToSupabase } from '../supabase/upload'
import Swal from 'sweetalert2'

export default function EditarProductosModal({ open, onClose, product, onUpdated }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    cardImageUrl: product?.cardImageUrl || '',
    imageFile: null,
    sku: product?.sku || '',
    stock: product?.stock ?? 0,
    description: product?.description || '',
    tags: Array.isArray(product?.tags) ? product.tags : [],
    newTag: '',
    salePrice: product?.salePrice ?? '',
    rentPrice: product?.rentPrice ?? '',
    isForSale: product?.isForSale ?? false,
    isForRent: product?.isForRent ?? true,
    priceVisibleForSale: product?.priceVisibleForSale ?? false,
    priceVisibleForRent: product?.priceVisibleForRent ?? true,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  React.useEffect(() => {
    if (product) {
      setForm(f => ({
        ...f,
        name: product.name || '',
        cardImageUrl: product.cardImageUrl || '',
        imageFile: null,
        sku: product.sku || '',
        stock: product.stock ?? 0,
        description: product.description || '',
        tags: Array.isArray(product.tags) ? product.tags : [],
        newTag: '',
        salePrice: product.salePrice ?? '',
        rentPrice: product.rentPrice ?? '',
        isForSale: product.isForSale ?? false,
        isForRent: product.isForRent ?? true,
        priceVisibleForSale: product.priceVisibleForSale ?? false,
        priceVisibleForRent: product.priceVisibleForRent ?? true,
      }))
    }
  }, [product])

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
      if (form.name !== product.name) patch.name = form.name
      if (imageUrl !== product.cardImageUrl) patch.cardImageUrl = imageUrl
      if (form.sku !== product.sku) patch.sku = form.sku
      if (form.stock !== product.stock) patch.stock = Number(form.stock)
      if (form.description !== product.description) patch.description = form.description
      // Tags: solo si hay diferencia
      if (JSON.stringify(form.tags) !== JSON.stringify(product.tags)) patch.tags = form.tags
      if (form.salePrice !== product.salePrice) patch.salePrice = form.salePrice === '' ? null : Number(form.salePrice)
      if (form.rentPrice !== product.rentPrice) patch.rentPrice = form.rentPrice === '' ? null : Number(form.rentPrice)
      if (form.isForSale !== product.isForSale) patch.isForSale = form.isForSale
      if (form.isForRent !== product.isForRent) patch.isForRent = form.isForRent
      if (form.priceVisibleForSale !== product.priceVisibleForSale) patch.priceVisibleForSale = form.priceVisibleForSale
      if (form.priceVisibleForRent !== product.priceVisibleForRent) patch.priceVisibleForRent = form.priceVisibleForRent
      if (Object.keys(patch).length === 0) {
        setError('No hay cambios para guardar')
        setSubmitting(false)
        return
      }
      await api.patch(`/api/products/${product.id}`, patch)
      Swal.fire('¡Producto actualizado!', 'Los cambios se han guardado.', 'success')
      if (onUpdated) onUpdated()
      onClose && onClose()
    } catch (err) {
      console.log('Error al editar producto:', err)
      let apiMsg = err?.response?.data?.message
      if (!apiMsg && err?.response?.data?.description) apiMsg = err.response.data.description
      if (!apiMsg && Array.isArray(err?.response?.data)) apiMsg = err.response.data.join(', ')
      setError(apiMsg || 'Error al editar el producto')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-fade-in" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl">×</button>
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
