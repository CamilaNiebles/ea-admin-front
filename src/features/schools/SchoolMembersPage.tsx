import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, UserPlus, Users } from 'lucide-react'
import { useMembers } from './hooks/useMembers'
import { useUpdateMember, useRemoveMember } from './hooks/useMembersMutations'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { selectClass } from '@/components/ui/FormField'
import type { SchoolMember, MemberRole, MemberStatus } from './members.types'



const statusVariants: Record<MemberStatus, 'success' | 'destructive'> = {
  active: 'success',
  inactive: 'destructive',
}

const statusLabels: Record<MemberStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
}

export default function SchoolMembersPage() {
  const { schoolId } = useParams<{ schoolId: string }>()
  const navigate = useNavigate()
  const { data: members, isLoading } = useMembers(schoolId ?? '')
  const updateMutation = useUpdateMember(schoolId ?? '')
  const removeMutation = useRemoveMember(schoolId ?? '')

  const [confirmMemberId, setConfirmMemberId] = useState<string | null>(null)

  function handleRoleChange(memberId: string, role: MemberRole) {
    updateMutation.mutate({ memberId, dto: { role } })
  }

  function handleRemoveConfirm() {
    if (!confirmMemberId) return
    removeMutation.mutate(confirmMemberId, {
      onSettled: () => setConfirmMemberId(null),
    })
  }

  const columns: Column<SchoolMember>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (row) => <span className="font-medium">{row.user.name}</span>,
    },
    {
      key: 'email',
      header: 'Correo',
      render: (row) => (
        <span className="text-muted-foreground">{row.user.email}</span>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      render: (row) => (
        <select
          className={`${selectClass} w-44`}
          value={row.role}
          onChange={(e) => handleRoleChange(row.userId, e.target.value as MemberRole)}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="teacher">Docente</option>
          <option value="psychologist">Psicólogo/a</option>
          <option value="admin">Administrador/a</option>
        </select>
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
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          className="text-xs text-destructive hover:underline disabled:opacity-50"
          disabled={removeMutation.isPending}
          onClick={(e) => {
            e.stopPropagation()
            setConfirmMemberId(row.userId)
          }}
        >
          Desactivar
        </button>
      ),
    },
  ]

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(`/dashboard/schools/${schoolId}`)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al colegio
      </button>

      <PageHeader
        title="Miembros del colegio"
        description="Gestiona docentes, psicólogos y administradores."
        action={
          <Link
            to={`/dashboard/schools/${schoolId}/members/invite`}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Invitar miembro
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={members ?? []}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={<Users className="h-10 w-10" />}
            title="Sin miembros"
            description="Invita el primer miembro al colegio."
          />
        }
      />

      <ConfirmDialog
        open={Boolean(confirmMemberId)}
        title="¿Desactivar miembro?"
        description="El miembro perderá acceso al colegio. Esta acción se puede revertir editando el estado."
        confirmLabel="Desactivar"
        onConfirm={handleRemoveConfirm}
        onCancel={() => setConfirmMemberId(null)}
      />
    </div>
  )
}
