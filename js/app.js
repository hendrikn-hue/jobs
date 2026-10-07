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

  const JOBS = JW.JOBS;
  const byId = Object.fromEntries(JOBS.map((j) => [j.id, j]));

  const ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>',
    bookmarkFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M9 17h6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    euro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 6.5A7 7 0 1 0 17 17.5M4 10.5h9M4 13.5h9"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9H3z"/><path d="M10 20v-5h4v5"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8a7 7 0 0 0 7 7z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>'
  };

  const EXAMPLES = [
    "Ik zoek een deeltijdse job in de zorg rond Gent, liefst zonder weekendwerk",
    "Junior developer in Antwerpen of Mechelen met thuiswerk en minstens € 3.000 bruto",
    "Ik ben schoolverlater en wil met mijn handen werken in Limburg, vast contract",
    "Tweetalige job in Brussel in finance met bedrijfswagen",
    "Ik spreek geen Frans en wil buiten werken, geen ploegenwerk, binnen 30 km van 9000"
  ];

  const emptyFilters = () => ({ cat: new Set(), contract: new Set(), regime: new Set(), lang: new Set(), remote: false, knelpunt: false, minSal: 0, posted: 0 });

  const state = {
    mode: "classic",
    wat: "", waar: "", radius: 25,
    prompt: "", removed: new Set(),
    filters: emptyFilters(),
    sort: "relevantie",
    hasSearch: false,
    saved: new Set(store.get("jw-saved", [])),
    applied: store.get("jw-applied", {}),
    visited: new Set(store.get("jw-visited", [])),
    lastList: [],
    resultsScroll: 0,
    lastRoute: ""
  };

  /* ---------- Hulpjes ---------- */
  const initials = (name) => name.replace(/&/g, "").split(/\s+/).filter((w) => /^[A-Za-zÀ-ÿ]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const logo = (co, big) => `<span class="logo${big ? " big" : ""}" style="--h:${co.hue}" aria-hidden="true">${esc(initials(co.name))}</span>`;
  const postedLabel = (d) => (d === 0 ? "Vandaag" : d === 1 ? "Gisteren" : d + " dagen geleden");
  const remoteLabel = (r) => ({ remote: "Volledig thuiswerk", hybride: "Hybride thuiswerk", geen: "Op locatie" })[r];
  const eduLabel = (e) => ({ geen: "Geen diploma vereist", secundair: "Secundair onderwijs", bachelor: "Bachelor", master: "Master" })[e];
  const expLabel = (x) => (x === 0 ? "Geen ervaring vereist" : x + "+ jaar");
  const plural = (n, one, many) => n + " " + (n === 1 ? one : many);

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.hidden = true; }, 2600);
  }

  function updateSavedCount() { $("#saved-count").textContent = state.saved.size; }

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
    const city = JW.CITIES.find((c) => JW.norm(c.name) === n || c.alias.includes(n) || n === JW.norm(c.name + " (" + c.pc + ")") || n === c.pc + " " + JW.norm(c.name));
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

  function passFilters(job, f, skip) {
    if (skip !== "cat" && f.cat.size && !f.cat.has(job.cat)) return false;
    if (skip !== "contract" && f.contract.size && !f.contract.has(job.contract)) return false;
    if (skip !== "regime" && f.regime.size && !f.regime.has(job.regime)) return false;
    if (skip !== "lang" && f.lang.size && !job.langs.some((l) => f.lang.has(l))) return false;
    if (skip !== "remote" && f.remote && job.remote === "geen") return false;
    if (skip !== "knelpunt" && f.knelpunt && !job.knelpunt) return false;
    if (skip !== "minSal" && f.minSal && job.salMax < f.minSal) return false;
    if (skip !== "posted" && f.posted && job.daysAgo > f.posted) return false;
    return true;
  }

  function sortResults(list) {
    const s = state.sort;
    const by = {
      relevantie: (a, b) => b.score - a.score || a.job.daysAgo - b.job.daysAgo,
      datum: (a, b) => a.job.daysAgo - b.job.daysAgo,
      loon: (a, b) => b.job.salMax - a.job.salMax,
      afstand: (a, b) => (a.dist ?? 999) - (b.dist ?? 999)
    }[s];
    return list.slice().sort(by);
  }

  /* ---------- Componenten ---------- */
  function searchPanel(withExamples = true) {
    const isPrompt = state.mode === "prompt";
    const cityOptions = JW.CITIES.map((c) => `<option value="${esc(c.name)}">${c.pc} · ${esc(c.prov)}</option>`).join("")
      + JW.PROVINCES.filter((p) => p !== "Brussel").map((p) => `<option value="Provincie ${esc(p)}"></option>`).join("")
      + `<option value="Vlaanderen"></option><option value="Wallonië"></option>`;
    const roleOptions = Array.from(new Set(JW.ROLES.map((r) => r.title))).concat(JW.CATEGORIES.map((c) => c.label)).map((t) => `<option value="${esc(t)}"></option>`).join("");
    return `
    <div class="search">
      <div class="tabs" role="tablist" aria-label="Manier van zoeken">
        <button class="tab" role="tab" id="tab-classic" aria-controls="classic-form" aria-selected="${!isPrompt}" data-action="mode" data-mode="classic">${ICON.search} Wat &amp; waar</button>
        <button class="tab" role="tab" id="tab-prompt" aria-controls="prompt-form" aria-selected="${isPrompt}" data-action="mode" data-mode="prompt">${ICON.spark} Beschrijf wat je zoekt <span class="pill hide-sm">nieuw</span></button>
      </div>
      <form class="classic-form" id="classic-form" role="tabpanel" aria-labelledby="tab-classic" ${isPrompt ? "hidden" : ""}>
        <label class="field withicon"><span>Wat</span>${ICON.search}<input id="f-wat" name="wat" list="dl-wat" autocomplete="off" placeholder="Functie, trefwoord of bedrijf" value="${esc(state.wat)}"></label>
        <label class="field withicon"><span>Waar</span>${ICON.pin}<input id="f-waar" name="waar" list="dl-waar" autocomplete="off" placeholder="Gemeente, postcode of provincie" value="${esc(state.waar)}"></label>
        <label class="field"><span>Straal</span>
          <select id="f-radius" name="radius">
            ${[0, 10, 25, 50, 100].map((r) => `<option value="${r}" ${state.radius === r ? "selected" : ""}>${r === 0 ? "Enkel deze gemeente" : "+ " + r + " km"}</option>`).join("")}
          </select>
        </label>
        <button class="btn primary" type="submit">Zoek jobs</button>
        <datalist id="dl-wat">${roleOptions}</datalist>
        <datalist id="dl-waar">${cityOptions}</datalist>
      </form>
      <form class="prompt-form" id="prompt-form" role="tabpanel" aria-labelledby="tab-prompt" ${isPrompt ? "" : "hidden"}>
        <div class="prompt-box">
          <label for="f-prompt" class="sr-only">Beschrijf in je eigen woorden welke job je zoekt</label>
          <textarea id="f-prompt" name="prompt" rows="3" placeholder="Bijvoorbeeld: ik zoek een deeltijdse job in de zorg rond Gent, liefst zonder weekendwerk">${esc(state.prompt)}</textarea>
        </div>
        <div class="prompt-foot">
          <p class="hint">Vertel wat je zoekt: functie, regio, uren, contract, loon, talen, ervaring of extralegale voordelen.</p>
          <button class="btn primary" type="submit">${ICON.spark} Zoek passende jobs</button>
        </div>
        <div class="examples" aria-label="Voorbeelden" ${withExamples ? "" : "hidden"}>
          ${EXAMPLES.slice(0, 3).map((e) => `<button type="button" class="example" data-action="example" data-text="${esc(e)}">${esc(e)}</button>`).join("")}
        </div>
      </form>
    </div>`;
  }

  function tags(job) {
    const out = [];
    out.push(`<span class="tag salary">${eur(job.salMin)} – ${eur(job.salMax)}</span>`);
    out.push(`<span class="tag">${esc(JW.contractLabel(job.contract))}</span>`);
    out.push(`<span class="tag">${job.regime === "voltijds" ? "Voltijds" : "Deeltijds"}</span>`);
    if (job.remote !== "geen") out.push(`<span class="tag remote">${ICON.home}${remoteLabel(job.remote)}</span>`);
    if (job.knelpunt) out.push(`<span class="tag knelpunt" title="Knelpuntberoep: werkgevers vinden moeilijk kandidaten">${ICON.flame}Knelpuntberoep</span>`);
    return out.join("");
  }

  function saveBtn(job) {
    const on = state.saved.has(job.id);
    return `<button class="save" type="button" data-action="save" data-id="${job.id}" aria-pressed="${on}" aria-label="${on ? "Verwijder uit bewaarde jobs" : "Bewaar deze job"}" title="${on ? "Bewaard" : "Bewaar"}">${on ? ICON.bookmarkFill : ICON.bookmark}</button>`;
  }

  function jobCard(r, opts = {}) {
    const job = r.job;
    const dist = r.dist != null && r.dist >= 1 ? ` · <span class="mono">${Math.round(r.dist)} km</span>` : "";
    let match = "";
    if (opts.match && r.hits) {
      const pct = Math.round(r.score * 100);
      const reasons = r.hits.filter((h) => h.s >= 0.6).slice(0, 3).map((h) => `<li class="ok">${esc(h.text)}</li>`)
        .concat(r.misses.slice(0, 1).map((m) => `<li class="no">${esc(m.text)}</li>`)).join("");
      match = `<div class="match"><span class="score ${pct < 70 ? "mid" : ""}" title="Hoe goed deze job past bij je vraag">${pct}%</span><ul class="reasons">${reasons}</ul></div>`;
    }
    return `
    <article class="job-card ${state.visited.has(job.id) ? "visited" : ""}">
      ${logo(job.company)}
      <div class="job-main">
        <h3><a href="#job-${job.id}">${esc(job.title)}</a></h3>
        <p class="job-sub"><strong>${esc(job.company.name)}</strong> · ${esc(job.city)}${dist}</p>
        <div class="meta">${tags(job)}</div>
      </div>
      <div class="job-side">
        <span class="posted">${postedLabel(job.daysAgo)}</span>
        ${saveBtn(job)}
      </div>
      ${match}
    </article>`;
  }

  /* ---------- Pagina's ---------- */
  function renderHome() {
    const regionCount = (r) => JOBS.filter((j) => j.region === r).length;
    const fresh = JOBS.slice().sort((a, b) => a.daysAgo - b.daysAgo).slice(0, 5);
    return `
    <section class="band">
      <div class="wrap">
        <p class="tally"><span><b>${JOBS.length}</b> vacatures</span><span>Vlaanderen <b>${regionCount("Vlaanderen")}</b></span><span>Brussel <b>${regionCount("Brussel")}</b></span><span>Wallonië <b>${regionCount("Wallonië")}</b></span></p>
        <h1>Zoek werk op <em>jouw</em> manier.</h1>
        <p class="lede">Zoek klassiek op functie en plaats, of vertel in je eigen woorden wat je zoekt. Wij zoeken de jobs die het best passen.</p>
      </div>
    </section>
    <div class="wrap"><div class="search-wrap">${searchPanel()}</div></div>
    <div class="wrap home-sections">
      <section>
        <div class="section-head"><h2>Probeer een vraag</h2><span class="muted">Klik om meteen te zoeken</span></div>
        <div class="prompt-cards">
          ${EXAMPLES.slice(0, 4).map((e) => `<button class="prompt-card" data-action="run-prompt" data-text="${esc(e)}"><q>${esc(e)}</q><span>Zoek met deze prompt →</span></button>`).join("")}
        </div>
      </section>
      <section>
        <div class="section-head"><h2>Per sector</h2></div>
        <div class="cat-grid">
          ${JW.CATEGORIES.map((c) => `<a href="#resultaten" data-action="cat" data-cat="${c.id}">${esc(c.label)} <span class="mono">${JOBS.filter((j) => j.cat === c.id).length}</span></a>`).join("")}
        </div>
      </section>
      <section>
        <div class="section-head"><h2>Per regio</h2></div>
        <div class="region-row">
          ${JW.REGIONS.map((r) => `<a class="region" href="#resultaten" data-action="region" data-region="${esc(r)}"><strong>${esc(r)}</strong><span class="mono">${regionCount(r)} vacatures</span></a>`).join("")}
        </div>
      </section>
      <section>
        <div class="section-head"><h2>Nieuw deze week</h2><a href="#resultaten" data-action="all-jobs">Alle vacatures →</a></div>
        <div class="job-list">${fresh.map((job) => jobCard({ job })).join("")}</div>
      </section>
    </div>`;
  }

  function filterPanel(base) {
    const f = state.filters;
    const count = (key, test) => base.filter((r) => passFilters(r.job, f, key) && test(r.job)).length;
    const group = (title, key, options) => `
      <fieldset class="fgroup"><legend>${title}</legend>
        ${options.map(([val, label]) => {
          const n = count(key, (j) => (key === "lang" ? j.langs.includes(val) : j[key] === val));
          const on = f[key].has(val);
          return `<label class="check ${n === 0 && !on ? "zero" : ""}"><input type="checkbox" data-filter="${key}" value="${esc(val)}" ${on ? "checked" : ""}> ${esc(label)} <span class="n">${n}</span></label>`;
        }).join("")}
      </fieldset>`;
    const activeN = f.cat.size + f.contract.size + f.regime.size + f.lang.size + (f.remote ? 1 : 0) + (f.knelpunt ? 1 : 0) + (f.minSal ? 1 : 0) + (f.posted ? 1 : 0);
    return `
    <details class="filters" id="filters" ${matchMedia("(max-width: 960px)").matches && !activeN ? "" : "open"}>
      <summary>Filters ${activeN ? `<span class="count">${activeN}</span>` : ""} ${ICON.chev}</summary>
      <div class="filter-body">
        ${activeN ? `<button class="linkbtn" data-action="clear-filters" style="justify-self:start">Wis alle filters</button>` : ""}
        <fieldset class="fgroup"><legend>Snel</legend>
          <label class="check"><input type="checkbox" data-filter="remote" ${f.remote ? "checked" : ""}> Thuiswerk mogelijk <span class="n">${count("remote", (j) => j.remote !== "geen")}</span></label>
          <label class="check"><input type="checkbox" data-filter="knelpunt" ${f.knelpunt ? "checked" : ""}> Knelpuntberoep <span class="n">${count("knelpunt", (j) => j.knelpunt)}</span></label>
        </fieldset>
        ${group("Sector", "cat", JW.CATEGORIES.map((c) => [c.id, c.label]))}
        ${group("Contract", "contract", [["vast", "Vast contract"], ["tijdelijk", "Tijdelijk"], ["interim", "Interim"], ["freelance", "Freelance"], ["studentenjob", "Studentenjob"], ["flexi-job", "Flexi-job"]])}
        ${group("Regime", "regime", [["voltijds", "Voltijds"], ["deeltijds", "Deeltijds"]])}
        ${group("Werktaal", "lang", [["NL", "Nederlands"], ["FR", "Frans"], ["EN", "Engels"], ["DE", "Duits"]])}
        <label class="field"><span>Minimum brutoloon</span>
          <select data-filter="minSal" id="f-minsal">
            ${[0, 2500, 3000, 3500, 4000, 4500].map((v) => `<option value="${v}" ${f.minSal === v ? "selected" : ""}>${v ? "Tot minstens " + eur(v) : "Alle lonen"}</option>`).join("")}
          </select>
        </label>
        <label class="field"><span>Online sinds</span>
          <select data-filter="posted" id="f-posted">
            ${[[0, "Om het even"], [1, "Laatste 24 uur"], [7, "Laatste 7 dagen"], [14, "Laatste 14 dagen"]].map(([v, l]) => `<option value="${v}" ${f.posted === v ? "selected" : ""}>${l}</option>`).join("")}
          </select>
        </label>
      </div>
    </details>`;
  }

  function renderResults() {
    let base, headTitle, top = "";
    const isPrompt = state.mode === "prompt" && state.prompt.trim();
    if (isPrompt) {
      const { results, all, crit } = promptSearch();
      base = results;
      const chips = all.map((c) => state.removed.has(c.id)
        ? `<span class="chip off"><button type="button" data-action="restore-crit" data-id="${c.id}" class="linkbtn" style="width:auto;height:auto;text-decoration:none">+ ${esc(c.group)}: ${esc(c.label)}</button></span>`
        : `<span class="chip"><span>${esc(c.group)}: <b>${esc(c.label)}</b></span><button type="button" data-action="remove-crit" data-id="${c.id}" aria-label="Verwijder ${esc(c.group)}: ${esc(c.label)}">✕</button></span>`).join("");
      top = `
      <section class="interpret" aria-label="Zo begrepen we je vraag">
        <div class="interpret-head"><h2>Zo begrepen we je vraag</h2><button class="linkbtn" data-action="edit-prompt">Vraag aanpassen</button></div>
        <p class="quote">“${esc(state.prompt.trim())}”</p>
        ${all.length ? `<div class="chips">${chips}</div><p class="muted" style="font-size:14px">Klopt iets niet? Haal een criterium weg met ✕. Jobs die op een harde voorwaarde (functie of plaats) niet passen, tonen we niet.</p>`
          : `<p class="notice">We vonden geen duidelijke criteria in je vraag. Noem bijvoorbeeld een functie (“verpleegkundige”), een plaats (“rond Leuven”) of uren (“deeltijds”). We tonen intussen alle vacatures.</p>`}
      </section>`;
      headTitle = crit.length ? "passende jobs" : "vacatures";
    } else {
      const { results, place } = classicSearch();
      base = results;
      const what = state.wat.trim() ? ` voor <span class="mono">“${esc(state.wat.trim())}”</span>` : "";
      const where = place && !place.error ? ` in ${esc(place.label)}${place.type === "city" ? (state.radius ? ` <span class="muted" style="font-size:.7em">+ ${state.radius} km</span>` : "") : ""}` : "";
      headTitle = "vacatures" + what + where;
      if (place && place.error) top = `<p class="notice">We kennen de plaats “${esc(place.label)}” niet. Probeer een gemeente, postcode of provincie. We tonen jobs in heel België.</p>`;
    }
    const filtered = base.filter((r) => passFilters(r.job, state.filters));
    const sorted = sortResults(filtered);
    state.lastList = sorted.map((r) => r.job.id);
    state.lastResults = sorted;
    const hasDist = sorted.some((r) => r.dist != null);

    return `
    <section class="band compact" aria-hidden="true"></section>
    <div class="wrap"><div class="search-wrap">${searchPanel(false)}</div></div>
    <div class="wrap results-page">
      ${top}
      <div class="res-layout">
        ${filterPanel(base)}
        <section aria-live="polite">
          <div class="res-head">
            <h1><span class="mono">${sorted.length}</span> ${headTitle}</h1>
            <label class="sort">Sorteer
              <select id="f-sort" data-action="sort">
                <option value="relevantie" ${state.sort === "relevantie" ? "selected" : ""}>${isPrompt ? "Beste match" : "Relevantie"}</option>
                <option value="datum" ${state.sort === "datum" ? "selected" : ""}>Nieuwste eerst</option>
                <option value="loon" ${state.sort === "loon" ? "selected" : ""}>Hoogste loon</option>
                ${hasDist ? `<option value="afstand" ${state.sort === "afstand" ? "selected" : ""}>Dichtstbij</option>` : ""}
              </select>
            </label>
          </div>
          <div class="job-list">
            ${sorted.length ? sorted.map((r) => jobCard(r, { match: isPrompt })).join("") : `
              <div class="empty">
                <h2>Geen jobs gevonden</h2>
                <p class="muted">Maak je zoekopdracht ruimer: vergroot de straal, haal een filter of criterium weg of probeer een ander woord.</p>
                <button class="btn ghost" data-action="clear-filters">Wis alle filters</button>
              </div>`}
          </div>
        </section>
      </div>
    </div>`;
  }

  function renderDetail(id) {
    const job = byId[id];
    if (!job) return `<div class="wrap detail-page"><div class="empty"><h2>Deze vacature bestaat niet (meer)</h2><a class="btn primary" href="#resultaten" data-action="all-jobs">Bekijk alle vacatures</a></div></div>`;
    state.visited.add(id);
    store.set("jw-visited", Array.from(state.visited));

    const fromSearch = state.hasSearch && state.lastList.includes(id);
    const idx = state.lastList.indexOf(id);
    const prev = idx > 0 ? state.lastList[idx - 1] : null;
    const next = idx >= 0 && idx < state.lastList.length - 1 ? state.lastList[idx + 1] : null;

    let why = "";
    if (state.mode === "prompt" && state.prompt.trim()) {
      const crit = activeCriteria();
      if (crit.length) {
        const r = JW.scoreJobs([job], crit)[0] || (() => { const all = JW.scoreJobs([job], crit.map((c) => ({ ...c, hard: false })))[0]; return all; })();
        why = `
        <section class="why-box">
          <h2>Past bij je vraag: <span class="mono">${Math.round(r.score * 100)}%</span></h2>
          <ul class="reasons">${r.hits.map((h) => `<li class="ok">${esc(h.text)}</li>`).join("")}${r.misses.map((m) => `<li class="no">${esc(m.text)}</li>`).join("")}</ul>
        </section>`;
      }
    }

    const similar = JOBS.filter((j) => j.id !== id && (j.role === job.role || j.cat === job.cat))
      .map((j) => ({ job: j, dist: JW.distanceKm(job, j), same: j.role === job.role }))
      .sort((a, b) => (b.same - a.same) || a.dist - b.dist).slice(0, 3);

    const applied = state.applied[id];
    const langs = job.langs.map((l) => JW.LANG_LABEL[l]).join(", ");

    return `
    <div class="wrap detail-page">
      <nav class="crumbs" aria-label="Navigatie">
        ${fromSearch ? `<a href="#resultaten">← Terug naar resultaten</a><span>·</span><span class="mono">${idx + 1} / ${state.lastList.length}</span>
          ${prev ? `<a href="#job-${prev}">Vorige</a>` : ""}${next ? `<a href="#job-${next}">Volgende</a>` : ""}` : `<a href="#home">Jobwijs</a><span>/</span><a href="#resultaten" data-action="cat" data-cat="${job.cat}">${esc(job.catLabel)}</a><span>/</span><span>${esc(job.title)}</span>`}
      </nav>
      <header class="detail-head">
        ${logo(job.company, true)}
        <div>
          <h1>${esc(job.title)}</h1>
          <p class="company"><strong>${esc(job.company.name)}</strong> · ${esc(job.company.size)}</p>
          <div class="facts">
            <span>${ICON.pin}${esc(job.city)} <span class="muted">(${job.pc}, ${esc(job.prov)})</span></span>
            <span>${ICON.doc}${esc(JW.contractLabel(job.contract))}</span>
            <span>${ICON.clock}${job.regime === "voltijds" ? "Voltijds" : "Deeltijds"} · ${esc(job.hours)}</span>
            <span>${ICON.home}${remoteLabel(job.remote)}</span>
          </div>
          <div class="meta" style="margin-top:12px">
            ${job.knelpunt ? `<span class="tag knelpunt">${ICON.flame}Knelpuntberoep</span>` : ""}
            <span class="tag">${esc(job.catLabel)}</span>
            <span class="tag">${postedLabel(job.daysAgo)} geplaatst</span>
          </div>
        </div>
      </header>
      <div class="detail-layout">
        <article class="detail-body">
          ${why}
          <section><h2>De job</h2><p>${esc(job.intro)}</p></section>
          <section><h2>Wat ga je doen?</h2><ul>${job.tasks.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section>
          <section><h2>Wie zoeken we?</h2><ul>${job.profile.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section>
          <section>
            <h2>Wat bieden we?</h2>
            <p>Een brutomaandloon tussen <strong class="mono">${eur(job.salMin)}</strong> en <strong class="mono">${eur(job.salMax)}</strong> (${job.regime === "voltijds" ? "voltijds" : "voltijdse equivalent"}), volgens de barema's van ${esc(job.paritair === "Onderwijs" ? "het onderwijs" : job.paritair)} en je ervaring. Daarbovenop:</p>
            <ul class="benefits">${job.benefits.map((b) => `<li>${esc(JW.BENEFITS[b])}</li>`).join("") || "<li>Vakantiegeld en eindejaarspremie</li>"}</ul>
          </section>
          <section><h2>Over ${esc(job.company.name)}</h2><p>${esc(job.company.about)}</p></section>
        </article>
        <aside class="apply-card" aria-label="Solliciteren">
          <p class="big-sal">${eur(job.salMin)} – ${eur(job.salMax)}<small>bruto per maand</small></p>
          ${applied ? `<p class="applied">Je solliciteerde op ${esc(applied)}.</p>` : `<button class="btn primary block" data-action="apply" data-id="${id}">Solliciteer nu</button>`}
          <button class="btn ghost block" data-action="save" data-id="${id}" aria-pressed="${state.saved.has(id)}">${state.saved.has(id) ? ICON.bookmarkFill + " Bewaard" : ICON.bookmark + " Bewaar deze job"}</button>
          <dl class="dl">
            <dt>Referentie</dt><dd class="mono">${job.ref}</dd>
            <dt>Start</dt><dd>${esc(job.start)}</dd>
            <dt>Diploma</dt><dd>${eduLabel(job.edu)}</dd>
            <dt>Ervaring</dt><dd>${expLabel(job.exp)}</dd>
            <dt>Talen</dt><dd>${esc(langs)}</dd>
            <dt>Paritair comité</dt><dd class="mono">${esc(job.paritair)}</dd>
            <dt>Bekeken</dt><dd class="mono">${job.views}×</dd>
          </dl>
        </aside>
      </div>
      <section class="similar">
        <h2>Vergelijkbare jobs</h2>
        <div class="job-list">${similar.map((r) => jobCard({ job: r.job, dist: r.dist })).join("")}</div>
      </section>
    </div>`;
  }

  function renderSaved() {
    const list = Array.from(state.saved).map((id) => byId[id]).filter(Boolean);
    return `
    <div class="wrap results-page">
      <div class="res-head"><h1><span class="mono">${list.length}</span> bewaarde ${list.length === 1 ? "job" : "jobs"}</h1></div>
      <div class="job-list">
        ${list.length ? list.map((job) => jobCard({ job })).join("") : `
          <div class="empty">
            <h2>Nog niets bewaard</h2>
            <p class="muted">Klik op het bladwijzer-icoon bij een vacature om ze hier terug te vinden. Bewaarde jobs blijven in deze browser staan.</p>
            <a class="btn primary" href="#resultaten" data-action="all-jobs">Bekijk vacatures</a>
          </div>`}
      </div>
    </div>`;
  }

  /* ---------- Router ---------- */
  function route() {
    const h = (location.hash || "#home").slice(1);
    const app = $("#app");
    const prevRoute = state.lastRoute;
    if (prevRoute === "resultaten") state.resultsScroll = window.scrollY;
    let html;
    if (h.startsWith("job-")) html = renderDetail(h.slice(4));
    else if (h === "resultaten") html = renderResults();
    else if (h === "bewaard") html = renderSaved();
    else html = renderHome();
    app.innerHTML = html;
    document.title = h.startsWith("job-") && byId[h.slice(4)] ? byId[h.slice(4)].title + " · Jobwijs" : "Jobwijs";
    state.lastRoute = h;
    if (h === "resultaten" && prevRoute.startsWith("job-")) window.scrollTo(0, state.resultsScroll);
    else if (h !== prevRoute) window.scrollTo(0, 0);
    updateSavedCount();
  }

  function rerenderResults() {
    const y = window.scrollY;
    if (location.hash === "#resultaten") { $("#app").innerHTML = renderResults(); window.scrollTo(0, y); }
    else location.hash = "resultaten";
  }

  function go(hash) {
    if (location.hash === "#" + hash) route();
    else location.hash = hash;
  }

  function runClassic() {
    state.mode = "classic";
    state.hasSearch = true;
    state.sort = "relevantie";
    go("resultaten");
  }
  function runPrompt(text) {
    state.mode = "prompt";
    state.prompt = text;
    state.removed = new Set();
    state.filters = emptyFilters();
    state.hasSearch = true;
    state.sort = "relevantie";
    go("resultaten");
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
          <p class="muted" style="font-size:14px">Dit is een prototype: er werd niets verzonden.</p>
          <button class="btn primary" data-action="close-dialog">Sluiten</button>
        </div>`;
    }
  });

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action;
    if (a === "mode") {
      state.mode = el.dataset.mode;
      const isPrompt = state.mode === "prompt";
      $$(".tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.mode === state.mode)));
      $("#classic-form").hidden = isPrompt;
      $("#prompt-form").hidden = !isPrompt;
      (isPrompt ? $("#f-prompt") : $("#f-wat")).focus();
    } else if (a === "example") {
      const ta = $("#f-prompt");
      ta.value = el.dataset.text;
      ta.focus();
    } else if (a === "run-prompt") {
      runPrompt(el.dataset.text);
    } else if (a === "all-jobs") {
      e.preventDefault();
      Object.assign(state, { mode: "classic", wat: "", waar: "", radius: 25, filters: emptyFilters(), hasSearch: true, sort: "datum" });
      go("resultaten");
    } else if (a === "cat") {
      e.preventDefault();
      Object.assign(state, { mode: "classic", wat: "", waar: "", filters: emptyFilters(), hasSearch: true, sort: "datum" });
      state.filters.cat.add(el.dataset.cat);
      go("resultaten");
    } else if (a === "region") {
      e.preventDefault();
      Object.assign(state, { mode: "classic", wat: "", waar: el.dataset.region, radius: 25, filters: emptyFilters(), hasSearch: true, sort: "datum" });
      go("resultaten");
    } else if (a === "save") {
      e.preventDefault();
      const id = el.dataset.id;
      if (state.saved.has(id)) { state.saved.delete(id); toast("Verwijderd uit je bewaarde jobs"); }
      else { state.saved.add(id); toast("Bewaard. Je vindt deze job terug onder Bewaard"); }
      store.set("jw-saved", Array.from(state.saved));
      const y = window.scrollY;
      route();
      window.scrollTo(0, y);
    } else if (a === "remove-crit") {
      state.removed.add(el.dataset.id);
      rerenderResults();
    } else if (a === "restore-crit") {
      state.removed.delete(el.dataset.id);
      rerenderResults();
    } else if (a === "edit-prompt") {
      state.mode = "prompt";
      window.scrollTo(0, 0);
      const ta = $("#f-prompt");
      if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
    } else if (a === "clear-filters") {
      state.filters = emptyFilters();
      rerenderResults();
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
      if (k === "remote" || k === "knelpunt") f[k] = el.checked;
      else if (k === "minSal" || k === "posted") f[k] = +el.value;
      else if (el.checked) f[k].add(el.value);
      else f[k].delete(el.value);
      rerenderResults();
    } else if (el.id === "f-sort") {
      state.sort = el.value;
      rerenderResults();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && e.target.id === "f-prompt") {
      e.target.form.requestSubmit();
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
        <button class="btn primary full" type="submit">Verstuur sollicitatie</button>
      </form>`;
    dlg.showModal();
    setTimeout(() => $("#a-first").focus(), 30);
  }

  $("#apply-dialog").addEventListener("close", () => { if (location.hash.startsWith("#job-")) { const y = window.scrollY; route(); window.scrollTo(0, y); } });
  $("#apply-dialog").addEventListener("click", (e) => { if (e.target.id === "apply-dialog") e.target.close(); });

  window.addEventListener("hashchange", route);
  route();
})();
