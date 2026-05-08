export {
  OPENFGA_AUTHORIZATION_MODEL,
  OPENFGA_MODEL_DSL,
  SOCIAL_OBJECT_TYPES,
  SOCIAL_RELATIONS,
} from "./src/model.ts";

export type {
  SocialObjectType,
  SocialRelation,
} from "./src/model.ts";

export {
  PUBLIC_USER,
  fgaObject,
  fgaObjects,
  parseFgaObject,
  tuple,
} from "./src/identifiers.ts";

export type {
  FgaObject,
  FgaObjectParts,
  FgaUser,
  TupleKey,
} from "./src/identifiers.ts";

export {
  OpenFgaRequestError,
  OpenFgaSocialService,
  createOpenFgaManagementClientFromEnv,
  createOpenFgaSocialServiceFromEnv,
  openFgaConfigFromEnv,
} from "./src/client.ts";

export type {
  CheckInput,
  CheckResult,
  CreateStoreResult,
  ListObjectsInput,
  OpenFgaConfig,
  OpenFgaCredentials,
  OpenFgaEnv,
  OpenFgaManagementConfig,
  OpenFgaManagementClient,
  OpenFgaRequestOptions,
  WriteAuthorizationModelResult,
} from "./src/client.ts";
