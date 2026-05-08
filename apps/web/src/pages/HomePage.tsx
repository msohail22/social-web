import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PostCard } from '../components/PostCard'
import { Button, Card, Textarea } from '../components/ui'
import { posts } from '../lib/socialData'

export function HomePage() {
  return (
    <section>
      <PageHeader
        title="Home"
        description="Your local feed with recent posts from people you follow."
        action={
          <Link
            to="/posts/new"
            className="inline-flex h-10 items-center rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            New post
          </Link>
        }
      />

      <div className="grid gap-4">
        <Card className="space-y-3">
          <Textarea placeholder="What is happening?" />
          <div className="flex justify-end">
            <Button>Post</Button>
          </div>
        </Card>

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
