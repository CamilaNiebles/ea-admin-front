import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Building2 } from 'lucide-react'
import { useOrganizations } from './hooks/useOrganizations'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Organization, OrgPlan, OrgStatus } from './organizations.types'

const LIMIT = 10

const planLabels: Record<OrgPlan, string> = {
  semilla: 'Semilla',
  arbol: 'Árbol',
  bosque: 'Bosque',
  campus: 'Campus',
}

const planVariants: Record<OrgPlan, 'default' | 'success' | 'warning' | 'secondary'> = {
  semilla: 'secondary',
  arbol: 'default',
  bosque: 'success',
  campus: 'warning',
}

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
  const [page, setPage] = useState(1)
  const { data, isLoading } = useOrganizations({ page, limit: LIMIT })

  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  const columns: Column<Organization>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'nit',
      header: 'NIT',
      render: (row) => row.nit,
    },
    {
      key: 'city',
      header: 'Ciudad',
      render: (row) => row.city,
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (row) => (
        <Badge variant={planVariants[row.plan]}>{planLabels[row.plan]}</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => (
        <Badge variant={statusVariants[row.status]}>{statusLabels[row.status]}</Badge>
      ),
    },
    {
      key: 'max_students',
      header: 'Máx. estudiantes',
      render: (row) => row.max_students.toLocaleString('es-CO'),
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
        data={data?.data ?? []}
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
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {total} organización{total !== 1 ? 'es' : ''} en total
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
