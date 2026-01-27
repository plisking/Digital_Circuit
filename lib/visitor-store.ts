const VISITOR_COUNT_KEY = "visitor_count";

export async function getVisitorCount(kv: KVNamespace): Promise<number> {
  const raw = await kv.get<string>(VISITOR_COUNT_KEY);
  const parsed = Number.parseInt(raw ?? "0", 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function incrementVisitorCount(kv: KVNamespace): Promise<number> {
  const current = await getVisitorCount(kv);
  const next = current + 1;
  await kv.put(VISITOR_COUNT_KEY, next.toString());
  return next;
}
