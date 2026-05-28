export function sendJson(res, statusCode, payload, headers = {}) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    ...headers
  });
  res.end(body);
}

export function sendText(res, statusCode, body, contentType = "text/plain; charset=utf-8", headers = {}) {
  res.writeHead(statusCode, {
    "content-type": contentType,
    "content-length": Buffer.byteLength(body),
    ...headers
  });
  res.end(body);
}

export function sendBuffer(res, statusCode, body, contentType, headers = {}) {
  res.writeHead(statusCode, {
    "content-type": contentType,
    "content-length": body.length,
    ...headers
  });
  res.end(body);
}

export function notFound(res, message = "Not found") {
  sendJson(res, 404, {
    ok: false,
    error: {
      code: "NOT_FOUND",
      message
    }
  });
}

export function badRequest(res, message, details = undefined) {
  sendJson(res, 400, {
    ok: false,
    error: {
      code: "BAD_REQUEST",
      message,
      details
    }
  });
}

export function serverError(res, message = "Internal server error") {
  sendJson(res, 500, {
    ok: false,
    error: {
      code: "INTERNAL_ERROR",
      message
    }
  });
}

export async function readJsonBody(req, maxBytes = 1024 * 64) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) {
      throw new Error("REQUEST_TOO_LARGE");
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) {
    return {};
  }

  return JSON.parse(raw);
}

export function withCors(res) {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type,authorization");
  res.setHeader("access-control-max-age", "86400");
}
