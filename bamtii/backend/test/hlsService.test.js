import test from "node:test";
import assert from "node:assert/strict";
import { streams } from "../src/data/streams.js";
import { decideAbr } from "../src/services/abrEngine.js";
import { createMasterManifest, createVariantManifest } from "../src/services/hlsService.js";

test("master manifest only exposes 360p during congestion", () => {
  const manifest = createMasterManifest(
    streams[0],
    decideAbr({ bandwidthMbps: 1.2, latencyMs: 80, packetDropPercent: 5, jitterMs: 16 }),
    "http://localhost:4000"
  );

  assert.match(manifest, /360p/);
  assert.doesNotMatch(manifest, /1080p/);
});

test("master manifest exposes all qualities on stable network", () => {
  const manifest = createMasterManifest(
    streams[0],
    decideAbr({ bandwidthMbps: 8, latencyMs: 20, packetDropPercent: 0, jitterMs: 2 }),
    "http://localhost:4000"
  );

  assert.match(manifest, /360p/);
  assert.match(manifest, /720p/);
  assert.match(manifest, /1080p/);
});

test("variant manifest contains playable segment paths", () => {
  const manifest = createVariantManifest(streams[0], "360p");

  assert.ok(manifest);
  assert.match(manifest, /#EXTM3U/);
  assert.match(manifest, /seg-000\.ts/);
  assert.match(manifest, /#EXT-X-ENDLIST/);
});
