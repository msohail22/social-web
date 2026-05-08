import { PageHeader } from '../components/PageHeader'
import { PostCard } from '../components/PostCard'
import { posts } from '../lib/socialData'

export function BookmarksPage() {
  return (
    <section>
      <PageHeader title="Bookmarks" description="Posts you saved for later." />

      <div className="grid max-w-3xl gap-4">
        {posts.slice(1).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
