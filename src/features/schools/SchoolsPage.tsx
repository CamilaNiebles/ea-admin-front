import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, School as SchoolIcon } from 'lucide-react'
import { useSchools } from './hooks/useSchools'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { School, EducationLevel, SchoolStatus } from './schools.types'

const LIMIT = 10

const levelLabels: Record<EducationLevel, string> = {
  preschool: 'Preescolar',
  elementary: 'Primaria',
  both: 'Preescolar y primaria',
}

const statusVariants: Record<SchoolStatus, 'success' | 'destructive'> = {
  active: 'success',
  inactive: 'destructive',
}

const statusLabels: Record<SchoolStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
}

export default function SchoolsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const organizationId = searchParams.get('organization_id') ?? undefined
  const [page, setPage] = useState(1)

  const { data, isLoading } = useSchools({ organization_id: organizationId, page, limit: LIMIT })

  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

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
      key: 'education_level',
      header: 'Nivel educativo',
      render: (row) => levelLabels[row.education_level],
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => (
        <Badge variant={statusVariants[row.status]}>{statusLabels[row.status]}</Badge>
      ),
    },
    {
      key: 'student_count',
      header: 'Estudiantes',
      render: (row) => row.student_count.toLocaleString('es-CO'),
    },
    {
      key: 'dane_code',
      header: 'Código DANE',
      render: (row) => <span className="font-mono text-xs">{row.dane_code}</span>,
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
        data={data?.data ?? []}
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

      {!isLoading && total > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {total} colegio{total !== 1 ? 's' : ''} en total
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
