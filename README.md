# Jobwijs — prototype Belgische jobsite

Klikbaar prototype van een jobsite voor de Belgische markt. Bezoekers kunnen:

- **klassiek zoeken** met een **Wat**-veld (functie, trefwoord, bedrijf) en een **Waar**-veld (gemeente, postcode, provincie of gewest) plus een straal in km;
- **zoeken met een prompt**: in gewone taal beschrijven wat ze zoeken, bv. *"Ik zoek een deeltijdse job in de zorg rond Gent, liefst zonder weekendwerk"*;
- resultaten **filteren en sorteren** (sector, contract, regime, werktaal, thuiswerk, knelpuntberoep, minimumloon, datum);
- **detailpagina's** openen met taken, profiel, loon, extralegale voordelen, paritair comité, en een (fictief) sollicitatieformulier;
- jobs **bewaren** (in de browser).

Alle vacatures (±85), bedrijven en referenties zijn **fictief**. Er wordt niets verstuurd.

## Zo werkt de promptzoeker

De prompt wordt in de browser geïnterpreteerd (`js/prompt.js`) en omgezet in criteria:
functie/sector, plaats + straal, regime, contract, thuiswerk, minimumloon (bruto/netto),
talen ("ik spreek geen Frans", "tweetalig"), ervaring ("schoolverlater", "3 jaar ervaring"),
diploma, ploegen- en weekendwerk, extralegale voordelen en soort werk ("buiten", "met mijn handen").

De bezoeker ziet hoe de vraag begrepen werd (als chips die je kan weghalen) en per job een
matchpercentage met de redenen waarom de job wel of niet past.

Dit is een regelgebaseerde simulatie. In een echte versie vervang je `JW.parsePrompt` door een
call naar een taalmodel dat dezelfde criteria-structuur teruggeeft; de rest van de site blijft gelijk.

## Lokaal bekijken

Geen build of installatie nodig:

- open `index.html` rechtstreeks in je browser, of
- start een lokale server: `npx serve .` of `python3 -m http.server` en surf naar de getoonde URL.

## Delen met collega's

- **Eén bestand**: `dist/jobwijs.html` bevat alles (HTML, CSS, JS en data). Mail het of zet het op een gedeelde schijf; dubbelklikken volstaat.
  Na wijzigingen opnieuw bundelen met `python3 tools/build.py`.
- **GitHub Pages**: Settings → Pages → *Deploy from a branch* → kies de branch en map `/ (root)`. De site staat dan op `https://<account>.github.io/jobs/`.

## Structuur

```
index.html        pagina-skelet (header, footer, sollicitatiedialoog)
css/styles.css    vormgeving, licht en donker thema, responsive
js/data.js        steden, sectoren, fictieve bedrijven en rolsjablonen → vacatures
js/prompt.js      interpretatie van de prompt + matchscore
js/app.js         routing (#home, #resultaten, #job-…, #bewaard), zoeken, filters, weergave
tools/build.py    bundelt alles tot dist/jobwijs.html
```

## Mogelijke volgende stappen

- Prompt laten interpreteren door een taalmodel (ook in het Frans, Engels en Duits).
- Meertalige interface (NL / FR / EN / DE).
- Echte vacaturedata of een koppeling met een ATS.
- Accounts, jobalerts en "jobs zoals deze" op basis van bewaarde vacatures.
