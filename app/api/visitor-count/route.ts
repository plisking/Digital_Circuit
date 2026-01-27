import { NextResponse } from 'next/server';
import { getVisitorCount, incrementVisitorCount } from '@/lib/visitor-store';

export const runtime = 'edge';

export async function GET() {
  const count = await getVisitorCount();
  return NextResponse.json({ count });
}

export async function POST() {
  const count = await incrementVisitorCount();
  return NextResponse.json({ count });
}
