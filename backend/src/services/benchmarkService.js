const maxSizeKb = 2048;

export function createBenchmarkChunk(sizeKbInput) {
  const sizeKb = clampSizeKb(sizeKbInput);
  const sizeBytes = sizeKb * 1024;
  const buffer = Buffer.alloc(sizeBytes);

  for (let index = 0; index < sizeBytes; index += 1) {
    buffer[index] = 65 + (index % 26);
  }

  return {
    sizeKb,
    sizeBytes,
    buffer
  };
}

function clampSizeKb(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 256;
  }
  return Math.max(16, Math.min(Math.round(parsed), maxSizeKb));
}
