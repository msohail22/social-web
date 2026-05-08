import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { Card, Input } from '../components/ui'
import { conversations } from '../lib/socialData'

export function MessagesPage() {
  return (
    <section>
      <PageHeader title="Messages" description="Your local conversations." />

      <div className="grid max-w-3xl gap-4">
        <Input placeholder="Search messages" />
        {conversations.map((conversation) => (
          <Link key={conversation.id} to={`/messages/${conversation.id}`}>
            <Card className="flex items-start gap-3 transition-colors hover:bg-slate-50">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                {conversation.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{conversation.name}</p>
                  <span className="text-xs text-slate-500">{conversation.time}</span>
                </div>
                <p className="text-sm text-slate-500">@{conversation.username}</p>
                <p className="mt-2 truncate text-sm text-slate-700">{conversation.preview}</p>
              </div>
              {conversation.unread > 0 ? (
                <span className="rounded-full bg-slate-950 px-2 py-1 text-xs font-medium text-white">
                  {conversation.unread}
                </span>
              ) : null}
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
