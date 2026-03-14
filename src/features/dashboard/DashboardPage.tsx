import { Building2, School, Users, Activity } from 'lucide-react'

interface StatCard {
  label: string
  icon: React.ReactNode
}

const stats: StatCard[] = [
  { label: 'Total Organizaciones', icon: <Building2 size={20} className="text-blue-500" /> },
  { label: 'Total Colegios', icon: <School size={20} className="text-green-500" /> },
  { label: 'Total Estudiantes', icon: <Users size={20} className="text-purple-500" /> },
  { label: 'Total Sesiones', icon: <Activity size={20} className="text-orange-500" /> },
]

// TODO: fetch real stats when aggregation endpoints are available
export default function DashboardPage() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">—</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
