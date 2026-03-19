import { useQuery } from '@tanstack/react-query'
import { organizationsService } from '../organizations.service'
import type { OrgQueryParams } from '../organizations.types'

export function useOrganizations(params?: OrgQueryParams) {
  return useQuery({
    queryKey: ['organizations', params],
    queryFn: () => organizationsService.list(params),
  })
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => organizationsService.getById(id),
    enabled: Boolean(id),
  })
}
