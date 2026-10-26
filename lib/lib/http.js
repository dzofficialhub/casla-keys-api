export function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Admin-Key"
  );
  res.setHeader("Cache-Control", "no-store");
}

export function reply(res, status, data) {
  return res.status(status).json(data);
}

export function isAdmin(req) {
  const secret = process.env.ADMIN_SECRET;
  const supplied = req.headers["x-admin-key"];

  return Boolean(
    secret &&
    typeof supplied === "string" &&
    supplied.length > 0 &&
    supplied === secret
  );
}

export function makeKey() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const groups = [];

  for (let g = 0; g < 4; g++) {
    let part = "";

    for (let i = 0; i < 4; i++) {
      part += alphabet[
        Math.floor(Math.random() * alphabet.length)
      ];
    }

    groups.push(part);
  }

  return "CASLA-" + groups.join("-");
}
