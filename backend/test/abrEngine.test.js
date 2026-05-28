import test from "node:test";
import assert from "node:assert/strict";
import { decideAbr } from "../src/services/abrEngine.js";

test("switches to edge AI restore when bandwidth is below 2Mbps", () => {
  const decision = decideAbr({
    bandwidthMbps: 1.4,
    latencyMs: 35,
    packetDropPercent: 1,
    jitterMs: 4,
    delegate: "NPU"
  });

  assert.equal(decision.mode, "EDGE_AI_RESTORE");
  assert.equal(decision.serverQuality, "360p");
  assert.equal(decision.aiUpscaleEnabled, true);
  assert.equal(decision.delegate, "NPU");
  assert.ok(decision.trafficSavedPercent >= 60);
});

test("keeps native stream when network is stable", () => {
  const decision = decideAbr({
    bandwidthMbps: 8,
    latencyMs: 18,
    packetDropPercent: 0.2,
    jitterMs: 2
  });

  assert.equal(decision.mode, "NATIVE_STREAM");
  assert.equal(decision.serverQuality, "1080p");
  assert.equal(decision.aiUpscaleEnabled, false);
  assert.equal(decision.trafficSavedPercent, 0);
});

test("uses GPU delegate when battery is very low and delegate was not requested", () => {
  const decision = decideAbr({
    bandwidthMbps: 1.9,
    latencyMs: 30,
    packetDropPercent: 1,
    jitterMs: 3,
    deviceBatteryPercent: 15
  });

  assert.equal(decision.delegate, "GPU");
  assert.equal(decision.targetQuality, "720p");
});
