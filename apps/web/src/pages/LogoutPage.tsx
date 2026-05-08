import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { getApiErrorMessage } from '../lib/api/client'
import { useCurrentUser, useLogout } from '../lib/auth'

export function LogoutPage() {
  const [hasLoggedOut, setHasLoggedOut] = useState(false)
  const currentUserQuery = useCurrentUser()
  const logoutMutation = useLogout()
  const currentUser = currentUserQuery.data?.user

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => setHasLoggedOut(true),
    })
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 font-sans text-slate-950">
      <Card className="w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">{currentUser ? 'Logout' : 'Signed out'}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {currentUser ? 'End the current cookie session.' : 'No active cookie session was found.'}
          </p>
        </div>

        {currentUser ? (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-950">{currentUser.name}</p>
            <p className="text-slate-500">{currentUser.email}</p>
          </div>
        ) : null}

        {hasLoggedOut ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            You are signed out.
          </div>
        ) : null}

        {logoutMutation.isError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {getApiErrorMessage(logoutMutation.error)}
          </div>
        ) : null}

        {currentUser ? (
          <Button className="w-full" variant="danger" isLoading={logoutMutation.isPending} onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              Register
            </Link>
          </div>
        )}
      </Card>
    </main>
  )
}
