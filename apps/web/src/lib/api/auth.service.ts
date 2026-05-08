import { ApiError, apiRequest } from './client'

export type AuthUser = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type AuthResponse = {
  user: AuthUser
}

export type CurrentUserResponse = {
  user: AuthUser | null
}

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = LoginInput & {
  name: string
}

const jsonHeaders = {
  'Content-Type': 'application/json',
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  try {
    return await apiRequest<AuthResponse>('/auth/me')
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { user: null }
    }

    throw error
  }
}

export function login(input: LoginInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/sign-in', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(input),
  })
}

export function register(input: RegisterInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/sign-up', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(input),
  })
}

export function logout(): Promise<{ ok: true }> {
  return apiRequest<{ ok: true }>('/auth/logout', {
    method: 'POST',
    headers: jsonHeaders,
  })
}
