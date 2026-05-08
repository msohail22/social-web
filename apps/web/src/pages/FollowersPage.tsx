import { PageHeader } from '../components/PageHeader'
import { Button, Card } from '../components/ui'
import { people } from '../lib/socialData'

export function FollowersPage() {
  return (
    <section>
      <PageHeader title="Followers" description="People following this profile." />

      <div className="grid max-w-3xl gap-3">
        {people.map((person) => (
          <Card key={person.username} className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                {person.avatar}
              </div>
              <div>
                <p className="font-semibold">{person.name}</p>
                <p className="text-sm text-slate-500">@{person.username}</p>
                <p className="mt-1 text-sm text-slate-700">{person.bio}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Follow
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}
