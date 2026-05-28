import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { URL } from "node:url";
import { fileURLToPath } from "node:url";
import { badRequest, notFound, readJsonBody, sendBuffer, sendJson, sendText, serverError, withCors } from "./lib/http.js";
import { logEvent, getLogPaths } from "./lib/logger.js";
import { findStream, streams } from "./data/streams.js";
import { decideAbr } from "./services/abrEngine.js";
import { createBenchmarkChunk } from "./services/benchmarkService.js";
import { createDemoSegment, createMasterManifest, createVariantManifest } from "./services/hlsService.js";
import { addTelemetry, getRecentTelemetry, getReport } from "./services/telemetryStore.js";

const videoRoot = fileURLToPath(new URL("../public/videos/", import.meta.url));

export async function handleRequest(req, res) {
  withCors(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const baseUrl = `http://${req.headers.host ?? "localhost:4000"}`;
    const url = new URL(req.url ?? "/", baseUrl);
    const path = url.pathname;
    const method = req.method ?? "GET";

    await logEvent("request", { method, path });

    if (method === "GET" && path === "/health") {
      sendJson(res, 200, {
        ok: true,
        service: "kkakdugi-cutter-backend",
        status: "healthy",
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (method === "GET" && path === "/api/streams") {
      sendJson(res, 200, {
        ok: true,
        data: streams
      });
      return;
    }

    const mediaVideoMatch = path.match(/^\/media\/videos\/([A-Za-z0-9._-]+)$/);
    if ((method === "GET" || method === "HEAD") && mediaVideoMatch) {
      await sendVideoFile(req, res, mediaVideoMatch[1]);
      return;
    }

    if (method === "GET" && path === "/api/benchmark/chunk") {
      const chunk = createBenchmarkChunk(url.searchParams.get("sizeKb") ?? 256);
      sendBuffer(res, 200, chunk.buffer, "application/octet-stream", {
        "cache-control": "no-store",
        "x-benchmark-size-kb": String(chunk.sizeKb),
        "x-benchmark-size-bytes": String(chunk.sizeBytes)
      });
      return;
    }

    const streamMatch = path.match(/^\/api\/streams\/([^/]+)$/);
    if (method === "GET" && streamMatch) {
      const stream = findStream(streamMatch[1]);
      if (!stream) {
        notFound(res, "Stream not found");
        return;
      }
      sendJson(res, 200, {
        ok: true,
        data: stream
      });
      return;
    }

    const masterMatch = path.match(/^\/api\/streams\/([^/]+)\/master\.m3u8$/);
    if (method === "GET" && masterMatch) {
      const stream = findStream(masterMatch[1]);
      if (!stream) {
        notFound(res, "Stream not found");
        return;
      }
      const decision = decideAbr({
        bandwidthMbps: url.searchParams.get("bandwidthMbps") ?? 8,
        latencyMs: url.searchParams.get("latencyMs") ?? 20,
        packetDropPercent: url.searchParams.get("packetDropPercent") ?? 0,
        jitterMs: url.searchParams.get("jitterMs") ?? 1,
        delegate: url.searchParams.get("delegate") ?? "NPU"
      });
      sendText(res, 200, createMasterManifest(stream, decision, baseUrl), "application/vnd.apple.mpegurl; charset=utf-8");
      return;
    }

    const variantMatch = path.match(/^\/api\/streams\/([^/]+)\/hls\/([^/]+)\/index\.m3u8$/);
    if (method === "GET" && variantMatch) {
      const stream = findStream(variantMatch[1]);
      if (!stream) {
        notFound(res, "Stream not found");
        return;
      }
      const manifest = createVariantManifest(stream, variantMatch[2]);
      if (!manifest) {
        notFound(res, "Quality not found");
        return;
      }
      sendText(res, 200, manifest, "application/vnd.apple.mpegurl; charset=utf-8");
      return;
    }

    const segmentMatch = path.match(/^\/api\/streams\/([^/]+)\/hls\/([^/]+)\/(seg-\d{3}\.ts)$/);
    if (method === "GET" && segmentMatch) {
      const stream = findStream(segmentMatch[1]);
      if (!stream) {
        notFound(res, "Stream not found");
        return;
      }
      if (!stream.qualities.includes(segmentMatch[2])) {
        notFound(res, "Quality not found");
        return;
      }
      sendBuffer(res, 200, createDemoSegment(stream, segmentMatch[2], segmentMatch[3]), "video/mp2t");
      return;
    }

    if (method === "POST" && path === "/api/telemetry") {
      const body = await readJsonBody(req);
      const result = await addTelemetry(body);
      if (!result.ok) {
        badRequest(res, result.error);
        return;
      }
      sendJson(res, 201, {
        ok: true,
        data: result.record
      });
      return;
    }

    if (method === "GET" && path === "/api/telemetry/recent") {
      sendJson(res, 200, {
        ok: true,
        data: getRecentTelemetry(url.searchParams.get("limit") ?? 20)
      });
      return;
    }

    if (method === "GET" && path === "/api/abr/decision") {
      const decision = decideAbr({
        bandwidthMbps: url.searchParams.get("bandwidthMbps") ?? 8,
        latencyMs: url.searchParams.get("latencyMs") ?? 20,
        packetDropPercent: url.searchParams.get("packetDropPercent") ?? 0,
        jitterMs: url.searchParams.get("jitterMs") ?? 1,
        deviceBatteryPercent: url.searchParams.get("deviceBatteryPercent") ?? 80,
        delegate: url.searchParams.get("delegate") ?? "NPU"
      });
      sendJson(res, 200, {
        ok: true,
        data: decision
      });
      return;
    }

    if (method === "GET" && path === "/api/report") {
      sendJson(res, 200, {
        ok: true,
        data: getReport()
      });
      return;
    }

    if (method === "GET" && path === "/api/logs") {
      sendJson(res, 200, {
        ok: true,
        data: getLogPaths()
      });
      return;
    }

    notFound(res);
  } catch (error) {
    if (error instanceof SyntaxError) {
      badRequest(res, "Invalid JSON body");
      return;
    }
    if (error instanceof Error && error.message === "REQUEST_TOO_LARGE") {
      badRequest(res, "Request body is too large");
      return;
    }
    await logEvent("error", { message: error instanceof Error ? error.message : String(error) });
    serverError(res);
  }
}

async function sendVideoFile(req, res, fileName) {
  const filePath = resolve(videoRoot, fileName);
  if (!filePath.startsWith(videoRoot)) {
    notFound(res, "Video not found");
    return;
  }

  let fileStat;
  try {
    fileStat = await stat(filePath);
  } catch {
    notFound(res, "Video not found");
    return;
  }

  const range = req.headers.range;
  const commonHeaders = {
    "accept-ranges": "bytes",
    "cache-control": "public, max-age=3600",
    "content-type": "video/mp4"
  };

  if (!range) {
    res.writeHead(200, {
      ...commonHeaders,
      "content-length": fileStat.size
    });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    createReadStream(filePath).pipe(res);
    return;
  }

  const match = range.match(/^bytes=(\d*)-(\d*)$/);
  if (!match) {
    res.writeHead(416, { "content-range": `bytes */${fileStat.size}` });
    res.end();
    return;
  }

  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Math.min(Number(match[2]), fileStat.size - 1) : fileStat.size - 1;

  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= fileStat.size) {
    res.writeHead(416, { "content-range": `bytes */${fileStat.size}` });
    res.end();
    return;
  }

  res.writeHead(206, {
    ...commonHeaders,
    "content-length": end - start + 1,
    "content-range": `bytes ${start}-${end}/${fileStat.size}`
  });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  createReadStream(filePath, { start, end }).pipe(res);
}
