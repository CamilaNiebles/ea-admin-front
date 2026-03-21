import api, { get, post } from '@/lib/api'
import type {
  School,
  SchoolQueryParams,
  CreateSchoolDto,
  UpdateSchoolDto,
} from './schools.types'

const BASE = '/schools'

export const schoolsService = {
  list(params?: SchoolQueryParams): Promise<School[]> {
    return get<School[]>(BASE, { params })
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
