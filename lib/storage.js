import { get, put } from "@vercel/blob";

const PATH = "casla/keys.json";

export async function readKeys() {
  const result = await get(PATH, { access: "private" });

  if (!result || result.statusCode !== 200) {
    return [];
  }

  const text = await new Response(result.stream).text();
  const data = JSON.parse(text);

  if (!Array.isArray(data)) {
    throw new Error("El archivo de keys no tiene un formato válido");
  }

  return data;
}

export async function writeKeys(keys) {
  await put(PATH, JSON.stringify(keys), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60
  });
}
