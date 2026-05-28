const qualityProfiles = {
  "360p": {
    bandwidth: 850000,
    resolution: "640x360"
  },
  "720p": {
    bandwidth: 2600000,
    resolution: "1280x720"
  },
  "1080p": {
    bandwidth: 5800000,
    resolution: "1920x1080"
  }
};

export function createMasterManifest(stream, decision, baseUrl) {
  const allowedQualities = decision.mode === "EDGE_AI_RESTORE" ? ["360p"] : stream.qualities;
  const lines = ["#EXTM3U", "#EXT-X-VERSION:3", `# 깍두기 절단기 ABR mode=${decision.mode}`];

  for (const quality of allowedQualities) {
    const profile = qualityProfiles[quality];
    lines.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${profile.bandwidth},RESOLUTION=${profile.resolution},NAME="${quality}"`,
      `${baseUrl}/api/streams/${stream.id}/hls/${quality}/index.m3u8`
    );
  }

  return `${lines.join("\n")}\n`;
}

export function createVariantManifest(stream, quality) {
  if (!stream.qualities.includes(quality)) {
    return null;
  }

  const segmentCount = Math.ceil(stream.durationSeconds / 6);
  const visibleSegments = Math.min(segmentCount, 8);
  const lines = [
    "#EXTM3U",
    "#EXT-X-VERSION:3",
    "#EXT-X-TARGETDURATION:6",
    "#EXT-X-MEDIA-SEQUENCE:0",
    `# 깍두기 절단기 quality=${quality}`
  ];

  for (let index = 0; index < visibleSegments; index += 1) {
    lines.push("#EXTINF:6.000,", `seg-${String(index).padStart(3, "0")}.ts`);
  }

  lines.push("#EXT-X-ENDLIST");
  return `${lines.join("\n")}\n`;
}

export function createDemoSegment(stream, quality, segmentName) {
  const payload = {
    streamId: stream.id,
    quality,
    segment: segmentName,
    note: "Demo MPEG-TS placeholder for 깍두기 절단기 MVP"
  };
  return Buffer.from(JSON.stringify(payload), "utf8");
}
