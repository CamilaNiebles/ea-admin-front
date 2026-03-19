import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, X, Check, School } from 'lucide-react'
import axios from 'axios'
import { useOrganization } from './hooks/useOrganizations'
import { useUpdateOrganization } from './hooks/useOrganizationsMutations'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { FormField, inputClass, selectClass } from '@/components/ui/FormField'
import type { OrgPlan, OrgStatus, UpdateOrganizationDto } from './organizations.types'

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

interface EditForm {
  plan: OrgPlan
  status: OrgStatus
  max_students: string
  license_expires_at: string
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
    setEditForm({
      plan: org.plan,
      status: org.status,
      max_students: String(org.max_students),
      license_expires_at: org.license_expires_at
        ? org.license_expires_at.split('T')[0]
        : '',
    })
    setEditing(true)
    setServerError(null)
  }

  function cancelEdit() {
    setEditing(false)
    setEditForm(null)
    setServerError(null)
  }

  function setField(field: keyof EditForm, value: string) {
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  function handleSave() {
    if (!editForm) return
    const dto: UpdateOrganizationDto = {
      plan: editForm.plan,
      status: editForm.status,
      max_students: Number(editForm.max_students),
      license_expires_at: editForm.license_expires_at || null,
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
            <Badge variant={planVariants[org.plan]}>{planLabels[org.plan]}</Badge>
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
            <dd className="font-medium mt-0.5 break-all">{org.contact_email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Teléfono</dt>
            <dd className="font-medium mt-0.5">{org.contact_phone}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Máx. estudiantes</dt>
            <dd className="font-medium mt-0.5">{org.max_students.toLocaleString('es-CO')}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Creada</dt>
            <dd className="font-medium mt-0.5">{formatDate(org.created_at)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Fin de prueba</dt>
            <dd className="font-medium mt-0.5">{formatDate(org.trial_ends_at)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Vencimiento licencia</dt>
            <dd className="font-medium mt-0.5">{formatDate(org.license_expires_at)}</dd>
          </div>
        </dl>
      </div>

      {/* Formulario de edición */}
      {editing && editForm && (
        <div className="rounded-lg border border-border bg-background p-5 space-y-4">
          <h2 className="text-base font-medium text-foreground">Editar organización</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Plan" required>
              {(id) => (
                <select
                  id={id}
                  className={selectClass}
                  value={editForm.plan}
                  onChange={(e) => setField('plan', e.target.value)}
                >
                  <option value="semilla">Semilla</option>
                  <option value="arbol">Árbol</option>
                  <option value="bosque">Bosque</option>
                  <option value="campus">Campus</option>
                </select>
              )}
            </FormField>

            <FormField label="Estado" required>
              {(id) => (
                <select
                  id={id}
                  className={selectClass}
                  value={editForm.status}
                  onChange={(e) => setField('status', e.target.value)}
                >
                  <option value="active">Activa</option>
                  <option value="suspended">Suspendida</option>
                  <option value="trial">Prueba</option>
                </select>
              )}
            </FormField>

            <FormField label="Máximo de estudiantes" required>
              {(id) => (
                <input
                  id={id}
                  type="number"
                  min={1}
                  className={inputClass}
                  value={editForm.max_students}
                  onChange={(e) => setField('max_students', e.target.value)}
                />
              )}
            </FormField>

            <FormField label="Vencimiento de licencia">
              {(id) => (
                <input
                  id={id}
                  type="date"
                  className={inputClass}
                  value={editForm.license_expires_at}
                  onChange={(e) => setField('license_expires_at', e.target.value)}
                />
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
