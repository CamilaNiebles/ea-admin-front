import { useMutation, useQueryClient } from '@tanstack/react-query'
import { membersService } from '../members.service'
import type { InviteMemberDto, UpdateMemberDto } from '../members.types'

export function useInviteMember(schoolId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: InviteMemberDto) => membersService.invite(schoolId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', schoolId] })
    },
  })
}

export function useUpdateMember(schoolId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ memberId, dto }: { memberId: string; dto: UpdateMemberDto }) =>
      membersService.update(schoolId, memberId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', schoolId] })
    },
  })
}

export function useRemoveMember(schoolId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (memberId: string) => membersService.remove(schoolId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', schoolId] })
    },
  })
}
