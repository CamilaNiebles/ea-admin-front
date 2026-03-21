import api, { get, post } from '@/lib/api'
import type {
  Organization,
  OrgQueryParams,
  CreateOrganizationDto,
  CreateOrganizationResponse,
  UpdateOrganizationDto,
} from './organizations.types'

const BASE = '/organizations'

export const organizationsService = {
  list(params?: OrgQueryParams): Promise<Organization[]> {
    return get<Organization[]>(BASE, { params })
  },

  getById(id: string): Promise<Organization> {
    return get<Organization>(`${BASE}/${id}`)
  },

  create(dto: CreateOrganizationDto): Promise<CreateOrganizationResponse> {
    return post<CreateOrganizationResponse>(BASE, dto)
  },

  update(id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    return api.patch<Organization>(`${BASE}/${id}`, dto).then((r) => r.data)
  },
}
