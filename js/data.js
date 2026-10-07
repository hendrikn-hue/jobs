/* Jobwijs prototype — fictieve dataset.
   Alle bedrijven, vacatures en referenties zijn verzonnen. */

window.JW = window.JW || {};

JW.CITIES = [
  // name, postcode, province, region, lat, lng, aliases
  { name: "Antwerpen", pc: "2000", prov: "Antwerpen", region: "Vlaanderen", lat: 51.2194, lng: 4.4025, alias: ["anvers", "antwerp"] },
  { name: "Mechelen", pc: "2800", prov: "Antwerpen", region: "Vlaanderen", lat: 51.0259, lng: 4.4776, alias: ["malines"] },
  { name: "Lier", pc: "2500", prov: "Antwerpen", region: "Vlaanderen", lat: 51.1310, lng: 4.5700, alias: [] },
  { name: "Turnhout", pc: "2300", prov: "Antwerpen", region: "Vlaanderen", lat: 51.3227, lng: 4.9447, alias: [] },
  { name: "Geel", pc: "2440", prov: "Antwerpen", region: "Vlaanderen", lat: 51.1617, lng: 4.9900, alias: [] },
  { name: "Gent", pc: "9000", prov: "Oost-Vlaanderen", region: "Vlaanderen", lat: 51.0543, lng: 3.7174, alias: ["gand", "ghent"] },
  { name: "Aalst", pc: "9300", prov: "Oost-Vlaanderen", region: "Vlaanderen", lat: 50.9378, lng: 4.0410, alias: ["alost"] },
  { name: "Sint-Niklaas", pc: "9100", prov: "Oost-Vlaanderen", region: "Vlaanderen", lat: 51.1650, lng: 4.1437, alias: ["sint niklaas"] },
  { name: "Dendermonde", pc: "9200", prov: "Oost-Vlaanderen", region: "Vlaanderen", lat: 51.0286, lng: 4.1010, alias: ["termonde"] },
  { name: "Beveren", pc: "9120", prov: "Oost-Vlaanderen", region: "Vlaanderen", lat: 51.2120, lng: 4.2560, alias: [] },
  { name: "Brugge", pc: "8000", prov: "West-Vlaanderen", region: "Vlaanderen", lat: 51.2093, lng: 3.2247, alias: ["bruges"] },
  { name: "Kortrijk", pc: "8500", prov: "West-Vlaanderen", region: "Vlaanderen", lat: 50.8280, lng: 3.2649, alias: ["courtrai"] },
  { name: "Oostende", pc: "8400", prov: "West-Vlaanderen", region: "Vlaanderen", lat: 51.2154, lng: 2.9286, alias: ["ostende", "ostend"] },
  { name: "Roeselare", pc: "8800", prov: "West-Vlaanderen", region: "Vlaanderen", lat: 50.9465, lng: 3.1227, alias: ["roulers"] },
  { name: "Ieper", pc: "8900", prov: "West-Vlaanderen", region: "Vlaanderen", lat: 50.8503, lng: 2.8853, alias: ["ypres"] },
  { name: "Leuven", pc: "3000", prov: "Vlaams-Brabant", region: "Vlaanderen", lat: 50.8798, lng: 4.7005, alias: ["louvain"] },
  { name: "Vilvoorde", pc: "1800", prov: "Vlaams-Brabant", region: "Vlaanderen", lat: 50.9281, lng: 4.4245, alias: [] },
  { name: "Zaventem", pc: "1930", prov: "Vlaams-Brabant", region: "Vlaanderen", lat: 50.8830, lng: 4.4720, alias: [] },
  { name: "Hasselt", pc: "3500", prov: "Limburg", region: "Vlaanderen", lat: 50.9307, lng: 5.3325, alias: [] },
  { name: "Genk", pc: "3600", prov: "Limburg", region: "Vlaanderen", lat: 50.9650, lng: 5.5008, alias: [] },
  { name: "Brussel", pc: "1000", prov: "Brussel", region: "Brussel", lat: 50.8503, lng: 4.3517, alias: ["bruxelles", "brussels"] },
  { name: "Wavre", pc: "1300", prov: "Waals-Brabant", region: "Wallonië", lat: 50.7170, lng: 4.6010, alias: ["waver"] },
  { name: "Ottignies-Louvain-la-Neuve", pc: "1340", prov: "Waals-Brabant", region: "Wallonië", lat: 50.6680, lng: 4.6120, alias: ["louvain-la-neuve", "ottignies", "lln"] },
  { name: "Namur", pc: "5000", prov: "Namen", region: "Wallonië", lat: 50.4674, lng: 4.8720, alias: ["namen"] },
  { name: "Liège", pc: "4000", prov: "Luik", region: "Wallonië", lat: 50.6326, lng: 5.5797, alias: ["luik", "liege"] },
  { name: "Eupen", pc: "4700", prov: "Luik", region: "Wallonië", lat: 50.6300, lng: 6.0300, alias: [] },
  { name: "Charleroi", pc: "6000", prov: "Henegouwen", region: "Wallonië", lat: 50.4108, lng: 4.4446, alias: [] },
  { name: "Mons", pc: "7000", prov: "Henegouwen", region: "Wallonië", lat: 50.4542, lng: 3.9523, alias: ["bergen"] },
  { name: "Arlon", pc: "6700", prov: "Luxemburg", region: "Wallonië", lat: 49.6833, lng: 5.8167, alias: ["aarlen"] }
];

JW.PROVINCES = ["Antwerpen", "Oost-Vlaanderen", "West-Vlaanderen", "Vlaams-Brabant", "Limburg", "Brussel", "Waals-Brabant", "Namen", "Luik", "Henegouwen", "Luxemburg"];
JW.REGIONS = ["Vlaanderen", "Brussel", "Wallonië"];

JW.CATEGORIES = [
  { id: "ict", label: "ICT & Digitaal" },
  { id: "zorg", label: "Zorg & Welzijn" },
  { id: "logistiek", label: "Logistiek & Transport" },
  { id: "techniek", label: "Techniek & Onderhoud" },
  { id: "bouw", label: "Bouw & Installatie" },
  { id: "onderwijs", label: "Onderwijs & Kinderopvang" },
  { id: "finance", label: "Financiën & Boekhouding" },
  { id: "sales", label: "Verkoop & Marketing" },
  { id: "admin", label: "HR & Administratie" },
  { id: "horeca", label: "Horeca & Voeding" },
  { id: "productie", label: "Productie & Industrie" }
];

JW.BENEFITS = {
  maaltijd: "Maaltijdcheques",
  eco: "Ecocheques",
  hosp: "Hospitalisatieverzekering",
  groep: "Groepsverzekering",
  wagen: "Bedrijfswagen met tankkaart",
  mobi: "Mobiliteitsbudget",
  fiets: "Fietslease",
  gsm: "Gsm-abonnement",
  laptop: "Laptop",
  dertiende: "13de maand",
  extraverlof: "Extra verlofdagen (ADV)",
  thuiswerkverg: "Thuiswerkvergoeding",
  opleiding: "Opleidingsbudget",
  ploegpremie: "Ploegenpremie",
  vervoer: "Terugbetaling woon-werkverkeer"
};

JW.COMPANIES = [
  { id: "brabo", name: "Brabo Software", city: "Antwerpen", sector: "ict", size: "120 medewerkers", hue: 168, about: "Brabo Software bouwt planningssoftware voor havenbedrijven en logistieke spelers in de Benelux. Een vlakke organisatie met korte lijnen en veel ruimte voor eigen initiatief." },
  { id: "pixelpoort", name: "Pixelpoort", city: "Gent", sector: "ict", size: "45 medewerkers", hue: 280, about: "Digitaal bureau aan de Coupure dat websites en apps maakt voor cultuurhuizen, steden en kmo's." },
  { id: "fintek", name: "Fintek Benelux", city: "Brussel", sector: "finance", size: "300 medewerkers", hue: 215, about: "Fintek Benelux levert betaal- en boekhoudsoftware aan banken en accountantskantoren. Hoofdkantoor vlak bij Brussel-Centraal." },
  { id: "senne", name: "Senne Consulting", city: "Brussel", sector: "finance", size: "60 medewerkers", hue: 30, about: "Advieskantoor in fiscaliteit en bedrijfsfinanciering voor familiebedrijven, actief in het Nederlands, Frans en Engels." },
  { id: "dijle", name: "Dijlevallei Ziekenhuis", city: "Leuven", sector: "zorg", size: "1.800 medewerkers", hue: 355, about: "Algemeen ziekenhuis met 520 bedden en een sterke focus op geriatrie, oncologie en revalidatie." },
  { id: "zorgnet", name: "Zorgnet Leie", city: "Gent", sector: "zorg", size: "650 medewerkers", hue: 340, about: "Netwerk van thuiszorg, dagcentra en assistentiewoningen in Gent en de Leiestreek." },
  { id: "terlinde", name: "WZC Hof ter Linde", city: "Kortrijk", sector: "zorg", size: "140 medewerkers", hue: 12, about: "Woonzorgcentrum met 110 bewoners, kleinschalige leefgroepen en een eigen keuken." },
  { id: "klaver", name: "Kinderopvang Klavertje Vier", city: "Mechelen", sector: "onderwijs", size: "35 medewerkers", hue: 95, about: "Drie kinderdagverblijven in Mechelen en omgeving, erkend door Opgroeien." },
  { id: "campus", name: "Campus Schelde", city: "Antwerpen", sector: "onderwijs", size: "210 medewerkers", hue: 200, about: "Secundaire school met technische en beroepsrichtingen, sterk in duaal leren met bedrijven uit de haven." },
  { id: "schelde", name: "Scheldewerk Logistics", city: "Antwerpen", sector: "logistiek", size: "900 medewerkers", hue: 190, about: "Logistiek dienstverlener met opslag, overslag en distributie vanuit de Antwerpse haven." },
  { id: "zenne", name: "Zennevallei Transport", city: "Vilvoorde", sector: "logistiek", size: "180 medewerkers", hue: 45, about: "Familiaal transportbedrijf met 110 vrachtwagens, gespecialiseerd in gekoeld vervoer." },
  { id: "kempen", name: "Kempen Kabels", city: "Geel", sector: "productie", size: "420 medewerkers", hue: 25, about: "Producent van energie- en datakabels, met afnemers in heel Europa." },
  { id: "waasland", name: "Waasland Chemie", city: "Beveren", sector: "productie", size: "650 medewerkers", hue: 140, about: "Chemische productiesite in het havengebied Waasland, met een sterke veiligheidscultuur." },
  { id: "sambre", name: "Sambre Métal", city: "Charleroi", sector: "productie", size: "250 medewerkers", hue: 10, about: "Metaalbewerking en staalconstructie voor bruggen en industriële gebouwen." },
  { id: "maasland", name: "Maasland Bouw", city: "Genk", sector: "bouw", size: "160 medewerkers", hue: 35, about: "Algemene aannemer voor woningbouw, scholen en renovatieprojecten in Limburg." },
  { id: "ijzer", name: "IJzer & Co Elektro", city: "Roeselare", sector: "techniek", size: "55 medewerkers", hue: 55, about: "Elektrotechnische installaties voor kmo's, landbouwbedrijven en zonneparken in West-Vlaanderen." },
  { id: "kouter", name: "Groene Kouter", city: "Aalst", sector: "bouw", size: "40 medewerkers", hue: 120, about: "Tuinaanleg en groenonderhoud voor particulieren, gemeenten en bedrijventerreinen." },
  { id: "mosa", name: "Mosa Energie", city: "Namur", sector: "techniek", size: "380 medewerkers", hue: 260, about: "Waalse energieleverancier die investeert in warmtepompen, zonne-energie en slimme netten." },
  { id: "limlab", name: "Limburg Lab", city: "Hasselt", sector: "zorg", size: "90 medewerkers", hue: 300, about: "Klinisch labo met vestigingen in Hasselt en Genk, voor huisartsen en ziekenhuizen." },
  { id: "duinzicht", name: "Duinzicht Hotels", city: "Oostende", sector: "horeca", size: "120 medewerkers", hue: 205, about: "Drie hotels aan de kust met restaurant, wellness en vergaderzalen." },
  { id: "noordzee", name: "Noordzee Fresh", city: "Brugge", sector: "horeca", size: "230 medewerkers", hue: 185, about: "Verwerker van verse vis en kant-en-klare maaltijden voor retail en grootkeukens." },
  { id: "polder", name: "Polder Retail", city: "Sint-Niklaas", sector: "sales", size: "75 winkels", hue: 330, about: "Keten van doe-het-zelf- en tuinwinkels in Vlaanderen." },
  { id: "lumiere", name: "Atelier Lumière", city: "Liège", sector: "sales", size: "70 medewerkers", hue: 50, about: "Ontwerper en verdeler van verlichting voor winkels, hotels en kantoren." },
  { id: "wavrepharma", name: "Wavre Pharma Solutions", city: "Wavre", sector: "productie", size: "540 medewerkers", hue: 225, about: "Contractproducent van vaccins en steriele geneesmiddelen." },
  { id: "monsdigital", name: "Mons Digital", city: "Mons", sector: "ict", size: "85 medewerkers", hue: 160, about: "Datacenter- en clouddienstverlener voor overheden en ziekenhuizen in Wallonië." },
  { id: "ostbelgien", name: "Ostbelgien Tech", city: "Eupen", sector: "techniek", size: "65 medewerkers", hue: 0, about: "Automatisering en robotica voor de voedingsindustrie, actief in België, Duitsland en Luxemburg." },
  { id: "turnprint", name: "Turnhout Print & Pack", city: "Turnhout", sector: "productie", size: "190 medewerkers", hue: 275, about: "Drukkerij en verpakkingsbedrijf met een lange traditie in de Kempen." },
  { id: "admina", name: "Admina Sociaal Secretariaat", city: "Hasselt", sector: "admin", size: "260 medewerkers", hue: 240, about: "Sociaal secretariaat voor zo'n 9.000 werkgevers, van starters tot grote kmo's." },
  { id: "brugsebakkers", name: "Brugse Bakkers", city: "Brugge", sector: "horeca", size: "50 medewerkers", hue: 28, about: "Ambachtelijke bakkerij met vier winkels en een atelier in Sint-Andries." },
  { id: "ardenne", name: "Ardenne Bois", city: "Arlon", sector: "bouw", size: "70 medewerkers", hue: 100, about: "Houtbouw en houtskeletwoningen, met eigen zagerij en atelier." },
  { id: "kustgemeente", name: "Intercommunale Kust & Polder", city: "Ieper", sector: "admin", size: "400 medewerkers", hue: 210, about: "Fictieve intergemeentelijke dienstverlener voor afval, water en ruimtelijke planning." }
];

/* Rolsjablonen. exp = minimum jaren ervaring; edu: geen | secundair | bachelor | master.
   tags: mensen, buiten, handen, creatief, cijfers, analytisch */
JW.ROLES = [
  {
    key: "devjr", title: "Junior .NET-ontwikkelaar", cat: "ict", sectors: ["ict", "finance"],
    kw: ["developer", "ontwikkelaar", "programmeur", "software", "c#", ".net", "it"],
    sal: [2900, 3500], pc: "PC 200", edu: "bachelor", exp: 0, regime: ["voltijds"], contract: ["vast"],
    remote: "hybride", shifts: false, weekend: false, knelpunt: true, tags: ["analytisch"],
    ben: ["maaltijd", "eco", "hosp", "groep", "laptop", "thuiswerkverg", "opleiding", "mobi"],
    intro: "Je start in een team van zes ontwikkelaars dat een webplatform voor {sector} verder uitbouwt. Een senior collega begeleidt je de eerste maanden als vaste buddy.",
    tasks: ["Je bouwt nieuwe functionaliteit in C# en ASP.NET Core.", "Je schrijft unit tests en doet code reviews met je collega's.", "Je zoekt samen met de product owner uit wat gebruikers echt nodig hebben.", "Je lost bugs op die via de helpdesk binnenkomen."],
    profile: ["Je hebt een bachelor toegepaste informatica of je leerde programmeren op een andere manier.", "Je kent de basis van C# of een verwante taal zoals Java.", "Je bent nieuwsgierig en stelt graag vragen.", "Je spreekt vlot Nederlands en kan technische teksten in het Engels lezen."]
  },
  {
    key: "devsr", title: "Senior full-stack developer", cat: "ict", sectors: ["ict"],
    kw: ["developer", "ontwikkelaar", "programmeur", "full-stack", "react", "typescript", "node", "it"],
    sal: [4200, 5600], pc: "PC 200", edu: "bachelor", exp: 5, regime: ["voltijds"], contract: ["vast", "freelance"],
    remote: "remote", shifts: false, weekend: false, knelpunt: true, tags: ["analytisch"],
    ben: ["maaltijd", "eco", "hosp", "groep", "wagen", "laptop", "gsm", "thuiswerkverg", "opleiding"],
    intro: "Je neemt technische verantwoordelijkheid voor een product dat dagelijks door duizenden mensen gebruikt wordt. Je werkt grotendeels van thuis, met één teamdag per week op kantoor.",
    tasks: ["Je ontwerpt en bouwt features van database tot front-end (TypeScript, React, Node.js).", "Je coacht junior collega's en bewaakt de codekwaliteit.", "Je denkt mee over architectuur, performantie en beveiliging.", "Je automatiseert deployments in de cloud."],
    profile: ["Minstens vijf jaar ervaring als developer.", "Je hebt ervaring met TypeScript en een modern front-end framework.", "Je communiceert helder met niet-technische collega's.", "Engels is geen probleem; Nederlands of Frans is een plus."]
  },
  {
    key: "data", title: "Data-analist", cat: "ict", sectors: ["ict", "finance", "zorg", "admin"],
    kw: ["data", "analist", "sql", "power bi", "rapportering", "analytics", "it"],
    sal: [3300, 4300], pc: "PC 200", edu: "master", exp: 2, regime: ["voltijds", "deeltijds"], contract: ["vast"],
    remote: "hybride", shifts: false, weekend: false, knelpunt: false, tags: ["analytisch", "cijfers"],
    ben: ["maaltijd", "eco", "hosp", "groep", "laptop", "thuiswerkverg", "mobi"],
    intro: "Je maakt cijfers begrijpelijk voor het management en de teams op de werkvloer. Je werkt nauw samen met de afdeling {sector}.",
    tasks: ["Je bouwt dashboards in Power BI.", "Je schrijft SQL-queries en controleert de datakwaliteit.", "Je vertaalt vragen van collega's naar concrete analyses.", "Je presenteert je inzichten aan het managementteam."],
    profile: ["Master in een kwantitatieve richting of gelijkwaardig door ervaring.", "Twee jaar ervaring met SQL en een BI-tool.", "Je kan een verhaal vertellen met cijfers.", "Goede kennis van Nederlands en Engels."]
  },
  {
    key: "helpdesk", title: "Servicedeskmedewerker IT", cat: "ict", sectors: ["ict", "zorg", "productie", "admin"],
    kw: ["helpdesk", "servicedesk", "support", "it", "ict", "systeembeheer"],
    sal: [2500, 3000], pc: "PC 200", edu: "secundair", exp: 0, regime: ["voltijds"], contract: ["vast", "interim"],
    remote: "hybride", shifts: false, weekend: false, knelpunt: false, tags: ["mensen"],
    ben: ["maaltijd", "eco", "hosp", "laptop", "opleiding", "vervoer"],
    intro: "Je bent het eerste aanspreekpunt voor collega's met IT-vragen. Geen dag is hetzelfde: van een laptop installeren tot een netwerkprobleem opsporen.",
    tasks: ["Je beantwoordt vragen via telefoon, chat en ticketsysteem.", "Je installeert en configureert laptops en smartphones.", "Je beheert gebruikersaccounts in Microsoft 365.", "Je escaleert complexe problemen naar de systeembeheerders."],
    profile: ["Je hebt een diploma secundair onderwijs, bij voorkeur in een IT-richting.", "Je legt technische zaken eenvoudig uit.", "Je bent klantvriendelijk en geduldig.", "Je bent tweetalig Nederlands-Frans of bereid om Frans bij te leren."]
  },
  {
    key: "verpleeg", title: "Verpleegkundige", cat: "zorg", sectors: ["zorg"],
    kw: ["verpleegkundige", "verpleger", "verpleging", "zorg", "ziekenhuis", "bachelor verpleegkunde"],
    sal: [2900, 3800], pc: "PC 330", edu: "bachelor", exp: 0, regime: ["voltijds", "deeltijds"], contract: ["vast"],
    remote: "geen", shifts: true, weekend: true, knelpunt: true, tags: ["mensen"],
    ben: ["eco", "hosp", "fiets", "extraverlof", "opleiding", "vervoer", "ploegpremie"],
    intro: "Je komt terecht in een warm team op een afdeling met 28 bedden. Patiëntgerichte zorg en een goede verstandhouding met artsen staan centraal.",
    tasks: ["Je verleent verpleegkundige zorg volgens de geldende protocols.", "Je volgt patiënten op en registreert in het elektronisch patiëntendossier.", "Je informeert patiënten en familie.", "Je werkt mee aan kwaliteitsprojecten op de afdeling."],
    profile: ["Bachelor of gegradueerde in de verpleegkunde met RIZIV-nummer.", "Pas afgestudeerd? Je krijgt een uitgebreid inwerktraject.", "Je bent bereid om in een wisselend uurrooster te werken.", "Je spreekt goed Nederlands."]
  },
  {
    key: "zorgkundige", title: "Zorgkundige", cat: "zorg", sectors: ["zorg"],
    kw: ["zorgkundige", "zorg", "ouderen", "woonzorgcentrum", "verzorging", "rusthuis"],
    sal: [2400, 2900], pc: "PC 330", edu: "secundair", exp: 0, regime: ["deeltijds", "voltijds"], contract: ["vast", "tijdelijk"],
    remote: "geen", shifts: true, weekend: true, knelpunt: true, tags: ["mensen", "handen"],
    ben: ["eco", "hosp", "fiets", "extraverlof", "vervoer", "ploegpremie"],
    intro: "Je zorgt dat bewoners zich thuis voelen. In onze kleinschalige leefgroepen heb je tijd voor een babbel en een wandeling.",
    tasks: ["Je helpt bewoners bij wassen, aankleden en maaltijden.", "Je volgt de gezondheid van bewoners op en rapporteert aan de verpleegkundige.", "Je organiseert mee kleine activiteiten.", "Je werkt nauw samen met familie en vrijwilligers."],
    profile: ["Je hebt een visum als zorgkundige of bent bijna afgestudeerd.", "Je hebt een groot hart voor ouderen.", "Je kan werken in vroege en late diensten en af en toe in het weekend.", "Je spreekt Nederlands."]
  },
  {
    key: "thuisverpleeg", title: "Thuisverpleegkundige", cat: "zorg", sectors: ["zorg"],
    kw: ["thuisverpleging", "verpleegkundige", "thuiszorg", "zorg"],
    sal: [3000, 3700], pc: "PC 330", edu: "bachelor", exp: 0, regime: ["deeltijds", "voltijds"], contract: ["vast"],
    remote: "geen", shifts: false, weekend: true, knelpunt: true, tags: ["mensen"],
    ben: ["wagen", "gsm", "eco", "hosp", "extraverlof", "opleiding"],
    intro: "Je trekt met een elektrische dienstwagen naar patiënten thuis in een vaste regio. Je plant je ronde zelf mee in.",
    tasks: ["Je verzorgt wonden, geeft injecties en begeleidt chronische patiënten.", "Je volgt patiënten op met de tablet.", "Je overlegt met huisartsen en apothekers.", "Je draait gemiddeld één weekend op vier mee."],
    profile: ["Bachelor verpleegkunde met RIZIV-nummer.", "Je hebt een rijbewijs B.", "Je werkt graag zelfstandig.", "Je hebt geen ploegwerk, wel af en toe weekenddienst."]
  },
  {
    key: "laborant", title: "Medisch laboratoriumtechnoloog", cat: "zorg", sectors: ["zorg", "productie"],
    kw: ["labo", "laborant", "laboratorium", "biomedisch", "analyse"],
    sal: [2800, 3500], pc: "PC 330", edu: "bachelor", exp: 0, regime: ["voltijds", "deeltijds"], contract: ["vast"],
    remote: "geen", shifts: true, weekend: false, knelpunt: true, tags: ["analytisch", "handen"],
    ben: ["maaltijd", "eco", "hosp", "groep", "fiets", "ploegpremie"],
    intro: "In een modern en sterk geautomatiseerd labo analyseer je stalen voor huisartsen en ziekenhuizen.",
    tasks: ["Je voert hematologische en biochemische analyses uit.", "Je bedient en kalibreert de analyzers.", "Je valideert resultaten technisch.", "Je werkt mee aan accreditatie volgens ISO 15189."],
    profile: ["Bachelor in de biomedische laboratoriumtechnologie.", "Nauwkeurig en stressbestendig.", "Bereid om in een vroege of late dienst te werken.", "Kennis van Nederlands; Engels is een plus."]
  },
  {
    key: "magazijn", title: "Magazijnmedewerker", cat: "logistiek", sectors: ["logistiek", "sales", "productie"],
    kw: ["magazijn", "magazijnier", "orderpicker", "logistiek", "heftruck", "reachtruck"],
    sal: [2300, 2700], pc: "PC 226", edu: "geen", exp: 0, regime: ["voltijds"], contract: ["interim", "vast"],
    remote: "geen", shifts: true, weekend: false, knelpunt: false, tags: ["handen"],
    ben: ["maaltijd", "eco", "ploegpremie", "vervoer", "fiets"],
    intro: "Je werkt in een magazijn van 40.000 m² waar elke dag honderden bestellingen vertrekken. Na drie maanden interim krijg je uitzicht op een vast contract.",
    tasks: ["Je verzamelt orders met een handscanner.", "Je laadt en lost vrachtwagens met de heftruck.", "Je controleert inkomende goederen.", "Je houdt je werkzone net en veilig."],
    profile: ["Geen diploma of ervaring nodig: je krijgt een opleiding.", "Een heftruckattest is een plus.", "Je kan werken in een twee-ploegensysteem (6-14 u en 14-22 u).", "Je bent fysiek fit."]
  },
  {
    key: "chauffeur", title: "Vrachtwagenchauffeur CE", cat: "logistiek", sectors: ["logistiek", "horeca"],
    kw: ["chauffeur", "vrachtwagen", "transport", "rijbewijs ce", "trucker", "camion"],
    sal: [2700, 3300], pc: "PC 140", edu: "geen", exp: 1, regime: ["voltijds"], contract: ["vast"],
    remote: "geen", shifts: false, weekend: false, knelpunt: true, tags: ["buiten"],
    ben: ["maaltijd", "eco", "hosp", "gsm"],
    intro: "Je rijdt nationale ritten met gekoelde ladingen en bent elke avond thuis. Je krijgt een vaste, recente vrachtwagen.",
    tasks: ["Je levert bij supermarkten en groothandels.", "Je laadt en lost met de elektrische transpallet.", "Je volgt de temperatuur van je lading op.", "Je registreert je ritten digitaal."],
    profile: ["Rijbewijs CE, code 95 en een geldige bestuurderskaart.", "Minstens één jaar rijervaring.", "Je bent stipt en klantvriendelijk.", "Basiskennis Frans is handig voor leveringen in Brussel."]
  },
  {
    key: "dispatch", title: "Transportplanner", cat: "logistiek", sectors: ["logistiek"],
    kw: ["planner", "dispatcher", "transport", "logistiek", "planning"],
    sal: [2900, 3600], pc: "PC 200", edu: "bachelor", exp: 2, regime: ["voltijds"], contract: ["vast"],
    remote: "hybride", shifts: false, weekend: false, knelpunt: false, tags: ["analytisch", "mensen"],
    ben: ["maaltijd", "eco", "hosp", "groep", "gsm", "laptop"],
    intro: "Je zorgt dat elke vrachtwagen op het juiste moment op de juiste plaats is, en je bent de spil tussen klanten en chauffeurs.",
    tasks: ["Je plant dagelijks de ritten van 30 chauffeurs.", "Je speelt in op last-minute wijzigingen.", "Je onderhoudt het contact met klanten.", "Je zoekt manieren om lege kilometers te vermijden."],
    profile: ["Bachelor logistiek of gelijkwaardig door ervaring.", "Twee jaar ervaring in transport of logistiek.", "Je blijft rustig onder druk.", "Nederlands, Frans en Engels."]
  },
  {
    key: "elektricien", title: "Elektricien", cat: "techniek", sectors: ["techniek", "bouw"],
    kw: ["elektricien", "elektrotechniek", "elektriciteit", "installateur", "technieker"],
    sal: [2600, 3300], pc: "PC 149.01", edu: "secundair", exp: 0, regime: ["voltijds"], contract: ["vast"],
    remote: "geen", shifts: false, weekend: false, knelpunt: true, tags: ["handen", "buiten"],
    ben: ["maaltijd", "eco", "hosp", "wagen", "gsm", "dertiende"],
    intro: "Je werkt aan de installatie van zonnepanelen, laadpalen en elektrische borden. Je rijdt met een bestelwagen die je mee naar huis mag nemen.",
    tasks: ["Je plaatst en sluit elektrische installaties aan.", "Je zoekt storingen en lost ze op.", "Je werkt volgens het AREI.", "Je rapporteert digitaal over je werfbezoeken."],
    profile: ["Diploma elektriciteit of elektrotechniek (secundair).", "Starters zijn welkom, ervaren elektriciens ook.", "Je werkt nauwkeurig en veilig.", "Rijbewijs B."]
  },
  {
    key: "onderhoud", title: "Onderhoudstechnieker", cat: "techniek", sectors: ["productie", "techniek"],
    kw: ["technieker", "onderhoud", "mechanica", "elektromechanica", "maintenance", "monteur"],
    sal: [2900, 3800], pc: "PC 111", edu: "secundair", exp: 2, regime: ["voltijds"], contract: ["vast"],
    remote: "geen", shifts: true, weekend: false, knelpunt: true, tags: ["handen", "analytisch"],
    ben: ["maaltijd", "eco", "hosp", "groep", "ploegpremie", "dertiende", "extraverlof"],
    intro: "Je houdt de productielijnen draaiende. Je werkt in een team van twaalf technici in een vol-continu rooster, met een stevige ploegenpremie.",
    tasks: ["Je voert preventief en correctief onderhoud uit.", "Je zoekt storingen in mechanische, pneumatische en elektrische systemen.", "Je stelt verbeteringen voor om stilstand te vermijden.", "Je registreert interventies in het onderhoudssysteem."],
    profile: ["Diploma elektromechanica of gelijkwaardig.", "Twee jaar ervaring in een industriële omgeving.", "Bereid om in ploegen te werken.", "Kennis van PLC's is een plus."]
  },
  {
    key: "hvac", title: "Technieker warmtepompen", cat: "techniek", sectors: ["techniek", "bouw"],
    kw: ["technieker", "warmtepomp", "hvac", "verwarming", "koeltechniek", "installateur", "energie"],
    sal: [2800, 3600], pc: "PC 111", edu: "secundair", exp: 1, regime: ["voltijds"], contract: ["vast"],
    remote: "geen", shifts: false, weekend: false, knelpunt: true, tags: ["handen", "buiten"],
    ben: ["maaltijd", "eco", "hosp", "wagen", "gsm", "opleiding"],
    intro: "Je helpt gezinnen de overstap maken naar duurzame verwarming. Je krijgt een opleiding voor het F-gassencertificaat als je dat nog niet hebt.",
    tasks: ["Je installeert en start warmtepompen op.", "Je doet onderhoud en herstellingen bij klanten thuis.", "Je legt klanten uit hoe ze hun installatie best gebruiken.", "Je werkt met een tablet voor werkbonnen."],
    profile: ["Technisch diploma (koeltechniek, HVAC of elektromechanica).", "Een jaar ervaring of een sterke motivatie om bij te leren.", "Rijbewijs B.", "Je bent klantvriendelijk."]
  },
  {
    key: "werfleider", title: "Werfleider", cat: "bouw", sectors: ["bouw"],
    kw: ["werfleider", "bouw", "werf", "projectleider", "aannemer", "conducteur"],
    sal: [3400, 4500], pc: "PC 200", edu: "bachelor", exp: 3, regime: ["voltijds"], contract: ["vast"],
    remote: "geen", shifts: false, weekend: false, knelpunt: true, tags: ["mensen", "buiten"],
    ben: ["maaltijd", "eco", "hosp", "groep", "wagen", "gsm", "laptop"],
    intro: "Je bent verantwoordelijk voor twee à drie werven tegelijk, van ruwbouw tot oplevering.",
    tasks: ["Je plant het werk van eigen ploegen en onderaannemers.", "Je bewaakt timing, budget en veiligheid.", "Je bent het aanspreekpunt voor architect en bouwheer.", "Je doet werfvergaderingen en maakt verslagen."],
    profile: ["Bachelor bouwkunde of gelijkwaardig.", "Minstens drie jaar ervaring op de werf.", "Je bent een natuurlijke leider.", "Rijbewijs B."]
  },
  {
    key: "tuin", title: "Tuinaanlegger", cat: "bouw", sectors: ["bouw"],
    kw: ["tuinman", "tuinaanleg", "groenonderhoud", "hovenier", "tuinier"],
    sal: [2300, 2800], pc: "PC 145", edu: "geen", exp: 0, regime: ["voltijds"], contract: ["vast", "tijdelijk"],
    remote: "geen", shifts: false, weekend: false, knelpunt: false, tags: ["buiten", "handen", "creatief"],
    ben: ["maaltijd", "eco", "hosp", "vervoer"],
    intro: "Je werkt de hele dag buiten in een ploeg van drie, aan tuinen die we zelf ontwerpen.",
    tasks: ["Je legt terrassen, paden en beplanting aan.", "Je onderhoudt tuinen en groenzones.", "Je bedient kleine machines zoals een minigraver.", "Je denkt mee over het ontwerp."],
    profile: ["Geen diploma nodig; een opleiding tuinbouw is een plus.", "Je werkt graag buiten, ook bij minder weer.", "Rijbewijs B is een plus.", "Je bent een teamspeler."]
  },
  {
    key: "schrijnwerker", title: "Schrijnwerker houtbouw", cat: "bouw", sectors: ["bouw"],
    kw: ["schrijnwerker", "timmerman", "houtbouw", "hout", "menuisier"],
    sal: [2500, 3100], pc: "PC 125", edu: "secundair", exp: 1, regime: ["voltijds"], contract: ["vast"],
    remote: "geen", shifts: false, weekend: false, knelpunt: true, tags: ["handen", "creatief"],
    ben: ["maaltijd", "eco", "hosp", "dertiende"],
    intro: "Je bouwt houtskeletwanden in ons atelier en plaatst ze mee op de werf.",
    tasks: ["Je leest plannen en zaagt elementen op maat.", "Je assembleert wanden, vloeren en daken.", "Je plaatst elementen op de werf.", "Je werkt met CNC-gestuurde machines."],
    profile: ["Diploma houtbewerking of ervaring als schrijnwerker.", "Je werkt nauwkeurig.", "Je hebt geen hoogtevrees.", "Frans is de voertaal op de werf."]
  },
  {
    key: "leerkracht", title: "Leerkracht elektromechanica", cat: "onderwijs", sectors: ["onderwijs"],
    kw: ["leerkracht", "leraar", "onderwijs", "lesgever", "school", "techniek"],
    sal: [2700, 3600], pc: "Onderwijs", edu: "bachelor", exp: 0, regime: ["deeltijds", "voltijds"], contract: ["tijdelijk"],
    remote: "geen", shifts: false, weekend: false, knelpunt: true, tags: ["mensen", "handen"],
    ben: ["extraverlof", "fiets", "vervoer", "opleiding"],
    intro: "Je geeft praktijkles aan leerlingen in de derde graad. Zij-instromers met bedrijfservaring zijn erg welkom, je ervaringsjaren tellen mee voor je loon.",
    tasks: ["Je geeft praktijk- en theorielessen elektromechanica.", "Je begeleidt leerlingen tijdens stages en duaal leren.", "Je werkt mee aan nieuwe lesprojecten.", "Je overlegt met collega's en ouders."],
    profile: ["Technisch diploma; een pedagogisch bekwaamheidsbewijs kan je tijdens je job halen.", "Je wil jongeren iets bijbrengen.", "Je hebt geduld en gezag.", "Je spreekt Nederlands op niveau C1."]
  },
  {
    key: "kinderbeg", title: "Kinderbegeleider", cat: "onderwijs", sectors: ["onderwijs"],
    kw: ["kinderbegeleider", "kinderopvang", "kinderen", "baby", "creche", "onderwijs"],
    sal: [2300, 2700], pc: "PC 331", edu: "secundair", exp: 0, regime: ["deeltijds", "voltijds"], contract: ["vast"],
    remote: "geen", shifts: false, weekend: false, knelpunt: true, tags: ["mensen", "creatief"],
    ben: ["eco", "hosp", "fiets", "extraverlof"],
    intro: "Je zorgt voor een groep van acht kinderen tussen 0 en 3 jaar, samen met een vaste collega. Opvang open van 7 tot 18.30 uur, nooit in het weekend.",
    tasks: ["Je verzorgt baby's en peuters: eten, slapen, verschonen.", "Je organiseert spelactiviteiten.", "Je volgt de ontwikkeling van elk kind op.", "Je houdt een warm contact met ouders."],
    profile: ["Attest of diploma kinderbegeleider.", "Je bent geduldig en creatief.", "Je spreekt goed Nederlands.", "Starters krijgen een mentor."]
  },
  {
    key: "boekhouder", title: "Boekhouder", cat: "finance", sectors: ["finance", "admin", "productie"],
    kw: ["boekhouder", "boekhouding", "accountancy", "comptable", "finance", "btw"],
    sal: [2900, 3800], pc: "PC 200", edu: "bachelor", exp: 2, regime: ["voltijds", "deeltijds"], contract: ["vast"],
    remote: "hybride", shifts: false, weekend: false, knelpunt: true, tags: ["cijfers", "analytisch"],
    ben: ["maaltijd", "eco", "hosp", "groep", "laptop", "thuiswerkverg", "mobi"],
    intro: "Je beheert een eigen portefeuille van klanten en bent hun vaste aanspreekpunt voor alles wat met cijfers te maken heeft.",
    tasks: ["Je verwerkt de boekhouding tot en met de jaarafsluiting.", "Je maakt btw-aangiftes en klantenlistings.", "Je bereidt de vennootschapsbelasting voor.", "Je adviseert klanten bij vragen."],
    profile: ["Bachelor accountancy-fiscaliteit.", "Twee jaar ervaring in een boekhoudkantoor of een finance-afdeling.", "Je werkt nauwkeurig en zelfstandig.", "Kennis van Exact of Octopus is een plus."]
  },
  {
    key: "controller", title: "Financial controller", cat: "finance", sectors: ["finance", "productie"],
    kw: ["controller", "finance", "financieel", "rapportering", "budget", "analyse"],
    sal: [4200, 5500], pc: "PC 200", edu: "master", exp: 4, regime: ["voltijds"], contract: ["vast"],
    remote: "hybride", shifts: false, weekend: false, knelpunt: false, tags: ["cijfers", "analytisch"],
    ben: ["maaltijd", "eco", "hosp", "groep", "wagen", "laptop", "gsm", "dertiende"],
    intro: "Je rapporteert rechtstreeks aan de CFO en bent de financiële sparringpartner van de operationele teams.",
    tasks: ["Je maakt de maand- en kwartaalrapportering.", "Je stelt mee het budget en de forecasts op.", "Je analyseert afwijkingen en stelt acties voor.", "Je verbetert processen en controles."],
    profile: ["Master economie of handelsingenieur.", "Vier jaar ervaring in controlling of audit.", "Sterk in Excel en ERP-systemen.", "Vlot in Nederlands, Frans en Engels."]
  },
  {
    key: "payroll", title: "Payroll consultant", cat: "admin", sectors: ["admin", "finance"],
    kw: ["payroll", "loonadministratie", "sociaal secretariaat", "hr", "personeelsadministratie"],
    sal: [2800, 3600], pc: "PC 200", edu: "bachelor", exp: 0, regime: ["voltijds", "deeltijds"], contract: ["vast"],
    remote: "hybride", shifts: false, weekend: false, knelpunt: true, tags: ["cijfers", "mensen"],
    ben: ["maaltijd", "eco", "hosp", "groep", "laptop", "thuiswerkverg", "opleiding"],
    intro: "Je verzorgt de loonadministratie van een vaste groep klanten. Starters volgen eerst een interne opleiding van zes weken.",
    tasks: ["Je berekent lonen en controleert prestaties.", "Je doet Dimona- en DmfA-aangiftes.", "Je beantwoordt vragen over sociale wetgeving.", "Je adviseert klanten over paritaire comités en premies."],
    profile: ["Bachelor HR, rechtspraktijk of gelijkwaardig.", "Interesse in sociale wetgeving.", "Je werkt nauwkeurig en klantgericht.", "Basiskennis Frans."]
  },
  {
    key: "hrbp", title: "HR business partner", cat: "admin", sectors: ["productie", "zorg", "logistiek", "ict"],
    kw: ["hr", "human resources", "personeel", "rekrutering", "people"],
    sal: [3800, 4800], pc: "PC 200", edu: "master", exp: 4, regime: ["voltijds"], contract: ["vast"],
    remote: "hybride", shifts: false, weekend: false, knelpunt: false, tags: ["mensen"],
    ben: ["maaltijd", "eco", "hosp", "groep", "wagen", "laptop", "gsm"],
    intro: "Je ondersteunt leidinggevenden in alles wat met mensen te maken heeft: van rekrutering tot moeilijke gesprekken.",
    tasks: ["Je adviseert het management over HR-beleid.", "Je begeleidt rekrutering en onboarding.", "Je volgt verzuim en welzijn op.", "Je overlegt met de vakbondsafvaardiging."],
    profile: ["Master HR, psychologie of rechten.", "Vier jaar ervaring als HR-generalist.", "Je bent diplomatisch en stevig tegelijk.", "Kennis van Belgisch arbeidsrecht."]
  },
  {
    key: "admin", title: "Administratief medewerker", cat: "admin", sectors: ["admin", "zorg", "logistiek", "bouw", "techniek"],
    kw: ["administratie", "bediende", "onthaal", "secretariaat", "office", "administratief"],
    sal: [2400, 2900], pc: "PC 200", edu: "secundair", exp: 0, regime: ["deeltijds", "voltijds"], contract: ["vast", "tijdelijk", "interim"],
    remote: "hybride", shifts: false, weekend: false, knelpunt: false, tags: ["mensen"],
    ben: ["maaltijd", "eco", "hosp", "vervoer"],
    intro: "Je zorgt dat de administratie vlot loopt en bent het eerste gezicht voor bezoekers en bellers.",
    tasks: ["Je verwerkt facturen en bestellingen.", "Je beheert agenda's en plant afspraken.", "Je beantwoordt telefoon en e-mails.", "Je houdt dossiers bij."],
    profile: ["Diploma secundair onderwijs.", "Vlot met Word, Excel en Outlook.", "Je bent georganiseerd en vriendelijk.", "Kennis van Frans is een plus."]
  },
  {
    key: "verkoper", title: "Winkelverkoper", cat: "sales", sectors: ["sales"],
    kw: ["verkoper", "winkel", "retail", "kassa", "verkoop", "winkelbediende"],
    sal: [2200, 2600], pc: "PC 311", edu: "geen", exp: 0, regime: ["deeltijds", "voltijds"], contract: ["vast", "studentenjob", "flexi-job"],
    remote: "geen", shifts: false, weekend: true, knelpunt: false, tags: ["mensen"],
    ben: ["maaltijd", "eco", "fiets"],
    intro: "Je helpt klanten in onze winkel met advies over tuin, verf en gereedschap. Zaterdagwerk hoort erbij, zondag is de winkel dicht.",
    tasks: ["Je adviseert klanten en zoekt mee naar oplossingen.", "Je vult rekken aan en zorgt voor een nette winkel.", "Je bedient de kassa.", "Je neemt bestellingen op."],
    profile: ["Geen ervaring nodig.", "Je bent sociaal en doe-het-zelver in hart en nieren.", "Je werkt op zaterdag.", "Studenten en flexi-jobbers welkom voor weekendwerk."]
  },
  {
    key: "accountmgr", title: "Account manager B2B", cat: "sales", sectors: ["sales", "ict", "logistiek", "techniek"],
    kw: ["account manager", "verkoper", "sales", "commercieel", "vertegenwoordiger", "b2b"],
    sal: [3200, 4200], pc: "PC 200", edu: "bachelor", exp: 2, regime: ["voltijds"], contract: ["vast"],
    remote: "hybride", shifts: false, weekend: false, knelpunt: false, tags: ["mensen"],
    ben: ["maaltijd", "eco", "hosp", "groep", "wagen", "gsm", "laptop"],
    intro: "Je bouwt langdurige relaties op met klanten en vindt nieuwe klanten in je regio. Naast je vast loon krijg je een variabele bonus.",
    tasks: ["Je bezoekt klanten en prospecten.", "Je maakt offertes en onderhandelt over contracten.", "Je volgt je pipeline op in het CRM.", "Je stemt af met de interne teams."],
    profile: ["Bachelor marketing of gelijkwaardig.", "Twee jaar commerciële ervaring.", "Je bent overtuigend en betrouwbaar.", "Tweetalig Nederlands-Frans."]
  },
  {
    key: "marketing", title: "Digital marketeer", cat: "sales", sectors: ["sales", "ict", "horeca"],
    kw: ["marketing", "marketeer", "social media", "content", "communicatie", "seo"],
    sal: [3000, 3800], pc: "PC 200", edu: "bachelor", exp: 1, regime: ["voltijds", "deeltijds"], contract: ["vast"],
    remote: "hybride", shifts: false, weekend: false, knelpunt: false, tags: ["creatief", "analytisch"],
    ben: ["maaltijd", "eco", "hosp", "laptop", "thuiswerkverg", "opleiding"],
    intro: "Je zet campagnes op die echt resultaat opleveren, en je meet alles.",
    tasks: ["Je plant en maakt content voor sociale media en nieuwsbrieven.", "Je beheert advertentiecampagnes.", "Je optimaliseert de website voor zoekmachines.", "Je rapporteert over resultaten."],
    profile: ["Bachelor communicatie of marketing.", "Een jaar ervaring met online campagnes.", "Je schrijft vlot en creatief.", "Je kent Google Analytics."]
  },
  {
    key: "kok", title: "Kok", cat: "horeca", sectors: ["horeca"],
    kw: ["kok", "chef", "keuken", "horeca", "cuisinier", "koken"],
    sal: [2400, 3000], pc: "PC 302", edu: "secundair", exp: 1, regime: ["voltijds", "deeltijds"], contract: ["vast", "flexi-job"],
    remote: "geen", shifts: true, weekend: true, knelpunt: true, tags: ["handen", "creatief"],
    ben: ["maaltijd", "eco", "hosp", "extraverlof"],
    intro: "Je kookt met verse, lokale producten in een keuken met zes collega's. Gesloten op maandag en dinsdag.",
    tasks: ["Je bereidt gerechten à la minute.", "Je doet de mise-en-place.", "Je volgt HACCP-normen op.", "Je denkt mee over het seizoensmenu."],
    profile: ["Diploma hotelschool of ervaring in een professionele keuken.", "Je werkt snel en proper.", "Bereid om 's avonds en in het weekend te werken.", "Je bent een teamspeler."]
  },
  {
    key: "receptie", title: "Receptionist hotel", cat: "horeca", sectors: ["horeca"],
    kw: ["receptionist", "receptie", "hotel", "onthaal", "front office", "horeca", "toerisme"],
    sal: [2300, 2700], pc: "PC 302", edu: "secundair", exp: 0, regime: ["voltijds", "deeltijds"], contract: ["vast", "studentenjob"],
    remote: "geen", shifts: true, weekend: true, knelpunt: false, tags: ["mensen"],
    ben: ["maaltijd", "eco", "hosp", "fiets"],
    intro: "Je verwelkomt gasten uit binnen- en buitenland in een hotel met zicht op zee.",
    tasks: ["Je doet check-ins en check-outs.", "Je beheert reservaties.", "Je geeft tips over de streek.", "Je lost klachten vriendelijk op."],
    profile: ["Diploma toerisme of hotel is een plus.", "Je spreekt Nederlands, Frans en Engels; Duits is een plus.", "Je werkt in vroege en late diensten.", "Je bent gastvrij."]
  },
  {
    key: "operator", title: "Productieoperator", cat: "productie", sectors: ["productie", "horeca"],
    kw: ["operator", "productie", "productiemedewerker", "machine", "lijnoperator", "fabriek"],
    sal: [2500, 3100], pc: "PC 116", edu: "secundair", exp: 0, regime: ["voltijds"], contract: ["interim", "vast"],
    remote: "geen", shifts: true, weekend: false, knelpunt: false, tags: ["handen"],
    ben: ["maaltijd", "eco", "hosp", "groep", "ploegpremie", "dertiende", "vervoer"],
    intro: "Je bedient een productielijn in een drie-ploegensysteem. Je krijgt een opleiding van vier weken naast een ervaren collega.",
    tasks: ["Je stuurt de productielijn aan via een computerscherm.", "Je voert kwaliteitscontroles uit.", "Je verhelpt kleine storingen.", "Je volgt strikt de veiligheidsvoorschriften."],
    profile: ["Technisch diploma secundair of ervaring in productie.", "Bereid om in drie ploegen te werken.", "Je bent verantwoordelijk en alert.", "Basiskennis Nederlands."]
  },
  {
    key: "qa", title: "Quality assurance specialist", cat: "productie", sectors: ["productie"],
    kw: ["kwaliteit", "quality", "qa", "gmp", "farma", "audit"],
    sal: [3500, 4500], pc: "PC 207", edu: "master", exp: 2, regime: ["voltijds"], contract: ["vast"],
    remote: "hybride", shifts: false, weekend: false, knelpunt: false, tags: ["analytisch"],
    ben: ["maaltijd", "eco", "hosp", "groep", "laptop", "dertiende", "opleiding"],
    intro: "Je bewaakt dat elk product voldoet aan de strengste kwaliteitsnormen.",
    tasks: ["Je beoordeelt afwijkingen en CAPA's.", "Je bereidt audits voor en begeleidt ze.", "Je schrijft en herziet procedures.", "Je traint collega's in GMP."],
    profile: ["Master in de wetenschappen of farmacie.", "Twee jaar ervaring in QA.", "Je bent nauwkeurig en kritisch.", "Frans en Engels zijn de werktalen."]
  }
];

/* Deterministische generator: elke rol wordt bij 2-4 passende bedrijven geplaatst. */
JW.buildJobs = function () {
  let seed = 20261007;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const cityBy = Object.fromEntries(JW.CITIES.map((c) => [c.name, c]));
  const catLabel = Object.fromEntries(JW.CATEGORIES.map((c) => [c.id, c.label]));
  const sectorWord = { ict: "de IT-sector", finance: "de financiële sector", zorg: "zorg", onderwijs: "onderwijs", logistiek: "logistiek", productie: "de productie", bouw: "de bouw", techniek: "de technische dienst", horeca: "de horeca", sales: "retail", admin: "dienstverlening" };
  const jobs = [];
  let n = 400;

  JW.ROLES.forEach((role) => {
    const companies = JW.COMPANIES.filter((c) => role.sectors.includes(c.sector));
    const shuffled = companies.slice().sort(() => rnd() - 0.5);
    const count = Math.min(shuffled.length, 2 + Math.floor(rnd() * 3));
    shuffled.slice(0, count).forEach((co) => {
      const city = cityBy[co.city];
      const wallonia = city.region === "Wallonië";
      const brussels = city.region === "Brussel";
      const east = co.city === "Eupen";
      let langs = ["NL"];
      if (wallonia) langs = ["FR"];
      if (east) langs = ["DE", "FR"];
      if (brussels) langs = ["NL", "FR"];
      if (/Frans/.test(role.profile.join(" ")) && !langs.includes("FR") && rnd() > 0.4) langs.push("FR");
      if (/Engels/.test(role.profile.join(" ")) && rnd() > 0.5) langs.push("EN");
      const step = 50;
      const min = Math.round((role.sal[0] + (rnd() - 0.5) * 200) / step) * step;
      const max = Math.round((role.sal[1] + (rnd() - 0.5) * 200) / step) * step;
      const regime = rnd() > 0.5 ? role.regime[0] : pick(role.regime);
      const contract = pick(role.contract);
      const ben = role.ben.filter(() => rnd() > 0.2);
      const daysAgo = Math.floor(rnd() * 29);
      const views = 40 + Math.floor(rnd() * 900);
      n += 1 + Math.floor(rnd() * 37);
      jobs.push({
        id: "jw" + n,
        ref: "JW-2026-" + String(n).padStart(4, "0"),
        role: role.key,
        title: role.title,
        cat: role.cat,
        catLabel: catLabel[role.cat],
        company: co,
        city: city.name,
        pc: city.pc,
        prov: city.prov,
        region: city.region,
        lat: city.lat,
        lng: city.lng,
        salMin: Math.min(min, max - 200),
        salMax: max,
        paritair: role.pc,
        edu: role.edu,
        exp: role.exp,
        regime,
        hours: regime === "voltijds" ? (role.pc === "PC 330" ? "38 u/week" : "38 u/week") : pick(["19 u/week (halftijds)", "30,4 u/week (4/5)", "24 u/week"]),
        contract,
        remote: role.remote,
        shifts: role.shifts,
        weekend: role.weekend,
        knelpunt: role.knelpunt,
        tags: role.tags,
        kw: role.kw,
        langs: Array.from(new Set(langs)),
        benefits: ben,
        daysAgo,
        views,
        intro: role.intro.replace("{sector}", sectorWord[co.sector] || "het team"),
        tasks: role.tasks,
        profile: role.profile,
        start: pick(["Zo snel mogelijk", "In overleg", "1 november 2026", "1 december 2026", "Januari 2027"])
      });
    });
  });
  return jobs;
};

JW.JOBS = JW.buildJobs();
