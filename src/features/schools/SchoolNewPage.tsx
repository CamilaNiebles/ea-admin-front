import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useCreateSchool } from './hooks/useSchoolsMutations'
import { useOrganizations } from '@/features/organizations/hooks/useOrganizations'
import { PageHeader } from '@/components/ui/PageHeader'
import { FormField, inputClass, selectClass } from '@/components/ui/FormField'
import type { EducationLevel } from './schools.types'

interface FormState {
  organization_id: string
  name: string
  address: string
  city: string
  dane_code: string
  education_level: EducationLevel
  student_count: string
}

export default function SchoolNewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedOrgId = searchParams.get('organization_id') ?? ''

  const [form, setForm] = useState<FormState>({
    organization_id: preselectedOrgId,
    name: '',
    address: '',
    city: '',
    dane_code: '',
    education_level: 'elementary',
    student_count: '',
  })
  const [serverError, setServerError] = useState<string | null>(null)

  const createMutation = useCreateSchool()
  const { data: orgsData } = useOrganizations({ limit: 100 })

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError(null)
    createMutation.mutate(
      {
        organization_id: form.organization_id,
        name: form.name,
        address: form.address,
        city: form.city,
        dane_code: form.dane_code,
        education_level: form.education_level,
        student_count: Number(form.student_count),
      },
      {
        onSuccess: (data) => {
          navigate(`/dashboard/schools/${data.id}`)
        },
        onError: (err) => {
          const msg = axios.isAxiosError(err)
            ? (err.response?.data?.message ?? 'Error inesperado')
            : 'Error inesperado'
          setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg))
        },
      }
    )
  }

  return (
    <div className="p-6 max-w-2xl">
      <PageHeader
        title="Nuevo colegio"
        description="Registra un nuevo colegio en la plataforma."
      />

      <form onSubmit={handleSubmit} className="bg-background border border-border rounded-lg p-6 space-y-5">
        <FormField label="Organización" required>
          {(id) => (
            <select
              id={id}
              className={selectClass}
              value={form.organization_id}
              onChange={(e) => set('organization_id', e.target.value)}
              disabled={Boolean(preselectedOrgId)}
              required
            >
              <option value="">Selecciona una organización</option>
              {orgsData?.data?.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField label="Nombre del colegio" required>
          {(id) => (
            <input
              id={id}
              className={inputClass}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ej. Colegio Los Pinos"
              required
            />
          )}
        </FormField>

        <FormField label="Dirección" required>
          {(id) => (
            <input
              id={id}
              className={inputClass}
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Ej. Calle 10 # 20-30"
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
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder="Ej. Medellín"
                required
              />
            )}
          </FormField>

          <FormField label="Código DANE" required>
            {(id) => (
              <input
                id={id}
                className={inputClass}
                value={form.dane_code}
                onChange={(e) => set('dane_code', e.target.value)}
                placeholder="Ej. 05001001234"
                required
              />
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Nivel educativo" required>
            {(id) => (
              <select
                id={id}
                className={selectClass}
                value={form.education_level}
                onChange={(e) => set('education_level', e.target.value as EducationLevel)}
                required
              >
                <option value="preschool">Preescolar</option>
                <option value="elementary">Primaria</option>
                <option value="both">Preescolar y primaria</option>
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
                value={form.student_count}
                onChange={(e) => set('student_count', e.target.value)}
                placeholder="Ej. 200"
                required
              />
            )}
          </FormField>
        </div>

        {serverError && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard/schools')}
            className="rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {createMutation.isPending ? 'Creando…' : 'Crear colegio'}
          </button>
        </div>
      </form>
    </div>
  )
}
