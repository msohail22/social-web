import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Input } from '../components/ui'
import { getApiErrorMessage } from '../lib/api/client'
import { useRegister } from '../lib/auth'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const registerMutation = useRegister()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => navigate('/'),
      },
    )
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 font-sans text-slate-950">
      <Card className="w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="mt-1 text-sm text-slate-600">Set up a local user for this system.</p>
        </div>

        {registerMutation.isSuccess ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            Account created for <span className="font-semibold">{registerMutation.data.user.name}</span>.
          </div>
        ) : null}

        {registerMutation.isError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {getApiErrorMessage(registerMutation.error)}
          </div>
        ) : null}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Display name
            <Input
              aria-label="Display name"
              autoComplete="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
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
              autoComplete="new-password"
              minLength={8}
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
            Register
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-slate-950 hover:underline">
            Login
          </Link>
        </p>
        {registerMutation.isSuccess ? (
          <Link to="/" className="block text-center text-sm font-medium text-slate-600 hover:underline">
            Continue to home
          </Link>
        ) : null}
      </Card>
    </main>
  )
}
