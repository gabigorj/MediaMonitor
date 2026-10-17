# MediaMonitor

Portal Next.js pentru agregarea știrilor din fluxuri RSS publice, clasificare în 10 categorii și afișarea cursului valutar BNR.

## Pornire locală

Necesită Node.js 18.17+ și npm.

```bash
npm install
npm run dev
```

Deschide http://localhost:3000.

## Funcționalități

- Pagina principală cu „Cele mai noi știri” și „Ultima oră”.
- 10 categorii colorate: Actualitate, Politică, Justiție, Economie, Externe, Sport, Tehnologie, Știință, Cultură, Monden.
- Flux RSS de la publicațiile configurate în `lib/news.ts`; sursele inaccesibile sunt omise fără a bloca restul paginii.
- Reîmprospătare automată la 15 minute.
- Curs valutar preluat din XML-ul public BNR (`https://www.bnr.ro/nbrfxrates.xml`).
- Căutare în titlurile și rezumatele agregate.
- Fiecare știre trimite către articolul original.

## Note importante

1. URL-urile RSS ale editorilor se pot schimba sau pot bloca accesul automat. Verifică lista „Surse monitorizate”; actualizează URL-urile din `lib/news.ts` dacă o publicație și-a modificat fluxul.
2. Clasificarea pe categorii se face local pe bază de cuvinte-cheie și poate necesita ajustări editoriale.
3. Rezumatul afișat este un fragment scurt curățat din descrierea RSS, nu o rescriere integrală a articolului. Pentru parafraze originale mai ample este necesar un serviciu de procesare editorială configurat separat; nu copia integral articolele protejate.
4. Imaginile din RSS sunt folosite numai dacă fluxul oferă o adresă de imagine. Interfața nu inventează imagini de știri.
5. Nu există valori valutare de rezervă fabricate: dacă BNR nu răspunde, interfața afișează „—”.

## API intern

- `GET /api/news` — articole agregate și starea fluxurilor
- `GET /api/rates` — curs valutar BNR
