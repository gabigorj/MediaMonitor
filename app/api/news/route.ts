import { NextResponse } from 'next/server';
import { getStories } from '../../../lib/news';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await getStories();
    return NextResponse.json({ ...result, updatedAt: new Date().toISOString() }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch {
    return NextResponse.json({ stories: [], sources: [], updatedAt: new Date().toISOString(), error: 'RSS indisponibil temporar' }, { status: 200 });
  }
}
