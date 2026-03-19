import type { School } from '@/features/schools/schools.types'

export type OrgPlan = 'semilla' | 'arbol' | 'bosque' | 'campus'
export type OrgStatus = 'active' | 'suspended' | 'trial'

export interface Organization {
  id: string
  name: string
  nit: string
  contact_email: string
  contact_phone: string
  country: string
  city: string
  plan: OrgPlan
  status: OrgStatus
  max_students: number
  trial_ends_at: string | null
  license_expires_at: string | null
  schools?: School[]
  created_at: string
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

export interface CreateOrganizationDto {
  name: string
  nit: string
  contact_email: string
  contact_phone: string
  country: string
  city: string
  plan: OrgPlan
  max_students: number
  trial_ends_at?: string | null
}

export interface UpdateOrganizationDto {
  plan?: OrgPlan
  status?: OrgStatus
  max_students?: number
  license_expires_at?: string | null
}
