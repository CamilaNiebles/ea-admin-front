import { useMutation, useQueryClient } from '@tanstack/react-query'
import { organizationsService } from '../organizations.service'
import type { CreateOrganizationDto, CreateOrganizationResponse, UpdateOrganizationDto } from '../organizations.types'

export function useCreateOrganization() {
  const queryClient = useQueryClient()
  return useMutation<CreateOrganizationResponse, Error, CreateOrganizationDto>({
    mutationFn: (dto: CreateOrganizationDto) => organizationsService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })
}

export function useUpdateOrganization(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateOrganizationDto) => organizationsService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })
}
