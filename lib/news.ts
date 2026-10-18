import Parser from 'rss-parser';

export const CATEGORIES = [
  'Actualitate','Politică','Justiție','Economie','Externe','Sport','Tehnologie','Știință','Cultură','Monden'
] as const;
export type Category = typeof CATEGORIES[number];
export type Story = { id: string; title: string; summary: string; url: string; source: string; category: Category; publishedAt: string; image?: string; imageCredit?: string };

const parser = new Parser({
  timeout: 4500,
  headers: { 'User-Agent': 'MediaMonitor/1.0 (+public RSS news aggregator)' },
  customFields: { item: [['media:content', 'mediaContent'], ['media:thumbnail', 'mediaThumbnail'], ['media:credit', 'mediaCredit'], ['itunes:image', 'itunesImage']] }
});

export const FEEDS = [
  { source:'Știrile ProTV', url:'https://stirileprotv.ro/rss.xml' },
  { source:'Digi24', url:'https://www.digi24.ro/rss/Stiri/Digi24/' },
  { source:'HotNews', url:'https://rss.hotnews.ro' },
  { source:'Recorder', url:'https://recorder.ro/feed/' },
  { source:'G4Media', url:'https://www.g4media.ro/feed' },
  { source:'Adevărul', url:'https://adevarul.ro/toate-articolele.rss' },
  { source:'Gazeta Sporturilor', url:'https://www.gsp.ro/rss.xml' },
  { source:'Sport.ro', url:'https://sport.ro/rss.xml' },
  { source:'Digi Sport', url:'https://www.digisport.ro/rss' },
  { source:'Libertatea', url:'https://www.libertatea.ro/feed' },
  { source:'Cancan', url:'https://www.cancan.ro/feed' },
  { source:'Newsweek România', url:'https://newsweek.ro/feed' },
  { source:'Ziarul Financiar', url:'https://www.zf.ro/rss' },
  { source:'Ziarul Bursa', url:'https://www.bursa.ro/rss' },
  { source:'Agerpres', url:'https://agerpres.ro/feeds' },
  { source:'Radio România', url:'https://www.romania-actualitati.ro/rss' },
  { source:'Știrile TVR', url:'https://www.tvr.ro/rss/stiri.xml' },
];

function clean(s = '') {
  return s.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"')
    .replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
}

const categoryRules: { category: Category; patterns: RegExp[] }[] = [
  { category:'Justiție', patterns:[/justiț/i,/justit/i, /dna\b/i,/diicot/i,/instanț/i,/instanţ/i,/judecător/i,/judecator/i,/procuror/i,/dosar penal/i,/condamn/i,/tribunal/i,/curtea de apel/i] },
  { category:'Economie', patterns:[/economie/i,/economic/i,/burs[ăe]/i,/inflaț/i,/inflaţ/i,/dobân/i,/doban/i,/buget/i,/profit/i,/compani/i,/afaceri/i,/financiar/i,/salari/i,/pensie/i,/bnr/i,/fiscal/i,/impozit/i,/taxe/i,/export/i,/import/i,/investiț/i,/investit/i,/prețuri/i,/preturi/i,/factur/i,/energie/i,/locuri de muncă/i,/locuri de munca/i,/piața muncii/i,/piata muncii/i,/produs intern brut/i,/\bpib\b/i,/\beuro\b/i,/\bdolar\b/i] },
  { category:'Politică', patterns:[/politic/i,/guvern/i,/parlament/i,/președ/i,/presed/i,/ministr/i,/partid/i,/alegeri/i,/coaliț/i,/coalit/i,/senat/i,/deputat/i,/prim-ministr/i,/ordonanț/i,/ordonant/i,/proiect de lege/i,/moțiune/i,/motiune/i] },
  { category:'Externe', patterns:[/ucrain/i,/rusia/i,/statele unite/i,/donald trump/i,/uniunea europeană/i,/uniunea europeana/i,/orientul mijlociu/i,/israel/i,/china/i,/franța/i,/franta/i,/germania/i,/marea britanie/i,/bruxelles/i,/nato/i,/război/i,/razboi/i,/atac iran/i,/alegeri în sua/i,/alegeri in sua/i] },
  { category:'Sport', patterns:[/sport/i,/fotbal/i,/tenis/i,/campionat/i,/goluri/i,/meci/i,/liga 1/i,/formula 1/i,/baschet/i,/handbal/i,/volei/i,/olimpic/i,/antrenor/i,/transfer/i,/superliga/i,/champions league/i] },
  { category:'Tehnologie', patterns:[/tehnolog/i,/inteligență artificială/i,/inteligenta artificiala/i,/software/i,/cyber/i,/digital/i,/telefon/i,/aplicație/i,/aplicatie/i,/internet/i,/robot/i,/google/i,/microsoft/i,/apple/i,/facebook/i,/instagram/i,/platformă/i,/platforma/i,/securitate cibernetică/i] },
  { category:'Știință', patterns:[/științ/i,/stiint/i,/cercetător/i,/cercetator/i,/nasa/i,/spațiu/i,/spatiu/i,/descoperire/i,/climă/i,/clima/i,/mediu/i,/astronom/i,/cercetare/i,/stud[iu]/i,/universitate/i,/specie nouă/i,/specie noua/i] },
  { category:'Cultură', patterns:[/cultur/i,/carte/i,/literatur/i,/teatru/i,/film/i,/cinema/i,/muzeu/i,/expoziț/i,/expozit/i,/festival/i,/muzică/i,/muzica/i,/artist/i,/concert/i,/premieră/i,/premiera/i,/spectacol/i] },
  { category:'Monden', patterns:[/vedet/i,/showbiz/i,/mond(en|ial)/i,/divorț/i,/divort/i,/nuntă/i,/nunta/i,/actor/i,/actriț/i,/influencer/i,/reality show/i,/emisiune tv/i,/cântăreț/i,/cantaret/i] },
  { category:'Actualitate', patterns:[/accident/i,/incendiu/i,/vreme/i,/meteo/i,/sănătate/i,/sanatate/i,/educație/i,/educatie/i,/trafic/i,/comunitate/i,/cutremur/i,/inundaț/i,/inundat/i,/pompier/i,/spital/i,/școală/i,/scoala/i,/românia/i,/romania/i] }
];

function categoryFor(title: string, summary: string, source: string): Category {
  // Feeds dedicated to a single subject are more reliable than guessing from their full text.
  if (/Gazeta Sporturilor|Sport\.ro|Digi Sport/i.test(source)) return 'Sport';
  if (/Cancan/i.test(source)) return 'Monden';
  if (/Ziarul Financiar|Ziarul Bursa/i.test(source)) return 'Economie';

  // Give the headline more weight than the description, which often mentions unrelated topics.
  const headline = title.toLocaleLowerCase('ro');
  const description = summary.toLocaleLowerCase('ro');
  let winner: Category = 'Actualitate';
  let best = 0;
  for (const rule of categoryRules) {
    let score = 0;
    for (const pattern of rule.patterns) {
      if (pattern.test(headline)) score += 3;
      if (pattern.test(description)) score += 1;
    }
    if (score > best) { best = score; winner = rule.category; }
  }
  return winner;
}

function imageFrom(value: any): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const match = trimmed.match(/<img\b[^>]*?\b(?:src|data-src)=[\"']([^\"']+)[\"']/i)
      || trimmed.match(/<img\b[^>]*?\bsrcset=[\"']([^\"']+)[\"']/i);
    if (match?.[1]) return match[1].split(',')[0].trim().split(/\s+/)[0];
    return undefined;
  }
  if (Array.isArray(value)) {
    for (const entry of value) { const found = imageFrom(entry); if (found) return found; }
    return undefined;
  }
  return imageFrom(value.url || value.href || value.$?.url || value.$?.href || value._ || value['#text']);
}

function imageCreditFrom(rawItem: any, image?: string): string | undefined {
  const credit = rawItem?.mediaCredit || rawItem?.credit || rawItem?.['dc:creator'];
  const creditText = clean(typeof credit === 'string' ? credit : credit?._ || credit?.['#text'] || '');
  if (creditText) return creditText.slice(0, 100);
  if (image) { try { return new URL(image).hostname.replace(/^www\./, ''); } catch {} }
  return undefined;
}

function summarize(title: string, raw: string) {
  const text = clean(raw);
  if (!text) return `Pe scurt: ${title}. Consultă articolul publicat de sursă pentru detalii, context și declarațiile complete.`;
  const sentence = text.split(/(?<=[.!?])\s+/).find(s => s.length > 45) || text;
  const excerpt = sentence.length > 240 ? sentence.slice(0, 237).replace(/\s+\S*$/, '') + '…' : sentence;
  return excerpt;
}

type NewsResult = { stories: Story[]; sources: {name:string; ok:boolean; count:number}[] };
let cachedNews: NewsResult | null = null;
let cachedAt = 0;
let refreshInFlight: Promise<NewsResult> | null = null;
const CACHE_TTL = 15 * 60 * 1000;

async function refreshStories(): Promise<NewsResult> {
  const results = await Promise.all(FEEDS.map(async feed => {
    try {
      const data = await parser.parseURL(feed.url);
      const items = (data.items || []).slice(0, 25).map((item) => {
        const title = clean(item.title || 'Știre fără titlu');
        const url = item.link || '';
        if (!url.startsWith('http')) return null;
        const rawItem = item as any;
        const raw = rawItem.contentSnippet || rawItem.content || rawItem['content:encoded'] || rawItem.summary || '';
        const published = item.isoDate || item.pubDate || new Date().toISOString();
        const image = imageFrom(rawItem.enclosure)
          || imageFrom(rawItem.mediaContent) || imageFrom(rawItem.mediaThumbnail)
          || imageFrom(rawItem.itunesImage) || imageFrom(rawItem.image)
          || imageFrom(rawItem.content) || imageFrom(rawItem['content:encoded'])
          || imageFrom(rawItem.summary) || imageFrom(rawItem.description);
        return {
          id: `${feed.source}-${Buffer.from(url).toString('base64url').slice(0,24)}`,
          title, summary: summarize(title, raw), url, source: feed.source,
          category: categoryFor(title, clean(raw), feed.source),
          publishedAt: new Date(published).toISOString(), image, imageCredit: imageCreditFrom(rawItem, image)
        } as Story;
      }).filter(Boolean) as Story[];
      return { stories: items, source: { name: feed.source, ok: true, count: items.length } };
    } catch {
      return { stories: [] as Story[], source: { name: feed.source, ok: false, count: 0 } };
    }
  }));
  const unique = new Map<string, Story>();
  results.flatMap(r => r.stories).forEach(story => {
    const existing = unique.get(story.url);
    if (!existing || (!existing.image && story.image)) unique.set(story.url, story);
  });
  const stories: Story[] = [];
  unique.forEach(story => stories.push(story));
  stories.sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  return { stories, sources: results.map(r => r.source) };
}

export async function getStories(): Promise<NewsResult> {
  // Serve the last successful snapshot immediately while a background refresh runs.
  if (cachedNews && Date.now() - cachedAt < CACHE_TTL) return cachedNews;
  if (refreshInFlight) return cachedNews || refreshInFlight;
  refreshInFlight = refreshStories().then(result => {
    if (result.stories.length || !cachedNews) { cachedNews = result; cachedAt = Date.now(); }
    return cachedNews || result;
  }).catch(() => cachedNews || { stories: [], sources: FEEDS.map(feed => ({name:feed.source,ok:false,count:0})) })
    .finally(() => { refreshInFlight = null; });
  // Cold start waits for RSS once; subsequent page loads use the shared snapshot.
  return cachedNews || refreshInFlight;
}
