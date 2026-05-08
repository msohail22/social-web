import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '../lib/auth'
import { AppShell } from './AppShell'

export function RequireAuth() {
  const currentUserQuery = useCurrentUser()

  if (currentUserQuery.isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4 font-sans text-slate-950">
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm font-semibold shadow-sm shadow-slate-200/70">
          Checking session
        </div>
      </main>
    )
  }

  if (!currentUserQuery.data?.user) {
    return <Navigate to="/login" replace />
  }

  return <AppShell />
}
