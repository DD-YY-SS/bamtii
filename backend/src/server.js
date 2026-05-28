import { createServer } from "node:http";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { handleRequest } from "./router.js";
import { logEvent } from "./lib/logger.js";

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

export function createAiStreamerServer() {
  return createServer(handleRequest);
}

const currentFile = fileURLToPath(import.meta.url);
const launchedFile = process.argv[1] ? resolve(process.argv[1]) : "";

if (launchedFile === currentFile) {
  const server = createAiStreamerServer();
  server.listen(port, host, async () => {
    await logEvent("server_started", { host, port });
    console.log(`깍두기 절단기 backend running at http://${host}:${port}`);
  });
}
