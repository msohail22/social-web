import { Link, NavLink, Outlet } from 'react-router-dom'
import { RightSidebar } from './RightSidebar'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'Search', to: '/search' },
  { label: 'Messages', to: '/messages' },
  { label: 'Notifications', to: '/notifications' },
  { label: 'Bookmarks', to: '/bookmarks' },
  { label: 'Profile', to: '/profile' },
  { label: 'Settings', to: '/settings' },
]

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-md px-3 py-2 text-sm font-semibold transition-colors',
    isActive ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  ].join(' ')
}

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-950">
      <div className="grid min-h-screen w-full lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_26rem] 2xl:grid-cols-[17rem_minmax(0,1fr)_30rem]">
        <aside className="border-b border-slate-200 bg-white px-4 py-4 lg:sticky lg:left-0 lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link to="/" className="text-lg font-bold tracking-tight text-slate-950">
              Social Web
            </Link>
            <Link
              to="/posts/new"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 lg:hidden"
            >
              New post
            </Link>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} end={item.to === '/'}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/posts/new"
            className="mt-5 hidden w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 lg:block"
          >
            New post
          </Link>

          <div className="mt-6 hidden rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 lg:block">
            <p className="font-semibold text-slate-900">Local mode</p>
            <p className="mt-1">This social space is set up for this system first.</p>
          </div>
        </aside>

        <main className="min-w-0 border-slate-200 px-4 py-6 sm:px-6 xl:border-r xl:px-8">
          <div className="mx-auto w-full max-w-4xl">
            <Outlet />
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  )
}
