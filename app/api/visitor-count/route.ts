import { NextResponse } from "next/server";
import { getVisitorCount, incrementVisitorCount } from "@/lib/visitor-store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type Env = {
  VISITOR_KV: KVNamespace;
};

export async function GET(_request: Request, { env }: { env: Env }) {
  const count = await getVisitorCount(env.VISITOR_KV);
  return NextResponse.json({ count });
}

export async function POST(_request: Request, { env }: { env: Env }) {
  const count = await incrementVisitorCount(env.VISITOR_KV);
  return NextResponse.json({ count });
}
