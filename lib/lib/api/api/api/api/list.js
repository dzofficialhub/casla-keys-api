import { readKeys } from "../lib/storage.js";
import { cors, reply, isAdmin } from "../lib/http.js";

export default async function handler(req, res) {
  cors(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") {
    return reply(res, 405, { error: "Usa GET" });
  }

  if (!isAdmin(req)) {
    return reply(res, 401, { error: "No autorizado" });
  }

  try {
    const keys = await readKeys();

    return reply(res, 200, {
      success: true,
      total: keys.length,
      keys
    });
  } catch (error) {
    console.error(error);
    return reply(res, 500, { error: "No se pudieron consultar las keys" });
  }
}
