import Parser from 'rss-parser';

export const CATEGORIES = [
  'Actualitate','Politică','Justiție','Economie','Externe','Sport','Tehnologie','Știință','Cultură','Monden'
] as const;
export type Category = typeof CATEGORIES[number];
export type Story = { id: string; title: string; summary: string; url: string; source: string; category: Category; publishedAt: string; image?: string };

const parser = new Parser({ timeout: 9000, headers: { 'User-Agent': 'MediaMonitor/1.0 (+public RSS news aggregator)' } });
// Feeds are public RSS endpoints. Some publishers change feed paths or block automated access;
// failed feeds are skipped gracefully and can be adjusted in this central registry.
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

function clean(s = '') { return s.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim(); }
function categoryFor(text: string, source: string): Category {
  const t = text.toLocaleLowerCase('ro');
  if (/sport|fotbal|tenis|campionat|goluri|meci|liga 1|formula 1/.test(t) || /sport/i.test(source)) return 'Sport';
  if (/cancan|vedet|showbiz|mond(en|ial)|divorț|divort|nuntă|nunta|actor|actriț|influencer/.test(t) || /cancan/i.test(source)) return 'Monden';
  if (/justiț|justit|dna|diicot|instanț|instanţ|judecător|judecator|procuror|dosar penal|condamn/.test(t)) return 'Justiție';
  if (/economie|bursă|burse|inflaț|inflaţ|euro|dobând|doband|buget|profit|compani|afaceri|financiar|salari|pensie|bnr|fiscal/.test(t)) return 'Economie';
  if (/extern|ucrain|rusia|sua|statele unite|donald trump|ue |uniunea europeană|uniunea europeana|orientul mijlociu|israel|china|franța|germania/.test(t)) return 'Externe';
  if (/tehnolog|inteligență artificială|inteligenta artificiala|software|cyber|digital|telefon|aplicație|aplicatie|internet|robot/.test(t)) return 'Tehnologie';
  if (/științ|stiint|cercetător|cercetator|nasa|spațiu|spatiu|descoperire|climă|clima|mediu|astronom/.test(t)) return 'Știință';
  if (/cultur|carte|literatur|teatru|film|cinema|muzeu|expoziț|expozit|festival|muzică|muzica|artist/.test(t)) return 'Cultură';
  if (/politic|guvern|parlament|președ|presed|ministr|partid|alegeri|coaliț|coalit|senat|deputat/.test(t)) return 'Politică';
  if (/românia|romania|local|accident|incendiu|vreme|meteo|sănătate|sanatate|educație|educatie|trafic|comunitate/.test(t)) return 'Actualitate';
  return 'Actualitate';
}
function summarize(title: string, raw: string) {
  const text = clean(raw);
  if (!text) return `Pe scurt: ${title}. Consultă articolul publicat de sursă pentru detalii, context și declarațiile complete.`;
  const sentence = text.split(/(?<=[.!?])\s+/).find(s => s.length > 45) || text;
  const excerpt = sentence.length > 240 ? sentence.slice(0, 237).replace(/\s+\S*$/, '') + '…' : sentence;
  // This is a short editorial digest of the feed excerpt, not a claim to rewrite the full article.
  return excerpt;
}

export async function getStories(): Promise<{ stories: Story[]; sources: {name:string; ok:boolean; count:number}[] }> {
  const results = await Promise.all(FEEDS.map(async feed => {
    try {
      const data = await parser.parseURL(feed.url);
      const items = (data.items || []).slice(0, 25).map((item, i) => {
        const title = clean(item.title || 'Știre fără titlu');
        const url = item.link || '';
        if (!url.startsWith('http')) return null;
        const raw = clean(item.contentSnippet || item.content || item.summary || '');
        const published = item.isoDate || item.pubDate || new Date().toISOString();
        const enclosure = (item as any).enclosure?.url;
        const htmlImage = (item as any).content?.match(/<img[^>]+src=["']([^"']+)/i)?.[1];
        return { id: `${feed.source}-${Buffer.from(url).toString('base64url').slice(0,24)}`, title, summary: summarize(title, raw), url, source: feed.source, category: categoryFor(`${title} ${raw}`, feed.source), publishedAt: new Date(published).toISOString(), image: enclosure || htmlImage } as Story;
      }).filter(Boolean) as Story[];
      return { stories: items, source: { name: feed.source, ok: true, count: items.length } };
    } catch {
      return { stories: [] as Story[], source: { name: feed.source, ok: false, count: 0 } };
    }
  }));
  const unique = new Map<string, Story>();
  results.flatMap(r => r.stories).forEach(story => { if (!unique.has(story.url)) unique.set(story.url, story); });
  const stories: Story[] = [];
  unique.forEach(story => stories.push(story));
  stories.sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  return { stories, sources: results.map(r => r.source) };
}
