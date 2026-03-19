import { useQuery } from '@tanstack/react-query'
import { schoolsService } from '../schools.service'
import type { SchoolQueryParams } from '../schools.types'

export function useSchools(params?: SchoolQueryParams) {
  return useQuery({
    queryKey: ['schools', params],
    queryFn: () => schoolsService.list(params),
  })
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: ['schools', id],
    queryFn: () => schoolsService.getById(id),
    enabled: Boolean(id),
  })
}
