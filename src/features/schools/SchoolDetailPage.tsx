import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, X, Check, Users } from 'lucide-react'
import axios from 'axios'
import { useSchool } from './hooks/useSchools'
import { useUpdateSchool } from './hooks/useSchoolsMutations'
import { Badge } from '@/components/ui/Badge'
import { FormField, inputClass, selectClass } from '@/components/ui/FormField'
import type { EducationLevel, SchoolStatus, UpdateSchoolDto } from './schools.types'

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

interface EditForm {
  name: string
  address: string
  city: string
  education_level: EducationLevel
  status: SchoolStatus
  student_count: string
}

export default function SchoolDetailPage() {
  const { schoolId } = useParams<{ schoolId: string }>()
  const navigate = useNavigate()
  const { data: school, isLoading } = useSchool(schoolId ?? '')
  const updateMutation = useUpdateSchool(schoolId ?? '')

  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  function startEdit() {
    if (!school) return
    setEditForm({
      name: school.name,
      address: school.address,
      city: school.city,
      education_level: school.education_level,
      status: school.status,
      student_count: String(school.student_count),
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
    const dto: UpdateSchoolDto = {
      name: editForm.name,
      address: editForm.address,
      city: editForm.city,
      education_level: editForm.education_level,
      status: editForm.status,
      student_count: Number(editForm.student_count),
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

  if (!school) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Colegio no encontrado.</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/dashboard/schools')}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a colegios
        </button>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-foreground">{school.name}</h1>
            <Badge variant={statusVariants[school.status]}>{statusLabels[school.status]}</Badge>
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

      {/* Info */}
      <div className="rounded-lg border border-border bg-background p-5">
        <h2 className="text-base font-medium text-foreground mb-4">Información del colegio</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Dirección</dt>
            <dd className="font-medium mt-0.5">{school.address}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Ciudad</dt>
            <dd className="font-medium mt-0.5">{school.city}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Código DANE</dt>
            <dd className="font-mono text-xs font-medium mt-0.5">{school.dane_code}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Nivel educativo</dt>
            <dd className="font-medium mt-0.5">{levelLabels[school.education_level]}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Estudiantes</dt>
            <dd className="font-medium mt-0.5">{school.student_count.toLocaleString('es-CO')}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Creado</dt>
            <dd className="font-medium mt-0.5">
              {new Date(school.created_at).toLocaleDateString('es-CO')}
            </dd>
          </div>
        </dl>
      </div>

      {/* Edición inline */}
      {editing && editForm && (
        <div className="rounded-lg border border-border bg-background p-5 space-y-4">
          <h2 className="text-base font-medium text-foreground">Editar colegio</h2>

          <FormField label="Nombre" required>
            {(id) => (
              <input
                id={id}
                className={inputClass}
                value={editForm.name}
                onChange={(e) => setField('name', e.target.value)}
                required
              />
            )}
          </FormField>

          <FormField label="Dirección" required>
            {(id) => (
              <input
                id={id}
                className={inputClass}
                value={editForm.address}
                onChange={(e) => setField('address', e.target.value)}
                required
              />
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ciudad" required>
              {(id) => (
                <input
                  id={id}
                  className={inputClass}
                  value={editForm.city}
                  onChange={(e) => setField('city', e.target.value)}
                  required
                />
              )}
            </FormField>

            <FormField label="Nivel educativo" required>
              {(id) => (
                <select
                  id={id}
                  className={selectClass}
                  value={editForm.education_level}
                  onChange={(e) => setField('education_level', e.target.value)}
                >
                  <option value="preschool">Preescolar</option>
                  <option value="elementary">Primaria</option>
                  <option value="both">Preescolar y primaria</option>
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
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              )}
            </FormField>

            <FormField label="Cantidad de estudiantes" required>
              {(id) => (
                <input
                  id={id}
                  type="number"
                  min={0}
                  className={inputClass}
                  value={editForm.student_count}
                  onChange={(e) => setField('student_count', e.target.value)}
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

      {/* Miembros */}
      <div className="rounded-lg border border-border bg-background p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-medium text-foreground">Miembros</h2>
          <Link
            to={`/dashboard/schools/${school.id}/members`}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Users className="h-4 w-4" />
            Ver miembros
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Gestiona los docentes, psicólogos y administradores del colegio.
        </p>
      </div>
    </div>
  )
}
