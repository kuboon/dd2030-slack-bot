// Cache API を悪用して任意の json を cache する

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds
export async function cache<T>(
  key: string,
  getter: () => Promise<T>,
): Promise<T> {
  const cache = await caches.open("dummy-cache");
  const dummyRequest = new Request("https://example.com/" + key);
  const cachedResponse = await cache.match(dummyRequest);
  if (cachedResponse) {
    const expireAt = cachedResponse.headers.get("X-EXPIRE-AT");
    if (expireAt && Number(expireAt) > Date.now()) {
      console.log("cache hit");
      return cachedResponse.json();
    }
  }
  const value = await getter();
  const dummyResponse = Response.json(value);
  dummyResponse.headers.append(
    "X-EXPIRE-AT",
    (Date.now() + CACHE_TTL).toString(),
  );
  await cache.put(dummyRequest, dummyResponse);
  return value;
}
