import { Link } from 'react-router-dom'
import { Card } from '../components/ui'

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 font-sans text-slate-950">
      <Card className="w-full max-w-md text-center">
        <p className="text-sm font-medium text-slate-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="mt-5 inline-flex h-10 items-center rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Go home
        </Link>
      </Card>
    </main>
  )
}
