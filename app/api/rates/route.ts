import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch('https://www.bnr.ro/nbrfxrates.xml', { cache: 'no-store' });
    if (!response.ok) throw new Error('BNR unavailable');
    const xml = await response.text();
    const date = xml.match(/<Cube date="([^"]+)"/)?.[1] ?? null;
    const rates: Record<string, number> = {};
    for (const code of ['EUR', 'USD', 'GBP']) {
      const match = xml.match(new RegExp('<Rate currency="' + code + '"(?: multiplier="(\\d+)")?>([^<]+)</Rate>'));
      if (match) rates[code] = Number(match[2]) / Number(match[1] || 1);
    }
    return NextResponse.json({ date, rates, sourceUrl: 'https://www.bnr.ro/nbrfxrates.xml' }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch {
    return NextResponse.json({ date: null, rates: {}, sourceUrl: 'https://www.bnr.ro/nbrfxrates.xml' }, { status: 200 });
  }
}
