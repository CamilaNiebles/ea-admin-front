import { useMutation, useQueryClient } from '@tanstack/react-query'
import { schoolsService } from '../schools.service'
import type { CreateSchoolDto, UpdateSchoolDto } from '../schools.types'

export function useCreateSchool() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateSchoolDto) => schoolsService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] })
    },
  })
}

export function useUpdateSchool(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateSchoolDto) => schoolsService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] })
    },
  })
}
