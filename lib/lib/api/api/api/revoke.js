import { readKeys, writeKeys } from "../lib/storage.js";
import { cors, reply, isAdmin } from "../lib/http.js";

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
    const key = String(req.body?.key ?? "").trim().toUpperCase();
    const keys = await readKeys();
    const item = keys.find(entry => entry.key === key);

    if (!item) {
      return reply(res, 404, { error: "Key no encontrada" });
    }

    item.revoked = true;
    await writeKeys(keys);

    return reply(res, 200, {
      success: true,
      message: "Key revocada"
    });
  } catch (error) {
    console.error(error);
    return reply(res, 500, { error: "No se pudo revocar la key" });
  }
}
