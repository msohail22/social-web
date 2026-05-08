import {
  PUBLIC_USER,
  type FgaUser,
  fgaObjects,
  tuple,
  type TupleKey,
} from "./identifiers.ts";
import { OPENFGA_AUTHORIZATION_MODEL } from "./model.ts";

type Fetcher = typeof fetch;
type HeaderMap = Record<string, string>;

export type OpenFgaCredentials =
  | { method: "none" }
  | { method: "api-token"; token: string }
  | {
      method: "client-credentials";
      clientId: string;
      clientSecret: string;
      tokenIssuer: string;
      apiAudience?: string;
      scopes?: string[];
    };

export interface OpenFgaManagementConfig {
  apiUrl: string;
  credentials?: OpenFgaCredentials;
  fetch?: Fetcher;
  headers?: HeaderMap;
}

export interface OpenFgaConfig extends OpenFgaManagementConfig {
  storeId: string;
  authorizationModelId?: string;
}

export interface OpenFgaEnv {
  [key: string]: unknown;
  OPENFGA_API_URL?: string;
  OPENFGA_STORE_ID?: string;
  OPENFGA_AUTHORIZATION_MODEL_ID?: string;
  OPENFGA_API_TOKEN?: string;
  OPENFGA_CLIENT_ID?: string;
  OPENFGA_CLIENT_SECRET?: string;
  OPENFGA_API_TOKEN_ISSUER?: string;
  OPENFGA_API_AUDIENCE?: string;
  OPENFGA_SCOPES?: string;
}

export interface OpenFgaRequestOptions {
  contextualTuples?: TupleKey[];
  context?: Record<string, unknown>;
}

export interface CheckInput extends OpenFgaRequestOptions {
  user: string;
  relation: string;
  object: string;
  trace?: boolean;
}

export interface CheckResult {
  allowed: boolean;
  resolution?: string;
  raw: unknown;
}

export interface ListObjectsInput extends OpenFgaRequestOptions {
  user: string;
  relation: string;
  type: string;
}

export interface CreateStoreResult {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface WriteAuthorizationModelResult {
  authorization_model_id: string;
}

interface TokenCache {
  value: string;
  expiresAt: number;
}

export class OpenFgaRequestError extends Error {
  readonly status: number;
  readonly responseBody: string;

  constructor(method: string, path: string, status: number, responseBody: string) {
    super(`OpenFGA ${method} ${path} failed with ${status}: ${responseBody}`);
    this.name = "OpenFgaRequestError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

export class OpenFgaManagementClient {
  private readonly apiUrl: string;
  private readonly credentials: OpenFgaCredentials;
  private readonly fetcher: Fetcher;
  private readonly headers: HeaderMap | undefined;
  private tokenCache: TokenCache | undefined;

  constructor(config: OpenFgaManagementConfig) {
    this.apiUrl = trimTrailingSlash(config.apiUrl);
    this.credentials = config.credentials ?? { method: "none" };
    this.fetcher = config.fetch ?? fetch;
    this.headers = config.headers;
  }

  async createStore(name: string): Promise<CreateStoreResult> {
    return this.request<CreateStoreResult>("POST", "/stores", { name });
  }

  protected async request<TResponse>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<TResponse> {
    const response = await this.fetcher(`${this.apiUrl}${path}`, {
      method,
      headers: {
        ...toHeaderRecord(this.headers),
        ...(body === undefined ? {} : { "content-type": "application/json" }),
        ...(await this.authorizationHeaders()),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      throw new OpenFgaRequestError(method, path, response.status, responseBody);
    }

    if (responseBody.length === 0) {
      return undefined as TResponse;
    }

    return JSON.parse(responseBody) as TResponse;
  }

  private async authorizationHeaders(): Promise<Record<string, string>> {
    switch (this.credentials.method) {
      case "none":
        return {};
      case "api-token":
        return { authorization: `Bearer ${this.credentials.token}` };
      case "client-credentials":
        return { authorization: `Bearer ${await this.getAccessToken()}` };
    }
  }

  private async getAccessToken(): Promise<string> {
    const cachedToken = this.tokenCache;

    if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
      return cachedToken.value;
    }

    if (this.credentials.method !== "client-credentials") {
      throw new TypeError("Client credentials are not configured.");
    }

    const tokenRequestBody = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
    });

    if (this.credentials.apiAudience) {
      tokenRequestBody.set("audience", this.credentials.apiAudience);
    }

    if (this.credentials.scopes?.length) {
      tokenRequestBody.set("scope", this.credentials.scopes.join(" "));
    }

    const response = await this.fetcher(this.credentials.tokenIssuer, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: tokenRequestBody,
    });

    const responseBody = await response.text();

    if (!response.ok) {
      throw new OpenFgaRequestError(
        "POST",
        this.credentials.tokenIssuer,
        response.status,
        responseBody,
      );
    }

    const tokenResponse = JSON.parse(responseBody) as {
      access_token: string;
      expires_in?: number;
    };

    this.tokenCache = {
      value: tokenResponse.access_token,
      expiresAt: Date.now() + (tokenResponse.expires_in ?? 3600) * 1000,
    };

    return tokenResponse.access_token;
  }
}

export class OpenFgaSocialService extends OpenFgaManagementClient {
  private readonly storeId: string;
  private readonly authorizationModelId: string | undefined;

  constructor(config: OpenFgaConfig) {
    super(config);
    this.storeId = config.storeId;
    this.authorizationModelId = config.authorizationModelId;
  }

  async writeAuthorizationModel(
    model = OPENFGA_AUTHORIZATION_MODEL,
  ): Promise<WriteAuthorizationModelResult> {
    return this.request<WriteAuthorizationModelResult>(
      "POST",
      `/stores/${encodeURIComponent(this.storeId)}/authorization-models`,
      model,
    );
  }

  async check(input: CheckInput): Promise<CheckResult> {
    const response = await this.request<{ allowed?: boolean; resolution?: string }>(
      "POST",
      `/stores/${encodeURIComponent(this.storeId)}/check`,
      {
        ...this.modelScopedBody(),
        tuple_key: {
          user: input.user,
          relation: input.relation,
          object: input.object,
        },
        ...requestOptionsBody(input),
        ...(input.trace === undefined ? {} : { trace: input.trace }),
      },
    );

    return {
      allowed: Boolean(response.allowed),
      resolution: response.resolution,
      raw: response,
    };
  }

  async listObjects(input: ListObjectsInput): Promise<string[]> {
    const response = await this.request<{ objects?: string[] }>(
      "POST",
      `/stores/${encodeURIComponent(this.storeId)}/list-objects`,
      {
        ...this.modelScopedBody(),
        user: input.user,
        relation: input.relation,
        type: input.type,
        ...requestOptionsBody(input),
      },
    );

    return response.objects ?? [];
  }

  async writeTuples(tupleKeys: TupleKey[]): Promise<void> {
    if (tupleKeys.length === 0) {
      return;
    }

    await this.request(
      "POST",
      `/stores/${encodeURIComponent(this.storeId)}/write`,
      {
        ...this.modelScopedBody(),
        writes: { tuple_keys: tupleKeys },
      },
    );
  }

  async deleteTuples(tupleKeys: TupleKey[]): Promise<void> {
    if (tupleKeys.length === 0) {
      return;
    }

    await this.request(
      "POST",
      `/stores/${encodeURIComponent(this.storeId)}/write`,
      {
        ...this.modelScopedBody(),
        deletes: { tuple_keys: tupleKeys },
      },
    );
  }

  grant(tupleKey: TupleKey): Promise<void> {
    return this.writeTuples([tupleKey]);
  }

  revoke(tupleKey: TupleKey): Promise<void> {
    return this.deleteTuples([tupleKey]);
  }

  followUser(followerUserId: string, followedUserId: string): Promise<void> {
    return this.grant(
      tuple(fgaObjects.user(followerUserId), "follower", fgaObjects.user(followedUserId)),
    );
  }

  unfollowUser(followerUserId: string, followedUserId: string): Promise<void> {
    return this.revoke(
      tuple(fgaObjects.user(followerUserId), "follower", fgaObjects.user(followedUserId)),
    );
  }

  async isFollowing(followerUserId: string, followedUserId: string): Promise<boolean> {
    const result = await this.check({
      user: fgaObjects.user(followerUserId),
      relation: "follower",
      object: fgaObjects.user(followedUserId),
    });

    return result.allowed;
  }

  listFollowedUsers(userId: string): Promise<string[]> {
    return this.listObjects({
      user: fgaObjects.user(userId),
      relation: "follower",
      type: "user",
    });
  }

  setProfileOwner(profileId: string, ownerUserId: string): Promise<void> {
    return this.grant(
      tuple(fgaObjects.user(ownerUserId), "owner", fgaObjects.profile(profileId)),
    );
  }

  grantProfileViewer(profileId: string, viewerUserId: string): Promise<void> {
    return this.grant(
      tuple(fgaObjects.user(viewerUserId), "viewer", fgaObjects.profile(profileId)),
    );
  }

  revokeProfileViewer(profileId: string, viewerUserId: string): Promise<void> {
    return this.revoke(
      tuple(fgaObjects.user(viewerUserId), "viewer", fgaObjects.profile(profileId)),
    );
  }

  publishProfile(profileId: string): Promise<void> {
    return this.grant(tuple(PUBLIC_USER, "viewer", fgaObjects.profile(profileId)));
  }

  unpublishProfile(profileId: string): Promise<void> {
    return this.revoke(tuple(PUBLIC_USER, "viewer", fgaObjects.profile(profileId)));
  }

  async canViewProfile(userId: string, profileId: string): Promise<boolean> {
    return this.isAllowed(fgaObjects.user(userId), "viewer", fgaObjects.profile(profileId));
  }

  async canEditProfile(userId: string, profileId: string): Promise<boolean> {
    return this.isAllowed(fgaObjects.user(userId), "editor", fgaObjects.profile(profileId));
  }

  setPostOwner(postId: string, ownerUserId: string): Promise<void> {
    return this.grant(
      tuple(fgaObjects.user(ownerUserId), "owner", fgaObjects.post(postId)),
    );
  }

  grantPostViewer(postId: string, viewerUserId: string): Promise<void> {
    return this.grant(
      tuple(fgaObjects.user(viewerUserId), "viewer", fgaObjects.post(postId)),
    );
  }

  revokePostViewer(postId: string, viewerUserId: string): Promise<void> {
    return this.revoke(
      tuple(fgaObjects.user(viewerUserId), "viewer", fgaObjects.post(postId)),
    );
  }

  publishPost(postId: string): Promise<void> {
    return this.grant(tuple(PUBLIC_USER, "viewer", fgaObjects.post(postId)));
  }

  unpublishPost(postId: string): Promise<void> {
    return this.revoke(tuple(PUBLIC_USER, "viewer", fgaObjects.post(postId)));
  }

  async canViewPost(userId: string, postId: string): Promise<boolean> {
    return this.isAllowed(fgaObjects.user(userId), "viewer", fgaObjects.post(postId));
  }

  async canEditPost(userId: string, postId: string): Promise<boolean> {
    return this.isAllowed(fgaObjects.user(userId), "editor", fgaObjects.post(postId));
  }

  async canDeletePost(userId: string, postId: string): Promise<boolean> {
    return this.isAllowed(fgaObjects.user(userId), "deleter", fgaObjects.post(postId));
  }

  async canCommentOnPost(userId: string, postId: string): Promise<boolean> {
    return this.isAllowed(fgaObjects.user(userId), "commenter", fgaObjects.post(postId));
  }

  async canLikePost(userId: string, postId: string): Promise<boolean> {
    return this.isAllowed(fgaObjects.user(userId), "liker", fgaObjects.post(postId));
  }

  async canBookmarkPost(userId: string, postId: string): Promise<boolean> {
    return this.isAllowed(fgaObjects.user(userId), "bookmarker", fgaObjects.post(postId));
  }

  setCommentAuthor(commentId: string, authorUserId: string): Promise<void> {
    return this.grant(
      tuple(fgaObjects.user(authorUserId), "author", fgaObjects.comment(commentId)),
    );
  }

  attachCommentToPost(commentId: string, postId: string): Promise<void> {
    return this.grant(
      tuple(fgaObjects.post(postId), "parent", fgaObjects.comment(commentId)),
    );
  }

  async canViewComment(userId: string, commentId: string): Promise<boolean> {
    return this.isAllowed(fgaObjects.user(userId), "viewer", fgaObjects.comment(commentId));
  }

  async canEditComment(userId: string, commentId: string): Promise<boolean> {
    return this.isAllowed(fgaObjects.user(userId), "editor", fgaObjects.comment(commentId));
  }

  async canDeleteComment(userId: string, commentId: string): Promise<boolean> {
    return this.isAllowed(fgaObjects.user(userId), "deleter", fgaObjects.comment(commentId));
  }

  addConversationParticipant(conversationId: string, userId: string): Promise<void> {
    return this.grant(
      tuple(fgaObjects.user(userId), "participant", fgaObjects.conversation(conversationId)),
    );
  }

  removeConversationParticipant(conversationId: string, userId: string): Promise<void> {
    return this.revoke(
      tuple(fgaObjects.user(userId), "participant", fgaObjects.conversation(conversationId)),
    );
  }

  async canViewConversation(userId: string, conversationId: string): Promise<boolean> {
    return this.isAllowed(
      fgaObjects.user(userId),
      "viewer",
      fgaObjects.conversation(conversationId),
    );
  }

  async canSendMessage(userId: string, conversationId: string): Promise<boolean> {
    return this.isAllowed(
      fgaObjects.user(userId),
      "sender",
      fgaObjects.conversation(conversationId),
    );
  }

  private async isAllowed(
    user: FgaUser,
    relation: string,
    object: string,
  ): Promise<boolean> {
    const result = await this.check({ user, relation, object });

    return result.allowed;
  }

  private modelScopedBody(): Record<string, string> {
    return this.authorizationModelId
      ? { authorization_model_id: this.authorizationModelId }
      : {};
  }
}

export function createOpenFgaManagementClientFromEnv(
  env: OpenFgaEnv,
  overrides: Partial<OpenFgaManagementConfig> = {},
): OpenFgaManagementClient {
  const config = openFgaConfigFromEnv(env, { requireStoreId: false });

  return new OpenFgaManagementClient({
    ...config,
    ...overrides,
  });
}

export function createOpenFgaSocialServiceFromEnv(
  env: OpenFgaEnv,
  overrides: Partial<OpenFgaConfig> = {},
): OpenFgaSocialService {
  const config = openFgaConfigFromEnv(env, { requireStoreId: true });

  return new OpenFgaSocialService({
    ...config,
    ...overrides,
  });
}

export function openFgaConfigFromEnv(
  env: OpenFgaEnv,
  options?: { requireStoreId?: true },
): OpenFgaConfig;
export function openFgaConfigFromEnv(
  env: OpenFgaEnv,
  options: { requireStoreId: false },
): OpenFgaManagementConfig;
export function openFgaConfigFromEnv(
  env: OpenFgaEnv,
  options: { requireStoreId?: boolean } = {},
): OpenFgaConfig | OpenFgaManagementConfig {
  const apiUrl = envValue(env, "OPENFGA_API_URL") ?? "http://localhost:8080";
  const storeId = envValue(env, "OPENFGA_STORE_ID");
  const authorizationModelId = envValue(env, "OPENFGA_AUTHORIZATION_MODEL_ID");

  if (options.requireStoreId !== false && !storeId) {
    throw new TypeError("OPENFGA_STORE_ID is required.");
  }

  return {
    apiUrl,
    ...(storeId ? { storeId } : {}),
    ...(authorizationModelId ? { authorizationModelId } : {}),
    credentials: credentialsFromEnv(env),
  };
}

function credentialsFromEnv(env: OpenFgaEnv): OpenFgaCredentials {
  const apiToken = envValue(env, "OPENFGA_API_TOKEN");

  if (apiToken) {
    return { method: "api-token", token: apiToken };
  }

  const clientId = envValue(env, "OPENFGA_CLIENT_ID");
  const clientSecret = envValue(env, "OPENFGA_CLIENT_SECRET");
  const tokenIssuer = envValue(env, "OPENFGA_API_TOKEN_ISSUER");

  if (clientId && clientSecret && tokenIssuer) {
    return {
      method: "client-credentials",
      clientId,
      clientSecret,
      tokenIssuer,
      apiAudience: envValue(env, "OPENFGA_API_AUDIENCE"),
      scopes: envValue(env, "OPENFGA_SCOPES")?.split(/\s+/).filter(Boolean),
    };
  }

  return { method: "none" };
}

function requestOptionsBody(options: OpenFgaRequestOptions): Record<string, unknown> {
  return {
    ...(options.contextualTuples?.length
      ? { contextual_tuples: { tuple_keys: options.contextualTuples } }
      : {}),
    ...(options.context ? { context: options.context } : {}),
  };
}

function envValue<TKey extends keyof OpenFgaEnv>(
  env: OpenFgaEnv,
  key: TKey,
): string | undefined {
  const value = env[key];

  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function toHeaderRecord(headers: HeaderMap | undefined): HeaderMap {
  return headers ?? {};
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}
