import { PageHeader } from '../components/PageHeader'
import { Button, Card, Input } from '../components/ui'

export function SettingsPage() {
  return (
    <section>
      <PageHeader title="Settings" description="Manage account, privacy, and local data preferences." />

      <div className="grid max-w-3xl gap-4">
        <Card className="space-y-4">
          <h2 className="text-base font-semibold">Account</h2>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <Input id="email" type="email" defaultValue="you@example.com" />
          </div>
          <Button>Save account</Button>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-base font-semibold">Privacy</h2>
          <div className="flex items-center justify-between gap-4 rounded-md bg-slate-50 p-3">
            <div>
              <p className="text-sm font-medium">Private profile</p>
              <p className="text-sm text-slate-500">Approve followers before they can see your posts.</p>
            </div>
            <Button variant="secondary" size="sm">
              Off
            </Button>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-base font-semibold">Local data</h2>
          <p className="text-sm text-slate-600">Export or clear local social data stored on this system.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary">Export data</Button>
            <Button variant="danger">Clear data</Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
