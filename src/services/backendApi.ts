import type { MeasurementResult, SavingsReport, ThrottleMode } from "../types/app";

type TelemetryDecisionResponse = {
  ok: boolean;
  data: {
    decision: {
      mode: string;
      serverQuality: string;
      targetQuality: string;
      trafficSavedPercent: number;
      estimatedInferenceMs: number;
    };
  };
};

export async function measureNetworkAndSendTelemetry({
  apiBaseUrl,
  streamId,
  delegate,
  throttleMode = "off"
}: {
  apiBaseUrl: string;
  streamId: string;
  delegate: string;
  throttleMode?: ThrottleMode;
}): Promise<MeasurementResult> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const latencySamples: number[] = [];
  const chunkSizesKb = [64, 128, 256, 512];
  let downloadedBytes = 0;
  let failedSamples = 0;
  const startedAt = Date.now();

  for (const sizeKb of chunkSizesKb) {
    const sampleStartedAt = Date.now();
    try {
      const response = await fetch(`${baseUrl}/api/benchmark/chunk?sizeKb=${sizeKb}&t=${Date.now()}`);
      if (!response.ok) {
        failedSamples += 1;
        continue;
      }

      const buffer = await response.arrayBuffer();
      const sampleDuration = Math.max(Date.now() - sampleStartedAt, 1);
      latencySamples.push(sampleDuration);
      downloadedBytes += buffer.byteLength;
    } catch {
      failedSamples += 1;
    }
  }

  const durationMs = Math.max(Date.now() - startedAt, 1);
  const successfulSamples = latencySamples.length;
  const totalSamples = chunkSizesKb.length;

  if (successfulSamples === 0) {
    throw new Error("측정 서버에 연결할 수 없습니다. 백엔드 주소와 같은 Wi-Fi 여부를 확인해주세요.");
  }

  const rawBandwidthMbps = round((downloadedBytes * 8) / (durationMs / 1000) / 1_000_000, 2);
  const rawLatencyMs = Math.round(latencySamples[0]);
  const rawJitterMs = Math.round(calculateJitter(latencySamples));
  const rawPacketDropPercent = round((failedSamples / totalSamples) * 100, 1);
  const throttled = applyThrottle(rawBandwidthMbps, rawLatencyMs, rawJitterMs, rawPacketDropPercent, throttleMode);

  const telemetryResponse = await fetch(`${baseUrl}/api/telemetry`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      streamId,
      deviceId: "expo-go-device",
      deviceModel: "Expo Go",
      bandwidthMbps: throttled.bandwidthMbps,
      latencyMs: throttled.latencyMs,
      packetDropPercent: throttled.packetDropPercent,
      jitterMs: throttled.jitterMs,
      delegate
    })
  });

  if (!telemetryResponse.ok) {
    throw new Error("실측값은 계산됐지만 telemetry 저장에 실패했습니다.");
  }

  const telemetry = (await telemetryResponse.json()) as TelemetryDecisionResponse;

  return {
    measuredAt: new Date().toISOString(),
    bandwidthMbps: throttled.bandwidthMbps,
    latencyMs: throttled.latencyMs,
    jitterMs: throttled.jitterMs,
    packetDropPercent: throttled.packetDropPercent,
    downloadedBytes,
    durationMs,
    successfulSamples,
    totalSamples,
    backendMode: telemetry.data.decision.mode,
    backendServerQuality: telemetry.data.decision.serverQuality,
    backendTargetQuality: telemetry.data.decision.targetQuality,
    backendTrafficSavedPercent: telemetry.data.decision.trafficSavedPercent,
    backendInferenceMs: telemetry.data.decision.estimatedInferenceMs
  };
}

export async function fetchSavingsReport({
  apiBaseUrl,
  sourceFileName,
  restoredFileName
}: {
  apiBaseUrl: string;
  sourceFileName: string;
  restoredFileName: string;
}): Promise<SavingsReport> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const query = new URLSearchParams({
    source: sourceFileName,
    restored: restoredFileName
  });
  const response = await fetch(`${baseUrl}/api/media/savings-report?${query.toString()}`);

  if (response.ok) {
    const payload = (await response.json()) as { ok: boolean; data: SavingsReport };
    return payload.data;
  }

  return fetchSavingsReportFromVideoHeaders({
    baseUrl,
    sourceFileName,
    restoredFileName
  });
}

async function fetchSavingsReportFromVideoHeaders({
  baseUrl,
  sourceFileName,
  restoredFileName
}: {
  baseUrl: string;
  sourceFileName: string;
  restoredFileName: string;
}): Promise<SavingsReport> {
  const sourceBytes = await fetchContentLength(`${baseUrl}/media/videos/${sourceFileName}`);
  const restoredBytes = await fetchContentLength(`${baseUrl}/media/videos/${restoredFileName}`);
  const savedBytes = Math.max(restoredBytes - sourceBytes, 0);
  const trafficSavedPercent = restoredBytes > 0 ? round((savedBytes / restoredBytes) * 100, 1) : 0;

  return {
    measuredAt: new Date().toISOString(),
    sourceFileName,
    restoredFileName,
    sourceBytes,
    restoredBytes,
    savedBytes,
    trafficSavedPercent,
    sourceMbpsAt30Fps: estimateBitrateMbps(sourceBytes, 12.2),
    restoredMbpsAt30Fps: estimateBitrateMbps(restoredBytes, 12.2)
  };
}

async function fetchContentLength(url: string) {
  const response = await fetch(url, { method: "HEAD" });
  if (!response.ok) {
    throw new Error("절감 리포트를 불러오지 못했습니다. 백엔드 서버와 영상 파일을 확인해주세요.");
  }
  const contentLength = Number(response.headers.get("content-length") ?? 0);
  if (!Number.isFinite(contentLength) || contentLength <= 0) {
    throw new Error("영상 파일 크기를 실측하지 못했습니다. 백엔드 Content-Length 응답을 확인해주세요.");
  }
  return contentLength;
}

function estimateBitrateMbps(bytes: number, durationSeconds: number) {
  return round((bytes * 8) / durationSeconds / 1_000_000, 2);
}

function applyThrottle(
  bandwidthMbps: number,
  latencyMs: number,
  jitterMs: number,
  packetDropPercent: number,
  throttleMode: ThrottleMode
) {
  if (throttleMode === "off") {
    return { bandwidthMbps, latencyMs, jitterMs, packetDropPercent };
  }

  const profile = {
    "2mbps": { bandwidthMbps: 1.8, latencyMs: 62, jitterMs: 15, packetDropPercent: 3.2 },
    "1mbps": { bandwidthMbps: 1.0, latencyMs: 86, jitterMs: 24, packetDropPercent: 6.5 },
    "0_6mbps": { bandwidthMbps: 0.6, latencyMs: 120, jitterMs: 38, packetDropPercent: 9.8 }
  }[throttleMode];

  return {
    bandwidthMbps: Math.min(bandwidthMbps, profile.bandwidthMbps),
    latencyMs: Math.max(latencyMs, profile.latencyMs),
    jitterMs: Math.max(jitterMs, profile.jitterMs),
    packetDropPercent: Math.max(packetDropPercent, profile.packetDropPercent)
  };
}

function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/$/, "");
}

function calculateJitter(samples: number[]) {
  if (samples.length <= 1) {
    return 0;
  }
  const average = samples.reduce((sum, sample) => sum + sample, 0) / samples.length;
  const variance = samples.reduce((sum, sample) => sum + (sample - average) ** 2, 0) / samples.length;
  return Math.sqrt(variance);
}

function round(value: number, digits: number) {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}
