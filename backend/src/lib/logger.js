import { appendFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const logDir = join(currentDir, "..", "..", "logs");
const serverLogPath = join(logDir, "server.log");
const telemetryLogPath = join(logDir, "telemetry.jsonl");

async function ensureLogDir() {
  await mkdir(logDir, { recursive: true });
}

export async function logEvent(event, payload = {}) {
  await ensureLogDir();
  const record = {
    timestamp: new Date().toISOString(),
    event,
    ...payload
  };
  await appendFile(serverLogPath, `${JSON.stringify(record)}\n`, "utf8");
}

export async function logTelemetry(record) {
  await ensureLogDir();
  await appendFile(telemetryLogPath, `${JSON.stringify(record)}\n`, "utf8");
}

export function getLogPaths() {
  return {
    serverLogPath,
    telemetryLogPath
  };
}
