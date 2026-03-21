export interface LoginRequest {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email?: string
  full_name: string
  role: string
  institution_id: string | null
}

export interface LoginResponse {
    accessToken: string
    idToken: string
    refreshToken: string
    expiresIn: number
}

