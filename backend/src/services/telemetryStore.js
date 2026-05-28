import { randomUUID } from "node:crypto";
import { decideAbr } from "./abrEngine.js";
import { logTelemetry } from "../lib/logger.js";

const telemetryRecords = [];
const maxRecords = 500;

export async function addTelemetry(input) {
  const validation = validateTelemetry(input);
  if (!validation.ok) {
    return validation;
  }

  const decision = decideAbr(input);
  const record = {
    id: randomUUID(),
    streamId: input.streamId,
    deviceId: input.deviceId ?? "anonymous-device",
    deviceModel: input.deviceModel ?? "unknown",
    bandwidthMbps: Number(input.bandwidthMbps),
    latencyMs: Number(input.latencyMs),
    packetDropPercent: Number(input.packetDropPercent),
    jitterMs: Number(input.jitterMs),
    delegate: decision.delegate,
    decision,
    createdAt: new Date().toISOString()
  };

  telemetryRecords.unshift(record);
  if (telemetryRecords.length > maxRecords) {
    telemetryRecords.pop();
  }

  await logTelemetry(record);

  return {
    ok: true,
    record
  };
}

export function getRecentTelemetry(limit = 20) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 20, 100));
  return telemetryRecords.slice(0, safeLimit);
}

export function getReport() {
  const count = telemetryRecords.length;
  const edgeAiCount = telemetryRecords.filter((record) => record.decision.mode === "EDGE_AI_RESTORE").length;
  const averageTrafficSavedPercent = count
    ? Math.round(telemetryRecords.reduce((sum, record) => sum + record.decision.trafficSavedPercent, 0) / count)
    : 0;
  const averageInferenceMs = edgeAiCount
    ? Math.round(
        telemetryRecords
          .filter((record) => record.decision.mode === "EDGE_AI_RESTORE")
          .reduce((sum, record) => sum + record.decision.estimatedInferenceMs, 0) / edgeAiCount
      )
    : 0;
  const estimatedMonthlyGbSaved = Math.round(averageTrafficSavedPercent * 1.8);
  const estimatedCarbonKgSaved = Number((estimatedMonthlyGbSaved * 0.018).toFixed(1));

  return {
    totalTelemetry: count,
    edgeAiRestoreRatio: count ? Number((edgeAiCount / count).toFixed(2)) : 0,
    averageTrafficSavedPercent,
    averageInferenceMs,
    estimatedMonthlyGbSaved,
    estimatedCarbonKgSaved,
    psnrLossDbTarget: 0.2
  };
}

function validateTelemetry(input) {
  const required = ["streamId", "bandwidthMbps", "latencyMs", "packetDropPercent", "jitterMs"];
  const missing = required.filter((key) => input[key] === undefined || input[key] === null || input[key] === "");

  if (missing.length) {
    return {
      ok: false,
      error: `Missing required fields: ${missing.join(", ")}`
    };
  }

  const numericFields = ["bandwidthMbps", "latencyMs", "packetDropPercent", "jitterMs"];
  const invalid = numericFields.filter((key) => !Number.isFinite(Number(input[key])) || Number(input[key]) < 0);

  if (invalid.length) {
    return {
      ok: false,
      error: `Invalid numeric fields: ${invalid.join(", ")}`
    };
  }

  return {
    ok: true
  };
}
