import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getCurrentUser,
  login,
  logout,
  register,
  type AuthResponse,
  type LoginInput,
  type RegisterInput,
} from '../api/auth.service'

export const authKeys = {
  currentUser: ['auth', 'current-user'] as const,
}

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: getCurrentUser,
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(authKeys.currentUser, { user: data.user })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(authKeys.currentUser, { user: data.user })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.currentUser, { user: null })
    },
  })
}
