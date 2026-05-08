import { PageHeader } from '../components/PageHeader'
import { Button, Card } from '../components/ui'
import { notifications } from '../lib/socialData'

export function NotificationsPage() {
  return (
    <section>
      <PageHeader title="Notifications" description="Recent activity from your local network." />

      <div className="grid max-w-3xl gap-3">
        {notifications.map((notification) => (
          <Card key={notification.id} className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">{notification.title}</p>
              <p className="mt-1 text-sm text-slate-600">{notification.body}</p>
              <p className="mt-2 text-xs text-slate-500">{notification.time}</p>
            </div>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}
