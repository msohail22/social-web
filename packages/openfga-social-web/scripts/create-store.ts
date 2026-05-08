import { createOpenFgaManagementClientFromEnv } from "../src/client.ts";

const storeName = Bun.env.OPENFGA_STORE_NAME ?? "social-web";
const client = createOpenFgaManagementClientFromEnv(Bun.env);
const store = await client.createStore(storeName);

console.log(`OPENFGA_STORE_ID=${store.id}`);
console.log(`OPENFGA_STORE_NAME=${store.name}`);
