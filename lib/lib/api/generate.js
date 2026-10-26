import { readKeys, writeKeys } from "../lib/storage.js";
import { cors, reply, isAdmin, makeKey } from "../lib/http.js";

export default async function handler(req, res) {
  cors(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return reply(res, 405, { error: "Usa POST" });
  }

  if (!isAdmin(req)) {
    return reply(res, 401, { error: "No autorizado" });
  }

  try {
    const hours = Number(req.body?.hours ?? 24);

    if (!Number.isFinite(hours) || hours <= 0 || hours > 8760) {
      return reply(res, 400, {
        error: "hours debe estar entre 1 y 8760"
      });
    }

    const keys = await readKeys();
    let key;

    do {
      key = makeKey();
    } while (keys.some(item => item.key === key));

    const item = {
      key,
      createdAt: Date.now(),
      expiresAt: Date.now() + hours * 60 * 60 * 1000,
      revoked: false
    };

    keys.push(item);
    await writeKeys(keys);

    return reply(res, 201, {
      success: true,
      key: item.key,
      expiresAt: item.expiresAt
    });
  } catch (error) {
    console.error(error);
    return reply(res, 500, { error: "No se pudo guardar la key" });
  }
}
