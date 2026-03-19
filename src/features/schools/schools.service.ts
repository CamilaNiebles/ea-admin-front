import api, { get, post } from '@/lib/api'
import type {
  School,
  SchoolQueryParams,
  CreateSchoolDto,
  UpdateSchoolDto,
} from './schools.types'
import type { PaginatedResponse } from '@/features/organizations/organizations.types'

const BASE = '/institutions/schools'

export const schoolsService = {
  list(params?: SchoolQueryParams): Promise<PaginatedResponse<School>> {
    return get<PaginatedResponse<School>>(BASE, { params })
  },

  getById(id: string): Promise<School> {
    return get<School>(`${BASE}/${id}`)
  },

  create(dto: CreateSchoolDto): Promise<School> {
    return post<School>(BASE, dto)
  },

  update(id: string, dto: UpdateSchoolDto): Promise<School> {
    return api.patch<School>(`${BASE}/${id}`, dto).then((r) => r.data)
  },
}
