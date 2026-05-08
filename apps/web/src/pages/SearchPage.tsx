import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PostCard } from '../components/PostCard'
import { Button, Card, Input } from '../components/ui'
import { people, posts } from '../lib/socialData'

export function SearchPage() {
  return (
    <section>
      <PageHeader title="Search" description="Find posts, people, and tags." />

      <div className="grid gap-4">
        <Card className="space-y-3">
          <Input placeholder="Search the local network" />
          <div className="flex flex-wrap gap-2">
            <Button size="sm">All</Button>
            <Button variant="ghost" size="sm">
              People
            </Button>
            <Button variant="ghost" size="sm">
              Posts
            </Button>
            <Button variant="ghost" size="sm">
              Tags
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <Card className="space-y-3">
            <h2 className="text-sm font-semibold">People</h2>
            {people.slice(0, 3).map((person) => (
              <Link
                key={person.username}
                to={`/profile/${person.username}`}
                className="flex items-center gap-3 rounded-md p-2 hover:bg-slate-50"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                  {person.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{person.name}</p>
                  <p className="text-xs text-slate-500">@{person.username}</p>
                </div>
              </Link>
            ))}
          </Card>

          <div className="grid gap-4">
            {posts.slice(0, 2).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
