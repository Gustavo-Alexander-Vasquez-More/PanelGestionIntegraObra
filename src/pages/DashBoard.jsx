import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

export default function DashBoard() {
  const stats = [
    { id: 1, title: 'Notas de Remisión', value: 42, bg: 'bg-[#F48437]', action: 'Ver notas', href: '/notas-remision' },
    { id: 2, title: 'Rentas', value: 15, bg: 'bg-blue-500', action: 'Ver rentas', href: '/rentas', vencidas: 3 },
    { id: 3, title: 'Clientes', value: 128, bg: 'bg-[#066396]', action: 'Ver clientes', href: '/gestion-clientes', sinIne: 7 },
    { id: 4, title: 'Productos', value: 87, bg: 'bg-purple-600', action: 'Ver productos', href: '/gestion-productos', sinStock: 5 },
    { id: 5, title: 'Usuarios', value: 12, bg: 'bg-green-500', action: 'Ver usuarios', href: '/usuarios' },
    { id: 6, title: 'Ingresos del Mes', value: '$8,400', bg: 'bg-amber-500', action: 'Ver ingresos', href: '/ingresos', totalNotas: 5400, totalRentas: 3000 },
  ]

  const activities = [
    { id: 1, text: 'María creó la tarea "Revisión estructural"', time: '2h' },
    { id: 2, text: 'Proyecto "Edificio A" actualizado', time: '6h' },
    { id: 3, text: 'Usuario nuevo: Carlos', time: '1d' },
  ]

  return (
    <div className="w-full px-6">
      {/* Aviso tipo noticiero */}
      <div className="w-full overflow-hidden mb-2 relative h-[38px]">
        <div className="absolute left-0 top-0 flex whitespace-nowrap animate-marquee-continuous text-sm font-medium text-blue-900 bg-blue-100 rounded px-3 py-1 items-center gap-2 shadow-sm min-w-full">
          <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
          {[...activities, ...activities].map((a, i) => (
            <span key={a.id + '-' + i} className="mx-6 inline-block">
              <span className="font-semibold text-blue-700">{a.text}</span>
              <span className="ml-2 text-xs text-blue-400">({a.time} atrás)</span>
            </span>
          ))}
        </div>
      </div>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Vista general rápida de la actividad y métricas</p>
        </div>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.id} className={`p-5 rounded-xl shadow-md flex flex-col items-start justify-between ${s.bg} text-white min-h-[130px] relative`}>
            <div className="w-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base font-semibold">{s.title}</span>
                {s.title === 'Clientes' && s.sinIne > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold animate-pulse border border-yellow-300 ml-1" title="Clientes sin INE">
                    <svg className="w-3.5 h-3.5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zm-9-4v4" /></svg>
                    {s.sinIne} sin INE
                  </span>
                )}
                {s.title === 'Productos' && s.sinStock > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold animate-pulse border border-pink-300 ml-1" title="Productos sin stock">
                    <svg className="w-3.5 h-3.5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zm-9-4v4" /></svg>
                    {s.sinStock} sin stock
                  </span>
                )}
                {s.title === 'Rentas' && s.vencidas > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-200 text-red-800 text-xs font-semibold animate-pulse border border-red-400 ml-1" title="Rentas vencidas">
                    <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zm-9-4v4" /></svg>
                    {s.vencidas} vencidas · ¡Revisar!
                  </span>
                )}
              </div>
              {s.title === 'Ingresos del Mes' ? (
                <div className="flex flex-row items-end gap-6 mb-4 w-full justify-between">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-white/80">Total Notas</span>
                    <span className="text-lg font-bold">${s.totalNotas?.toLocaleString() ?? '0'}</span>
                  </div>
                  <span className="h-8 w-px bg-white/30 rounded-full" />
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-white/80">Total Rentas</span>
                    <span className="text-lg font-bold">${s.totalRentas?.toLocaleString() ?? '0'}</span>
                  </div>
                  <span className="h-8 w-px bg-white/30 rounded-full" />
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-white/80">Total</span>
                    <span className="text-2xl font-extrabold">${((s.totalNotas ?? 0) + (s.totalRentas ?? 0)).toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-bold mb-4">{s.value}</div>
              )}
            </div>
            <a href={s.href} className="mt-auto px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 text-white font-medium text-xs transition-colors shadow-sm">{s.action}</a>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gráfico Notas de Remisión */}
        <div className="p-4 rounded-lg bg-white shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-3">Notas de Remisión</h2>
          <Bar
            data={{
              labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
              datasets: [
                {
                  label: 'Notas',
                  data: [12, 19, 14, 17, 22, 15, 20, 18, 21, 16, 19, 23],
                  backgroundColor: '#F48437',
                  borderRadius: 6,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false }, title: { display: false } },
              scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' }, beginAtZero: true } },
            }}
            height={180}
          />
        </div>
        {/* Gráfico Rentas */}
        <div className="p-4 rounded-lg bg-white shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-3">Rentas</h2>
          <Bar
            data={{
              labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
              datasets: [
                {
                  label: 'Rentas',
                  data: [8, 11, 9, 13, 10, 12, 14, 13, 12, 15, 11, 14],
                  backgroundColor: '#2563eb',
                  borderRadius: 6,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false }, title: { display: false } },
              scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' }, beginAtZero: true } },
            }}
            height={180}
          />
        </div>
        {/* Gráfico Ingresos del Mes */}
        <div className="p-4 rounded-lg bg-white shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-3">Ingresos del Mes</h2>
          <Line
            data={{
              labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
              datasets: [
                {
                  label: 'Notas de Remisión',
                  data: [1200, 1900, 1400, 1700, 2200, 1500, 2000, 1800, 2100, 1600, 1900, 2300],
                  borderColor: '#F48437',
                  backgroundColor: 'rgba(244,132,55,0.1)',
                  tension: 0.4,
                  fill: true,
                },
                {
                  label: 'Rentas',
                  data: [800, 1100, 900, 1300, 1000, 1200, 1400, 1300, 1200, 1500, 1100, 1400],
                  borderColor: '#2563eb',
                  backgroundColor: 'rgba(37,99,235,0.1)',
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: true }, title: { display: false } },
              scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' }, beginAtZero: true } },
            }}
            height={180}
          />
        </div>
      </section>
    </div>
  )
}
