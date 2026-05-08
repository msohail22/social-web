import { Link } from 'react-router-dom'
import { Button, Card, Input } from '../components/ui'

export function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 font-sans text-slate-950">
      <Card className="w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">Reset password</h1>
          <p className="mt-1 text-sm text-slate-600">Enter your email to start a local recovery flow.</p>
        </div>
        <Input type="email" placeholder="Email" />
        <Button className="w-full">Continue</Button>
        <Link to="/login" className="block text-center text-sm font-medium hover:underline">
          Back to login
        </Link>
      </Card>
    </main>
  )
}
