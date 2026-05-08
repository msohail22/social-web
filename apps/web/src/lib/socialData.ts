export type Post = {
  id: string
  author: string
  username: string
  avatar: string
  content: string
  time: string
  tags: string[]
  stats: {
    likes: number
    comments: number
    shares: number
  }
}

export type Person = {
  name: string
  username: string
  avatar: string
  bio: string
}

export const posts: Post[] = [
  {
    id: '101',
    author: 'Aarav Mehta',
    username: 'aarav',
    avatar: 'AM',
    content: 'Building a local-first social app today. Fast routes, clean UI, and no external noise.',
    time: '12m',
    tags: ['localfirst', 'react'],
    stats: { likes: 42, comments: 8, shares: 3 },
  },
  {
    id: '102',
    author: 'Maya Singh',
    username: 'maya',
    avatar: 'MS',
    content: 'The best product decisions are the ones that make repeated actions feel boring in a good way.',
    time: '38m',
    tags: ['design', 'product'],
    stats: { likes: 31, comments: 5, shares: 6 },
  },
  {
    id: '103',
    author: 'Dev Patel',
    username: 'dev',
    avatar: 'DP',
    content: 'Added validation schemas before the UI got too large. Future changes should be easier.',
    time: '1h',
    tags: ['typescript', 'zod'],
    stats: { likes: 19, comments: 4, shares: 2 },
  },
]

export const people: Person[] = [
  {
    name: 'Aarav Mehta',
    username: 'aarav',
    avatar: 'AM',
    bio: 'Frontend engineer working on local-first tools.',
  },
  {
    name: 'Maya Singh',
    username: 'maya',
    avatar: 'MS',
    bio: 'Designer focused on simple social experiences.',
  },
  {
    name: 'Dev Patel',
    username: 'dev',
    avatar: 'DP',
    bio: 'TypeScript, validation, and tidy architecture.',
  },
  {
    name: 'Sara Khan',
    username: 'sara',
    avatar: 'SK',
    bio: 'Writes about communities and small software.',
  },
]

export const conversations = [
  {
    id: 'maya',
    name: 'Maya Singh',
    username: 'maya',
    avatar: 'MS',
    preview: 'Can you review the profile layout once routes are ready?',
    time: '9m',
    unread: 2,
  },
  {
    id: 'dev',
    name: 'Dev Patel',
    username: 'dev',
    avatar: 'DP',
    preview: 'I pushed the schema notes into the local draft.',
    time: '24m',
    unread: 0,
  },
  {
    id: 'sara',
    name: 'Sara Khan',
    username: 'sara',
    avatar: 'SK',
    preview: 'The saved posts flow feels useful already.',
    time: '1h',
    unread: 1,
  },
]

export const chatMessages = [
  { id: '1', from: 'them', text: 'Can you review the profile layout once routes are ready?', time: '10:12' },
  { id: '2', from: 'me', text: 'Yes. I am keeping the shell and cards consistent across pages.', time: '10:13' },
  { id: '3', from: 'them', text: 'Perfect. Keep the create post screen simple too.', time: '10:14' },
]

export const notifications = [
  { id: '1', title: 'Maya liked your post', body: 'Your local-first update is getting attention.', time: '5m' },
  { id: '2', title: 'Dev commented', body: 'Nice structure for the validation flow.', time: '18m' },
  { id: '3', title: 'Sara followed you', body: 'You have a new follower.', time: '42m' },
  { id: '4', title: 'Aarav mentioned you', body: 'Shared your post in a thread about React routing.', time: '1h' },
]
