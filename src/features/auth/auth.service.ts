import { get, post } from '@/lib/api'
import type { AuthUser, LoginRequest, LoginResponse } from './auth.types'

export const authService = {
  login(data: LoginRequest): Promise<LoginResponse> {
    return post<LoginResponse>('/auth/login', data)
  },

  logout(): Promise<void> {
    return post<void>('/auth/logout')
  },

  refreshToken(token: string): Promise<{ accessToken: string }> {
    return post<{ accessToken: string }>('/auth/refresh', { refreshToken: token })
  },

  getMe(): Promise<AuthUser> {
    return get<AuthUser>('/auth/me')
  },
}
