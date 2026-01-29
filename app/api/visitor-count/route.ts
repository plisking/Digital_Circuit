import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getVisitorCount, incrementVisitorCount } from "@/lib/visitor-store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type KVNamespaceLike = {
  get<T = string>(key: string, options?: { cacheTtl?: number }): Promise<T | null>;
  put(key: string, value: string): Promise<void>;
};

type Env = {
  VISITOR_KV: KVNamespaceLike;
};

const getKvBinding = (): KVNamespaceLike => {
  const ctx = getRequestContext();
  // 增加调试逻辑：尝试多种方式获取 env，并打印可用 keys
  const env = ctx.env;
  
  if (!env) {
    console.error("Error: Runtime env is missing");
  }

  const kv = (env as Env | undefined)?.VISITOR_KV;

  if (!kv) {
    // 收集当前环境中存在的变量名，辅助调试
    const availableKeys = env ? Object.keys(env).join(", ") : "env is undefined";
    throw new Error(`VISITOR_KV binding is not available. Available bindings: [${availableKeys}]`);
  }

  return kv;
};

export async function GET(_request: Request) {
  try {
    const count = await getVisitorCount(getKvBinding());
    return NextResponse.json({ count });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}

export async function POST(_request: Request) {
  try {
    const count = await incrementVisitorCount(getKvBinding());
    return NextResponse.json({ count });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}
