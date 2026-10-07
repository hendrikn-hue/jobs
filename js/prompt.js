/* Jobwijs prototype — interpretatie van een vrije zoekvraag.
   Dit is een regelgebaseerde simulatie die volledig in de browser draait.
   In een echte productversie vervang je JW.parsePrompt door een call naar een
   taalmodel dat dezelfde criteria-structuur teruggeeft. */

window.JW = window.JW || {};

JW.norm = function (s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
};

JW.distanceKm = function (a, b) {
  const R = 6371, toR = (d) => (d * Math.PI) / 180;
  const dLat = toR(b.lat - a.lat), dLng = toR(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

JW.CAT_TERMS = {
  ict: ["it", "ict", "informatica", "developer", "ontwikkelaar", "programmeur", "programmeren", "software", "data", "digitaal", "computer", "helpdesk", "servicedesk", "web", "full-stack", "frontend", "backend"],
  zorg: ["zorg", "verpleeg", "verpleging", "verpleegkundige", "ziekenhuis", "ouderen", "rusthuis", "woonzorg", "zorgkundige", "labo", "medisch", "patienten", "thuisverpleging"],
  logistiek: ["logistiek", "magazijn", "transport", "chauffeur", "vrachtwagen", "heftruck", "orderpicker", "planner"],
  techniek: ["technieker", "technisch", "techniek", "elektricien", "elektriciteit", "onderhoud", "mechanica", "warmtepomp", "installateur", "energie"],
  bouw: ["bouw", "werf", "aannemer", "tuin", "tuinaanleg", "tuinman", "hovenier", "schrijnwerker", "hout", "timmerman", "werfleider"],
  onderwijs: ["onderwijs", "leerkracht", "leraar", "school", "lesgeven", "lesgever", "kinderopvang", "kinderen", "kinderbegeleider", "baby"],
  finance: ["boekhoud", "boekhouding", "boekhouder", "finance", "financieel", "financiele", "financien", "accountancy", "controller", "fiscaliteit"],
  sales: ["verkoop", "verkoper", "sales", "marketing", "marketeer", "winkel", "retail", "commercieel", "account manager"],
  admin: ["administratie", "administratief", "hr", "human resources", "personeel", "payroll", "loonadministratie", "bediende", "secretariaat", "onthaal"],
  horeca: ["horeca", "kok", "keuken", "koken", "hotel", "restaurant", "bakkerij", "voeding", "receptionist"],
  productie: ["productie", "operator", "fabriek", "industrie", "kwaliteit", "farma", "chemie"]
};

const EXACT_TERMS = ["school", "hout", "data", "web", "tuin", "kinderen", "energie", "zorg", "hotel", "keuken"];
JW.termRegex = function (term) {
  if (EXACT_TERMS.includes(term)) return new RegExp("(^|[^a-z0-9])" + term + "($|[^a-z0-9])");
  const esc = term.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
  // korte termen exact, langere als woordbegin (verpleeg → verpleegkundige)
  return term.length <= 3 ? new RegExp("(^|[^a-z0-9])" + esc + "($|[^a-z0-9])") : new RegExp("(^|[^a-z0-9])" + esc);
};

JW.jobHaystack = function (job) {
  if (!job._hay) job._hay = JW.norm([job.title, job.kw.join(" "), job.catLabel].join(" "));
  return job._hay;
};

const LANGS = { nederlands: "NL", frans: "FR", engels: "EN", duits: "DE" };
const LANG_LABEL = { NL: "Nederlands", FR: "Frans", EN: "Engels", DE: "Duits" };
const EDU_RANK = { geen: 0, secundair: 1, bachelor: 2, master: 3 };
JW.LANG_LABEL = LANG_LABEL;

/* Zoek plaatsnamen, provincies en regio's in genormaliseerde tekst. */
JW.findPlaces = function (t) {
  const places = [];
  const used = [];
  const add = (p, idx, len) => { if (used.some(([a, b]) => idx < b && idx + len > a)) return; used.push([idx, idx + len]); places.push(p); };
  const provs = [
    ["west-vlaanderen", "West-Vlaanderen"], ["west vlaanderen", "West-Vlaanderen"], ["oost-vlaanderen", "Oost-Vlaanderen"], ["oost vlaanderen", "Oost-Vlaanderen"],
    ["vlaams-brabant", "Vlaams-Brabant"], ["vlaams brabant", "Vlaams-Brabant"], ["waals-brabant", "Waals-Brabant"], ["waals brabant", "Waals-Brabant"],
    ["provincie antwerpen", "Antwerpen"], ["limburg", "Limburg"], ["henegouwen", "Henegouwen"], ["provincie luik", "Luik"], ["provincie namen", "Namen"], ["provincie luxemburg", "Luxemburg"], ["kempen", "Antwerpen"]
  ];
  provs.forEach(([k, v]) => { const i = t.indexOf(k); if (i >= 0) add({ type: "prov", value: v, label: "provincie " + v }, i, k.length); });
  const regions = [["vlaanderen", "Vlaanderen"], ["wallonie", "Wallonië"], ["vlaams gewest", "Vlaanderen"]];
  regions.forEach(([k, v]) => {
    const m = new RegExp("(^|[^a-z-])" + k).exec(t);
    if (m) add({ type: "region", value: v, label: v }, m.index + m[1].length, k.length);
  });
  JW.CITIES.forEach((c) => {
    [c.name, ...c.alias].forEach((n) => {
      const k = JW.norm(n);
      const m = new RegExp("(^|[^a-z0-9-])" + k.replace(/[-]/g, "[- ]") + "($|[^a-z0-9])").exec(t);
      if (m) add({ type: "city", value: c.name, city: c, label: c.name }, m.index + m[1].length, k.length);
    });
    const m = new RegExp("(^|\\D)" + c.pc + "(\\D|$)").exec(t);
    if (m) add({ type: "city", value: c.name, city: c, label: c.name + " (" + c.pc + ")" }, m.index + m[1].length, 4);
  });
  return places;
};

JW.placeMatch = function (job, place, radius) {
  if (place.type === "city") {
    const d = JW.distanceKm(place.city, job);
    return { ok: d <= radius, d };
  }
  if (place.type === "prov") return { ok: job.prov === place.value };
  if (place.type === "region") return { ok: job.region === place.value };
  return { ok: false };
};

JW.parsePrompt = function (text) {
  const t = " " + JW.norm(text) + " ";
  const C = [];
  const neg = (word) => new RegExp("(geen|zonder|niet|liever geen|weinig|nooit)\\s+(\\S+\\s+){0,2}" + word).test(t);

  /* Functie / sector */
  const cats = new Set();
  const terms = new Set();
  Object.entries(JW.CAT_TERMS).forEach(([cat, list]) => {
    list.forEach((term) => {
      if (JW.termRegex(term).test(t) && !neg(term)) { cats.add(cat); terms.add(term); }
    });
  });
  // rolspecifieke trefwoorden die niet in de sectorlijsten staan
  JW.ROLES.forEach((r) => r.kw.forEach((k) => {
    const nk = JW.norm(k);
    if (nk.length > 3 && JW.termRegex(nk).test(t) && !neg(nk)) { cats.add(r.cat); terms.add(nk); }
  }));
  if (cats.size) {
    const catLabels = [...cats].map((c) => JW.CATEGORIES.find((x) => x.id === c).label);
    const termList = [...terms];
    C.push({
      id: "functie", group: "Functie", label: catLabels.join(" of "), weight: 4, hard: true,
      test: (j) => {
        const hay = JW.jobHaystack(j);
        if (termList.some((term) => JW.termRegex(term).test(hay))) return 1;
        return cats.has(j.cat) ? 0.6 : 0;
      },
      why: (j, s) => (s === 1 ? "Functie past bij “" + termList.filter((term) => JW.termRegex(term).test(JW.jobHaystack(j)))[0] + "”" : "Zelfde sector: " + j.catLabel)
    });
  }

  /* Locatie */
  const places = JW.findPlaces(t);
  let radius = 25, radiusSet = false;
  const km = /(\d{1,3})\s*(km|kilometer)/.exec(t);
  const min = /(\d{1,3})\s*(min|minuten)/.exec(t);
  if (km) { radius = +km[1]; radiusSet = true; } else if (min) { radius = Math.round(+min[1] * 0.9); radiusSet = true; }
  if (/(in|op) de stad|in het centrum/.test(t) && !radiusSet) radius = 10;
  if (places.length) {
    const hasCity = places.some((p) => p.type === "city");
    C.push({
      id: "waar", group: "Waar", label: places.map((p) => p.label).join(" of ") + (hasCity ? " + " + radius + " km" : ""), weight: 3, hard: true,
      places, radius,
      test: (j) => (places.some((p) => JW.placeMatch(j, p, radius).ok) ? 1 : 0),
      why: (j) => {
        const city = places.filter((p) => p.type === "city").sort((a, b) => JW.distanceKm(a.city, j) - JW.distanceKm(b.city, j))[0];
        if (city) { const d = Math.round(JW.distanceKm(city.city, j)); return d < 3 ? "In " + j.city : j.city + " ligt op " + d + " km van " + city.value; }
        return "In " + (j.prov === places[0].value ? "provincie " + j.prov : j.region);
      }
    });
  }

  /* Regime */
  if (/deeltijd|halftijd|parttime|part-time|4\/5|vier vijfde|80 ?%|minder uren/.test(t)) {
    C.push({ id: "regime", group: "Regime", label: "Deeltijds", weight: 2, test: (j) => (j.regime === "deeltijds" ? 1 : 0), why: (j, s) => (s ? "Deeltijds (" + j.hours + ")" : "Voltijdse job") });
  } else if (/voltijd|fulltime|full-time|full time/.test(t)) {
    C.push({ id: "regime", group: "Regime", label: "Voltijds", weight: 2, test: (j) => (j.regime === "voltijds" ? 1 : 0), why: (j, s) => (s ? "Voltijds" : "Deeltijdse job") });
  }

  /* Contract */
  const contracts = [];
  if (/vast(e)? (contract|job|baan|werk|aanstelling|betrekking)|onbepaalde duur|\bvast\b|zekerheid/.test(t)) contracts.push("vast");
  if (/tijdelijk|bepaalde duur|vervanging/.test(t)) contracts.push("tijdelijk");
  if (/interim|uitzend/.test(t)) contracts.push("interim");
  if (/freelance|zelfstandig|freelancer/.test(t) && !neg("freelance") && !neg("zelfstandig")) contracts.push("freelance");
  if (/student/.test(t)) contracts.push("studentenjob");
  if (/flexi/.test(t)) contracts.push("flexi-job");
  if (contracts.length) {
    C.push({ id: "contract", group: "Contract", label: contracts.map(JW.contractLabel).join(" of "), weight: 2, test: (j) => (contracts.includes(j.contract) ? 1 : 0), why: (j, s) => (s ? JW.contractLabel(j.contract) : "Contract: " + JW.contractLabel(j.contract).toLowerCase()) });
  }

  /* Thuiswerk */
  if (/volledig (van )?thuis|full remote|fully remote|100 ?% (remote|thuis)|volledig remote|enkel thuiswerk/.test(t)) {
    C.push({ id: "remote", group: "Thuiswerk", label: "Volledig remote", weight: 2, test: (j) => (j.remote === "remote" ? 1 : j.remote === "hybride" ? 0.4 : 0), why: (j, s) => (s === 1 ? "Volledig thuiswerk mogelijk" : s ? "Deels thuiswerk" : "Geen thuiswerk") });
  } else if (/thuiswerk|telewerk|remote|van thuis|hybride|thuis werken/.test(t) && !neg("thuiswerk")) {
    C.push({ id: "remote", group: "Thuiswerk", label: "Thuiswerk mogelijk", weight: 2, test: (j) => (j.remote !== "geen" ? 1 : 0), why: (j, s) => (s ? (j.remote === "remote" ? "Volledig thuiswerk mogelijk" : "Hybride: deels thuiswerk") : "Geen thuiswerk") });
  }

  /* Loon */
  let sal = null;
  const salRe = /(?:€|eur|euro)\s*(\d[\d.,]*)\s*(k)?|(\d[\d.,]*)\s*(k)?\s*(?:€|eur|euro)|(?:minstens|minimum|min\.?|meer dan|vanaf|boven|>)\s*(\d[\d.,]*)\s*(k)?/;
  const salAll = new RegExp(salRe.source, "g");
  let sm;
  while (!sal && (sm = salAll.exec(t))) {
    const raw = sm[1] || sm[3] || sm[5];
    const k = sm[2] || sm[4] || sm[6];
    let v = parseFloat(raw.replace(/\.(?=\d{3})/g, "").replace(",", "."));
    if (k) v *= 1000;
    if (v >= 1000 && v <= 20000) sal = Math.round(v);
  }
  if (sal) {
    const net = /netto/.test(t);
    C.push({
      id: "loon", group: "Loon", label: "Minstens € " + sal.toLocaleString("nl-BE") + (net ? " netto" : " bruto"), weight: 2,
      test: (j) => { const target = net ? sal * 1.6 : sal; return j.salMax >= target ? (j.salMin >= target ? 1 : 0.7) : 0; },
      why: (j, s) => (s ? "Loon tot € " + j.salMax.toLocaleString("nl-BE") + " bruto" : "Loon tot € " + j.salMax.toLocaleString("nl-BE") + " bruto, lager dan gevraagd")
    });
  }

  /* Talen */
  const avoid = [], want = [];
  let spoken = null;
  Object.entries(LANGS).forEach(([w, code]) => {
    if (!new RegExp(w).test(t)) return;
    if (neg(w)) avoid.push(code);
  });
  const part = /ik spreek ([a-z, ]+?)(?=[.;!?]|\bmaar\b|\ben (ik|zoek|wil)\b|\bzoek|\bwil|$)/.exec(t);
  if (part) {
    spoken = Object.entries(LANGS).filter(([w, c]) => part[1].includes(w) && !avoid.includes(c)).map(([, c]) => c);
    if (!spoken.length) spoken = null;
  }
  if (/tweetalig|bilingue/.test(t)) want.push("NL", "FR");
  Object.entries(LANGS).forEach(([w, code]) => {
    if (new RegExp("(met|in het|kennis van|gebruik van|mijn) " + w).test(t) && !avoid.includes(code) && !want.includes(code)) want.push(code);
  });
  if (avoid.length) {
    C.push({ id: "taal-niet", group: "Taal", label: "Zonder " + avoid.map((c) => LANG_LABEL[c]).join(", "), weight: 2, test: (j) => (j.langs.some((l) => avoid.includes(l)) ? 0 : 1), why: (j, s) => (s ? "Geen " + avoid.map((c) => LANG_LABEL[c]).join("/") + " vereist" : LANG_LABEL[avoid.find((a) => j.langs.includes(a))] + " is vereist") });
  }
  if (spoken) {
    C.push({ id: "taal-spreek", group: "Taal", label: "Jij spreekt " + spoken.map((c) => LANG_LABEL[c]).join(", "), weight: 2, test: (j) => (j.langs.every((l) => spoken.includes(l)) ? 1 : 0), why: (j, s) => (s ? "Gevraagde talen: " + j.langs.map((l) => LANG_LABEL[l]).join(", ") : "Vraagt ook " + j.langs.filter((l) => !spoken.includes(l)).map((l) => LANG_LABEL[l]).join(", ")) });
  }
  if (want.length) {
    const w = Array.from(new Set(want));
    C.push({ id: "taal-met", group: "Taal", label: "Met " + w.map((c) => LANG_LABEL[c]).join(" en "), weight: 1, test: (j) => w.filter((l) => j.langs.includes(l)).length / w.length, why: (j, s) => (s === 1 ? "Je werkt in het " + w.map((c) => LANG_LABEL[c]).join(" en ") : "Talen: " + j.langs.map((l) => LANG_LABEL[l]).join(", ")) });
  }

  /* Ervaring */
  const yrs = /(\d{1,2})\s*jaar (werk)?ervaring/.exec(t);
  if (/schoolverlater|pas afgestudeerd|net afgestudeerd|starter|geen ervaring|zonder ervaring|weinig ervaring|eerste job|herintreder|zij-instromer/.test(t)) {
    C.push({ id: "ervaring", group: "Ervaring", label: "Starter, geen ervaring", weight: 2, test: (j) => (j.exp === 0 ? 1 : j.exp === 1 ? 0.5 : 0), why: (j, s) => (s === 1 ? "Geen ervaring vereist" : j.exp + " jaar ervaring gevraagd") });
  } else if (yrs) {
    const y = +yrs[1];
    C.push({ id: "ervaring", group: "Ervaring", label: y + " jaar ervaring", weight: 2, test: (j) => (j.exp <= y ? 1 : j.exp - y <= 1 ? 0.5 : 0), why: (j, s) => (s === 1 ? "Ervaring past (" + (j.exp ? j.exp + "+ jaar gevraagd" : "geen minimum") + ")" : j.exp + " jaar ervaring gevraagd") });
  } else if (/\bjunior\b/.test(t)) {
    C.push({ id: "ervaring", group: "Ervaring", label: "Junior", weight: 2, test: (j) => (j.exp <= 1 ? 1 : j.exp <= 2 ? 0.5 : 0), why: (j, s) => (s === 1 ? "Geschikt voor juniors" : j.exp + " jaar ervaring gevraagd") });
  } else if (/\bsenior\b|veel ervaring|ervaren /.test(t)) {
    C.push({ id: "ervaring", group: "Ervaring", label: "Senior", weight: 2, test: (j) => (j.exp >= 4 ? 1 : j.exp >= 2 ? 0.5 : 0), why: (j, s) => (s === 1 ? "Senior functie" : "Eerder een junior/medior functie") });
  }

  /* Diploma */
  let edu = null;
  if (/zonder diploma|geen diploma|laaggeschoold/.test(t)) edu = "geen";
  else if (/secundair|middelbaar|\b(a2|tso|bso)\b/.test(t)) edu = "secundair";
  else if (/\bbachelor\b|hogeschool|graduaat|gegradueerde/.test(t)) edu = "bachelor";
  else if (/\bmaster\b|universiteit|universitair/.test(t)) edu = "master";
  if (edu) {
    const label = { geen: "Geen diploma vereist", secundair: "Diploma secundair", bachelor: "Bachelor", master: "Master" }[edu];
    C.push({ id: "diploma", group: "Diploma", label, weight: 1, test: (j) => (EDU_RANK[j.edu] <= EDU_RANK[edu] ? 1 : 0), why: (j, s) => (s ? (j.edu === "geen" ? "Geen diploma vereist" : "Diploma " + j.edu + " volstaat") : "Vraagt een " + j.edu + "diploma") });
  }

  /* Uren */
  if (/geen ploeg|zonder ploeg|geen ploegenwerk|geen shift|dagwerk|dagjob|overdag|normale uren|kantooruren|geen nacht|9 tot 5|daguren/.test(t)) {
    C.push({ id: "ploegen", group: "Uren", label: "Geen ploegenwerk", weight: 2, test: (j) => (j.shifts ? 0 : 1), why: (j, s) => (s ? "Dagwerk, geen ploegen" : "Werken in ploegen") });
  }
  if (/geen weekend|zonder weekend|weekends? vrij|nooit (in het )?weekend|niet in het weekend/.test(t)) {
    C.push({ id: "weekend", group: "Uren", label: "Geen weekendwerk", weight: 2, test: (j) => (j.weekend ? 0 : 1), why: (j, s) => (s ? "Weekends vrij" : "Af en toe weekendwerk") });
  }

  /* Extralegale voordelen */
  const benefitMap = [
    ["wagen", /bedrijfswagen|firmawagen|(auto|wagen) van de zaak|bedrijfsauto|company car|leasewagen|salariswagen/],
    ["maaltijd", /maaltijdcheque/], ["fiets", /fiets/], ["hosp", /hospitalisatie/], ["groep", /groepsverzekering|aanvullend pensioen/],
    ["mobi", /mobiliteitsbudget/], ["dertiende", /13de maand|dertiende maand/], ["opleiding", /opleiding|bijleren|groeien/]
  ];
  benefitMap.forEach(([key, re]) => {
    if (re.test(t)) C.push({ id: "voordeel-" + key, group: "Voordeel", label: JW.BENEFITS[key], weight: 1, test: (j) => (j.benefits.includes(key) ? 1 : 0), why: (j, s) => (s ? JW.BENEFITS[key] : "Geen " + JW.BENEFITS[key].toLowerCase()) });
  });

  /* Soort werk */
  const tagMap = [
    ["buiten", "Buiten werken", /\bbuiten\b|open lucht|openlucht|niet achter een bureau/],
    ["mensen", "Met mensen", /met mensen|sociaal|contact met|mensen helpen|helpen van mensen|met klanten/],
    ["handen", "Praktisch werk", /met (mijn|m'n|de|je) handen|handen uit de mouwen|praktisch|manueel|technisch werk/],
    ["creatief", "Creatief", /creatie|creatief/],
    ["cijfers", "Met cijfers", /cijfers|getallen|rekenen/],
    ["analytisch", "Analytisch", /analytisch|puzzel|problemen oplossen|analyseren/]
  ];
  tagMap.forEach(([tag, label, re]) => {
    if (re.test(t)) C.push({ id: "soort-" + tag, group: "Soort werk", label, weight: 1.5, test: (j) => (j.tags.includes(tag) ? 1 : 0), why: (j, s) => (s ? label + ": past" : label + ": minder") });
  });

  if (/knelpunt|veel vraag naar|werkzekerheid|toekomst/.test(t)) {
    C.push({ id: "knelpunt", group: "Toekomst", label: "Knelpuntberoep", weight: 1, test: (j) => (j.knelpunt ? 1 : 0), why: (j, s) => (s ? "Knelpuntberoep: veel vraag naar" : "Geen knelpuntberoep") });
  }
  if (/recent|nieuw(e)? vacature|deze week|pas online/.test(t)) {
    C.push({ id: "recent", group: "Datum", label: "Recent geplaatst", weight: 1, test: (j) => (j.daysAgo <= 7 ? 1 : 0), why: (j, s) => (s ? "Nieuw deze week" : "Al " + j.daysAgo + " dagen online") });
  }

  return C;
};

JW.scoreJobs = function (jobs, criteria) {
  const total = criteria.reduce((a, c) => a + c.weight, 0);
  return jobs
    .map((job) => {
      let got = 0;
      const hits = [], misses = [];
      let excluded = false;
      criteria.forEach((c) => {
        const s = c.test(job);
        if (c.hard && s === 0) excluded = true;
        got += s * c.weight;
        (s > 0 ? hits : misses).push({ c, s, text: c.why(job, s) });
      });
      return { job, excluded, score: total ? got / total : 0, hits, misses };
    })
    .filter((r) => !r.excluded);
};

JW.contractLabel = function (c) {
  return { vast: "Vast contract", tijdelijk: "Tijdelijk", interim: "Interim", freelance: "Freelance", studentenjob: "Studentenjob", "flexi-job": "Flexi-job" }[c] || c;
};
