# Roadmap

Goal: intermediate social networking app with graph-based relationships, ranked feed, realtime updates, and Cloudflare-native infra.

## Sprint 0 (Week 1) - Foundations
- Repo conventions, env config, CI basics
- Auth + user profile skeleton
- Core schema: users, follows, posts
- Basic post create/read API
- Minimal web shell (home, profile, feed placeholder)

## Sprint 1 (Week 2) - Graph + Follow System
- Follow/unfollow APIs
- Graph queries: followers, following, mutuals
- Friends-of-friends recommendation query
- Profile UI with follow controls

## Sprint 2 (Week 3) - Feed v1
- Feed generation from follows
- Basic ranking: likes + recency
- Feed cache (KV)
- Pagination + load more

## Sprint 3 (Week 4) - Interactions
- Likes + comments APIs
- UI for like/comment
- Realtime updates for likes/comments (Durable Objects)
- Notifications v1 (like/follow/comment)

## Sprint 4 (Week 5) - Media + Uploads
- Media upload pipeline (R2)
- Thumbnailing/compression
- Post attachments UI
- Rate limiting for posts/likes/comments

## Sprint 5 (Week 6) - Search
- Search users + posts
- Index updates on write
- Search UI + filters

## Sprint 6 (Week 7) - Queues + Fan-out
- Queue workers for:
  - Feed fan-out to followers
  - Notifications creation
  - Media processing
  - Search indexing
  - Activity logging
  - Email/webhook dispatch
  - Cleanup + retries
- Retry + dead-letter handling

## Sprint 7 (Week 8) - Caching + Performance
- Feed cache invalidation rules
- Hot profile caching
- Denormalized counters (likes/comments)
- Query optimization + indexes

## Sprint 8 (Week 9) - Safety + Moderation
- Report/flag flow
- Content moderation hooks
- Block/mute users
- Spam detection rules

## Sprint 9 (Week 10) - Observability + Analytics
- Structured logging
- Metrics + traces
- Basic analytics dashboard (posts, MAU, engagement)
- SLOs and alerting

## Sprint 10 (Week 11) - Polishing
- UX improvements, empty states, loading
- Notifications preferences
- Accessibility pass
- E2E + load tests

## Sprint 11 (Week 12) - Launch Prep
- Security review
- Backup/restore checks
- Rate limit tuning
- Final docs + runbooks

## Cloudflare Mapping
- D1: primary data store
- KV: feed + profile cache
- Durable Objects: realtime state, counters, presence
- R2: media storage
- Queues: async fan-out, notifications, indexing
