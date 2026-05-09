# Roadmap

Goal: build an intermediate social networking app with graph-based relationships, ranked feeds, realtime updates, and Cloudflare-native infrastructure.

## Owner Task Split

Use this split as the working assignment plan. Each ticket has one primary owner so work does not drift, but the owner should create small handoff notes whenever a ticket crosses backend/frontend boundaries.

For mixed tickets, the primary owner is responsible for closing the ticket, but should ask the other developer for scoped support. Examples: Charan should support Gandharv on notification and report APIs; Gandharv should support Charan on auth, feed, media, and moderation UI states.

### Charan

Primary focus: backend APIs, data model, Cloudflare services, async workers, performance, security, and production readiness.

- TICKET-S0-01: Establish repo conventions, environment config, and CI basics.
- TICKET-S0-02: Build cookie auth, session handling, and user profile API skeleton.
- TICKET-S0-03: Create core D1 schema for users, follows, and posts.
- TICKET-S0-04: Implement basic post create and read API.
- TICKET-S1-01: Implement follow and unfollow APIs.
- TICKET-S1-02: Add followers, following, and mutual graph queries.
- TICKET-S1-03: Build friends-of-friends recommendation query.
- TICKET-S2-01: Generate feed from follow graph.
- TICKET-S2-02: Add basic feed ranking with likes and recency.
- TICKET-S2-03: Cache feed results in KV.
- TICKET-S3-01: Implement likes and comments APIs.
- TICKET-S3-03: Add realtime interaction updates with Durable Objects.
- TICKET-S4-01: Implement media upload pipeline with R2.
- TICKET-S4-02: Add thumbnailing and compression.
- TICKET-S4-04: Add rate limiting for posts, likes, and comments.
- TICKET-S5-01: Implement user and post search APIs.
- TICKET-S5-02: Update search indexes on write.
- TICKET-S6-01: Add queue worker for feed fan-out.
- TICKET-S6-02: Add queue worker for notification creation.
- TICKET-S6-03: Add queue worker for media processing.
- TICKET-S6-04: Add queue worker for search indexing.
- TICKET-S6-05: Add queue worker for activity logging.
- TICKET-S6-06: Add queue worker for email and webhook dispatch.
- TICKET-S6-07: Add cleanup, retry, and dead-letter handling.
- TICKET-S7-01: Define feed cache invalidation rules.
- TICKET-S7-02: Add hot profile caching.
- TICKET-S7-03: Add denormalized interaction counters.
- TICKET-S7-04: Optimize queries and indexes.
- TICKET-S8-02: Add content moderation hooks.
- TICKET-S8-03: Implement block and mute users.
- TICKET-S8-04: Add spam detection rules.
- TICKET-S9-01: Add structured logging.
- TICKET-S9-02: Add metrics and traces.
- TICKET-S9-04: Define SLOs and alerting.
- TICKET-S11-01: Complete security review.
- TICKET-S11-02: Verify backup and restore.
- TICKET-S11-03: Tune rate limits.
- TICKET-S11-04: Finalize docs and runbooks.

Charan handoffs to Gandharv:
- Auth state DTOs and route contracts for login, logout, register, and current session.
- Feed, profile, interaction, notification, media, search, and moderation API DTO examples.
- Error response shapes and loading/empty-state expectations for each API-backed UI.
- Cloudflare binding names and local development commands that the web app depends on.

### Gandharv

Primary focus: frontend app shell, product flows, UI states, accessibility, dashboards, and user-facing polish.

- TICKET-S0-05: Deliver minimal web shell.
- TICKET-S1-04: Add profile UI follow controls.
- TICKET-S2-04: Implement feed pagination and load more UI.
- TICKET-S3-02: Add like and comment UI.
- TICKET-S3-04: Build notifications V1 UI and connect it to notification APIs.
- TICKET-S4-03: Build post attachments UI.
- TICKET-S5-03: Build search UI with filters.
- TICKET-S8-01: Build report and flag flow UI, including moderation queue screens.
- TICKET-S9-03: Build basic analytics dashboard.
- TICKET-S10-01: Improve UX, empty states, and loading states.
- TICKET-S10-02: Add notification preferences UI and connect it to the preferences API.
- TICKET-S10-03: Run accessibility pass.
- TICKET-S10-04: Add E2E and load tests for core user flows.

Gandharv handoffs to Charan:
- Frontend needs that require API changes, including missing fields, pagination shape issues, and error response gaps.
- UI state requirements for optimistic updates, retries, upload progress, realtime reconnects, and empty states.
- Accessibility and E2E findings that expose backend or routing problems.
- Dashboard metric definitions that need backend aggregation support.

## Sprint 0 (Week 1): Foundations

### TICKET-S0-01: Establish Repo Conventions, Environment Config, And CI Basics
**Description:** Define repository structure, formatting expectations, environment variable conventions, and baseline CI checks for the API, web app, and shared packages.
**Owner:** Charan
**Why This Comes First:** Every later ticket depends on predictable commands, environment variables, and CI checks. Do this before feature work so both developers can run the same project in the same way.

**Implementation Plan:**
- Confirm the repo layout for `apps/web`, `apps/api`, and shared `packages/*`.
- Add or update root-level scripts for install, build, typecheck, lint, and test.
- Add `.env.example` or `.dev.vars.example` with placeholder values only.
- Document local setup for Bun, D1, KV, R2, Durable Objects, and Queues.
- Add a simple pull request CI workflow that runs the baseline checks.

**Suggested Files/Areas:**
- `package.json`
- `README.md`
- `.env.example` or `.dev.vars.example`
- `.github/workflows/*`
- `apps/web/package.json`
- `apps/api/package.json`

**Step-By-Step Work:**
1. List the exact commands a developer should run from a clean checkout.
2. Add root scripts that call the web and API scripts in a consistent way.
3. Create the environment example file with comments for every required binding or secret.
4. Update README with local setup, migration, and Cloudflare binding notes.
5. Add CI with separate build/typecheck steps so failures are easy to identify.
6. Run the commands locally and fix missing scripts before moving on.

**Acceptance Criteria:**
- Root scripts or documented commands exist for install, build, typecheck, lint, and test.
- `.env.example` or `.dev.vars.example` documents required local variables without secrets.
- CI runs typecheck/build for API and web on pull requests.
- README documents local development for web, API, D1, and Cloudflare bindings.

**Done Check:**
- A new developer can clone the repo, follow README, run one install command, run one dev command, and understand which Cloudflare resources are mocked locally.

### TICKET-S0-02: Build Cookie Auth And User Profile Skeleton
**Description:** Complete cookie-based authentication backed by D1 users and expose the minimum profile model needed by the web shell.
**Owner:** Charan
**Frontend Handoff:** Gandharv needs the final auth DTOs, redirect behavior, and error messages before wiring the web shell.
**Why This Comes Before Private Features:** Posts, follows, feeds, media, notifications, and search personalization all require a stable current-user session.

**Implementation Plan:**
- Create user registration, login, logout, and current-session endpoints under `/api/v1/auth/*`.
- Store passwords using salted hashes and never return password fields in API responses.
- Set secure, HTTP-only session cookies with production-safe options.
- Add middleware/helper logic for protected API routes.
- Return a compact profile DTO that the frontend can render immediately.

**Suggested Files/Areas:**
- `apps/api`
- D1 user/session migrations
- Auth route handlers
- Auth middleware
- Shared API DTO types, if a shared package exists
- Web auth client helpers, only as needed for handoff validation

**Step-By-Step Work:**
1. Define `User`, `Session`, and `CurrentUser` DTO shapes before coding routes.
2. Add D1 tables or migrations needed for users and sessions.
3. Implement register with validation for email, username, display name, and password.
4. Implement login with password verification and cookie creation.
5. Implement logout by clearing the session cookie and invalidating the stored session if sessions are persisted.
6. Implement `/api/v1/auth/me` so the frontend can restore signed-in state on refresh.
7. Add route protection helper and use it on one test private route.
8. Add tests for success, invalid credentials, duplicate users, logout, and unauthenticated access.

**Acceptance Criteria:**
- Users can register, log in, log out, and fetch the current session through `/api/v1/auth/*`.
- Passwords are stored as salted hashes, not plaintext.
- Auth middleware protects private API routes.
- Frontend redirects unauthenticated users to login and shows signed-in user state.

**Done Check:**
- A browser session survives refresh, private routes reject anonymous requests, and the API never exposes password hashes or raw session secrets.

### TICKET-S0-03: Create Core D1 Schema For Users, Follows, And Posts
**Description:** Add versioned D1 migrations for the primary social graph and post data model.
**Owner:** Charan
**Why This Matters:** The schema is the foundation for graph queries, feed generation, ranking, interactions, search indexing, and moderation. Keep it simple, indexed, and easy to migrate.

**Implementation Plan:**
- Create versioned D1 migrations for `users`, `follows`, and `posts`.
- Add indexes for username/profile lookup, author post lists, recent post lists, and follow graph lookups.
- Define foreign key behavior explicitly so deletes do not create orphaned data.
- Use consistent timestamp fields across tables.
- Document how to apply migrations locally and against deployed D1 databases.

**Suggested Files/Areas:**
- `apps/api/migrations` or the repo's chosen migration folder
- Wrangler/D1 configuration
- `README.md`
- Schema/type files used by API routes

**Step-By-Step Work:**
1. Decide the migration folder and naming convention, such as `0001_create_core_social_tables.sql`.
2. Define `users` with stable IDs, unique username/email fields, profile fields, and timestamps.
3. Define `follows` with follower/following IDs, uniqueness constraints, and indexes in both directions.
4. Define `posts` with author ID, text content, status fields if needed, and timestamps.
5. Add indexes for the queries already known from Sprint 1 and Sprint 2.
6. Run migrations locally and verify tables/indexes exist.
7. Add rollback or forward-fix notes if the migration system does not support automatic rollback.

**Acceptance Criteria:**
- Migrations define `users`, `follows`, and `posts` tables with indexes for profile lookup, author feeds, and follow queries.
- Foreign key behavior is explicit.
- Created/updated timestamps are represented consistently.
- Migration application is documented for local and deployed D1 databases.

**Done Check:**
- The schema supports creating a user, following another user, creating a post, listing a user's posts, and querying who follows whom without full table scans.

### TICKET-S0-04: Implement Basic Post Create And Read API
**Description:** Add authenticated endpoints for creating posts and reading recent posts.
**Owner:** Charan
**Frontend Handoff:** Gandharv needs the post DTO, validation errors, and pagination shape before building the composer and feed shell.
**Why This Comes After Auth And Schema:** The API needs a signed-in author and a stable posts table before it can create or list content.

**Implementation Plan:**
- Add a protected endpoint for creating text posts.
- Add a read endpoint for recent posts with cursor or timestamp pagination.
- Validate post body length, trim whitespace, and reject empty content.
- Return stable `/api/v1` DTOs that include author summary data.
- Add tests around auth, validation, pagination, and response shape.

**Suggested Files/Areas:**
- `apps/api` post routes
- Post repository/query helpers
- Shared DTO types
- API tests
- README API examples, if the repo keeps route examples there

**Step-By-Step Work:**
1. Define the create-post request body and post response DTO.
2. Implement validation for empty content and max length.
3. Insert posts with the authenticated user's ID as `author_id`.
4. Implement recent-post listing ordered by newest first.
5. Add cursor or timestamp pagination with a clear `nextCursor` response field.
6. Include compact author fields so the frontend can render a feed item without extra requests.
7. Add tests for anonymous create, valid create, invalid content, first page, next page, and stable ordering.

**Acceptance Criteria:**
- Authenticated users can create text posts.
- API validates post body length and rejects empty content.
- Recent posts can be listed with cursor or timestamp pagination.
- Responses use stable DTO shapes under `/api/v1`.

**Done Check:**
- A logged-in user can create a post, refresh the recent-post endpoint, and see that post returned with author information and pagination metadata.

### TICKET-S0-05: Deliver Minimal Web Shell
**Description:** Keep the web app usable with home, profile, and feed placeholder views while backend features are under construction.
**Owner:** Gandharv
**Backend Handoff:** Charan must provide auth route contracts and the current-user DTO before the protected shell is considered complete.
**Why This Completes Sprint 0:** The app needs a visible, navigable surface where future backend features can be connected without rebuilding layout each sprint.

**Implementation Plan:**
- Build the authenticated app shell with stable layout, navigation, and route protection.
- Add login/register/logout screens or connect to existing auth screens.
- Create home, profile, and feed placeholder routes.
- Add loading, empty, and error states for panels that will later call APIs.
- Ensure direct deep links work through the SPA fallback.

**Suggested Files/Areas:**
- `apps/web`
- Web router setup
- Auth provider/session store
- Layout/navigation components
- Home, profile, and feed route components
- Web README or local dev notes

**Step-By-Step Work:**
1. Define the route map for public auth pages and protected app pages.
2. Add an auth/session provider that calls `/api/v1/auth/me` on app load.
3. Redirect anonymous users from protected pages to login.
4. Show signed-in user state and a logout action in the app shell.
5. Create stable placeholder pages for home, profile, and feed.
6. Add loading, empty, and error components that can be reused by later API-backed screens.
7. Verify browser refresh works on every route.
8. Check mobile and desktop layouts for obvious overflow or navigation issues.

**Acceptance Criteria:**
- App shell is protected by auth.
- Home, profile, and feed placeholder pages render without layout shift.
- Empty/loading/error states are present for API-backed panels.
- Navigation works on direct deep links through the SPA fallback.

**Done Check:**
- A user can log in, land inside the protected shell, move between home/profile/feed pages, refresh any route, and log out without seeing broken navigation or blank screens.

## Sprint 1 (Week 2): Graph And Follow System

### TICKET-S1-01: Implement Follow And Unfollow APIs
**Description:** Allow authenticated users to follow and unfollow other users.
**Acceptance Criteria:**
- Users cannot follow themselves.
- Follow operations are idempotent.
- D1 uniqueness constraints prevent duplicate follows.
- API returns current relationship state after each mutation.

### TICKET-S1-02: Add Followers, Following, And Mutual Graph Queries
**Description:** Expose graph query endpoints for profile pages and social context.
**Acceptance Criteria:**
- Profile followers and following lists support pagination.
- Mutual followers can be fetched for a viewed profile.
- Queries use indexed D1 access paths.
- API returns compact user summaries.

### TICKET-S1-03: Build Friends-Of-Friends Recommendation Query
**Description:** Recommend accounts based on second-degree graph relationships.
**Acceptance Criteria:**
- Recommendations exclude the current user and already-followed users.
- Results include a reason signal, such as mutual connection count.
- Query has deterministic ordering and pagination.
- Empty-state behavior is defined.

### TICKET-S1-04: Add Profile UI Follow Controls
**Description:** Connect profile pages to relationship APIs and graph data.
**Acceptance Criteria:**
- Follow/unfollow buttons update optimistically and recover on API failure.
- Follower/following counts refresh after mutations.
- Profile pages show mutual context when available.
- Loading and disabled states prevent duplicate actions.

## Sprint 2 (Week 3): Feed V1

### TICKET-S2-01: Generate Feed From Follow Graph
**Description:** Return posts authored by users the current user follows.
**Acceptance Criteria:**
- Feed excludes blocked or unavailable authors once those states exist.
- Feed query supports cursor pagination.
- New users receive a reasonable empty or discovery state.
- API route is protected and versioned.

### TICKET-S2-02: Add Basic Feed Ranking With Likes And Recency
**Description:** Rank feed items using a simple score based on recency and interaction counts.
**Acceptance Criteria:**
- Ranking formula is documented in code.
- Ordering is stable for equal scores.
- Pagination does not duplicate or skip items.
- Tests cover score ordering edge cases.

### TICKET-S2-03: Cache Feed Results In KV
**Description:** Store computed feed pages in Cloudflare KV to reduce repeated D1 reads.
**Acceptance Criteria:**
- KV key format includes user id, cursor, and ranking version.
- Cache TTL is configurable.
- Cache miss and cache hit paths return identical DTO shapes.
- Local development works without deployed KV secrets.

### TICKET-S2-04: Implement Feed Pagination And Load More UI
**Description:** Add incremental feed loading to the web home page.
**Acceptance Criteria:**
- Frontend uses TanStack Query infinite queries.
- Load more button or sentinel fetches next page.
- Loading, empty, and error states are visible.
- Pagination state survives basic route navigation.

## Sprint 3 (Week 4): Interactions

### TICKET-S3-01: Implement Likes And Comments APIs
**Description:** Add endpoints to like/unlike posts and create/list comments.
**Acceptance Criteria:**
- Like and unlike are idempotent.
- Comment creation validates body length.
- Post detail response includes counts and current-user interaction state.
- D1 indexes support post interaction queries.

### TICKET-S3-02: Add Like And Comment UI
**Description:** Wire feed and post detail views to interaction APIs.
**Acceptance Criteria:**
- Likes update optimistically.
- Comment forms handle pending and failure states.
- Counts stay consistent after mutation.
- UI works on mobile and desktop layouts.

### TICKET-S3-03: Add Realtime Interaction Updates With Durable Objects
**Description:** Use Durable Objects to coordinate realtime updates for likes and comments.
**Acceptance Criteria:**
- Clients can subscribe to a post interaction channel.
- Like/comment events broadcast to active subscribers.
- Reconnect behavior is defined.
- Durable Object state boundaries are documented.

### TICKET-S3-04: Build Notifications V1
**Description:** Create notifications for likes, follows, and comments.
**Acceptance Criteria:**
- Notification records are created for supported events.
- Users can list unread and recent notifications.
- Users can mark notifications as read.
- Notification UI shows actor, action, target, and time.

## Sprint 4 (Week 5): Media And Uploads

### TICKET-S4-01: Implement Media Upload Pipeline With R2
**Description:** Support image uploads for post attachments through Cloudflare R2.
**Acceptance Criteria:**
- Authenticated users can request an upload target.
- Uploaded media is associated with a post draft or final post.
- R2 object keys are namespaced by user and date.
- API enforces file size and MIME type limits.

### TICKET-S4-02: Add Thumbnailing And Compression
**Description:** Process uploaded media into optimized variants.
**Acceptance Criteria:**
- Original and thumbnail variants are stored or derivable.
- Processing failures are recorded and retryable.
- UI can render a stable thumbnail URL.
- Large images are compressed within configured limits.

### TICKET-S4-03: Build Post Attachments UI
**Description:** Allow users to attach media while composing posts.
**Acceptance Criteria:**
- Users can add, preview, and remove attachments before publishing.
- Upload progress and failure states are visible.
- Published posts render attachments in feed and detail views.
- Accessibility labels are present for media controls.

### TICKET-S4-04: Add Rate Limiting For Posts, Likes, And Comments
**Description:** Protect write-heavy endpoints from abuse.
**Acceptance Criteria:**
- Limits are scoped by user and IP where appropriate.
- API returns clear 429 responses.
- Limits are configurable per route category.
- Tests cover limit exceeded and reset behavior.

## Sprint 5 (Week 6): Search

### TICKET-S5-01: Implement User And Post Search APIs
**Description:** Add search endpoints for users and posts.
**Acceptance Criteria:**
- Search supports query text, pagination, and result type filtering.
- User results include profile summary fields.
- Post results include author and highlight-ready content.
- Empty queries are rejected or handled intentionally.

### TICKET-S5-02: Update Search Indexes On Write
**Description:** Keep search data current when users and posts change.
**Acceptance Criteria:**
- User profile changes update searchable fields.
- New and edited posts update post index data.
- Deletes or hidden content are removed from results.
- Index update failures are observable and retryable.

### TICKET-S5-03: Build Search UI With Filters
**Description:** Connect the search page to backend search endpoints.
**Acceptance Criteria:**
- Users can switch between all, people, and posts results.
- Query state is reflected in the URL.
- Loading and no-results states are clear.
- Results are keyboard accessible.

## Sprint 6 (Week 7): Queues And Fan-Out

### TICKET-S6-01: Add Queue Worker For Feed Fan-Out
**Description:** Fan out new posts to follower feed caches asynchronously.
**Acceptance Criteria:**
- Post creation enqueues a feed fan-out job.
- Worker updates feed cache entries for followers.
- Large follower sets are chunked.
- Job progress and failures are logged.

### TICKET-S6-02: Add Queue Worker For Notification Creation
**Description:** Move notification creation to asynchronous queue processing.
**Acceptance Criteria:**
- Interaction and follow events enqueue notification jobs.
- Worker deduplicates noisy events where needed.
- Notification records are created with stable payloads.
- Failed jobs are retryable.

### TICKET-S6-03: Add Queue Worker For Media Processing
**Description:** Process uploaded media variants asynchronously.
**Acceptance Criteria:**
- Upload completion enqueues media processing.
- Worker creates thumbnails/compressed variants.
- Processing status is queryable.
- Failed media jobs can be retried.

### TICKET-S6-04: Add Queue Worker For Search Indexing
**Description:** Decouple search index updates from request latency.
**Acceptance Criteria:**
- User and post writes enqueue indexing jobs.
- Worker handles create, update, and delete operations.
- Index version is tracked.
- Reindexing can be triggered safely.

### TICKET-S6-05: Add Queue Worker For Activity Logging
**Description:** Capture important user and system events asynchronously.
**Acceptance Criteria:**
- Events include actor, action, target, timestamp, and request context.
- Logging does not block user-facing requests.
- Sensitive fields are excluded.
- Logs can be queried for support/debugging.

### TICKET-S6-06: Add Queue Worker For Email And Webhook Dispatch
**Description:** Send outbound notifications without blocking request flows.
**Acceptance Criteria:**
- Dispatch jobs support email and webhook channels.
- Retry rules avoid duplicate sends where possible.
- User notification preferences are respected.
- Delivery errors are recorded.

### TICKET-S6-07: Add Cleanup, Retry, And Dead-Letter Handling
**Description:** Define operational behavior for failed and stale async work.
**Acceptance Criteria:**
- Dead-letter queues are configured where supported.
- Failed jobs include enough metadata for triage.
- Cleanup jobs remove expired sessions, stale uploads, and old cache keys.
- Runbook documents replay and recovery steps.

## Sprint 7 (Week 8): Caching And Performance

### TICKET-S7-01: Define Feed Cache Invalidation Rules
**Description:** Keep feed cache correct when posts, follows, likes, and blocks change.
**Acceptance Criteria:**
- Invalidation events are documented by source mutation.
- Cache keys include versioning for ranking changes.
- Stale cache windows are acceptable and documented.
- Tests cover major invalidation paths.

### TICKET-S7-02: Add Hot Profile Caching
**Description:** Cache frequently viewed profile summaries and counters.
**Acceptance Criteria:**
- Profile cache entries include user summary and social counts.
- Cache invalidates on profile edit and follow changes.
- API falls back to D1 on cache miss.
- Local development can run without deployed KV.

### TICKET-S7-03: Add Denormalized Interaction Counters
**Description:** Maintain post like/comment counts for fast feed rendering.
**Acceptance Criteria:**
- Counters update on like/comment mutations.
- Counter repair job can recompute from source tables.
- Race conditions are handled or bounded.
- Feed and detail APIs use counters consistently.

### TICKET-S7-04: Optimize Queries And Indexes
**Description:** Review D1 access patterns and add indexes for hot paths.
**Acceptance Criteria:**
- Feed, profile, graph, notification, and search queries are profiled.
- Slow queries have indexes or query changes.
- Migration includes new indexes.
- Performance notes are documented.

## Sprint 8 (Week 9): Safety And Moderation

### TICKET-S8-01: Build Report And Flag Flow
**Description:** Allow users to report posts, comments, and profiles.
**Acceptance Criteria:**
- Report API records reporter, target, reason, and details.
- Users cannot spam duplicate reports for the same target.
- Moderation queue view can list reports.
- Reported content can be hidden or reviewed.

### TICKET-S8-02: Add Content Moderation Hooks
**Description:** Introduce moderation checks into post and comment creation.
**Acceptance Criteria:**
- Moderation hook interface is separated from route code.
- Content can be allowed, flagged, or rejected.
- Flagged content is visible to moderators.
- Fail-open/fail-closed behavior is explicit.

### TICKET-S8-03: Implement Block And Mute Users
**Description:** Add user-level controls for blocking and muting.
**Acceptance Criteria:**
- Blocked users cannot interact with blockers.
- Muted users are hidden from feeds where applicable.
- Graph and feed queries respect block/mute state.
- UI exposes block/mute actions and state.

### TICKET-S8-04: Add Spam Detection Rules
**Description:** Add lightweight rule-based spam detection for abusive behavior.
**Acceptance Criteria:**
- Rules cover repeated posts, repeated follows, and high-frequency comments.
- Suspicious actions can be rate limited or flagged.
- Rule decisions are logged.
- False-positive recovery path is documented.

## Sprint 9 (Week 10): Observability And Analytics

### TICKET-S9-01: Add Structured Logging
**Description:** Standardize application logs across API routes, workers, and queues.
**Acceptance Criteria:**
- Logs include request id, user id where available, route, status, and duration.
- Errors include actionable context without secrets.
- Queue jobs log lifecycle events.
- Local logs are readable during development.

### TICKET-S9-02: Add Metrics And Traces
**Description:** Track health and latency for user-facing and async workflows.
**Acceptance Criteria:**
- Key API routes expose latency and error metrics.
- Queue processing emits success/failure counts.
- D1/KV/R2 operation failures are visible.
- Trace ids connect request and async follow-up work.

### TICKET-S9-03: Build Basic Analytics Dashboard
**Description:** Show product metrics for posts, monthly active users, and engagement.
**Acceptance Criteria:**
- Dashboard shows posts created, active users, follows, likes, and comments.
- Metrics are scoped by date range.
- Data source is documented.
- Dashboard is protected from non-admin users.

### TICKET-S9-04: Define SLOs And Alerting
**Description:** Establish operational targets and alerts for critical paths.
**Acceptance Criteria:**
- SLOs cover auth, feed, posting, and queue latency.
- Alerts are tied to actionable runbooks.
- Error budgets are documented.
- Alert noise is reviewed before launch.

## Sprint 10 (Week 11): Polishing

### TICKET-S10-01: Improve UX, Empty States, And Loading States
**Description:** Polish core web flows for clarity and resilience.
**Acceptance Criteria:**
- Feed, profile, search, notifications, and post detail have empty states.
- Loading states avoid layout jumps.
- Error states offer retry actions where useful.
- Copy is consistent across the app.

### TICKET-S10-02: Add Notification Preferences
**Description:** Let users control notification channels and categories.
**Acceptance Criteria:**
- Preferences cover likes, comments, follows, and mentions when available.
- API persists preferences per user.
- Notification creation respects preferences.
- Settings UI can update preferences.

### TICKET-S10-03: Run Accessibility Pass
**Description:** Improve keyboard, screen reader, and contrast support.
**Acceptance Criteria:**
- Main flows are keyboard navigable.
- Form controls have labels and error associations.
- Color contrast meets WCAG AA for normal text.
- Automated accessibility checks run in CI or E2E.

### TICKET-S10-04: Add E2E And Load Tests
**Description:** Cover core flows and basic performance expectations.
**Acceptance Criteria:**
- E2E covers register, login, post, follow, feed, search, and logout.
- Load tests cover feed and post creation APIs.
- Test data setup and cleanup are automated.
- Results are documented with thresholds.

## Sprint 11 (Week 12): Launch Prep

### TICKET-S11-01: Complete Security Review
**Description:** Review auth, sessions, data access, and public endpoints before launch.
**Acceptance Criteria:**
- Session cookie settings are reviewed for production.
- Authorization checks are verified on protected routes.
- Rate limits are enabled for sensitive mutations.
- Findings are tracked to resolution.

### TICKET-S11-02: Verify Backup And Restore
**Description:** Prove that critical data can be backed up and restored.
**Acceptance Criteria:**
- D1 backup/export process is documented.
- Restore process is tested against a non-production database.
- R2 media recovery assumptions are documented.
- Recovery time expectations are stated.

### TICKET-S11-03: Tune Rate Limits
**Description:** Adjust limits using observed behavior from testing.
**Acceptance Criteria:**
- Route-specific limits are documented.
- Legitimate high-use paths are not blocked unexpectedly.
- Abuse scenarios are covered.
- 429 responses include useful retry information.

### TICKET-S11-04: Finalize Docs And Runbooks
**Description:** Prepare developer and operational documentation for launch.
**Acceptance Criteria:**
- Setup, deploy, migration, and rollback docs are complete.
- Runbooks exist for failed deploys, queue failures, D1 issues, and auth incidents.
- Architecture overview includes Cloudflare service mapping.
- Known limitations are documented.

## Cloudflare Mapping

| Capability | Cloudflare Service | Primary Use |
| --- | --- | --- |
| Primary data store | D1 | Users, graph, posts, interactions, notifications |
| Feed and profile cache | KV | Cached feed pages, hot profile summaries, invalidation metadata |
| Realtime state | Durable Objects | Post interaction channels, counters, presence |
| Media storage | R2 | Original media, thumbnails, compressed variants |
| Async processing | Queues | Feed fan-out, notifications, media processing, search indexing, activity logging, email/webhook dispatch, cleanup/retries |
