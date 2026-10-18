'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

type Category = 'Actualitate'|'Politică'|'Justiție'|'Economie'|'Externe'|'Sport'|'Tehnologie'|'Știință'|'Cultură'|'Monden';
type Story = {id:string; title:string; summary:string; url:string; source:string; category:Category; publishedAt:string; image?:string; imageCredit?:string};
type NewsResponse = {stories:Story[]; updatedAt?:string};
const categories: {name:Category;color:string;bg:string;slug:string}[] = [
 {name:'Actualitate',color:'#1d4ed8',bg:'#eff6ff',slug:'actualitate'},
 {name:'Politică',color:'#7c3aed',bg:'#f5f3ff',slug:'politica'},
 {name:'Justiție',color:'#b91c1c',bg:'#fef2f2',slug:'justitie'},
 {name:'Economie',color:'#047857',bg:'#ecfdf5',slug:'economie'},
 {name:'Externe',color:'#0369a1',bg:'#f0f9ff',slug:'externe'},
 {name:'Sport',color:'#c2410c',bg:'#fff7ed',slug:'sport'},
 {name:'Tehnologie',color:'#4338ca',bg:'#eef2ff',slug:'tehnologie'},
 {name:'Știință',color:'#0f766e',bg:'#f0fdfa',slug:'stiinta'},
 {name:'Cultură',color:'#a21caf',bg:'#fdf4ff',slug:'cultura'},
 {name:'Monden',color:'#be185d',bg:'#fdf2f8',slug:'monden'}
];
const fmt = (s:string) => { try { return new Intl.DateTimeFormat('ro-RO',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(s)); } catch { return ''; } };

export default function CategoryPage() {
 const params=useParams<{category:string}>();
 const slug=Array.isArray(params.category)?params.category[0]:params.category;
 const category=categories.find(c=>c.slug===String(slug||'').toLocaleLowerCase('ro'));
 const [stories,setStories]=useState<Story[]>([]);
 const [clock,setClock]=useState<Date|null>(null);
 const [rates,setRates]=useState<{date:string|null;rates:Record<string,number>}>({date:null,rates:{}});
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 useEffect(()=>{let live=true; setClock(new Date()); const clockId=setInterval(()=>setClock(new Date()),1000); fetch('/api/rates',{cache:'no-store'}).then(r=>r.json()).then(d=>{if(live)setRates(d)}).catch(()=>{}); const ratesId=setInterval(()=>fetch('/api/rates',{cache:'no-store'}).then(r=>r.json()).then(d=>{if(live)setRates(d)}).catch(()=>{}),60*60*1000); fetch('/api/news',{cache:'no-store'}).then(r=>{if(!r.ok) throw new Error('RSS'); return r.json()}).then((d:NewsResponse)=>{if(live)setStories(d.stories||[])}).catch(()=>{if(live)setError('Știrile nu sunt disponibile momentan. Reîncarcă pagina în câteva momente.')}).finally(()=>{if(live)setLoading(false)});return()=>{live=false;clearInterval(clockId);clearInterval(ratesId)}},[]);
 const fmtRate=(code:string)=>rates.rates[code]?rates.rates[code].toLocaleString('ro-RO',{minimumFractionDigits:4,maximumFractionDigits:4}):'—';
 const filtered=useMemo(()=>category?stories.filter(s=>s.category===category.name):[],[stories,category]);
 return <main>
  <header className="hero"><div className="wrap">
   <div className="header-meta"><div className="header-datetime"><span>{clock?new Intl.DateTimeFormat('ro-RO',{weekday:'long',day:'2-digit',month:'short',year:'numeric'}).format(clock):'Data curentă'}</span><strong>{clock?new Intl.DateTimeFormat('ro-RO',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(clock):'--:--:--'}</strong></div><div className="rates"><div className="rate-list">{['EUR','USD','GBP'].map(code=><div className="rate" key={code}><span>{code}</span><strong>{fmtRate(code)}</strong></div>)}</div></div></div>
   <div className="brand-row"><a className="brand" href="/"><span className="brand-mark">MM</span><span>Media<span>Monitor</span><small>Monitorizarea presei românești</small></span></a><div className="brand-header-copy"><p className="eyebrow">AGREGATOR DE ȘTIRI · SURSE PUBLICE</p><h1>Informația, <em>din toate unghiurile.</em></h1><p>Urmărește actualitatea din România și din lume, centralizată din publicații naționale, într-un singur flux.</p></div></div>
   <nav className="nav">{[{name:'Acasă',href:'/'},...categories.map(c=>({name:c.name,href:'/categorie/'+c.slug}))].map(item=><a key={item.name} className={category?.name===item.name?'selected':''} href={item.href}>{item.name}</a>)}</nav>
  </div></header>
  <div className="wrap"><div className="ticker"><span className="live-dot"/><strong>ULTIMA ORĂ</strong><div className="ticker-viewport"><div className={stories.length?'ticker-items':'ticker-items ticker-static'}>{stories.length?[...stories.slice(0,6),...stories.slice(0,6)].map((story,i)=><a key={story.id+'-'+i} href={story.url} target="_blank" rel="noreferrer" title={story.title}>{story.title}</a>):<span>Se preiau cele mai noi informații din sursele publice…</span>}</div></div></div></div>
  <div className="wrap category-page-content">
   <div className="section-heading"><div><span className="eyebrow">MEDIAMONITOR · ȘTIRI DIN CATEGORIE</span><h1>{category?category.name:'Categorie inexistentă'}</h1></div><span className="count">{filtered.length} articole</span></div>
   {!category?<div className="empty">Categoria solicitată nu există. Alege o categorie din meniul principal.</div>:<section className="quick-category-results" id="news-list"><div className="latest-list">
    {filtered.map(story=>{const cat=categories.find(c=>c.name===story.category)!;return <article className="story" key={story.id}>
     {story.image&&<a className="story-image-link" href={story.url} target="_blank" rel="noreferrer"><img className="story-image" src={story.image} alt="" loading="lazy" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display='none'}}/><span className="photo-credit">Foto: {story.imageCredit||story.source}</span></a>}
     <div className="story-top"><span className="tag" style={{color:cat.color,background:cat.bg}}>{story.category}</span><time>{fmt(story.publishedAt)}</time></div>
     <a className="story-title" href={story.url} target="_blank" rel="noreferrer">{story.title}</a><p>{story.summary}</p><div className="story-bottom"><span>{story.source}</span><a href={story.url} target="_blank" rel="noreferrer">Citește la sursă ↗</a></div>
    </article>})}
    {loading&&<div className="empty">Se încarcă știrile din categoria selectată…</div>}
    {!loading&&!error&&!filtered.length&&<div className="empty">Nu există momentan știri încadrate la categoria {category.name}.</div>}
    {error&&<div className="notice">{error}<button onClick={()=>location.reload()}>Reîncarcă</button></div>}
   </div></section>}
  </div>
  <footer><div className="wrap footer-inner"><a className="brand footer-brand" href="/"><span className="brand-mark">MM</span><span>Media<span>Monitor</span><small>Monitorizarea presei românești</small></span></a><p>MediaMonitor centralizează titluri și fragmente din fluxuri publice. Conținutul integral aparține publicațiilor-sursă.</p><small>© {new Date().getFullYear()} MediaMonitor</small></div></footer>
 </main>;
}
