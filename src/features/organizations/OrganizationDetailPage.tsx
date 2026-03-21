import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, X, Check, School } from 'lucide-react'
import axios from 'axios'
import { useOrganization } from './hooks/useOrganizations'
import { useUpdateOrganization } from './hooks/useOrganizationsMutations'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { FormField, selectClass } from '@/components/ui/FormField'
import type { OrgStatus, UpdateOrganizationDto } from './organizations.types'


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

interface EditForm {
  status: OrgStatus
}

export default function OrganizationDetailPage() {
  const { organizationId } = useParams<{ organizationId: string }>()
  const navigate = useNavigate()
  const { data: org, isLoading } = useOrganization(organizationId ?? '')
  const updateMutation = useUpdateOrganization(organizationId ?? '')

  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  function startEdit() {
    if (!org) return
    setEditForm({ status: org.status })
    setEditing(true)
    setServerError(null)
  }

  function cancelEdit() {
    setEditing(false)
    setEditForm(null)
    setServerError(null)
  }

  function handleSave() {
    if (!editForm) return
    const dto: UpdateOrganizationDto = {
      status: editForm.status,
    }
    updateMutation.mutate(dto, {
      onSuccess: () => {
        setEditing(false)
        setEditForm(null)
      },
      onError: (err) => {
        const msg = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? 'Error inesperado')
          : 'Error inesperado'
        setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg))
      },
    })
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-4 w-64 rounded bg-muted animate-pulse" />
        <div className="h-40 rounded-lg bg-muted animate-pulse" />
      </div>
    )
  }

  if (!org) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Organización no encontrada.</p>
      </div>
    )
  }

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('es-CO') : '—'

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/dashboard/organizations')}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a organizaciones
        </button>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-foreground">{org.name}</h1>
            <Badge variant={statusVariants[org.status]}>{statusLabels[org.status]}</Badge>
          </div>
          {!editing && (
            <button
              onClick={startEdit}
              className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </button>
          )}
        </div>
      </div>

      {/* Info general */}
      <div className="rounded-lg border border-border bg-background p-5">
        <h2 className="text-base font-medium text-foreground mb-4">Información general</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">NIT</dt>
            <dd className="font-medium mt-0.5">{org.nit}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Ciudad</dt>
            <dd className="font-medium mt-0.5">{org.city}, {org.country}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Correo de contacto</dt>
            <dd className="font-medium mt-0.5 break-all">{org.email ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Teléfono</dt>
            <dd className="font-medium mt-0.5">{org.telephoneNumber ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Creada</dt>
            <dd className="font-medium mt-0.5">{formatDate(org.createdAt)}</dd>
          </div>
        </dl>
      </div>

      {/* Formulario de edición */}
      {editing && editForm && (
        <div className="rounded-lg border border-border bg-background p-5 space-y-4">
          <h2 className="text-base font-medium text-foreground">Editar organización</h2>
          <div className="max-w-xs">
            <FormField label="Estado" required>
              {(id) => (
                <select
                  id={id}
                  className={selectClass}
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((prev) => prev ? { ...prev, status: e.target.value as OrgStatus } : prev)
                  }
                >
                  <option value="active">Activa</option>
                  <option value="suspended">Suspendida</option>
                  <option value="trial">Prueba</option>
                </select>
              )}
            </FormField>
          </div>

          {serverError && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <Check className="h-4 w-4" />
              {updateMutation.isPending ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Colegios */}
      <div className="rounded-lg border border-border bg-background p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-foreground">Colegios</h2>
          <Link
            to={`/dashboard/schools/new?organization_id=${org.id}`}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar colegio
          </Link>
        </div>

        {!org.schools || org.schools.length === 0 ? (
          <EmptyState
            icon={<School className="h-8 w-8" />}
            title="Sin colegios"
            description="Esta organización no tiene colegios registrados aún."
          />
        ) : (
          <div className="divide-y divide-border">
            {org.schools.map((school) => (
              <div
                key={school.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{school.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {school.city} · DANE: {school.dane_code}
                  </p>
                </div>
                <Link
                  to={`/dashboard/schools/${school.id}`}
                  className="text-xs text-primary hover:underline"
                >
                  Ver detalle
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
