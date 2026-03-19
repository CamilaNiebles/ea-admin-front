import { useQuery } from '@tanstack/react-query'
import { membersService } from '../members.service'

export function useMembers(schoolId: string) {
  return useQuery({
    queryKey: ['members', schoolId],
    queryFn: () => membersService.list(schoolId),
    enabled: Boolean(schoolId),
  })
}
