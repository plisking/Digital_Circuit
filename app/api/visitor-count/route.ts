import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getVisitorCount, incrementVisitorCount, D1Database } from "@/lib/visitor-store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type Env = {
  VISITOR_DB: D1Database;
};

const getDbBinding = (): D1Database => {
  const ctx = getRequestContext();
  // 增加调试逻辑：尝试多种方式获取 env，并打印可用 keys
  const env = ctx.env;
  
  if (!env) {
    console.error("Error: Runtime env is missing");
  }

  const db = (env as Env | undefined)?.VISITOR_DB;

  if (!db) {
    // 收集当前环境中存在的变量名，辅助调试
    const availableKeys = env ? Object.keys(env).join(", ") : "env is undefined";
    throw new Error(`VISITOR_DB binding is not available. Available bindings: [${availableKeys}]`);
  }

  return db;
};

export async function GET(_request: Request) {
  try {
    const count = await getVisitorCount(getDbBinding());
    return NextResponse.json({ count });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}

export async function POST(_request: Request) {
  try {
    const count = await incrementVisitorCount(getDbBinding());
    return NextResponse.json({ count });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}
