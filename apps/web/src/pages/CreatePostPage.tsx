import { PageHeader } from '../components/PageHeader'
import { Button, Card, Input, Textarea } from '../components/ui'

export function CreatePostPage() {
  return (
    <section>
      <PageHeader title="Create post" description="Write a new local post for your feed." />

      <Card className="max-w-2xl space-y-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="post-body">
            Post
          </label>
          <Textarea id="post-body" placeholder="Share something with your network." />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="post-tags">
            Tags
          </label>
          <Input id="post-tags" placeholder="react, design, localfirst" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary">Save draft</Button>
          <Button>Publish</Button>
        </div>
      </Card>
    </section>
  )
}
