import { NullAIProvider } from "./ai/null-provider.js";
import { loadConfig } from "./config.js";
import { startHttpServer } from "./http/server.js";
import { startServer } from "./mcp/server.js";

const config = loadConfig();
const provider = new NullAIProvider();

startServer({ config, aiProvider: provider }).catch((error) => {
  console.error("Failed to start wp-mcp server:", error);
  process.exitCode = 1;
});

if (config.httpPort) {
  startHttpServer({ port: config.httpPort, aiProvider: provider });
}
