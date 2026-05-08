import type { SocialObjectType, SocialRelation } from "./model.ts";

export const PUBLIC_USER = "user:*" as const;

export type FgaObject<TType extends string = string> = `${TType}:${string}`;
export type FgaUser = FgaObject<"user"> | typeof PUBLIC_USER;

export interface FgaObjectParts<TType extends string = string> {
  type: TType;
  id: string;
}

export interface TupleKey<TRelation extends string = SocialRelation | string> {
  user: string;
  relation: TRelation;
  object: string;
  condition?: {
    name: string;
    context?: Record<string, unknown>;
  };
}

export function fgaObject<TType extends SocialObjectType>(
  type: TType,
  id: string,
): FgaObject<TType> {
  const normalizedId = normalizeObjectId(id);

  return `${type}:${normalizedId}` as FgaObject<TType>;
}

export const fgaObjects = {
  user: (id: string): FgaObject<"user"> => fgaObject("user", id),
  profile: (id: string): FgaObject<"profile"> => fgaObject("profile", id),
  post: (id: string): FgaObject<"post"> => fgaObject("post", id),
  comment: (id: string): FgaObject<"comment"> => fgaObject("comment", id),
  conversation: (id: string): FgaObject<"conversation"> =>
    fgaObject("conversation", id),
} as const;

export function parseFgaObject<TType extends string = string>(
  value: string,
): FgaObjectParts<TType> {
  const separatorIndex = value.indexOf(":");

  if (separatorIndex <= 0 || separatorIndex === value.length - 1) {
    throw new TypeError(`Invalid OpenFGA object identifier: "${value}"`);
  }

  return {
    type: value.slice(0, separatorIndex) as TType,
    id: value.slice(separatorIndex + 1),
  };
}

export function tuple<TRelation extends string>(
  user: string,
  relation: TRelation,
  object: string,
): TupleKey<TRelation> {
  return { user, relation, object };
}

function normalizeObjectId(id: string): string {
  const normalizedId = id.trim();

  if (normalizedId.length === 0) {
    throw new TypeError("OpenFGA object id cannot be empty.");
  }

  if (normalizedId.includes("#")) {
    throw new TypeError('OpenFGA object id cannot include "#".');
  }

  return normalizedId;
}
