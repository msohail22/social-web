import { createOpenFgaSocialServiceFromEnv } from "../src/client.ts";

const service = createOpenFgaSocialServiceFromEnv(Bun.env);
const result = await service.writeAuthorizationModel();

console.log(`OPENFGA_AUTHORIZATION_MODEL_ID=${result.authorization_model_id}`);
