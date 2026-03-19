import type { SchoolMember } from '@/features/schools/members.types'

export type EducationLevel = 'preschool' | 'elementary' | 'both'
export type SchoolStatus = 'active' | 'inactive'

export interface School {
  id: string
  organization_id: string
  name: string
  address: string
  city: string
  dane_code: string
  education_level: EducationLevel
  status: SchoolStatus
  student_count: number
  members?: SchoolMember[]
  created_at: string
}

export interface SchoolQueryParams {
  organization_id?: string
  status?: SchoolStatus
  page?: number
  limit?: number
}

export interface CreateSchoolDto {
  organization_id: string
  name: string
  address: string
  city: string
  dane_code: string
  education_level: EducationLevel
  student_count: number
}

export interface UpdateSchoolDto {
  name?: string
  address?: string
  city?: string
  education_level?: EducationLevel
  status?: SchoolStatus
  student_count?: number
}
