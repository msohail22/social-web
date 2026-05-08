import { Link } from 'react-router-dom'
import { useCurrentUser } from '../lib/auth'
import { people } from '../lib/socialData'
import { Button, Card, Input } from './ui'

const topics = ['react', 'localfirst', 'design', 'typescript']

export function RightSidebar() {
  const currentUserQuery = useCurrentUser()
  const currentUser = currentUserQuery.data?.user
  const displayName = currentUser?.name ?? 'Guest'
  const displayEmail = currentUser?.email ?? 'Login to sync this browser session'

  return (
    <aside className="hidden min-w-0 bg-slate-100/70 px-6 py-6 xl:block 2xl:px-8">
      <div className="sticky top-6 grid w-full gap-4">
        <Card className="space-y-4">
          <Input placeholder="Search Social Web" />
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">Signed in as</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {currentUser ? getInitials(currentUser.name) : 'G'}
              </div>
              <div>
                <p className="font-semibold text-slate-950">
                  {currentUserQuery.isLoading ? 'Checking session' : displayName}
                </p>
                <p className="text-sm text-slate-500">{displayEmail}</p>
              </div>
            </div>
          </div>
          {currentUser ? (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/profile/edit"
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                Edit profile
              </Link>
              <Link
                to="/logout"
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                Logout
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950">Who to follow</h2>
            <Link to="/search" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              See all
            </Link>
          </div>
          <div className="mt-4 grid gap-4">
            {people.slice(0, 3).map((person) => (
              <div key={person.username} className="flex items-center justify-between gap-3">
                <Link to={`/profile/${person.username}`} className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {person.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{person.name}</p>
                    <p className="truncate text-xs text-slate-500">@{person.username}</p>
                  </div>
                </Link>
                <Button variant="secondary" size="sm">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-slate-950">Trending locally</h2>
          <div className="mt-4 grid gap-2">
            {topics.map((topic, index) => (
              <Link
                key={topic}
                to={`/search?q=${topic}`}
                className="rounded-md p-2 transition-colors hover:bg-slate-50"
              >
                <p className="text-xs font-medium text-slate-500">#{index + 1} in your network</p>
                <p className="text-sm font-semibold text-slate-950">#{topic}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </aside>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
