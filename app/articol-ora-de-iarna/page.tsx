import Link from 'next/link';
import { editorialArticle } from '../../lib/editorial';

export default function WinterTimeArticle() {
 return <main className="articles-page editorial-article-page">
  <header className="hero"><div className="wrap"><div className="brand-row"><a className="brand" href="/"><span className="brand-mark">MM</span><span>Media<span>Monitor</span><small>Monitorizarea presei românești</small></span></a><Link className="all-news-cta" href="/">← Înapoi la prima pagină</Link></div><nav className="nav"><a href="/">Prima pagină</a><a href="/articole">Toate articolele</a></nav></div></header>
  <article className="wrap editorial-article">
   <div className="editorial-article-meta"><span>ACTUALITATE</span><time dateTime={editorialArticle.publishedAt}>{new Intl.DateTimeFormat('ro-RO',{day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(editorialArticle.publishedAt))}</time></div>
   <h1>{editorialArticle.title}</h1><p className="editorial-deck">{editorialArticle.summary}</p>
   <figure className="editorial-article-figure"><img src={editorialArticle.image} alt="Ceas stradal acoperit de zăpadă, fotografie de iarnă" /><figcaption>Fotografie: {editorialArticle.imageCredit}</figcaption></figure>
   <div className="editorial-author">Autor: <strong>{editorialArticle.author}</strong></div>
   <div className="editorial-article-body">
    <p>România va trece la ora de iarnă în noaptea de sâmbătă, 24 octombrie, spre duminică, 25 octombrie 2026. La ora 04:00, ceasurile vor fi date înapoi cu o oră, devenind ora 03:00. Astfel, ultima duminică din octombrie va avea 25 de ore.</p>
    <h2>Ce trebuie să facem cu ceasurile?</h2>
    <p>Telefoanele mobile, calculatoarele și majoritatea dispozitivelor conectate la internet își actualizează automat ora. În cazul ceasurilor de perete, al ceasurilor de mână, al unor aparate electrocasnice și al sistemelor auto, ora trebuie verificată și modificată manual, dacă dispozitivul nu face actualizarea automat.</p>
    <h2>De ce se schimbă ora?</h2>
    <p>Trecerea la ora standard înseamnă revenirea la ora Europei de Est. Diminețile vor deveni mai luminoase, însă se va întuneca mai devreme după-amiaza. Schimbarea poate influența temporar rutina de somn, de aceea este util ca programul de odihnă să fie ajustat treptat.</p>
    <h2>Se câștigă o oră de somn</h2>
    <p>În noaptea schimbării, ceasul se întoarce de la 04:00 la 03:00, astfel că intervalul respectiv se repetă, iar teoretic avem la dispoziție o oră în plus. Pentru persoanele care au program de lucru în timpul nopții, este recomandată verificarea orelor înscrise în ture și în rezervările programate.</p>
    <p>Următoarea schimbare va avea loc în primăvara anului 2027, când ceasurile vor fi date înainte cu o oră, la revenirea la ora de vară.</p>
   </div>
   <p className="editorial-source-note">Informații calendaristice: <a href="https://www.timeanddate.com/time/change/romania/bucharest?year=2026" target="_blank" rel="noreferrer">Timeanddate – schimbarea orei în România</a>. Fotografia este disponibilă pe Wikimedia Commons sub licența indicată în credit.</p>
   <Link className="all-news-cta" href="/articole">Vezi arhiva articolelor →</Link>
  </article>
  <footer><div className="wrap footer-inner"><a className="brand footer-brand" href="/"><span className="brand-mark">MM</span><span>Media<span>Monitor</span><small>Monitorizarea presei românești</small></span></a><p>MediaMonitor centralizează titluri și fragmente din fluxuri publice.</p><small>© {new Date().getFullYear()} MediaMonitor</small></div></footer>
 </main>;
}
