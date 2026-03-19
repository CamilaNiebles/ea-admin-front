import api, { get, post } from '@/lib/api'
import type {
  Organization,
  PaginatedResponse,
  OrgQueryParams,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './organizations.types'

const BASE = '/organizations'

export const organizationsService = {
  list(params?: OrgQueryParams): Promise<PaginatedResponse<Organization>> {
    return get<PaginatedResponse<Organization>>(BASE, { params })
  },

  getById(id: string): Promise<Organization> {
    return get<Organization>(`${BASE}/${id}`)
  },

  create(dto: CreateOrganizationDto): Promise<Organization> {
    return post<Organization>(BASE, dto)
  },

  update(id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    return api.patch<Organization>(`${BASE}/${id}`, dto).then((r) => r.data)
  },
}
