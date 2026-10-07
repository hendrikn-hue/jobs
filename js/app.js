/* Jobwijs prototype — routing, zoeken en weergave. */
(function () {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const eur = (n) => "€ " + n.toLocaleString("nl-BE");
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* opslag niet beschikbaar */ } }
  };
  const isWide = () => window.matchMedia("(min-width: 961px)").matches;

  const JOBS = JW.JOBS;
  const byId = Object.fromEntries(JOBS.map((j) => [j.id, j]));

  const svg = (inner, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;
  const ICON = {
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    pin: svg('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    spark: svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z"/>'),
    star: svg('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>'),
    starFill: svg('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" fill="currentColor"/>'),
    share: svg('<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>'),
    building: svg('<path d="M4 21V5h10v16M14 9h6v12M2 21h20M7 8h2M7 12h2M7 16h2M17 13h1M17 17h1"/>'),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    chev: svg('<path d="M6 9l6 6 6-6"/>', 'class="chev"'),
    check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'width="30" height="30" stroke-width="2.5"'),
    flame: svg('<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8a7 7 0 0 0 7 7z"/>'),
    back: svg('<path d="M15 18l-6-6 6-6"/>'),
    dots: svg('<circle cx="7" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="17" cy="12" r="1" fill="currentColor"/>')
  };

  /* Iconen voor extralegale voordelen (witte lijn op blauwe cirkel). */
  const BENEFIT_ICON = {
    maaltijd: '<path d="M8 3v7M6 3v4a2 2 0 0 0 4 0V3M8 10v11M17 21V3c-2 1.5-3 4-3 8h3"/>',
    eco: '<path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15zM5 19l8-8"/>',
    hosp: '<path d="M12 5v14M5 12h14" stroke-width="3"/>',
    groep: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>',
    wagen: '<path d="M4 16v-3l2-5h12l2 5v3z"/><path d="M7 16v2M17 16v2M4 13h16"/>',
    mobi: '<rect x="6" y="3" width="12" height="14" rx="2"/><path d="M6 11h12M8 20v-3M16 20v-3"/>',
    fiets: '<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-7h5l3 7M10 9l3 7"/>',
    gsm: '<rect x="8" y="3" width="8" height="18" rx="2"/><path d="M11 18h2"/>',
    laptop: '<rect x="5" y="5" width="14" height="10" rx="1"/><path d="M3 19h18"/>',
    dertiende: '<text x="12" y="16.5" font-size="11" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="Roboto, sans-serif">13</text>',
    extraverlof: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
    thuiswerkverg: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
    opleiding: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    ploegpremie: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    vervoer: '<rect x="6" y="3" width="12" height="13" rx="3"/><path d="M6 10h12M8 20l2-4M16 20l-2-4"/>'
  };

  const EXAMPLES = [
    "Ik zoek een deeltijdse job in de zorg rond Gent, liefst zonder weekendwerk",
    "Junior developer in Antwerpen of Mechelen met thuiswerk en minstens € 3.000 bruto",
    "Ik ben schoolverlater en wil met mijn handen werken in Limburg, vast contract",
    "Tweetalige job in Brussel in finance met bedrijfswagen",
    "Ik spreek geen Frans en wil buiten werken, geen ploegenwerk, binnen 30 km van 9000"
  ];

  const emptyFilters = () => ({ cat: new Set(), prov: new Set(), contract: new Set(), regime: new Set(), lang: new Set(), extra: new Set(), minSal: 0, posted: 0 });

  const FILTERS = [
    { key: "cat", label: "Categorieën", options: () => JW.CATEGORIES.map((c) => [c.id, c.label]) },
    { key: "prov", label: "Regio's", options: () => JW.PROVINCES.map((p) => [p, p]) },
    { key: "contract", label: "Contracttype", options: () => [["vast", "Vast contract"], ["tijdelijk", "Tijdelijk"], ["interim", "Interim"], ["freelance", "Freelance"], ["studentenjob", "Studentenjob"], ["flexi-job", "Flexi-job"]] },
    { key: "regime", label: "Arbeidsregime", options: () => [["voltijds", "Voltijds"], ["deeltijds", "Deeltijds"]] },
    { key: "extra", label: "Thuiswerk & meer", options: () => [["remote", "Thuiswerk mogelijk"], ["knelpunt", "Knelpuntberoep"], ["wagen", "Bedrijfswagen"], ["geenploeg", "Geen ploegenwerk"]] },
    { key: "minSal", label: "Loon", radio: true, options: () => [[0, "Alle lonen"], [2500, "Tot minstens € 2.500"], [3000, "Tot minstens € 3.000"], [3500, "Tot minstens € 3.500"], [4000, "Tot minstens € 4.000"], [4500, "Tot minstens € 4.500"]] },
    { key: "posted", label: "Online sinds", radio: true, options: () => [[0, "Om het even"], [1, "Laatste 24 uur"], [7, "Laatste 7 dagen"], [14, "Laatste 14 dagen"]] },
    { key: "lang", label: "Taal van de jobs", options: () => [["NL", "Nederlands"], ["FR", "Frans"], ["EN", "Engels"], ["DE", "Duits"]] }
  ];

  const state = {
    mode: "classic",
    wat: "", waar: "", radius: 25,
    prompt: "", removed: new Set(),
    filters: emptyFilters(),
    sort: "relevantie",
    hasSearch: false,
    openFilter: null,
    selected: null,
    jobAlert: false,
    saved: new Set(store.get("jw-saved", [])),
    applied: store.get("jw-applied", {}),
    visited: new Set(store.get("jw-visited", [])),
    lastList: [],
    resultsScroll: 0,
    lastRoute: ""
  };

  /* ---------- Hulpjes ---------- */
  const initials = (name) => name.replace(/&/g, "").split(/\s+/).filter((w) => /^[A-Za-zÀ-ÿ]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const logo = (co, cls = "") => `<span class="logo ${cls}" style="--h:${co.hue}" aria-hidden="true">${esc(initials(co.name))}</span>`;
  const onlineLabel = (d) => (d === 0 ? "Vandaag online" : d === 1 ? "Staat 1 dag op Jobwijs" : "Staat " + d + " dagen op Jobwijs");
  const postedShort = (d) => (d === 0 ? "Vandaag" : d === 1 ? "Gisteren" : d + " dagen geleden");
  const remoteLabel = (r) => ({ remote: "Volledig thuiswerk", hybride: "Hybride thuiswerk", geen: "Op locatie" })[r];
  const eduLabel = (e) => ({ geen: "Geen diploma vereist", secundair: "Secundair onderwijs", bachelor: "Bachelor", master: "Master" })[e];
  const expLabel = (x) => (x === 0 ? "Geen ervaring vereist" : x + "+ jaar");
  const contractTag = (c) => (c === "vast" ? "Onbepaalde duur" : JW.contractLabel(c));

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.hidden = true; }, 2600);
  }

  function updateSavedCount() {
    const n = state.saved.size;
    $$(".saved-count").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
  }

  /* ---------- WAAR herkennen ---------- */
  function resolveWhere(q) {
    const n = JW.norm(q);
    if (!n) return null;
    if (/^\d{4}$/.test(n)) {
      const exact = JW.CITIES.find((c) => c.pc === n);
      if (exact) return { type: "city", city: exact, value: exact.name, label: exact.name + " (" + exact.pc + ")" };
      const same = JW.CITIES.filter((c) => c.pc[0] === n[0]);
      if (same.length) {
        const near = same.slice().sort((a, b) => Math.abs(+a.pc - +n) - Math.abs(+b.pc - +n))[0];
        return { type: "city", city: near, value: near.name, label: "postcode " + n + " (rond " + near.name + ")" };
      }
    }
    const city = JW.CITIES.find((c) => JW.norm(c.name) === n || c.alias.includes(n));
    if (city) return { type: "city", city, value: city.name, label: city.name };
    const prov = JW.PROVINCES.find((p) => JW.norm(p) === n || JW.norm("provincie " + p) === n);
    if (prov) return { type: "prov", value: prov, label: "provincie " + prov };
    const region = JW.REGIONS.find((r) => JW.norm(r) === n);
    if (region) return region === "Brussel" ? { type: "city", city: JW.CITIES.find((c) => c.name === "Brussel"), value: "Brussel", label: "Brussel" } : { type: "region", value: region, label: region };
    const starts = JW.CITIES.filter((c) => JW.norm(c.name).startsWith(n));
    if (starts.length === 1) return { type: "city", city: starts[0], value: starts[0].name, label: starts[0].name };
    const found = JW.findPlaces(" " + n + " ");
    if (found.length) return found[0];
    return { error: true, label: q };
  }

  /* ---------- Zoeken ---------- */
  function classicSearch() {
    const tokens = JW.norm(state.wat).split(/[\s,\/]+/).filter((t) => t.length > 1 && !["en", "of", "de", "het", "een", "in", "job", "jobs", "vacature"].includes(t));
    const place = resolveWhere(state.waar);
    const results = [];
    JOBS.forEach((job) => {
      let score = 1;
      if (tokens.length) {
        const title = JW.norm(job.title);
        const hay = JW.jobHaystack(job) + " " + JW.norm(job.company.name);
        let ok = true;
        tokens.forEach((tok) => {
          const re = JW.termRegex(tok);
          const catHit = (JW.CAT_TERMS[job.cat] || []).some((term) => term === tok || (tok.length > 3 && term.startsWith(tok)));
          if (re.test(title)) score += 3;
          else if (re.test(hay)) score += 1.5;
          else if (catHit) score += 0.5;
          else ok = false;
        });
        if (!ok) return;
      }
      let dist = null;
      if (place && !place.error) {
        if (place.type === "city") {
          dist = JW.distanceKm(place.city, job);
          const r = state.radius === 0 ? 3 : state.radius;
          if (dist > r) return;
        } else if (!JW.placeMatch(job, place, 0).ok) return;
      }
      results.push({ job, score, dist });
    });
    return { results, place };
  }

  function activeCriteria() {
    return JW.parsePrompt(state.prompt).filter((c) => !state.removed.has(c.id));
  }

  function promptSearch() {
    const all = JW.parsePrompt(state.prompt);
    const crit = all.filter((c) => !state.removed.has(c.id));
    const scored = JW.scoreJobs(JOBS, crit);
    const loc = crit.find((c) => c.id === "waar");
    const cityPlaces = loc ? loc.places.filter((p) => p.type === "city") : [];
    scored.forEach((r) => { r.dist = cityPlaces.length ? Math.min(...cityPlaces.map((p) => JW.distanceKm(p.city, r.job))) : null; });
    return { results: crit.length ? scored : scored.map((r) => ({ ...r, score: 0 })), all, crit };
  }

  const EXTRA_TEST = { remote: (j) => j.remote !== "geen", knelpunt: (j) => j.knelpunt, wagen: (j) => j.benefits.includes("wagen"), geenploeg: (j) => !j.shifts };

  function passFilters(job, f, skip) {
    if (skip !== "cat" && f.cat.size && !f.cat.has(job.cat)) return false;
    if (skip !== "prov" && f.prov.size && !f.prov.has(job.prov)) return false;
    if (skip !== "contract" && f.contract.size && !f.contract.has(job.contract)) return false;
    if (skip !== "regime" && f.regime.size && !f.regime.has(job.regime)) return false;
    if (skip !== "lang" && f.lang.size && !job.langs.some((l) => f.lang.has(l))) return false;
    if (skip !== "extra" && [...f.extra].some((x) => !EXTRA_TEST[x](job))) return false;
    if (skip !== "minSal" && f.minSal && job.salMax < f.minSal) return false;
    if (skip !== "posted" && f.posted && job.daysAgo > f.posted) return false;
    return true;
  }

  function optionMatches(key, val, job) {
    if (key === "lang") return job.langs.includes(val);
    if (key === "extra") return EXTRA_TEST[val](job);
    if (key === "minSal") return !val || job.salMax >= val;
    if (key === "posted") return !val || job.daysAgo <= val;
    return job[key] === val;
  }

  function sortResults(list) {
    const by = {
      relevantie: (a, b) => b.score - a.score || a.job.daysAgo - b.job.daysAgo,
      datum: (a, b) => a.job.daysAgo - b.job.daysAgo,
      loon: (a, b) => b.job.salMax - a.job.salMax,
      afstand: (a, b) => (a.dist ?? 999) - (b.dist ?? 999)
    }[state.sort];
    return list.slice().sort(by);
  }

  /* ---------- Componenten ---------- */
  function searchBand(withFilters, base) {
    const isPrompt = state.mode === "prompt";
    const cityOptions = JW.CITIES.map((c) => `<option value="${esc(c.name)}">${c.pc} · ${esc(c.prov)}</option>`).join("")
      + JW.PROVINCES.filter((p) => p !== "Brussel").map((p) => `<option value="Provincie ${esc(p)}"></option>`).join("")
      + `<option value="Vlaanderen"></option><option value="Wallonië"></option>`;
    const roleOptions = Array.from(new Set(JW.ROLES.map((r) => r.title))).concat(JW.CATEGORIES.map((c) => c.label)).map((t) => `<option value="${esc(t)}"></option>`).join("");
    return `
    <section class="band">
      <div class="wrap">
        <div class="modes" role="tablist" aria-label="Manier van zoeken">
          <button class="mode" role="tab" id="tab-classic" aria-controls="classic-form" aria-selected="${!isPrompt}" data-action="mode" data-mode="classic">Wat &amp; waar</button>
          <button class="mode" role="tab" id="tab-prompt" aria-controls="prompt-form" aria-selected="${isPrompt}" data-action="mode" data-mode="prompt">${ICON.spark} Beschrijf wat je zoekt <span class="new">Nieuw</span></button>
        </div>
        <form class="classic-form" id="classic-form" role="tabpanel" aria-labelledby="tab-classic" ${isPrompt ? "hidden" : ""}>
          <label class="sfield">${ICON.search}<b>Wat?</b><input id="f-wat" name="wat" list="dl-wat" autocomplete="off" placeholder="Jobtitel, bedrijfsnaam of trefwoorden" value="${esc(state.wat)}"></label>
          <label class="sfield">${ICON.pin}<b>Waar?</b><input id="f-waar" name="waar" list="dl-waar" autocomplete="off" placeholder="Gemeente, postcode of provincie" value="${esc(state.waar)}">
            <select id="f-radius" name="radius" aria-label="Straal">
              ${[0, 10, 25, 50, 100].map((r) => `<option value="${r}" ${state.radius === r ? "selected" : ""}>${r === 0 ? "0 km" : "+ " + r + " km"}</option>`).join("")}
            </select>
          </label>
          <button class="btn dark" type="submit">Zoeken</button>
          <datalist id="dl-wat">${roleOptions}</datalist>
          <datalist id="dl-waar">${cityOptions}</datalist>
        </form>
        <form class="prompt-form" id="prompt-form" role="tabpanel" aria-labelledby="tab-prompt" ${isPrompt ? "" : "hidden"}>
          <label class="sfield prompt">${ICON.spark}<b>Jouw vraag?</b>
            <textarea id="f-prompt" name="prompt" rows="1" placeholder="Bv. deeltijdse job in de zorg rond Gent, zonder weekendwerk">${esc(state.prompt)}</textarea>
          </label>
          <button class="btn dark" type="submit">Zoeken</button>
        </form>
        ${withFilters ? filterBar(base) : isPrompt ? `<div class="examples" aria-label="Voorbeelden">${EXAMPLES.slice(0, 3).map((e) => `<button type="button" class="example" data-action="example" data-text="${esc(e)}">${esc(e)}</button>`).join("")}</div>` : ""}
      </div>
    </section>`;
  }

  function filterValueLabel(def) {
    const f = state.filters[def.key];
    if (def.radio) return f ? def.options().find(([v]) => v === f)[1] : "";
    if (!f.size) return "";
    return def.options().filter(([v]) => f.has(v)).map(([, l]) => l).join(", ");
  }

  function filterBar(base) {
    const anyActive = FILTERS.some((d) => filterValueLabel(d));
    return `
    <div class="filterbar" role="group" aria-label="Filters">
      ${FILTERS.map((def) => {
        const val = filterValueLabel(def);
        const open = state.openFilter === def.key;
        return `
        <div class="fpill-wrap">
          <button type="button" class="fpill ${val ? "active" : ""}" data-action="toggle-filter" data-key="${def.key}" aria-expanded="${open}" aria-controls="fp-${def.key}">
            <span class="fpill-text">${val ? `<small>${def.label}</small><span>${esc(val)}</span>` : def.label}</span>${ICON.chev}
          </button>
          ${open ? filterPopover(def, base) : ""}
        </div>`;
      }).join("")}
      ${anyActive ? `<button type="button" class="clear" data-action="clear-filters">Wis filters</button>` : ""}
    </div>`;
  }

  function filterPopover(def, base) {
    const f = state.filters;
    const type = def.radio ? "radio" : "checkbox";
    const items = def.options().map(([val, label]) => {
      const n = base.filter((r) => passFilters(r.job, f, def.key) && optionMatches(def.key, val, r.job)).length;
      const on = def.radio ? f[def.key] === val : f[def.key].has(val);
      return `<label class="check ${n === 0 && !on ? "zero" : ""}"><input type="${type}" name="fp-${def.key}" data-filter="${def.key}" value="${esc(val)}" ${on ? "checked" : ""}> <span>${esc(label)}</span> <span class="n">${n}</span></label>`;
    }).join("");
    const total = base.filter((r) => passFilters(r.job, f)).length;
    return `
      <div class="popover" id="fp-${def.key}" role="dialog" aria-label="${def.label}">
        <div class="pop-list">${items}</div>
        <div class="pop-foot">
          <button type="button" class="linkbtn" data-action="clear-one" data-key="${def.key}">Wissen</button>
          <button type="button" class="btn blue small" data-action="close-filter">Toon ${total} jobs</button>
        </div>
      </div>`;
  }

  function benefitIcons(job, max = 4) {
    const list = job.benefits.filter((b) => BENEFIT_ICON[b]);
    const shown = list.slice(0, max).map((b) => `<span class="bicon" title="${esc(JW.BENEFITS[b])}" aria-label="${esc(JW.BENEFITS[b])}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${BENEFIT_ICON[b]}</svg></span>`).join("");
    const more = list.length > max ? `<span class="bicon more" title="${esc(list.slice(max).map((b) => JW.BENEFITS[b]).join(", "))}" aria-label="Meer voordelen">${ICON.dots}</span>` : "";
    return `<div class="bicons">${shown}${more}</div>`;
  }

  function starBtn(job, cls = "") {
    const on = state.saved.has(job.id);
    return `<button class="star ${cls}" type="button" data-action="save" data-id="${job.id}" aria-pressed="${on}" aria-label="${on ? "Verwijder uit bewaarde jobs" : "Bewaar deze job"}" title="${on ? "Bewaard" : "Bewaar"}">${on ? ICON.starFill : ICON.star}</button>`;
  }

  function jobCard(r, opts = {}) {
    const job = r.job;
    const dist = r.dist != null && r.dist >= 1 ? ` (${Math.round(r.dist)} km)` : "";
    const selected = opts.selectable && state.selected === job.id;
    let match = "";
    if (opts.match && r.hits) {
      const pct = Math.round(r.score * 100);
      const reasons = r.hits.filter((h) => h.s >= 0.6).slice(0, 2).map((h) => `<li class="ok">${esc(h.text)}</li>`)
        .concat(r.misses.slice(0, 1).map((m) => `<li class="no">${esc(m.text)}</li>`)).join("");
      match = `<div class="match"><span class="score ${pct < 70 ? "mid" : ""}" title="Hoe goed deze job past bij je vraag">${pct}% match</span><ul class="reasons">${reasons}</ul></div>`;
    }
    return `
    <article class="job-card ${selected ? "selected" : ""} ${state.visited.has(job.id) ? "visited" : ""}">
      <h3><a href="#job-${job.id}" data-action="open-job" data-id="${job.id}">${esc(job.title)}</a></h3>
      <p class="job-sub"><span class="co">${esc(job.company.name)}</span><span class="sep">|</span>${esc(job.city)}${dist}<span class="sep">|</span>${esc(contractTag(job.contract))}</p>
      ${match}
      <div class="card-foot">${benefitIcons(job)}${job.knelpunt ? `<span class="kp" title="Knelpuntberoep: werkgevers vinden moeilijk kandidaten">${ICON.flame}Knelpuntberoep</span>` : ""}</div>
      ${starBtn(job, "card-star")}
    </article>`;
  }

  function whyBox(job) {
    if (!(state.mode === "prompt" && state.prompt.trim())) return "";
    const crit = activeCriteria();
    if (!crit.length) return "";
    const r = JW.scoreJobs([job], crit)[0] || JW.scoreJobs([job], crit.map((c) => ({ ...c, hard: false })))[0];
    return `
      <section class="why-box">
        <h2>Past bij je vraag: ${Math.round(r.score * 100)}%</h2>
        <ul class="reasons">${r.hits.map((h) => `<li class="ok">${esc(h.text)}</li>`).join("")}${r.misses.map((m) => `<li class="no">${esc(m.text)}</li>`).join("")}</ul>
      </section>`;
  }

  /* Detail van één job: gebruikt in het paneel naast de lijst en op de volledige detailpagina. */
  function jobDetail(job, full) {
    const applied = state.applied[job.id];
    const langs = job.langs.map((l) => JW.LANG_LABEL[l]).join(", ");
    const H = full ? "h1" : "h2";
    return `
    <div class="detail ${full ? "full" : ""}">
      <div class="banner" style="--h:${job.company.hue}" aria-hidden="true"><span class="banner-name">${esc(job.company.name)}</span>${logo(job.company, "banner-logo")}</div>
      <div class="detail-inner">
        <div class="detail-title">
          <${H} class="dtitle">${esc(job.title)}</${H}>
          <div class="round-btns">${starBtn(job, "round")}<button class="star round" type="button" data-action="share" data-id="${job.id}" aria-label="Deel deze job" title="Deel">${ICON.share}</button></div>
        </div>
        <div class="co-block">
          ${logo(job.company, "box")}
          <ul class="co-facts">
            <li>${ICON.building}<a href="#resultaten" data-action="company" data-id="${job.company.id}">${esc(job.company.name)}</a></li>
            <li>${ICON.pin}${esc(job.city)} <span class="muted">(${job.pc}, ${esc(job.prov)})</span></li>
            <li>${ICON.clock}${onlineLabel(job.daysAgo)}</li>
          </ul>
        </div>
        <div class="tags">
          <span class="tag">${esc(contractTag(job.contract))}</span>
          <span class="tag">${job.regime === "voltijds" ? "Voltijds" : "Deeltijds"}</span>
          ${job.remote !== "geen" ? `<span class="tag">${remoteLabel(job.remote)}</span>` : ""}
          <span class="tag">${eur(job.salMin)} – ${eur(job.salMax)} bruto/maand</span>
          ${job.knelpunt ? `<span class="tag kp">${ICON.flame}Knelpuntberoep</span>` : ""}
        </div>
        <div class="apply-row">
          ${applied ? `<p class="applied">Je solliciteerde op ${esc(applied)}.</p>` : `<button class="btn blue big" data-action="apply" data-id="${job.id}">Solliciteer nu</button>`}
        </div>
        <div class="dbody">
          ${whyBox(job)}
          <section><p>${esc(job.intro)}</p></section>
          <section><h3>Wat doe je?</h3><ul>${job.tasks.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section>
          <section><h3>Wie ben je?</h3><ul>${job.profile.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section>
          <section>
            <h3>Wat bieden we?</h3>
            <p>Een brutomaandloon tussen ${eur(job.salMin)} en ${eur(job.salMax)} (${job.regime === "voltijds" ? "voltijds" : "voltijdse equivalent"}), volgens de barema's van ${esc(job.paritair === "Onderwijs" ? "het onderwijs" : job.paritair)} en je ervaring. Daarbovenop:</p>
            <ul class="benefits">${job.benefits.map((b) => `<li>${BENEFIT_ICON[b] ? `<span class="bicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${BENEFIT_ICON[b]}</svg></span>` : ""}${esc(JW.BENEFITS[b])}</li>`).join("") || "<li>Vakantiegeld en eindejaarspremie</li>"}</ul>
          </section>
          <section>
            <h3>Praktisch</h3>
            <dl class="dl">
              <dt>Referentie</dt><dd>${job.ref}</dd>
              <dt>Start</dt><dd>${esc(job.start)}</dd>
              <dt>Uren</dt><dd>${esc(job.hours)}</dd>
              <dt>Diploma</dt><dd>${eduLabel(job.edu)}</dd>
              <dt>Ervaring</dt><dd>${expLabel(job.exp)}</dd>
              <dt>Talen</dt><dd>${esc(langs)}</dd>
              <dt>Paritair comité</dt><dd>${esc(job.paritair)}</dd>
            </dl>
          </section>
          <section><h3>Over ${esc(job.company.name)}</h3><p>${esc(job.company.about)} <span class="muted">(${esc(job.company.size)})</span></p></section>
          ${!applied ? `<div><button class="btn blue big" data-action="apply" data-id="${job.id}">Solliciteer nu</button></div>` : ""}
        </div>
      </div>
    </div>`;
  }

  /* ---------- Pagina's ---------- */
  function renderHome() {
    const regionCount = (r) => JOBS.filter((j) => j.region === r).length;
    const fresh = JOBS.slice().sort((a, b) => a.daysAgo - b.daysAgo).slice(0, 6);
    return `
    ${searchBand(false)}
    <div class="wrap home">
      <section class="hero-line">
        <h1>Vind je job tussen <span>${JOBS.length}</span> vacatures in heel België</h1>
        <p>Zoek op functie en plaats, of beschrijf in je eigen woorden wat je zoekt.</p>
      </section>
      <section>
        <h2 class="sh">Zoek met een prompt</h2>
        <div class="prompt-cards">
          ${EXAMPLES.slice(0, 4).map((e) => `<button class="prompt-card" data-action="run-prompt" data-text="${esc(e)}">${ICON.spark}<span>${esc(e)}</span></button>`).join("")}
        </div>
      </section>
      <section>
        <h2 class="sh">Jobs per categorie</h2>
        <div class="cat-grid">
          ${JW.CATEGORIES.map((c) => `<a href="#resultaten" data-action="cat" data-cat="${c.id}"><span>${esc(c.label)}</span><span class="n">${JOBS.filter((j) => j.cat === c.id).length} jobs</span></a>`).join("")}
        </div>
      </section>
      <section>
        <h2 class="sh">Jobs per regio</h2>
        <div class="region-row">
          ${JW.REGIONS.map((r) => `<a class="region" href="#resultaten" data-action="region" data-region="${esc(r)}"><strong>${esc(r)}</strong><span>${regionCount(r)} vacatures</span></a>`).join("")}
        </div>
      </section>
      <section>
        <div class="sh-row"><h2 class="sh">Nieuwste jobs</h2><a href="#resultaten" data-action="all-jobs">Bekijk alle jobs</a></div>
        <div class="card-grid">${fresh.map((job) => jobCard({ job })).join("")}</div>
      </section>
    </div>`;
  }

  function renderResults() {
    let base, title, top = "";
    const isPrompt = state.mode === "prompt" && state.prompt.trim();
    if (isPrompt) {
      const { results, all, crit } = promptSearch();
      base = results;
      const chips = all.map((c) => state.removed.has(c.id)
        ? `<button type="button" class="chip off" data-action="restore-crit" data-id="${c.id}">+ ${esc(c.group)}: ${esc(c.label)}</button>`
        : `<span class="chip"><span>${esc(c.group)}: <b>${esc(c.label)}</b></span><button type="button" data-action="remove-crit" data-id="${c.id}" aria-label="Verwijder ${esc(c.group)}: ${esc(c.label)}">✕</button></span>`).join("");
      top = `
      <section class="interpret" aria-label="Zo begrepen we je vraag">
        <div class="interpret-head"><h2>${ICON.spark} Zo begrepen we je vraag</h2><button class="linkbtn" data-action="edit-prompt">Vraag aanpassen</button></div>
        <p class="quote">“${esc(state.prompt.trim())}”</p>
        ${all.length ? `<div class="chips">${chips}</div><p class="hint">Klopt iets niet? Haal een criterium weg met ✕. Jobs die niet passen bij de functie of plaats, tonen we niet.</p>`
          : `<p class="notice">We vonden geen duidelijke criteria in je vraag. Noem bijvoorbeeld een functie (“verpleegkundige”), een plaats (“rond Leuven”) of uren (“deeltijds”). We tonen intussen alle vacatures.</p>`}
      </section>`;
      title = crit.length ? "Passende vacatures" : "Alle vacatures";
    } else {
      const { results, place } = classicSearch();
      base = results;
      const parts = [];
      if (state.wat.trim()) parts.push(esc(state.wat.trim()));
      if (place && !place.error) parts.push((place.type === "city" ? "in " : "in ") + esc(place.label) + (place.type === "city" && state.radius ? " + " + state.radius + " km" : ""));
      const cats = state.filters.cat.size === 1 ? JW.CATEGORIES.find((c) => state.filters.cat.has(c.id)).label : "";
      title = "Vacatures" + (cats && !parts.length ? " " + esc(cats) : parts.length ? " " + parts.join(" ") : "");
      if (place && place.error) top = `<p class="notice">We kennen de plaats “${esc(place.label)}” niet. Probeer een gemeente, postcode of provincie. We tonen jobs in heel België.</p>`;
    }
    const filtered = base.filter((r) => passFilters(r.job, state.filters));
    const sorted = sortResults(filtered);
    state.lastList = sorted.map((r) => r.job.id);
    if (!state.lastList.includes(state.selected)) state.selected = state.lastList[0] || null;
    const hasDist = sorted.some((r) => r.dist != null);
    const sel = state.selected && byId[state.selected];

    return `
    ${searchBand(true, base)}
    <div class="wrap results-page">
      ${top}
      <div class="res-head">
        <p><b>${title}:</b> <span>${sorted.length} jobs</span></p>
        <div class="res-tools">
          <label class="sort">Sorteer
            <select id="f-sort">
              <option value="relevantie" ${state.sort === "relevantie" ? "selected" : ""}>${isPrompt ? "Beste match" : "Relevantie"}</option>
              <option value="datum" ${state.sort === "datum" ? "selected" : ""}>Nieuwste eerst</option>
              <option value="loon" ${state.sort === "loon" ? "selected" : ""}>Hoogste loon</option>
              ${hasDist ? `<option value="afstand" ${state.sort === "afstand" ? "selected" : ""}>Dichtstbij</option>` : ""}
            </select>
          </label>
          <span class="alert-toggle">Job alert via e-mail: <span class="${state.jobAlert ? "" : "on-label"}">Uit</span>
            <button type="button" class="switch" role="switch" aria-checked="${state.jobAlert}" aria-label="Job alert via e-mail" data-action="job-alert"><span></span></button>
            <span class="${state.jobAlert ? "on-label" : ""}">Aan</span></span>
        </div>
      </div>
      ${sorted.length ? `
      <div class="master-detail">
        <div class="job-list">${sorted.map((r) => jobCard(r, { match: isPrompt, selectable: true })).join("")}</div>
        <aside class="panel" id="panel" aria-label="Geselecteerde vacature">${sel ? jobDetail(sel, false) : ""}</aside>
      </div>` : `
      <div class="empty">
        <h2>Geen jobs gevonden</h2>
        <p>Maak je zoekopdracht ruimer: vergroot de straal, haal een filter of criterium weg of probeer een ander woord.</p>
        <button class="btn blue" data-action="clear-filters">Wis alle filters</button>
      </div>`}
    </div>`;
  }

  function renderDetail(id) {
    const job = byId[id];
    if (!job) return `<div class="wrap detail-page"><div class="empty"><h2>Deze vacature bestaat niet (meer)</h2><a class="btn blue" href="#resultaten" data-action="all-jobs">Bekijk alle vacatures</a></div></div>`;
    markVisited(id);
    const fromSearch = state.hasSearch && state.lastList.includes(id);
    const idx = state.lastList.indexOf(id);
    const prev = idx > 0 ? state.lastList[idx - 1] : null;
    const next = idx >= 0 && idx < state.lastList.length - 1 ? state.lastList[idx + 1] : null;
    const similar = JOBS.filter((j) => j.id !== id && (j.role === job.role || j.cat === job.cat))
      .map((j) => ({ job: j, dist: JW.distanceKm(job, j), same: j.role === job.role }))
      .sort((a, b) => (b.same - a.same) || a.dist - b.dist).slice(0, 4);
    return `
    <div class="subbar"><div class="wrap crumbs">
      ${fromSearch ? `<a href="#resultaten">${ICON.back}Terug naar resultaten</a><span class="muted">${idx + 1} van ${state.lastList.length}</span>
        ${prev ? `<a href="#job-${prev}">Vorige</a>` : ""}${next ? `<a href="#job-${next}">Volgende</a>` : ""}`
        : `<a href="#home">Home</a><span class="muted">›</span><a href="#resultaten" data-action="cat" data-cat="${job.cat}">${esc(job.catLabel)}</a><span class="muted">›</span><span>${esc(job.title)}</span>`}
    </div></div>
    <div class="wrap detail-page">
      <article class="panel static">${jobDetail(job, true)}</article>
      <section>
        <h2 class="sh">Vergelijkbare jobs</h2>
        <div class="card-grid">${similar.map((r) => jobCard({ job: r.job, dist: r.dist })).join("")}</div>
      </section>
    </div>`;
  }

  function renderSaved() {
    const list = Array.from(state.saved).map((id) => byId[id]).filter(Boolean);
    return `
    <div class="subbar"><div class="wrap"><h1 class="page-title">Bewaarde jobs</h1></div></div>
    <div class="wrap results-page">
      <div class="res-head"><p><b>Bewaarde jobs:</b> <span>${list.length} ${list.length === 1 ? "job" : "jobs"}</span></p></div>
      ${list.length ? `<div class="card-grid">${list.map((job) => jobCard({ job })).join("")}</div>` : `
        <div class="empty">
          <h2>Nog niets bewaard</h2>
          <p>Klik op de ster bij een vacature om ze hier terug te vinden. Bewaarde jobs blijven in deze browser staan.</p>
          <a class="btn blue" href="#resultaten" data-action="all-jobs">Bekijk vacatures</a>
        </div>`}
    </div>`;
  }

  /* ---------- Router ---------- */
  function markVisited(id) {
    state.visited.add(id);
    store.set("jw-visited", Array.from(state.visited));
  }

  function setActiveNav(h) {
    $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === (h === "bewaard" ? "bewaard" : h === "home" ? "home" : "jobs")));
  }

  function route() {
    const h = (location.hash || "#home").slice(1);
    const prevRoute = state.lastRoute;
    if (prevRoute === "resultaten") state.resultsScroll = window.scrollY;
    let html;
    if (h.startsWith("job-")) html = renderDetail(h.slice(4));
    else if (h === "resultaten") html = renderResults();
    else if (h === "bewaard") html = renderSaved();
    else html = renderHome();
    $("#app").innerHTML = html;
    document.title = h.startsWith("job-") && byId[h.slice(4)] ? byId[h.slice(4)].title + " · Jobwijs" : "Jobwijs";
    state.lastRoute = h;
    if (h === "resultaten" && prevRoute.startsWith("job-")) window.scrollTo(0, state.resultsScroll);
    else if (h !== prevRoute) window.scrollTo(0, 0);
    setActiveNav(h.startsWith("job-") ? "jobs" : h || "home");
    updateSavedCount();
    autoGrow();
  }

  function rerender() {
    const y = window.scrollY;
    const panel = $("#panel");
    const py = panel ? panel.scrollTop : 0;
    route();
    window.scrollTo(0, y);
    const p2 = $("#panel");
    if (p2) p2.scrollTop = py;
  }

  function rerenderResults() {
    if (location.hash === "#resultaten") rerender();
    else location.hash = "resultaten";
  }

  function go(hash) {
    if (location.hash === "#" + hash) route();
    else location.hash = hash;
  }

  function autoGrow() {
    const ta = $("#f-prompt");
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }

  function runClassic() {
    Object.assign(state, { mode: "classic", hasSearch: true, sort: "relevantie", selected: null, openFilter: null });
    go("resultaten");
  }
  function runPrompt(text) {
    Object.assign(state, { mode: "prompt", prompt: text, removed: new Set(), filters: emptyFilters(), hasSearch: true, sort: "relevantie", selected: null, openFilter: null });
    go("resultaten");
  }
  function browse(extra) {
    Object.assign(state, { mode: "classic", wat: "", waar: "", radius: 25, filters: emptyFilters(), hasSearch: true, sort: "datum", selected: null, openFilter: null }, extra || {});
  }

  /* ---------- Events ---------- */
  document.addEventListener("submit", (e) => {
    const form = e.target;
    e.preventDefault();
    if (form.id === "classic-form") {
      state.wat = $("#f-wat").value;
      state.waar = $("#f-waar").value;
      state.radius = +$("#f-radius").value;
      state.filters = emptyFilters();
      runClassic();
    } else if (form.id === "prompt-form") {
      const text = $("#f-prompt").value.trim();
      if (!text) { $("#f-prompt").focus(); toast("Beschrijf eerst kort welke job je zoekt"); return; }
      runPrompt(text);
    } else if (form.id === "apply-form") {
      const id = form.dataset.id;
      const today = new Date().toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" });
      state.applied[id] = today;
      store.set("jw-applied", state.applied);
      const job = byId[id];
      $("#apply-body").innerHTML = `
        <div class="success">
          <span class="tick">${ICON.check}</span>
          <h2 id="apply-title">Sollicitatie verstuurd</h2>
          <p>${esc(job.company.name)} ontvangt je kandidatuur voor <strong>${esc(job.title)}</strong>. Je krijgt doorgaans binnen vijf werkdagen antwoord.</p>
          <p class="muted">Dit is een prototype: er werd niets verzonden.</p>
          <button class="btn blue" data-action="close-dialog">Sluiten</button>
        </div>`;
    }
  });

  document.addEventListener("click", (e) => {
    // Klik buiten een open filter sluit het.
    if (state.openFilter && !e.target.closest(".fpill-wrap")) {
      state.openFilter = null;
      if (!e.target.closest("[data-action]")) { rerender(); return; }
    }
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action;
    if (a === "mode") {
      state.mode = el.dataset.mode;
      const isPrompt = state.mode === "prompt";
      if (location.hash === "#resultaten" || !location.hash || location.hash === "#home") {
        $$(".mode").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.mode === state.mode)));
        $("#classic-form").hidden = isPrompt;
        $("#prompt-form").hidden = !isPrompt;
        if (location.hash !== "#resultaten") rerender();
        (isPrompt ? $("#f-prompt") : $("#f-wat")).focus();
        autoGrow();
      }
    } else if (a === "nav-home") {
      e.preventDefault();
      state.mode = el.dataset.mode || "classic";
      go("home");
      setTimeout(() => { const f = state.mode === "prompt" ? $("#f-prompt") : $("#f-wat"); if (f) f.focus(); }, 0);
    } else if (a === "example") {
      const ta = $("#f-prompt");
      ta.value = el.dataset.text;
      autoGrow();
      ta.focus();
    } else if (a === "run-prompt") {
      runPrompt(el.dataset.text);
    } else if (a === "all-jobs") {
      e.preventDefault();
      browse();
      go("resultaten");
    } else if (a === "cat") {
      e.preventDefault();
      browse();
      state.filters.cat.add(el.dataset.cat);
      go("resultaten");
    } else if (a === "region") {
      e.preventDefault();
      browse({ waar: el.dataset.region });
      go("resultaten");
    } else if (a === "company") {
      e.preventDefault();
      const co = JW.COMPANIES.find((c) => c.id === el.dataset.id);
      browse({ wat: co.name, sort: "relevantie" });
      go("resultaten");
    } else if (a === "open-job") {
      if (location.hash === "#resultaten" && isWide()) {
        e.preventDefault();
        state.selected = el.dataset.id;
        markVisited(el.dataset.id);
        rerender();
        const p = $("#panel");
        if (p) p.scrollTop = 0;
      }
    } else if (a === "save") {
      e.preventDefault();
      const id = el.dataset.id;
      if (state.saved.has(id)) { state.saved.delete(id); toast("Verwijderd uit je bewaarde jobs"); }
      else { state.saved.add(id); toast("Bewaard. Je vindt deze job terug onder Bewaarde jobs"); }
      store.set("jw-saved", Array.from(state.saved));
      rerender();
    } else if (a === "share") {
      const job = byId[el.dataset.id];
      const text = `${job.title} bij ${job.company.name} in ${job.city} (ref. ${job.ref})`;
      const done = () => toast("Jobgegevens gekopieerd");
      try { navigator.clipboard.writeText(text).then(done, () => toast(text)); } catch (err) { toast(text); }
    } else if (a === "toggle-filter") {
      state.openFilter = state.openFilter === el.dataset.key ? null : el.dataset.key;
      rerender();
    } else if (a === "close-filter") {
      state.openFilter = null;
      rerender();
    } else if (a === "clear-one") {
      const def = FILTERS.find((d) => d.key === el.dataset.key);
      state.filters[def.key] = def.radio ? 0 : new Set();
      rerender();
    } else if (a === "remove-crit") {
      state.removed.add(el.dataset.id);
      rerenderResults();
    } else if (a === "restore-crit") {
      state.removed.delete(el.dataset.id);
      rerenderResults();
    } else if (a === "edit-prompt") {
      window.scrollTo(0, 0);
      const ta = $("#f-prompt");
      if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
    } else if (a === "clear-filters") {
      state.filters = emptyFilters();
      state.openFilter = null;
      rerenderResults();
    } else if (a === "job-alert") {
      state.jobAlert = !state.jobAlert;
      toast(state.jobAlert ? "Job alert staat aan (demo: je krijgt geen mails)" : "Job alert staat uit");
      rerender();
    } else if (a === "demo") {
      e.preventDefault();
      toast(el.dataset.msg || "Dit onderdeel is niet uitgewerkt in het prototype");
    } else if (a === "apply") {
      openApply(el.dataset.id);
    } else if (a === "close-dialog") {
      $("#apply-dialog").close();
    }
  });

  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.dataset.filter) {
      const k = el.dataset.filter;
      const f = state.filters;
      if (k === "minSal" || k === "posted") f[k] = +el.value;
      else if (el.checked) f[k].add(el.value);
      else f[k].delete(el.value);
      rerender();
    } else if (el.id === "f-sort") {
      state.sort = el.value;
      rerender();
    }
  });

  document.addEventListener("input", (e) => { if (e.target.id === "f-prompt") autoGrow(); });

  document.addEventListener("keydown", (e) => {
    if (e.target.id === "f-prompt" && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.target.form.requestSubmit();
    }
    if (e.key === "Escape" && state.openFilter) {
      const key = state.openFilter;
      state.openFilter = null;
      rerender();
      const btn = $(`.fpill[data-key="${key}"]`);
      if (btn) btn.focus();
    }
  });

  function openApply(id) {
    const job = byId[id];
    const dlg = $("#apply-dialog");
    $("#apply-body").innerHTML = `
      <div class="dialog-head">
        <div><p class="eyebrow">${esc(job.company.name)} · ${job.ref}</p><h2 id="apply-title">Solliciteer als ${esc(job.title)}</h2></div>
        <button class="x" type="button" data-action="close-dialog" aria-label="Sluiten">✕</button>
      </div>
      <form id="apply-form" data-id="${id}" class="form-grid">
        <label class="field"><span>Voornaam</span><input id="a-first" required autocomplete="given-name"></label>
        <label class="field"><span>Naam</span><input id="a-last" required autocomplete="family-name"></label>
        <label class="field full"><span>E-mail</span><input id="a-mail" type="email" required autocomplete="email" placeholder="naam@voorbeeld.be"></label>
        <label class="field full"><span>Gsm</span><input id="a-tel" type="tel" autocomplete="tel" placeholder="+32 4xx xx xx xx"></label>
        <label class="field full"><span>Cv (pdf of docx)</span><input id="a-cv" type="file" accept=".pdf,.doc,.docx"></label>
        <label class="field full"><span>Waarom deze job?</span><textarea id="a-why" placeholder="Een paar zinnen volstaan."></textarea></label>
        <label class="consent full"><input id="a-ok" type="checkbox" required> Ik geef ${esc(job.company.name)} toestemming om mijn gegevens te gebruiken voor deze sollicitatie (GDPR).</label>
        <button class="btn blue big full" type="submit">Verstuur sollicitatie</button>
      </form>`;
    dlg.showModal();
    setTimeout(() => $("#a-first").focus(), 30);
  }

  $("#apply-dialog").addEventListener("close", () => rerender());
  $("#apply-dialog").addEventListener("click", (e) => { if (e.target.id === "apply-dialog") e.target.close(); });

  window.addEventListener("hashchange", route);
  route();
})();
