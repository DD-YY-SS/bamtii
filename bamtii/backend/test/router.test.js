import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createAiStreamerServer } from "../src/server.js";

test("backend health and telemetry flow works end to end", async () => {
  const server = createAiStreamerServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).ok, true);

    const chunk = await fetch(`${baseUrl}/api/benchmark/chunk?sizeKb=64`);
    assert.equal(chunk.status, 200);
    assert.equal((await chunk.arrayBuffer()).byteLength, 64 * 1024);

    const telemetry = await fetch(`${baseUrl}/api/telemetry`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        streamId: "crowd-concert-cam",
        deviceId: "demo-device",
        deviceModel: "Expo Go",
        bandwidthMbps: 1.6,
        latencyMs: 50,
        packetDropPercent: 4.2,
        jitterMs: 12,
        delegate: "NPU"
      })
    });
    assert.equal(telemetry.status, 201);
    const telemetryBody = await telemetry.json();
    assert.equal(telemetryBody.data.decision.mode, "EDGE_AI_RESTORE");

    const report = await fetch(`${baseUrl}/api/report`);
    assert.equal(report.status, 200);
    assert.equal((await report.json()).data.totalTelemetry >= 1, true);
  } finally {
    server.close();
  }
});
