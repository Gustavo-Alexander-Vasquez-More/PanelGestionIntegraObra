import React, { useState } from 'react'
import Swal from 'sweetalert2'

import api from '../../API/Api'
import { uploadToSupabase } from '../../supabase/upload'

export default function CreateClientModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    phone: '',
    reputation: '',
    frontPhotoIne: null,
    backPhotoIne: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validación: nombre debe tener al menos dos palabras
    const nombreValido = form.nombre.trim().split(/\s+/).length >= 2;
    if (!nombreValido) {
      setError('Por favor ingresa el nombre completo (mínimo dos palabras).');
      return;
    }

    setLoading(true);
    try {
      // Subir fotos a Supabase si existen
      let frontPhotoUrl = '';
      let backPhotoUrl = '';
      if (form.frontPhotoIne) {
        frontPhotoUrl = await uploadToSupabase(form.frontPhotoIne);
      }
      if (form.backPhotoIne) {
        backPhotoUrl = await uploadToSupabase(form.backPhotoIne);
      }

      // Construir el payload JSON con claves en inglés
      const payload = {
        name: form.nombre,
        phone: form.phone,
      };
      if (form.email) payload.email = form.email;
      if (form.reputation) payload.reputation = form.reputation;
      if (frontPhotoUrl) payload.frontPhotoIne = frontPhotoUrl;
      if (backPhotoUrl) payload.backPhotoIne = backPhotoUrl;

      const res = await api.post('/api/clients', payload);
      setSuccess(true);
      // Llama a onCreated si está definido, pasando el cliente creado
      if (onCreated && typeof onCreated === 'function') {
        onCreated(res.data);
      }
      // Swal de éxito
      await Swal.fire({
        icon: 'success',
        title: 'Cliente creado',
        text: 'El cliente se ha creado correctamente.',
        timer: 1500,
        showConfirmButton: false
      });
      setForm({ nombre: '', email: '', phone: '', reputation: '', frontPhotoIne: null, backPhotoIne: null });
      setSuccess(false);
      onClose();
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || 'Error al crear cliente');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Crear Cliente</h2>
        <form className="space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo<span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Nombre completo"
              required
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Correo electrónico (opcional)"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono <span className="text-red-500">*</span></label>
            <input
              type="tel"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Número de teléfono"
              required
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reputación <span className="text-gray-400 font-normal">(opcional)</span></label>
            <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={form.reputation}
              onChange={e => setForm(f => ({ ...f, reputation: e.target.value }))}
            >
              <option value="">Sin reputación</option>
              <option value="CUMPLIDOR">Cumplidor</option>
              <option value="MOROSO">Moroso</option>
            </select>
          </div>
          <div>
            <p className="text-xs text-red-600 mb-2 font-semibold">¡Atención! Las fotos del INE son opcionales, pero pueden ser requeridas para generar una renta o nota de remisión.</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto INE (frente) <span className='text-gray-400 font-normal'>(opcional)</span></label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded px-3 py-2"
              onChange={e => setForm(f => ({ ...f, frontPhotoIne: e.target.files[0] }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto INE (reverso) <span className='text-gray-400 font-normal'>(opcional)</span></label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded px-3 py-2"
              onChange={e => setForm(f => ({ ...f, backPhotoIne: e.target.files[0] }))}
            />
          </div>
          {error && <div className="text-red-600 text-sm font-semibold text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm font-semibold text-center">Cliente creado correctamente</div>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-[#066396] text-white font-semibold hover:bg-[#04496b] disabled:opacity-60" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
