import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCreateOrganization } from './hooks/useOrganizationsMutations'
import { PageHeader } from '@/components/ui/PageHeader'
import { FormField, inputClass, selectClass } from '@/components/ui/FormField'
import type { OrgPlan } from './organizations.types'

interface FormState {
  name: string
  nit: string
  contact_email: string
  contact_phone: string
  country: string
  city: string
  plan: OrgPlan
  max_students: string
  trial_ends_at: string
}

const defaultForm: FormState = {
  name: '',
  nit: '',
  contact_email: '',
  contact_phone: '',
  country: 'Colombia',
  city: '',
  plan: 'semilla',
  max_students: '',
  trial_ends_at: '',
}

export default function OrganizationNewPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(defaultForm)
  const [serverError, setServerError] = useState<string | null>(null)
  const createMutation = useCreateOrganization()

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    createMutation.mutate(
      {
        name: form.name,
        nit: form.nit,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone,
        country: form.country,
        city: form.city,
        plan: form.plan,
        max_students: Number(form.max_students),
        trial_ends_at: form.trial_ends_at || null,
      },
      {
        onSuccess: (data) => {
          navigate(`/dashboard/organizations/${data.id}`)
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
        title="Nueva organización"
        description="Registra una nueva organización educativa en la plataforma."
      />

      <form onSubmit={handleSubmit} className="bg-background border border-border rounded-lg p-6 space-y-5">
        <FormField label="Nombre de la organización" required>
          {(id) => (
            <input
              id={id}
              className={inputClass}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ej. Institución Educativa Los Pinos"
              required
            />
          )}
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="NIT" required>
            {(id) => (
              <input
                id={id}
                className={inputClass}
                value={form.nit}
                onChange={(e) => set('nit', e.target.value)}
                placeholder="Ej. 900123456-1"
                required
              />
            )}
          </FormField>

          <FormField label="Teléfono de contacto" required>
            {(id) => (
              <input
                id={id}
                className={inputClass}
                value={form.contact_phone}
                onChange={(e) => set('contact_phone', e.target.value)}
                placeholder="Ej. 3001234567"
                required
              />
            )}
          </FormField>
        </div>

        <FormField label="Correo de contacto" required>
          {(id) => (
            <input
              id={id}
              type="email"
              className={inputClass}
              value={form.contact_email}
              onChange={(e) => set('contact_email', e.target.value)}
              placeholder="contacto@organizacion.edu.co"
              required
            />
          )}
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="País" required>
            {(id) => (
              <input
                id={id}
                className={inputClass}
                value={form.country}
                onChange={(e) => set('country', e.target.value)}
                required
              />
            )}
          </FormField>

          <FormField label="Ciudad" required>
            {(id) => (
              <input
                id={id}
                className={inputClass}
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder="Ej. Bogotá"
                required
              />
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Plan" required>
            {(id) => (
              <select
                id={id}
                className={selectClass}
                value={form.plan}
                onChange={(e) => set('plan', e.target.value as OrgPlan)}
                required
              >
                <option value="semilla">Semilla</option>
                <option value="arbol">Árbol</option>
                <option value="bosque">Bosque</option>
                <option value="campus">Campus</option>
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
                value={form.max_students}
                onChange={(e) => set('max_students', e.target.value)}
                placeholder="Ej. 500"
                required
              />
            )}
          </FormField>
        </div>

        <FormField label="Fecha de fin de prueba">
          {(id) => (
            <input
              id={id}
              type="date"
              className={inputClass}
              value={form.trial_ends_at}
              onChange={(e) => set('trial_ends_at', e.target.value)}
            />
          )}
        </FormField>

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
