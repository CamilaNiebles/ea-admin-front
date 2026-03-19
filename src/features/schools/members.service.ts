import api, { get, post, del } from '@/lib/api'
import type {
  SchoolMember,
  InviteMemberDto,
  UpdateMemberDto,
  InviteMemberResponse,
  UpdateMemberResponse,
} from './members.types'

function base(schoolId: string) {
  return `/institutions/schools/${schoolId}/members`
}

export const membersService = {
  list(schoolId: string): Promise<SchoolMember[]> {
    return get<SchoolMember[]>(base(schoolId))
  },

  invite(schoolId: string, dto: InviteMemberDto): Promise<InviteMemberResponse> {
    return post<InviteMemberResponse>(base(schoolId), dto)
  },

  update(
    schoolId: string,
    memberId: string,
    dto: UpdateMemberDto
  ): Promise<UpdateMemberResponse> {
    return api
      .patch<UpdateMemberResponse>(`${base(schoolId)}/${memberId}`, dto)
      .then((r) => r.data)
  },

  remove(schoolId: string, memberId: string): Promise<void> {
    return del<void>(`${base(schoolId)}/${memberId}`)
  },
}
