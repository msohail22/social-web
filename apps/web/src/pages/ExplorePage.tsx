import { PageHeader } from '../components/PageHeader'
import { PostCard } from '../components/PostCard'
import { Card } from '../components/ui'
import { posts } from '../lib/socialData'

const topics = ['localfirst', 'react', 'design', 'typescript', 'zod', 'routing']

export function ExplorePage() {
  return (
    <section>
      <PageHeader title="Explore" description="Discover popular topics and posts across the local network." />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <Card>
          <h2 className="text-sm font-semibold text-slate-950">Trending topics</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {topics.map((topic) => (
              <span key={topic} className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                #{topic}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
