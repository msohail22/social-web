import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PostCard } from '../components/PostCard'
import { Button, Card, Input } from '../components/ui'
import { posts } from '../lib/socialData'

const comments = [
  { id: '1', author: 'Maya Singh', body: 'This feels clean and easy to scan.' },
  { id: '2', author: 'Dev Patel', body: 'The reusable card structure should scale well.' },
]

export function PostDetailPage() {
  const { postId } = useParams()
  const post = posts.find((item) => item.id === postId) ?? posts[0]

  return (
    <section>
      <PageHeader title="Post" description="View the full conversation for this post." />

      <div className="grid max-w-3xl gap-4">
        <PostCard post={post} compact />

        <Card className="space-y-3">
          <h2 className="text-sm font-semibold">Comments</h2>
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-md bg-slate-50 p-3">
              <p className="text-sm font-medium">{comment.author}</p>
              <p className="mt-1 text-sm text-slate-700">{comment.body}</p>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Input placeholder="Write a comment" />
            <Button>Reply</Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
