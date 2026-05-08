import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PostCard } from '../components/PostCard'
import { Button, Card } from '../components/ui'
import { people, posts } from '../lib/socialData'

export function ProfilePage() {
  const { username = 'you' } = useParams()
  const person = people.find((item) => item.username === username) ?? {
    name: 'Your Profile',
    username: 'you',
    avatar: 'YP',
    bio: 'Local social profile ready for posts, followers, and saved activity.',
  }

  return (
    <section>
      <PageHeader title={person.name} description={`@${person.username}`} />

      <div className="grid gap-4">
        <Card className="space-y-5">
          <div className="h-32 rounded-lg bg-slate-900" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="-mt-14 flex size-24 items-center justify-center rounded-full border-4 border-white bg-slate-950 text-xl font-semibold text-white">
                {person.avatar}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{person.name}</h2>
                <p className="text-sm text-slate-500">@{person.username}</p>
              </div>
            </div>
            <Link
              to="/profile/edit"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium hover:bg-slate-100"
            >
              Edit profile
            </Link>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-700">{person.bio}</p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <Link to={`/profile/${person.username}/followers`} className="hover:underline">
              <span className="font-semibold text-slate-950">248</span> followers
            </Link>
            <Link to={`/profile/${person.username}/following`} className="hover:underline">
              <span className="font-semibold text-slate-950">182</span> following
            </Link>
            <span>
              <span className="font-semibold text-slate-950">36</span> posts
            </span>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Posts
          </Button>
          <Button variant="ghost" size="sm">
            Replies
          </Button>
          <Button variant="ghost" size="sm">
            Media
          </Button>
        </div>

        {posts.slice(0, 2).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
