import { readKeys } from "../lib/storage.js";
import { cors, reply } from "../lib/http.js";

export default async function handler(req, res) {
  cors(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return reply(res, 405, { error: "Usa POST" });
  }

  try {
    const key = String(req.body?.key ?? "").trim().toUpperCase();

    if (!/^CASLA-[A-Z2-9]{4}(-[A-Z2-9]{4}){3}$/.test(key)) {
      return reply(res, 200, {
        valid: false,
        reason: "invalid"
      });
    }

    const keys = await readKeys();
    const item = keys.find(entry => entry.key === key);

    if (!item) {
      return reply(res, 200, {
        valid: false,
        reason: "not_found"
      });
    }

    if (item.revoked) {
      return reply(res, 200, {
        valid: false,
        reason: "revoked"
      });
    }

    if (Date.now() >= item.expiresAt) {
      return reply(res, 200, {
        valid: false,
        reason: "expired"
      });
    }

    return reply(res, 200, {
      valid: true,
      expiresAt: item.expiresAt
    });
  } catch (error) {
    console.error(error);
    return reply(res, 500, {
      valid: false,
      reason: "server_error"
    });
  }
}
