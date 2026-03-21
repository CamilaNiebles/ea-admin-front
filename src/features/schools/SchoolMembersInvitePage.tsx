import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { useInviteMember } from './hooks/useMembersMutations'
import { PageHeader } from '@/components/ui/PageHeader'
import { FormField, inputClass, selectClass } from '@/components/ui/FormField'
import type { MemberRole } from './members.types'

interface FormState {
  email: string
  name: string
  role: MemberRole
}

export default function SchoolMembersInvitePage() {
  const { schoolId } = useParams<{ schoolId: string }>()
  const navigate = useNavigate()
  const inviteMutation = useInviteMember(schoolId ?? '')

  const [form, setForm] = useState<FormState>({
    email: '',
    name: '',
    role: 'teacher',
  })
  const [serverError, setServerError] = useState<string | null>(null)
  const [cognitoWarning, setCognitoWarning] = useState(false)

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    setCognitoWarning(false)
    inviteMutation.mutate(
      { email: form.email, name: form.name, role: form.role },
      {
        onSuccess: (data) => {
          if (data.cognitoSyncWarning) {
            setCognitoWarning(true)
            // Navegar después de mostrar el warning brevemente
            setTimeout(() => {
              navigate(`/dashboard/schools/${schoolId}/members`)
            }, 3000)
          } else {
            navigate(`/dashboard/schools/${schoolId}/members`)
          }
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
    <div className="p-6 max-w-lg">
      <button
        onClick={() => navigate(`/dashboard/schools/${schoolId}/members`)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a miembros
      </button>

      <PageHeader
        title="Invitar miembro"
        description="Agrega un docente, psicólogo o administrador al colegio."
      />

      <form onSubmit={handleSubmit} className="bg-background border border-border rounded-lg p-6 space-y-5">
        <FormField label="Correo electrónico" required>
          {(id) => (
            <input
              id={id}
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="usuario@colegio.edu.co"
              required
            />
          )}
        </FormField>

        <FormField label="Nombre completo" required>
          {(id) => (
            <input
              id={id}
              className={inputClass}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ej. María González"
              required
            />
          )}
        </FormField>

        <FormField label="Rol" required>
          {(id) => (
            <select
              id={id}
              className={selectClass}
              value={form.role}
              onChange={(e) => set('role', e.target.value as MemberRole)}
              required
            >
              <option value="teacher">Docente</option>
              <option value="psychologist">Psicólogo/a</option>
              <option value="admin">Administrador/a</option>
            </select>
          )}
        </FormField>

        {cognitoWarning && (
          <div className="flex items-start gap-2 rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              El miembro fue agregado correctamente, pero ocurrió un problema al sincronizar
              con el proveedor de autenticación. El usuario puede demorar en recibir acceso.
            </span>
          </div>
        )}

        {serverError && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/schools/${schoolId}/members`)}
            className="rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={inviteMutation.isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {inviteMutation.isPending ? 'Invitando…' : 'Invitar miembro'}
          </button>
        </div>
      </form>
    </div>
  )
}
