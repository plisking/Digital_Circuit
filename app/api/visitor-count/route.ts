import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getVisitorCount, incrementVisitorCount } from "@/lib/visitor-store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type KVNamespaceLike = {
  get<T = string>(key: string): Promise<T | null>;
  put(key: string, value: string): Promise<void>;
};

type Env = {
  VISITOR_KV: KVNamespaceLike;
};

const getKvBinding = (): KVNamespaceLike => {
  const { env } = getRequestContext();
  const kv = (env as Env | undefined)?.VISITOR_KV;

  if (!kv) {
    throw new Error("VISITOR_KV binding is not available");
  }

  return kv;
};

export async function GET(_request: Request) {
  const count = await getVisitorCount(getKvBinding());
  return NextResponse.json({ count });
}

export async function POST(_request: Request) {
  const count = await incrementVisitorCount(getKvBinding());
  return NextResponse.json({ count });
}
