import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCreateOrganization } from './hooks/useOrganizationsMutations'
import { PageHeader } from '@/components/ui/PageHeader'
import { FormField, inputClass } from '@/components/ui/FormField'

interface FormState {
  // Sección 1 — Datos de la organización
  name: string
  nit: string
  telephoneNumber: string
  email: string
  country: string
  city: string
  // Sección 2 — Primer colegio
  schoolName: string
  schoolCity: string
  schoolTrialEndsAt: string
}

interface FormErrors {
  name?: string
  email?: string
  schoolName?: string
  schoolTrialEndsAt?: string
}

const defaultForm: FormState = {
  name: '',
  nit: '',
  telephoneNumber: '',
  email: '',
  country: 'Colombia',
  city: '',
  schoolName: '',
  schoolCity: '',
  schoolTrialEndsAt: '',
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}

  if (!form.name.trim()) {
    errors.name = 'El nombre de la organización es requerido.'
  } else if (form.name.length > 200) {
    errors.name = 'Máximo 200 caracteres.'
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ingresa un correo electrónico válido.'
  }

  if (!form.schoolName.trim()) {
    errors.schoolName = 'El nombre del colegio es requerido.'
  } else if (form.schoolName.length > 200) {
    errors.schoolName = 'Máximo 200 caracteres.'
  }

  if (form.schoolTrialEndsAt) {
    const selected = new Date(form.schoolTrialEndsAt)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selected <= today) {
      errors.schoolTrialEndsAt = 'La fecha de fin de prueba debe ser una fecha futura.'
    }
  }

  return errors
}

// Returns today's date in YYYY-MM-DD format (for min attribute on date input)
function todayString(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function OrganizationNewPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(defaultForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createMutation = useCreateOrganization()

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear field error on change
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const dto: Parameters<typeof createMutation.mutate>[0] = {
      name: form.name,
      ...(form.nit && { nit: form.nit }),
      ...(form.telephoneNumber && { telephoneNumber: form.telephoneNumber }),
      ...(form.email && { email: form.email }),
      ...(form.country && { country: form.country }),
      ...(form.city && { city: form.city }),
      firstSchool: {
        name: form.schoolName,
        ...(form.schoolCity && { city: form.schoolCity }),
        ...(form.schoolTrialEndsAt && {
          trialEndsAt: new Date(form.schoolTrialEndsAt).toISOString(),
        }),
      },
    }

    createMutation.mutate(dto, {
      onSuccess: (data) => {
        navigate(`/dashboard/organizations/${data.organization.id}`)
      },
      onError: (err) => {
        const msg = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? 'Error inesperado')
          : 'Error inesperado'
        setServerError(typeof msg === 'string' ? msg : JSON.stringify(msg))
      },
    })
  }

  return (
    <div className="p-6 max-w-2xl">
      <PageHeader
        title="Nueva organización"
        description="Registra una nueva organización educativa y su primer colegio."
      />

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Sección 1 — Datos de la organización */}
        <div className="bg-background border border-border rounded-lg p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">Datos de la organización</h2>

          <FormField label="Nombre de la organización" required error={errors.name}>
            {(id) => (
              <input
                id={id}
                className={inputClass}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Ej. Red Educativa Los Pinos"
                maxLength={200}
              />
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="NIT">
              {(id) => (
                <input
                  id={id}
                  className={inputClass}
                  value={form.nit}
                  onChange={(e) => set('nit', e.target.value)}
                  placeholder="Ej. 900123456-1"
                />
              )}
            </FormField>

            <FormField label="Teléfono de contacto">
              {(id) => (
                <input
                  id={id}
                  className={inputClass}
                  value={form.telephoneNumber}
                  onChange={(e) => set('telephoneNumber', e.target.value)}
                  placeholder="Ej. 3001234567"
                />
              )}
            </FormField>
          </div>

          <FormField label="Correo de contacto" error={errors.email}>
            {(id) => (
              <input
                id={id}
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="contacto@organizacion.edu.co"
              />
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="País">
              {(id) => (
                <input
                  id={id}
                  className={inputClass}
                  value={form.country}
                  onChange={(e) => set('country', e.target.value)}
                  placeholder="Colombia"
                />
              )}
            </FormField>

            <FormField label="Ciudad">
              {(id) => (
                <input
                  id={id}
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  placeholder="Ej. Bogotá"
                />
              )}
            </FormField>
          </div>
        </div>

        {/* Sección 2 — Primer colegio */}
        <div className="bg-background border border-border rounded-lg p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">Primer colegio</h2>

          <FormField label="Nombre del colegio" required error={errors.schoolName}>
            {(id) => (
              <input
                id={id}
                className={inputClass}
                value={form.schoolName}
                onChange={(e) => set('schoolName', e.target.value)}
                placeholder="Ej. Colegio Los Pinos Sede Norte"
                maxLength={200}
              />
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ciudad del colegio">
              {(id) => (
                <input
                  id={id}
                  className={inputClass}
                  value={form.schoolCity}
                  onChange={(e) => set('schoolCity', e.target.value)}
                  placeholder="Ej. Bogotá"
                />
              )}
            </FormField>

            <FormField
              label="Fecha de fin de prueba"
              hint="Si no se selecciona, el backend usa 30 días por defecto."
              error={errors.schoolTrialEndsAt}
            >
              {(id) => (
                <input
                  id={id}
                  type="date"
                  className={inputClass}
                  value={form.schoolTrialEndsAt}
                  min={todayString()}
                  onChange={(e) => set('schoolTrialEndsAt', e.target.value)}
                />
              )}
            </FormField>
          </div>
        </div>

        {serverError && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard/organizations')}
            className="rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {createMutation.isPending ? 'Creando…' : 'Crear organización'}
          </button>
        </div>
      </form>
    </div>
  )
}
