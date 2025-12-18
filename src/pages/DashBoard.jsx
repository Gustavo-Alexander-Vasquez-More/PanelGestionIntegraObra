import React from 'react'

export default function DashBoard() {
  const stats = [
    { id: 1, title: 'Proyectos', value: 24, bg: 'bg-[#F48437]' },
    { id: 2, title: 'Tareas pendientes', value: 12, bg: 'bg-[#066396]' },
    { id: 3, title: 'Usuarios', value: 128, bg: 'bg-green-500' },
    { id: 4, title: 'Ingresos', value: '$8.4k', bg: 'bg-amber-500' },
  ]

  const activities = [
    { id: 1, text: 'María creó la tarea "Revisión estructural"', time: '2h' },
    { id: 2, text: 'Proyecto "Edificio A" actualizado', time: '6h' },
    { id: 3, text: 'Usuario nuevo: Carlos', time: '1d' },
  ]

  return (
    <div className="w-full p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel de control</h1>
          <p className="text-sm text-gray-500">Vista general rápida de la actividad y métricas</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 bg-[#F48437] text-white rounded-md">Crear proyecto</button>
          <button className="px-3 py-1 bg-white/5 text-gray-700 rounded-md">Filtros</button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.id} className={`p-4 rounded-lg shadow-sm flex items-center gap-4 ${s.bg} text-white`}>
            <div className="p-3 bg-white/20 rounded-md">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" stroke="none" fill="rgba(255,255,255,0.12)" />
              </svg>
            </div>
            <div>
              <div className="text-sm opacity-90">{s.title}</div>
              <div className="text-2xl font-bold">{s.value}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-4 rounded-lg bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Visión general</h2>
            <div className="h-56 rounded-md bg-gradient-to-r from-gray-100 to-gray-50 flex items-center justify-center text-gray-400">Gráfico de líneas (placeholder)</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white shadow-sm">
              <h3 className="text-sm font-semibold mb-2">Tareas completadas</h3>
              <div className="h-40 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">Gráfico (placeholder)</div>
            </div>
            <div className="p-4 rounded-lg bg-white shadow-sm">
              <h3 className="text-sm font-semibold mb-2">Actividad reciente</h3>
              <ul className="space-y-2">
                {activities.map(a => (
                  <li key={a.id} className="flex justify-between text-sm text-gray-600">
                    <span>{a.text}</span>
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="p-4 rounded-lg bg-white shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Acciones rápidas</h3>
            <div className="flex flex-col gap-2">
              <button className="w-full text-left px-3 py-2 bg-white/5 rounded">Nueva tarea</button>
              <button className="w-full text-left px-3 py-2 bg-white/5 rounded">Subir documentos</button>
              <button className="w-full text-left px-3 py-2 bg-white/5 rounded">Generar reporte</button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white shadow-sm">
            <h3 className="text-sm font-semibold mb-3">Resumen rápido</h3>
            <div className="text-sm text-gray-600">Proyectos activos: <span className="font-medium">8</span></div>
            <div className="text-sm text-gray-600">Alertas: <span className="font-medium text-red-400">2</span></div>
            <div className="text-sm text-gray-600">Usuarios en línea: <span className="font-medium">5</span></div>
          </div>
        </aside>
      </section>
    </div>
  )
}
