import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Input } from '../components/ui'
import { getApiErrorMessage } from '../lib/api/client'
import { useCurrentUser, useLogin } from '../lib/auth'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const currentUserQuery = useCurrentUser()
  const loginMutation = useLogin()
  const currentUser = currentUserQuery.data?.user

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => navigate('/'),
      },
    )
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 font-sans text-slate-950">
      <Card className="w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="mt-1 text-sm text-slate-600">Access your local social profile.</p>
        </div>

        {currentUser ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            Signed in as <span className="font-semibold">{currentUser.name}</span>.
          </div>
        ) : null}

        {loginMutation.isError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {getApiErrorMessage(loginMutation.error)}
          </div>
        ) : null}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Email
            <Input
              aria-label="Email"
              autoComplete="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Password
            <Input
              aria-label="Password"
              autoComplete="current-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
            Login
          </Button>
        </form>

        <div className="flex justify-between gap-4 text-sm">
          <Link to="/forgot-password" className="text-slate-600 hover:text-slate-950 hover:underline">
            Forgot password?
          </Link>
          <Link to="/register" className="font-medium hover:underline">
            Create account
          </Link>
        </div>
        {currentUser ? (
          <Link to="/logout" className="block text-center text-sm font-medium text-slate-600 hover:underline">
            Logout
          </Link>
        ) : null}
      </Card>
    </main>
  )
}
