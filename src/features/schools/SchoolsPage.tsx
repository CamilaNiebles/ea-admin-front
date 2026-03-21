import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, School as SchoolIcon } from 'lucide-react'
import { useSchools } from './hooks/useSchools'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { School, SchoolStatus } from './schools.types'

const statusVariants: Record<SchoolStatus, 'success' | 'destructive' | 'warning'> = {
  active: 'success',
  inactive: 'destructive',
  trial: 'warning',
}

const statusLabels: Record<SchoolStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  trial: 'Prueba',
}

export default function SchoolsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const organizationId = searchParams.get('organization_id') ?? undefined

  const { data, isLoading } = useSchools({ organization_id: organizationId })

  const columns: Column<School>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'city',
      header: 'Ciudad',
      render: (row) => row.city,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => (
        <Badge variant={statusVariants[row.status]}>{statusLabels[row.status]}</Badge>
      ),
    },
    {
      key: 'planEndDate',
      header: 'Fin de plan',
      render: (row) => new Date(row.planEndDate).toLocaleDateString('es-CO'),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          className="text-xs text-primary hover:underline"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/dashboard/schools/${row.id}`)
          }}
        >
          Ver detalle
        </button>
      ),
    },
  ]

  return (
    <div className="p-6">
      <PageHeader
        title="Colegios"
        description="Gestiona los colegios registrados en la plataforma."
        action={
          <button
            onClick={() =>
              navigate(
                organizationId
                  ? `/dashboard/schools/new?organization_id=${organizationId}`
                  : '/dashboard/schools/new'
              )
            }
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo colegio
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`/dashboard/schools/${row.id}`)}
        emptyState={
          <EmptyState
            icon={<SchoolIcon className="h-10 w-10" />}
            title="Sin colegios"
            description="Crea el primer colegio para comenzar."
          />
        }
      />
    </div>
  )
}
