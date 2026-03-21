import type { School } from '@/features/schools/schools.types'

export type OrgPlan = 'semilla' | 'arbol' | 'bosque' | 'campus'
export type OrgStatus = 'active' | 'suspended' | 'trial'

export interface Organization {
  id: string
  name: string
  nit?: string
  email?: string
  telephoneNumber?: string
  country?: string
  city?: string
  status: OrgStatus
  createdAt: string
  updatedAt: string
  schools?: School[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface OrgQueryParams {
  status?: OrgStatus
  plan?: OrgPlan
  page?: number
  limit?: number
}

export interface FirstSchoolDto {
  name: string
  city?: string
  trialEndsAt?: string
}

export interface CreateOrganizationDto {
  name: string
  nit?: string
  email?: string
  telephoneNumber?: string
  country?: string
  city?: string
  firstSchool: FirstSchoolDto
}

export interface CreateOrganizationResponse {
  organization: Organization
  school: School
}

export interface UpdateOrganizationDto {
  plan?: OrgPlan
  status?: OrgStatus
  max_students?: number
  license_expires_at?: string | null
}
