import { useNavigate } from 'react-router-dom'
import { Plus, Building2 } from 'lucide-react'
import { useOrganizations } from './hooks/useOrganizations'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Organization, OrgStatus } from './organizations.types'

const statusLabels: Record<OrgStatus, string> = {
  active: 'Activa',
  suspended: 'Suspendida',
  trial: 'Prueba',
}

const statusVariants: Record<OrgStatus, 'success' | 'destructive' | 'warning'> = {
  active: 'success',
  suspended: 'destructive',
  trial: 'warning',
}

export default function OrganizationsPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useOrganizations()

  const total = data?.length ?? 0

  const columns: Column<Organization>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'nit',
      header: 'NIT',
      render: (row) => row.nit ?? '—',
    },
    {
      key: 'city',
      header: 'Ciudad',
      render: (row) => row.city ?? '—',
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => (
        <Badge variant={statusVariants[row.status]}>{statusLabels[row.status]}</Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          className="text-xs text-primary hover:underline"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/dashboard/organizations/${row.id}`)
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
        title="Organizaciones"
        description="Gestiona las organizaciones educativas registradas en la plataforma."
        action={
          <button
            onClick={() => navigate('/dashboard/organizations/new')}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva organización
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`/dashboard/organizations/${row.id}`)}
        emptyState={
          <EmptyState
            icon={<Building2 className="h-10 w-10" />}
            title="Sin organizaciones"
            description="Crea la primera organización para comenzar."
          />
        }
      />

      {!isLoading && total > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          {total} organización{total !== 1 ? 'es' : ''} en total
        </div>
      )}
    </div>
  )
}
