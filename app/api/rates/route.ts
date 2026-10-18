import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
type RatePayload = { date: string | null; rates: Record<string, number>; sourceUrl: string; sourceName: string };

function fromBnrXml(xml: string, sourceUrl: string): RatePayload | null {
  const date = xml.match(/<Cube\s+date="([^"]+)"/)?.[1] ?? xml.match(/<Cube\s+date='([^']+)'/)?.[1] ?? null;
  if (!date) return null;
  const rates: Record<string, number> = {};
  for (const code of ['EUR', 'USD', 'GBP']) {
    const match = xml.match(new RegExp(`<Rate\\s+currency=["']${code}["'](?:\\s+multiplier=["'](\\d+)["'])?[^>]*>([^<]+)</Rate>`));
    if (match) rates[code] = Number(match[2]) / Number(match[1] || 1);
  }
  return Object.keys(rates).length ? { date, rates, sourceUrl, sourceName: 'BNR (XML oficial)' } : null;
}

export async function GET() {
  const sources = [
    async (): Promise<RatePayload | null> => {
      const url = 'https://curs.bnr.ro/nbrfxrates.xml';
      const r = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(7000) });
      if (!r.ok) return null;
      return fromBnrXml(await r.text(), url);
    },
    async (): Promise<RatePayload | null> => {
      const url = 'https://cupiu.ro/api/rates/';
      const r = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(7000) });
      if (!r.ok) return null;
      const d = await r.json();
      const rates: Record<string, number> = {};
      for (const item of (d.rates ?? [])) if (['EUR','USD','GBP'].includes(item.currency)) rates[item.currency] = Number(item.rate ?? item.perUnit ?? item.value) / Number(item.multiplier && item.rate === undefined ? item.multiplier : 1);
      return d.date && Object.keys(rates).length ? { date: d.date, rates, sourceUrl: url, sourceName: 'Cupiu (date BNR)' } : null;
    },
    async (): Promise<RatePayload | null> => {
      const url = 'https://cursul-valutar.ro/api/rates.json';
      const r = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(7000) });
      if (!r.ok) return null;
      const d = await r.json();
      const rates: Record<string, number> = {};
      for (const item of (d.rates ?? [])) if (['EUR','USD','GBP'].includes(item.currency)) rates[item.currency] = Number(item.perUnit ?? (Number(item.value) / Number(item.multiplier || 1)));
      return d.date && Object.keys(rates).length ? { date: d.date, rates, sourceUrl: url, sourceName: 'Cursul-valutar.ro (date BNR)' } : null;
    }
  ];
  for (const source of sources) {
    try {
      const data = await source();
      if (data) return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } });
    } catch { /* încearcă următoarea sursă */ }
  }
  return NextResponse.json({ date: null, rates: {}, sourceUrl: 'https://curs.bnr.ro/nbrfxrates.xml', sourceName: 'Indisponibil temporar' }, { status: 200 });
}
