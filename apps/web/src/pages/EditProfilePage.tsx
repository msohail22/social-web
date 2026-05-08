import { PageHeader } from '../components/PageHeader'
import { Button, Card, Input, Textarea } from '../components/ui'

export function EditProfilePage() {
  return (
    <section>
      <PageHeader title="Edit profile" description="Update how your local profile appears across the app." />

      <Card className="max-w-2xl space-y-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Display name
          </label>
          <Input id="name" defaultValue="Your Profile" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="username">
            Username
          </label>
          <Input id="username" defaultValue="you" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="bio">
            Bio
          </label>
          <Textarea id="bio" defaultValue="Local social profile ready for posts, followers, and saved activity." />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary">Cancel</Button>
          <Button>Save changes</Button>
        </div>
      </Card>
    </section>
  )
}
