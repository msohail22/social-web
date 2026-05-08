import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { Button, Card, Input } from '../components/ui'
import { chatMessages, conversations } from '../lib/socialData'

export function ChatPage() {
  const { chatId = 'maya' } = useParams()
  const conversation = conversations.find((item) => item.id === chatId) ?? conversations[0]

  return (
    <section>
      <PageHeader title={conversation.name} description={`@${conversation.username}`} />

      <Card className="flex min-h-[32rem] max-w-3xl flex-col">
        <div className="grid flex-1 content-end gap-3">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={[
                'max-w-[78%] rounded-lg px-3 py-2 text-sm',
                message.from === 'me'
                  ? 'justify-self-end bg-blue-600 text-white'
                  : 'justify-self-start bg-slate-100 text-slate-800',
              ].join(' ')}
            >
              <p>{message.text}</p>
              <p className="mt-1 text-xs opacity-70">{message.time}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
          <Input placeholder="Type a message" />
          <Button>Send</Button>
        </div>
      </Card>
    </section>
  )
}
