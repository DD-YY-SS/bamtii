const LIMITS = {
  lowBandwidthMbps: 2,
  highLatencyMs: 60,
  highPacketDropPercent: 3,
  highJitterMs: 15
};

export function decideAbr(input) {
  const bandwidthMbps = toNumber(input.bandwidthMbps);
  const latencyMs = toNumber(input.latencyMs);
  const packetDropPercent = toNumber(input.packetDropPercent);
  const jitterMs = toNumber(input.jitterMs);
  const deviceBatteryPercent = input.deviceBatteryPercent === undefined ? 80 : toNumber(input.deviceBatteryPercent);

  const reasons = [];
  if (bandwidthMbps <= LIMITS.lowBandwidthMbps) {
    reasons.push(`bandwidth ${bandwidthMbps}Mbps <= ${LIMITS.lowBandwidthMbps}Mbps`);
  }
  if (latencyMs >= LIMITS.highLatencyMs) {
    reasons.push(`latency ${latencyMs}ms >= ${LIMITS.highLatencyMs}ms`);
  }
  if (packetDropPercent >= LIMITS.highPacketDropPercent) {
    reasons.push(`packetDrop ${packetDropPercent}% >= ${LIMITS.highPacketDropPercent}%`);
  }
  if (jitterMs >= LIMITS.highJitterMs) {
    reasons.push(`jitter ${jitterMs}ms >= ${LIMITS.highJitterMs}ms`);
  }

  const congested = reasons.length > 0;
  const aiUpscaleEnabled = congested;
  const serverQuality = congested ? "360p" : "1080p";
  const targetQuality = congested ? (deviceBatteryPercent < 25 ? "720p" : "720p+") : "1080p";
  const delegate = chooseDelegate(input.delegate, deviceBatteryPercent, congested);
  const trafficSavedPercent = congested ? estimateTrafficSaved(bandwidthMbps, packetDropPercent) : 0;
  const inferenceMs = congested ? estimateInferenceMs(delegate, deviceBatteryPercent) : 0;
  const fps = congested ? Math.max(30, Math.round(1000 / Math.max(inferenceMs, 1))) : 60;

  return {
    mode: congested ? "EDGE_AI_RESTORE" : "NATIVE_STREAM",
    serverQuality,
    targetQuality,
    aiUpscaleEnabled,
    delegate,
    trafficSavedPercent,
    estimatedInferenceMs: inferenceMs,
    estimatedFps: fps,
    psnrLossDb: congested ? 0.2 : 0,
    carbonProfile: congested ? "GREEN_EDGE" : "STANDARD",
    reasons: reasons.length ? reasons : ["network stable"],
    limits: LIMITS
  };
}

function chooseDelegate(requestedDelegate, batteryPercent, congested) {
  if (!congested) {
    return "OFF";
  }
  if (requestedDelegate === "GPU" || requestedDelegate === "CPU" || requestedDelegate === "NPU") {
    return requestedDelegate;
  }
  if (batteryPercent < 20) {
    return "GPU";
  }
  return "NPU";
}

function estimateTrafficSaved(bandwidthMbps, packetDropPercent) {
  const base = bandwidthMbps <= 1.5 ? 65 : 60;
  const penaltyBonus = packetDropPercent >= 6 ? 3 : 0;
  return Math.min(68, base + penaltyBonus);
}

function estimateInferenceMs(delegate, batteryPercent) {
  if (delegate === "CPU") {
    return batteryPercent < 25 ? 42 : 38;
  }
  if (delegate === "GPU") {
    return batteryPercent < 25 ? 32 : 29;
  }
  return batteryPercent < 25 ? 30 : 27;
}

function toNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0;
  }
  return number;
}
