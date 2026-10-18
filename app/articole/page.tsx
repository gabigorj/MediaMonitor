'use client';

import { useEffect, useMemo, useState } from 'react';
import { editorialArticle } from '../../lib/editorial';

type Category = 'Actualitate'|'Politică'|'Justiție'|'Economie'|'Externe'|'Sport'|'Tehnologie'|'Știință'|'Cultură'|'Monden';
type Story = {id:string;title:string;summary:string;url:string;source:string;category:Category;publishedAt:string;image?:string;imageCredit?:string};
type Rates = {date:string|null;rates:Record<string,number>;sourceName?:string};
const categories: Category[] = ['Actualitate','Politică','Justiție','Economie','Externe','Sport','Tehnologie','Știință','Cultură','Monden'];
const fmt = (s:string) => { try { return new Intl.DateTimeFormat('ro-RO',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(s)); } catch { return ''; } };

export default function ArticlesPage() {
 const [stories,setStories] = useState<Story[]>([editorialArticle]);
 const [search,setSearch] = useState('');
 const [category,setCategory] = useState<Category|'Toate'>('Toate');
 const [loading,setLoading] = useState(true);
 const [clock,setClock] = useState<Date|null>(null);
 const [rates,setRates] = useState<Rates>({date:null,rates:{}});
 const [darkMode,setDarkMode] = useState(false);
 const [largeText,setLargeText] = useState(true);
 useEffect(()=>{
  setClock(new Date());
  const clockId=setInterval(()=>setClock(new Date()),1000);
  try { setDarkMode(localStorage.getItem('mediamonitor-dark')==='true'); } catch {}
  fetch('/api/news').then(r=>r.json()).then(d=>setStories([editorialArticle,...(d.stories||[])]))
   .catch(()=>setStories([editorialArticle])).finally(()=>setLoading(false));
  fetch('/api/rates').then(r=>r.json()).then(setRates).catch(()=>{});
  return ()=>clearInterval(clockId);
 },[]);
 const filtered = useMemo(()=>stories.filter(s=>(category==='Toate'||s.category===category)&&`${s.title} ${s.summary} ${s.source}`.toLocaleLowerCase('ro').includes(search.toLocaleLowerCase('ro'))),[stories,category,search]);
 const fmtRate=(code:string)=>rates.rates[code]?rates.rates[code].toLocaleString('ro-RO',{minimumFractionDigits:4,maximumFractionDigits:4}):'—';
 return <main className={`articles-page ${largeText?'large-text':''} ${darkMode?'dark-mode':''}`}>
  <header className="hero"><div className="wrap">
   <div className="header-meta"><div className="header-datetime"><span>{clock?new Intl.DateTimeFormat('ro-RO',{weekday:'long',day:'2-digit',month:'short',year:'numeric'}).format(clock):'Data curentă'}</span><strong>{clock?new Intl.DateTimeFormat('ro-RO',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(clock):'--:--:--'}</strong></div><div className="rates"><div className="rate-list">{[['EUR',''],['USD',''],['GBP','']].map(([code])=><div className="rate" key={code}><span>{code}</span><strong>{fmtRate(code)}</strong></div>)}</div></div></div>
   <div className="brand-row"><a className="brand" href="/"><span className="brand-mark">MM</span><span>Media<span>Monitor</span><small>Monitorizarea presei românești</small></span></a></div>
   <nav className="nav"><a href="/">Acasă</a><a href="/#news-list">Toate</a>{categories.map(c=><a key={c} href={`/?category=${encodeURIComponent(c)}#news-list`}>{c}</a>)}</nav>
   <div className="accessibility-tools"><span>Dimensiune text</span><button onClick={()=>setLargeText(false)} aria-pressed={!largeText}>A−</button><button onClick={()=>setLargeText(true)} aria-pressed={largeText}>A+</button><button className="dark-toggle" onClick={()=>setDarkMode(v=>{const n=!v;try{localStorage.setItem('mediamonitor-dark',String(n))}catch{}return n})} aria-pressed={darkMode}>{darkMode?'☀ Mod luminos':'☾ Mod întunecat'}</button></div>
  </div></header>
  <div className="wrap"><div className="ticker"><span className="live-dot"/><strong>ULTIMA ORĂ</strong><div className="ticker-viewport"><div className="ticker-items">{stories.slice(0,6).map(s=><a key={s.id} href={s.url} target="_blank" rel="noreferrer" title={s.title}>{s.title}</a>)}</div></div></div></div>
  <div className="wrap articles-content"><div className="articles-heading"><span className="eyebrow">ARHIVĂ LIVE</span><h1>Toate articolele</h1><p>Știrile preluate din sursele publice, într-o listă completă, cu căutare și filtre pe categorii.</p></div><div className="search-wrap"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Caută după titlu, rezumat sau publicație…"/><button onClick={()=>setSearch('')}>Șterge</button></div><div className="article-filters"><button className={category==='Toate'?'active':''} onClick={()=>setCategory('Toate')}>Toate ({stories.length})</button>{categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div><p className="articles-count">{filtered.length} articole</p>{loading?<p className="empty">Se încarcă articolele…</p>:<div className="articles-list">{filtered.map(s=><article className="archive-story" key={s.id}>{s.id===editorialArticle.id?<a className="archive-image-link" href={editorialArticle.url}><img src={editorialArticle.image} alt="Ceas înzăpezit, fotografie de iarnă" loading="lazy"/><span className="photo-credit">Foto: {editorialArticle.imageCredit}</span></a>:s.image&&<a className="archive-image-link" href={s.url} target="_blank" rel="noreferrer"><img src={s.image} alt="" loading="lazy" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display='none'}}/><span className="photo-credit">Foto: {s.imageCredit||s.source}</span></a>}<div><span className="archive-category">{s.category} · {fmt(s.publishedAt)}</span><a className="archive-title" href={s.id===editorialArticle.id?editorialArticle.url:s.url} target={s.id===editorialArticle.id?undefined:'_blank'} rel={s.id===editorialArticle.id?undefined:'noreferrer'}>{s.title}</a><p>{s.summary}</p><div className="archive-source">{s.source} · {s.id===editorialArticle.id?'':<a href={s.url} target="_blank" rel="noreferrer">Citește la sursă ↗</a>}</div></div></article>)}</div>}{!loading&&!filtered.length&&<p className="empty">Nu au fost găsite articole pentru această căutare.</p>}</div>
  <footer><div className="wrap footer-inner"><a className="brand footer-brand" href="/"><span className="brand-mark">MM</span><span>Media<span>Monitor</span><small>Monitorizarea presei românești</small></span></a><p>MediaMonitor centralizează titluri și fragmente din fluxuri publice. Conținutul integral aparține publicațiilor-sursă.</p><small>© {new Date().getFullYear()} MediaMonitor</small></div></footer>
 </main>;
}
