import React, { useState, useRef, useEffect } from 'react'
import Swal from 'sweetalert2'

export default function CategoriasBarraFiltro({
  categories,
  selectedCategory,
  setSelectedCategory,
  setPage,
  setShowAddCategory,
  showAddCategory,
  setNewCategoryName,
  newCategoryName,
  creatingCategory,
  setCreatingCategory,
  setErrorCreateCategory,
  errorCreateCategory,
  categoryObjects,
  getSelectedCategoryId,
  api,
  setCategories,
  setCategoryObjects
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showCatMenu, setShowCatMenu] = useState(false)
  const dropdownRef = useRef(null)

  // Cerrar el dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
        setShowCatMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="mb-4 w-full flex items-center gap-2 pb-2 border-b border-gray-200 relative z-0">
      {/* Botón fijo para 'Todos los productos' */}
      <button
        className={`px-4 py-1 z-0 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'Todos los productos' ? 'bg-[#F48437] text-white border-[#F48437]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
        style={{ minWidth: 'fit-content' }}
        onClick={() => {
          setSelectedCategory('Todos los productos')
          setPage(1)
        }}
      >
        Todos los productos
      </button>
      {/* Botón para abrir el filtro de categorías */}
      <div className="relative" ref={dropdownRef}>
        <button
          className="px-4 py-1 rounded-full border text-sm font-medium bg-white text-gray-700 border-gray-300 hover:bg-gray-100 flex items-center gap-2 min-w-[140px]"
          onClick={() => setShowDropdown(v => !v)}
          aria-haspopup="listbox"
          aria-expanded={showDropdown}
        >
          <span className="">Filtro por categoría</span>
          <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showDropdown && (
          <ul className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-0 max-h-60 overflow-y-auto" role="listbox">
            {categories.filter(c => c !== 'Todos los productos').map((c, idx) => (
              <li
                key={c}
                className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedCategory === c ? 'bg-[#F48437] text-white' : ''}`}
                onClick={() => {
                  setSelectedCategory(c)
                  setPage(1)
                  setShowDropdown(false)
                }}
                role="option"
                aria-selected={selectedCategory === c}
              >
                <input
                  type="checkbox"
                  checked={selectedCategory === c}
                  readOnly
                  className="accent-[#F48437] w-4 h-4 rounded"
                  tabIndex={-1}
                  style={{ pointerEvents: 'none' }}
                />
                <span className="truncate">{c}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={() => setShowAddCategory(v => !v)}
        className="px-3 py-1 bg-[#066396] text-white rounded-full text-sm ml-2"
        aria-label="Añadir categoría"
      >
        <svg className="w-4 h-4 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Añadir categoría
      </button>
      {/* Menú desplegable de gestión de categorías */}
      {categories.length > 1 && selectedCategory !== 'Todos los productos' && (
        <div className="relative ml-2">
          
          {showCatMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-0">
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-t-lg"
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
                  setShowCatMenu(false)
                }}
              >Editar categoría</button>
              <button
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
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
                  setShowCatMenu(false)
                }}
              >Eliminar categoría</button>
            </div>
          )}
        </div>
      )}
    </div>
    )
}

