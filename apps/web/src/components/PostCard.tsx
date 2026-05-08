import { Link } from 'react-router-dom'
import type { Post } from '../lib/socialData'
import { Button, Card } from './ui'

type PostCardProps = {
  post: Post
  compact?: boolean
}

export function PostCard({ post, compact = false }: PostCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
          {post.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link to={`/profile/${post.username}`} className="font-semibold hover:underline">
              {post.author}
            </Link>
            <span className="text-sm text-slate-500">@{post.username}</span>
            <span className="text-sm text-slate-400">/</span>
            <span className="text-sm text-slate-500">{post.time}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-800">{post.content}</p>
        </div>
      </div>

      {post.tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/search?q=${tag}`}
              className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              #{tag}
            </Link>
          ))}
        </div>
      ) : null}

      {compact ? null : (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          <Button variant="ghost" size="sm">
            Like {post.stats.likes}
          </Button>
          <Link
            to={`/posts/${post.id}`}
            className="inline-flex h-8 items-center rounded-md px-3 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100"
          >
            Comments {post.stats.comments}
          </Link>
          <Button variant="ghost" size="sm">
            Share {post.stats.shares}
          </Button>
        </div>
      )}
    </Card>
  )
}
