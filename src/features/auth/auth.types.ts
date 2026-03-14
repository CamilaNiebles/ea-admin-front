export interface LoginRequest {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginResponse {
  tokens: AuthTokens
  user: AuthUser
}
