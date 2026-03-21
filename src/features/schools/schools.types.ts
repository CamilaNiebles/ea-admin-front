export type SchoolStatus = 'active' | 'inactive' | 'trial'

export interface School {
  id: string
  organizationId: string
  name: string
  city: string
  status: SchoolStatus
  planId: string
  planStartDate: string
  planEndDate: string
  createdAt: string
  updatedAt: string
}

export interface SchoolQueryParams {
  organization_id?: string
  status?: SchoolStatus
  page?: number
  limit?: number
}

export interface CreateSchoolDto {
  organizationId: string
  name: string
  city: string
}

export interface UpdateSchoolDto {
  name?: string
  city?: string
  status?: SchoolStatus
}
