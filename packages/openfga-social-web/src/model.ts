export const SOCIAL_OBJECT_TYPES = [
  "user",
  "profile",
  "post",
  "comment",
  "conversation",
] as const;

export type SocialObjectType = (typeof SOCIAL_OBJECT_TYPES)[number];

export const SOCIAL_RELATIONS = [
  "follower",
  "blocked",
  "owner",
  "viewer",
  "editor",
  "deleter",
  "commenter",
  "liker",
  "bookmarker",
  "author",
  "parent",
  "participant",
  "sender",
] as const;

export type SocialRelation = (typeof SOCIAL_RELATIONS)[number];

export const OPENFGA_MODEL_DSL = `model
  schema 1.1

type user
  relations
    define follower: [user]
    define blocked: [user]

type profile
  relations
    define owner: [user]
    define viewer: [user, user:*] or owner
    define editor: owner

type post
  relations
    define owner: [user]
    define viewer: [user, user:*] or owner
    define editor: owner
    define deleter: owner
    define commenter: viewer
    define liker: viewer
    define bookmarker: viewer

type comment
  relations
    define author: [user]
    define parent: [post]
    define viewer: viewer from parent
    define editor: author
    define deleter: author or owner from parent

type conversation
  relations
    define participant: [user]
    define viewer: participant
    define sender: participant
`;

export const OPENFGA_AUTHORIZATION_MODEL = {
  schema_version: "1.1",
  type_definitions: [
    {
      type: "user",
      relations: {
        follower: { this: {} },
        blocked: { this: {} },
      },
      metadata: {
        relations: {
          follower: {
            directly_related_user_types: [{ type: "user" }],
          },
          blocked: {
            directly_related_user_types: [{ type: "user" }],
          },
        },
      },
    },
    {
      type: "profile",
      relations: {
        owner: { this: {} },
        viewer: {
          union: {
            child: [
              { this: {} },
              { computedUserset: { relation: "owner" } },
            ],
          },
        },
        editor: { computedUserset: { relation: "owner" } },
      },
      metadata: {
        relations: {
          owner: {
            directly_related_user_types: [{ type: "user" }],
          },
          viewer: {
            directly_related_user_types: [
              { type: "user" },
              { type: "user", wildcard: {} },
            ],
          },
        },
      },
    },
    {
      type: "post",
      relations: {
        owner: { this: {} },
        viewer: {
          union: {
            child: [
              { this: {} },
              { computedUserset: { relation: "owner" } },
            ],
          },
        },
        editor: { computedUserset: { relation: "owner" } },
        deleter: { computedUserset: { relation: "owner" } },
        commenter: { computedUserset: { relation: "viewer" } },
        liker: { computedUserset: { relation: "viewer" } },
        bookmarker: { computedUserset: { relation: "viewer" } },
      },
      metadata: {
        relations: {
          owner: {
            directly_related_user_types: [{ type: "user" }],
          },
          viewer: {
            directly_related_user_types: [
              { type: "user" },
              { type: "user", wildcard: {} },
            ],
          },
        },
      },
    },
    {
      type: "comment",
      relations: {
        author: { this: {} },
        parent: { this: {} },
        viewer: {
          tupleToUserset: {
            tupleset: { relation: "parent" },
            computedUserset: { relation: "viewer" },
          },
        },
        editor: { computedUserset: { relation: "author" } },
        deleter: {
          union: {
            child: [
              { computedUserset: { relation: "author" } },
              {
                tupleToUserset: {
                  tupleset: { relation: "parent" },
                  computedUserset: { relation: "owner" },
                },
              },
            ],
          },
        },
      },
      metadata: {
        relations: {
          author: {
            directly_related_user_types: [{ type: "user" }],
          },
          parent: {
            directly_related_user_types: [{ type: "post" }],
          },
        },
      },
    },
    {
      type: "conversation",
      relations: {
        participant: { this: {} },
        viewer: { computedUserset: { relation: "participant" } },
        sender: { computedUserset: { relation: "participant" } },
      },
      metadata: {
        relations: {
          participant: {
            directly_related_user_types: [{ type: "user" }],
          },
        },
      },
    },
  ],
} as const;
