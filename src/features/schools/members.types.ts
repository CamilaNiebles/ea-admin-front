export type MemberRole = 'teacher' | 'psychologist' | 'admin'
export type MemberStatus = 'active' | 'inactive'

export interface SchoolMember {
  userId: string
  schoolId: string
  role: MemberRole
  status: MemberStatus
  user: {
    id: string
    email: string
    name: string
  }
}

export interface InviteMemberDto {
  email: string
  name: string
  role: MemberRole
  user_id?: string
}

export interface UpdateMemberDto {
  role?: MemberRole
  status?: MemberStatus
}

export interface InviteMemberResponse {
  member: SchoolMember
  cognitoSyncWarning?: boolean
}

export interface UpdateMemberResponse {
  member: SchoolMember
  cognitoSyncWarning?: boolean
}
