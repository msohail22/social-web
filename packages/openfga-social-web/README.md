# openfga-social-web

Reusable OpenFGA authorization package for the social-web apps.

It includes:

- A social authorization model for users, profiles, posts, comments, follows, and conversations.
- A fetch-based OpenFGA client that works in Bun, Cloudflare Workers, and browser-compatible runtimes.
- Typed helpers for creating OpenFGA object ids and tuple keys.
- Scripts to create a store and upload the model.

## Install

```bash
bun install
```

## Local env

Copy `.env.example` and fill the generated ids as you initialize OpenFGA.

```bash
OPENFGA_API_URL=http://localhost:8080
OPENFGA_STORE_ID=...
OPENFGA_AUTHORIZATION_MODEL_ID=...
```

For authenticated OpenFGA instances, set either `OPENFGA_API_TOKEN` or the client credential variables.

## Initialize OpenFGA

Create a store:

```bash
bun run create:store
```

Then set `OPENFGA_STORE_ID` and upload the model:

```bash
bun run init:model
```

Set the printed `OPENFGA_AUTHORIZATION_MODEL_ID` in the API app environment.

## API usage

Use the service on the server side where OpenFGA credentials are safe.

```ts
import { createOpenFgaSocialServiceFromEnv } from "openfga-social-web";

const fga = createOpenFgaSocialServiceFromEnv(env);

await fga.setPostOwner("post_123", "user_123");
await fga.publishPost("post_123");

const canView = await fga.canViewPost("user_456", "post_123");
```

## Web usage

Do not ship OpenFGA admin credentials to `apps/web`. The web app can import the model/object helpers for shared naming, but checks and tuple writes should go through `apps/api`.

```ts
import { fgaObjects } from "openfga-social-web";

const postObject = fgaObjects.post("post_123");
```

## Model

The DSL version is in `authorization-model.fga`, and the JSON body used by the init script is exported as `OPENFGA_AUTHORIZATION_MODEL`.
