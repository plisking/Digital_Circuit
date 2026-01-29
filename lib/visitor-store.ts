const VISITOR_COUNT_KEY = "visitor_count";

type KVNamespaceLike = {
  get<T = string>(key: string, options?: { cacheTtl?: number }): Promise<T | null>;
  put(key: string, value: string): Promise<void>;
};

export async function getVisitorCount(kv: KVNamespaceLike): Promise<number> {
  const raw = await kv.get<string>(VISITOR_COUNT_KEY, { cacheTtl: 0 });
  const parsed = Number.parseInt(raw ?? "0", 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function incrementVisitorCount(kv: KVNamespaceLike): Promise<number> {
  const current = await getVisitorCount(kv);
  const next = current + 1;
  await kv.put(VISITOR_COUNT_KEY, next.toString());
  return next;
}
