const VERSION = "0.6.0";
const SAVE_KEY = "guerra-minima-save-v1";
const W = 40;
const H = 28;
const TW = 48;
const TH = 24;
const MAX_AP = 6;
const MAX_PLANS = 5;
const TERRITORY_WIN = 0.60;
const START_MONEY = 12;
const CAPITAL_TROOPS = 6;
const FORT_COST = 4;
const POSTS = [idx(12,14), idx(20,14), idx(27,14)];
const POST_NAMES = ["Paso Oeste", "Valle Central", "Paso Este"];
function postCount(owner) { return POSTS.filter(i => state.cells[i].owner === owner).length; }
function initializeCampaign() {
  state.milestones ||= {p:[], ai:[]};
  for (const i of POSTS) state.cells[i].building = "outpost";
  for (const c of state.cells) c.fort = !!c.fort;
}
function rewardMilestones(owner) {
  const checks = [territoryCount(owner) >= 30, postCount(owner) >= 1, postCount(owner) >= 2];
  const names = ["30 territorios", "primer puesto", "dos puestos"];
  const purse = owner === "p" ? state.resources : state.aiResources;
  checks.forEach((done,i) => {
    if (done && !state.milestones[owner].includes(i)) {
      state.milestones[owner].push(i); purse.money += 6;
      if (owner === "p") addLog("Hito: " + names[i] + ". +¤6 (una sola vez).");
    }
  });
}

const COUNTRIES = [
["Afganistán","AF"],["Albania","AL"],["Alemania","DE"],["Andorra","AD"],["Angola","AO"],["Antigua y Barbuda","AG"],["Arabia Saudita","SA"],["Argelia","DZ"],["Argentina","AR"],["Armenia","AM"],["Australia","AU"],["Austria","AT"],["Azerbaiyán","AZ"],["Bahamas","BS"],["Bangladés","BD"],["Barbados","BB"],["Baréin","BH"],["Bélgica","BE"],["Belice","BZ"],["Benín","BJ"],["Bielorrusia","BY"],["Birmania","MM"],["Bolivia","BO"],["Bosnia y Herzegovina","BA"],["Botsuana","BW"],["Brasil","BR"],["Brunéi","BN"],["Bulgaria","BG"],["Burkina Faso","BF"],["Burundi","BI"],["Bután","BT"],["Cabo Verde","CV"],["Camboya","KH"],["Camerún","CM"],["Canadá","CA"],["Catar","QA"],["Chad","TD"],["Chile","CL"],["China","CN"],["Chipre","CY"],["Colombia","CO"],["Comoras","KM"],["Corea del Norte","KP"],["Corea del Sur","KR"],["Costa de Marfil","CI"],["Costa Rica","CR"],["Croacia","HR"],["Cuba","CU"],["Dinamarca","DK"],["Dominica","DM"],["Ecuador","EC"],["Egipto","EG"],["El Salvador","SV"],["Emiratos Árabes Unidos","AE"],["Eritrea","ER"],["Eslovaquia","SK"],["Eslovenia","SI"],["España","ES"],["Estados Unidos","US"],["Estonia","EE"],["Esuatini","SZ"],["Etiopía","ET"],["Filipinas","PH"],["Finlandia","FI"],["Fiyi","FJ"],["Francia","FR"],["Gabón","GA"],["Gambia","GM"],["Georgia","GE"],["Ghana","GH"],["Granada","GD"],["Grecia","GR"],["Guatemala","GT"],["Guinea","GN"],["Guinea-Bisáu","GW"],["Guinea Ecuatorial","GQ"],["Guyana","GY"],["Haití","HT"],["Honduras","HN"],["Hungría","HU"],["India","IN"],["Indonesia","ID"],["Irak","IQ"],["Irán","IR"],["Irlanda","IE"],["Islandia","IS"],["Islas Marshall","MH"],["Islas Salomón","SB"],["Israel","IL"],["Italia","IT"],["Jamaica","JM"],["Japón","JP"],["Jordania","JO"],["Kazajistán","KZ"],["Kenia","KE"],["Kirguistán","KG"],["Kiribati","KI"],["Kuwait","KW"],["Laos","LA"],["Lesoto","LS"],["Letonia","LV"],["Líbano","LB"],["Liberia","LR"],["Libia","LY"],["Liechtenstein","LI"],["Lituania","LT"],["Luxemburgo","LU"],["Macedonia del Norte","MK"],["Madagascar","MG"],["Malasia","MY"],["Malaui","MW"],["Maldivas","MV"],["Malí","ML"],["Malta","MT"],["Marruecos","MA"],["Mauricio","MU"],["Mauritania","MR"],["México","MX"],["Micronesia","FM"],["Moldavia","MD"],["Mónaco","MC"],["Mongolia","MN"],["Montenegro","ME"],["Mozambique","MZ"],["Namibia","NA"],["Nauru","NR"],["Nepal","NP"],["Nicaragua","NI"],["Níger","NE"],["Nigeria","NG"],["Noruega","NO"],["Nueva Zelanda","NZ"],["Omán","OM"],["Países Bajos","NL"],["Pakistán","PK"],["Palaos","PW"],["Palestina","PS"],["Panamá","PA"],["Papúa Nueva Guinea","PG"],["Paraguay","PY"],["Perú","PE"],["Polonia","PL"],["Portugal","PT"],["Reino Unido","GB"],["República Centroafricana","CF"],["República Checa","CZ"],["República del Congo","CG"],["República Democrática del Congo","CD"],["República Dominicana","DO"],["Ruanda","RW"],["Rumania","RO"],["Rusia","RU"],["Samoa","WS"],["San Cristóbal y Nieves","KN"],["San Marino","SM"],["San Vicente y las Granadinas","VC"],["Santa Lucía","LC"],["Santo Tomé y Príncipe","ST"],["Senegal","SN"],["Serbia","RS"],["Seychelles","SC"],["Sierra Leona","SL"],["Singapur","SG"],["Siria","SY"],["Somalia","SO"],["Sri Lanka","LK"],["Sudáfrica","ZA"],["Sudán","SD"],["Sudán del Sur","SS"],["Suecia","SE"],["Suiza","CH"],["Surinam","SR"],["Tailandia","TH"],["Tanzania","TZ"],["Tayikistán","TJ"],["Timor Oriental","TL"],["Togo","TG"],["Tonga","TO"],["Trinidad y Tobago","TT"],["Túnez","TN"],["Turkmenistán","TM"],["Turquía","TR"],["Tuvalu","TV"],["Ucrania","UA"],["Uganda","UG"],["Uruguay","UY"],["Uzbekistán","UZ"],["Vanuatu","VU"],["Vaticano","VA"],["Venezuela","VE"],["Vietnam","VN"],["Yemen","YE"],["Yibuti","DJ"],["Zambia","ZM"],["Zimbabue","ZW"]
];

const TERRAIN_LABELS = {
  water:"Costa",
  plains:"Llanura",
  valley:"Valle fértil",
  forest:"Bosque",
  hills:"Colinas",
  scrub:"Matorral"
};

const el = (id) => document.getElementById(id);
const canvas = el("world");
const ctx = canvas.getContext("2d", { alpha:false });
const mapShell = el("mapShell");
let viewW = 1;
let viewH = 1;
let dpr = 1;
let selected = null;
let terrain = [];
let state = null;
let camera = { x:0, y:-70 };
let zoom = 1;
const MIN_ZOOM = 0.55;
const MAX_ZOOM = 1.8;
const pointers = new Map();
let pinchStart = null;
let dragging = false;
let moved = false;
let pointerStart = null;
let cameraStart = null;
let moveSource = null;
let pendingMove = null;
let pendingAttack = null;

let toastTimer = null;

function flag(code) {
  return String.fromCodePoint(...code.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0)));
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function hash(seed, x, y) {
  let n = (seed ^ Math.imul(x + 37, 374761393) ^ Math.imul(y + 101, 668265263)) >>> 0;
  n = Math.imul(n ^ n >>> 13, 1274126177);
  return ((n ^ n >>> 16) >>> 0) / 4294967295;
}

function idx(x, y) { return y * W + x; }
function xy(i) { return { x:i % W, y:Math.floor(i / W) }; }
function inside(x, y) { return x >= 0 && y >= 0 && x < W && y < H; }
function isLand(i) { return terrain[i] !== "water"; }

function neighbors(i) {
  const p = xy(i);
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  return dirs.map((d) => ({x:p.x+d[0], y:p.y+d[1]}))
    .filter((q) => inside(q.x,q.y)).map((q) => idx(q.x,q.y));
}

function adjacentOwner(i, owner) {
  return neighbors(i).some((n) => state.cells[n].owner === owner);
}

function generateTerrain(seed) {
  const out = new Array(W * H);
  const cx = (W - 1) / 2;
  const cy = (H - 1) / 2;
  for (let y=0; y<H; y++) {
    for (let x=0; x<W; x++) {
      const i = idx(x,y);
      const ex = (x-cx)/(W*.52);
      const ey = (y-cy)/(H*.56);
      const edge = ex*ex + ey*ey;
      if (edge > 1 || (edge > .82 && hash(seed,x,y) > .45)) {
        out[i] = "water";
        continue;
      }
      const r = hash(seed,x,y);
      const valleyDist = Math.abs(x - cx + Math.sin(y*.55)*1.2);
      if (valleyDist < 3.1) out[i] = r < .12 ? "scrub" : "valley";
      else if (r < .20) out[i] = "forest";
      else if (r > .84) out[i] = "hills";
      else if (r < .29) out[i] = "scrub";
      else out[i] = "plains";
    }
  }
  const force = [[6,Math.floor(H/2)],[W-7,Math.floor(H/2)]];
  force.forEach((p) => {
    for (let yy=p[1]-3; yy<=p[1]+3; yy++) for (let xx=p[0]-3; xx<=p[0]+3; xx++) {
      if (inside(xx,yy)) out[idx(xx,yy)] = hash(seed,xx,yy) > .72 ? "forest" : "plains";
    }
  });
  return out;
}

function conflictName(seed) {
  const a = ["Conflicto","Disputa","Guerra","Crisis","Incidente"];
  const b = ["del Valle","del Paso","de las Ruinas","de la Cuenca","de las Dos Colinas","del Río Seco","de la Frontera"];
  const c = ["Ceniza","Baja","Vieja","del Norte","Gris","de Aram","del Ciervo","de Piedra","Clara","del Viento"];
  const r = mulberry32(seed ^ 0x4a39b70d);
  return a[Math.floor(r()*a.length)] + " " + b[Math.floor(r()*b.length)] + " " + c[Math.floor(r()*c.length)];
}

function newState() {
  const seed = (crypto.getRandomValues(new Uint32Array(1))[0]) >>> 0;
  terrain = generateTerrain(seed);
  const r = mulberry32(seed);
  const pIndex = Math.floor(r()*COUNTRIES.length);
  let eIndex = Math.floor(r()*COUNTRIES.length);
  if (eIndex === pIndex) eIndex = (eIndex + 1) % COUNTRIES.length;
  const playerCapital = idx(6, Math.floor(H/2));
  const enemyCapital = idx(W-7, Math.floor(H/2));
  const cells = new Array(W*H).fill(null).map(() => ({ owner:null, building:null, troops:0, ruin:false, explored:false }));

  function claimAround(center, owner) {
    const p = xy(center);
    for (let y=p.y-2; y<=p.y+2; y++) for (let x=p.x-2; x<=p.x+2; x++) {
      if (!inside(x,y)) continue;
      const i = idx(x,y);
      if (isLand(i) && Math.abs(x-p.x)+Math.abs(y-p.y) <= 3) {
        cells[i].owner = owner;
        cells[i].troops = 1;
      }
    }
  }

  claimAround(playerCapital, "p");
  claimAround(enemyCapital, "ai");
  cells[playerCapital].building = "capital";
  cells[playerCapital].troops = CAPITAL_TROOPS;
  cells[enemyCapital].building = "capital";
  cells[enemyCapital].troops = CAPITAL_TROOPS;

  const fresh = {
    schema:1,
    version:VERSION,
    seed,
    name:conflictName(seed),
    playerCountry:COUNTRIES[pIndex],
    enemyCountry:COUNTRIES[eIndex],
    playerCapital,
    enemyCapital,
    cells,
    ap:MAX_AP,
    day:1,
    turn:1,
    resources:{ money:START_MONEY },
    aiResources:{ money:START_MONEY },
    winner:null,
    victoryReason:null,
    log:["Tenés tiempo. Leé el mapa, armá tu plan y cerrá el turno cuando quieras."],
    milestones:{p:[],ai:[]},
    plans:[],
    lastRivalReport:[],
    turnHistory:[]
  };
  for (const i of POSTS) fresh.cells[i].building = "outpost";
  return fresh;
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schema !== 1 || !Array.isArray(parsed.cells) || parsed.cells.length !== W*H) return false;
    state = parsed;
    terrain = generateTerrain(state.seed);
    state.version = VERSION;
    const oldPlayerMoney = Number(state.resources?.money);
    const oldAiMoney = Number(state.aiResources?.money);
    state.resources = { money:Number.isFinite(oldPlayerMoney) ? oldPlayerMoney : START_MONEY };
    state.aiResources = { money:Number.isFinite(oldAiMoney) ? oldAiMoney : START_MONEY };
    state.winner = state.winner || null;
    state.victoryReason = state.victoryReason || null;
    state.plans = Array.isArray(state.plans) ? state.plans.filter(Number.isInteger).slice(0,MAX_PLANS) : [];
    state.lastRivalReport = Array.isArray(state.lastRivalReport) ? state.lastRivalReport : [];
    state.turnHistory = Array.isArray(state.turnHistory) ? state.turnHistory.slice(-12) : [];
    state.cells.forEach((c,i) => {
      c.ruin = false;
      c.explored = false;
      if (c.building && c.building !== "capital") c.building = null;
      if (c.owner && (!Number.isFinite(c.troops) || c.troops < 1)) c.troops = i === state.playerCapital || i === state.enemyCapital ? CAPITAL_TROOPS : 1;
      if (!c.owner) c.troops = 0;
    });
    state.cells[state.playerCapital].building = "capital";
    state.cells[state.enemyCapital].building = "capital";
    initializeCampaign();
    return true;
  } catch {
    return false;
  }
}

function resetGame() {
  state = newState();
  selected = null;
  moveSource = null;
  pendingMove = null;
  pendingAttack = null;
  resetGesture();
  zoom = 1;
  centerOnPlayer();
  save();
  syncUI();
  closeDialog("menu");
  toast("Nuevo continente generado.");
}

function territoryCount(owner) {
  return state.cells.reduce((n,c,i) => n + (isLand(i) && c.owner === owner ? 1 : 0), 0);
}

function landCount() {
  let total = 0;
  for (let i=0; i<state.cells.length; i++) if (isLand(i)) total++;
  return total;
}

function territoryShare(owner) {
  const total = landCount();
  return total ? territoryCount(owner) / total : 0;
}

function troopTotal(owner) {
  return state.cells.reduce((n,c) => n + (c.owner === owner ? (c.troops || 0) : 0), 0);
}

function incomeFor(owner) {
  return Math.max(2, Math.floor(territoryCount(owner) / 5));
}

function strongestAdjacent(i, owner) {
  const candidates = neighbors(i).filter((n) => state.cells[n].owner === owner && state.cells[n].troops > 1);
  if (!candidates.length) return null;
  candidates.sort((a,b) => state.cells[b].troops - state.cells[a].troops);
  return candidates[0];
}

function syncUI() {
  el("warName").textContent = state.name;
  el("playerCountry").textContent = state.playerCountry[0];
  el("enemyCountry").textContent = state.enemyCountry[0];
  el("playerFlag").textContent = flag(state.playerCountry[1]);
  el("enemyFlag").textContent = flag(state.enemyCountry[1]);
  el("dayLabel").textContent = "Día " + state.day + " · T" + state.turn;
  el("apLabel").textContent = state.ap + "/" + MAX_AP;
  el("versionLabel").textContent = "v" + VERSION;
  el("lastEvent").textContent = state.log[0] || "Sin reloj: revisá el mapa y cerrá el turno cuando quieras.";

  const pct = Math.round(territoryShare("p") * 100);
  el("resources").innerHTML =
    '<div class="resource"><span>¤</span><b>' + state.resources.money + '</b><small>monedas</small></div>' +
    '<div class="resource"><span>♟</span><b>' + troopTotal("p") + '</b><small>tropas</small></div>' +
    '<div class="resource"><span>⚑</span><b>' + pct + '%</b><small>territorio · meta 60%</small></div>';

  const threats = state.cells.filter((c,i) => c.owner === "p" && strongestAdjacent(i,"ai") != null).length;
  el("threatLabel").textContent = threats ? "⚠ " + threats + " sectores bajo amenaza" : "Sin ataques posibles del rival en tu frontera";
  el("threatLabel").classList[threats ? "add" : "remove"]("danger");
  const reportBtn = el("reportBtn");
  if (reportBtn) reportBtn.textContent = state.lastRivalReport.length ? "☷ RIVAL · " + state.lastRivalReport.length : "☷ RIVAL";
  refreshReportUI();
  updateSelectionUI();
}

function sectorLabel(i) {
  const p = xy(i);
  return "sector " + (p.x+1) + "." + (p.y+1);
}

function ownerLabel(owner) {
  if (owner === "p") return state.playerCountry[0];
  if (owner === "ai") return state.enemyCountry[0];
  return "Territorio neutral";
}

function updateSelectionUI() {
  if (selected == null) {
    el("selectionTitle").textContent = moveSource == null ? "Tocá una zona del mapa" : "Elegí un territorio vecino";
    el("selectionMeta").textContent = moveSource == null ? "Los números sobre el mapa son tropas." : "Mover transfiere 1 tropa y gasta 1 acción.";
  } else {
    const c = state.cells[selected];
    const pos = xy(selected);
    let title = TERRAIN_LABELS[terrain[selected]];
    if (c.building === "capital") title = "Cuartel de " + ownerLabel(c.owner);
    if (c.building === "outpost") title = "★ " + POST_NAMES[POSTS.indexOf(selected)];
    const bits = [ownerLabel(c.owner), "sector " + (pos.x+1) + "." + (pos.y+1)];
    if (c.owner) bits.push((c.troops || 0) + ((c.troops || 0) === 1 ? " tropa" : " tropas"));
    if (c.building === "outpost") bits.push("objetivo estratégico");
    if (c.fort) bits.push("escudo: absorbe 1 derrota defensiva");
    if (c.owner === null && isLand(selected)) {
      bits.push(strongestAdjacent(selected,"p") != null ? "PODÉS EXPANDIR" : "necesitás 2 tropas en un vecino");
    }
    if (c.owner === "ai" && adjacentOwner(selected,"p")) {
      const src = strongestAdjacent(selected,"p");
      bits.push(src != null ? "PODÉS ATACAR" : "frontera rival · necesitás 2 tropas");
    }
    if (c.owner === "ai" && c.building === "capital") bits.push("tomarlo gana la partida");
    if (c.owner === "p" && selected === state.playerCapital) bits.push("protegé este cuartel");
    if (c.owner === "ai" && strongestAdjacent(selected,"p") != null) {
      const from = xy(strongestAdjacent(selected,"p"));
      bits.push("desde " + (from.x+1) + "." + (from.y+1) + " · ganar dado: 42%");
    }
    el("selectionTitle").textContent = title;
    el("selectionMeta").textContent = bits.join(" · ");
  }

  document.querySelectorAll(".actions button").forEach((button) => {
    button.disabled = !canAction(button.dataset.action);
  });
  const planBtn = el("planBtn");
  if (planBtn) {
    planBtn.disabled = selected == null || !isLand(selected);
    planBtn.textContent = selected != null && state.plans.includes(selected) ? "✓ PLAN" : "＋ PLAN";
  }
  const clearPlanBtn = el("clearPlanBtn");
  if (clearPlanBtn) clearPlanBtn.disabled = !state.plans.length;
  const reinforceLabel = el("reinforceLabel");
  if (reinforceLabel) reinforceLabel.textContent = selected === state.playerCapital ? "Reforzar +2" : "Reforzar +1";
  const storeFortify = el("storeFortifyBtn");
  if (storeFortify) storeFortify.disabled = !canAction("fortify");
}

function canAction(action) {
  if (state.winner || state.ap <= 0 || selected == null) return false;
  const c = state.cells[selected];
  if (action === "expand") return isLand(selected) && c.owner === null && strongestAdjacent(selected,"p") != null;
  if (action === "fortify") return c.owner === "p" && !c.fort && state.resources.money >= FORT_COST;
  if (action === "reinforce") return c.owner === "p";
  if (action === "move") return c.owner === "p" && c.troops > 1;
  if (action === "attack") return c.owner === "ai" && strongestAdjacent(selected,"p") != null;
  return false;
}

function addLog(text) {
  state.log.unshift(text);
  state.log = state.log.slice(0,8);
  el("lastEvent").textContent = text;
}

function togglePlan() {
  if (selected == null || !isLand(selected)) {
    toast("Seleccioná primero un territorio del mapa.");
    return;
  }
  const pos = state.plans.indexOf(selected);
  if (pos >= 0) {
    state.plans.splice(pos,1);
    toast("Marca de planificación quitada.");
  } else {
    if (state.plans.length >= MAX_PLANS) {
      toast("Podés marcar hasta " + MAX_PLANS + " sectores por turno.");
      return;
    }
    state.plans.push(selected);
    toast("Plan " + state.plans.length + " marcado en " + sectorLabel(selected) + ".");
  }
  save();
  syncUI();
}

function clearPlans() {
  state.plans = [];
  save();
  syncUI();
  toast("Planificación limpiada.");
}

function refreshReportUI() {
  const body = el("reportBody");
  if (!body || !state) return;
  const reports = state.turnHistory.length
    ? state.turnHistory.slice().reverse().slice(0,5)
    : (state.lastRivalReport.length ? [{turn:Math.max(1,state.turn-1),rival:state.lastRivalReport}] : []);
  if (!reports.length) {
    body.innerHTML = '<p class="empty-report">Todavía no hay un turno rival para revisar.</p>';
    return;
  }
  body.innerHTML = reports.map((report,ri) =>
    '<section class="report-turn"><small>RONDA '+report.turn+'</small>' +
    report.rival.map((line,i) =>
      '<button class="report-event" data-report-turn="'+ri+'" data-report-index="'+i+'"><b>'+(i+1)+'.</b> '+line.text+'</button>'
    ).join("") + '</section>'
  ).join("");
  body.querySelectorAll(".report-event").forEach((button) => button.addEventListener("click",() => {
    const report = reports[Number(button.dataset.reportTurn)];
    const item = report?.rival?.[Number(button.dataset.reportIndex)];
    if (item && Number.isInteger(item.tile)) {
      selected = item.tile;
      centerOnTile(item.tile);
      updateSelectionUI();
      closeDialog("report");
    }
  }));
}

function useAction() {
  state.ap = Math.max(0, state.ap - 1);
}

function setWinner(owner, reason) {
  if (state.winner) return;
  state.winner = owner;
  state.victoryReason = reason;
  const who = owner === "p" ? "Ganaste" : "Perdiste";
  addLog(who + ": " + reason + ".");
  save();
  syncUI();
  showVictory();
}

function checkVictory() {
  if (state.winner) return state.winner;
  rewardMilestones("p");
  rewardMilestones("ai");
  if (state.cells[state.enemyCapital].owner === "p") {
    setWinner("p","tomaste el cuartel rival");
    return "p";
  }
  if (state.cells[state.playerCapital].owner === "ai") {
    setWinner("ai","el rival tomó tu cuartel");
    return "ai";
  }
  if (territoryShare("p") >= TERRITORY_WIN) {
    setWinner("p","controlás al menos el 60% del continente");
    return "p";
  }
  if (territoryShare("ai") >= TERRITORY_WIN) {
    setWinner("ai","el rival controla al menos el 60% del continente");
    return "ai";
  }
  return null;
}

function showVictory() {
  if (!state?.winner) return;
  const title = state.winner === "p" ? "VICTORIA" : "DERROTA";
  el("victoryTitle").textContent = title;
  el("victoryText").textContent = state.victoryReason + ".";
  if (!el("victoryDialog").open) el("victoryDialog").showModal();
}

function resolveCombat(attacker, target) {
  const defender = attacker === "p" ? "ai" : "p";
  const source = strongestAdjacent(target, attacker);
  if (source == null || state.cells[target].owner !== defender) return null;

  const attackRoll = 1 + Math.floor(Math.random()*6);
  const defendRoll = 1 + Math.floor(Math.random()*6);
  const sourceCell = state.cells[source];
  const targetCell = state.cells[target];
  const targetWasCapital = targetCell.building === "capital";
  let message = "";

  if (attackRoll > defendRoll && targetCell.fort) {
    targetCell.fort = false;
    message = "rompió la fortificación (" + attackRoll + "-" + defendRoll + "); no hubo bajas";
  } else if (attackRoll > defendRoll) {
    targetCell.troops = Math.max(0, targetCell.troops - 1);
    if (targetCell.troops === 0) {
      sourceCell.troops -= 1;
      targetCell.owner = attacker;
      targetCell.troops = 1;
      message = "conquistó " + (targetWasCapital ? "el cuartel" : "un sector") + " (" + attackRoll + "-" + defendRoll + ")";
    } else {
      message = "hizo perder 1 tropa al defensor (" + attackRoll + "-" + defendRoll + ")";
    }
  } else {
    sourceCell.troops -= 1;
    message = "perdió 1 tropa atacando (" + attackRoll + "-" + defendRoll + ")";
  }
  return {source,target,message,attackRoll,defendRoll};
}

function beginMove() {
  if (!canAction("move")) return;
  moveSource = selected;
  updateSelectionUI();
  toast("Elegí un territorio propio vecino para mover 1 tropa.");
}

function finishMove(target) {
  if (moveSource == null) return false;
  const source = moveSource;
  moveSource = null;
  if (state.winner || state.ap <= 0) return false;
  if (target == null || target === source || !neighbors(source).includes(target) || state.cells[target].owner !== "p" || state.cells[source].troops <= 1) {
    toast("Movimiento cancelado: elegí un territorio propio vecino.");
    return false;
  }
  pendingMove = {source,target};
  const max = state.cells[source].troops - 1;
  const input = el("moveAmount");
  input.max = String(max);
  input.value = String(Math.min(max, Math.max(1, Math.ceil(max/2))));
  el("movePreview").textContent = sectorLabel(source) + " → " + sectorLabel(target) +
    " · quedan " + (state.cells[source].troops - Number(input.value)) +
    " · llegan " + (state.cells[target].troops + Number(input.value));
  el("moveDialog").showModal();
  return true;
}

function refreshMovePreview() {
  if (!pendingMove) return;
  const {source,target} = pendingMove;
  const input = el("moveAmount");
  const max = state.cells[source].troops - 1;
  let amount = Math.max(1, Math.min(max, Number(input.value) || 1));
  input.value = String(amount);
  el("moveAmountLabel").textContent = amount + (amount === 1 ? " tropa" : " tropas");
  el("movePreview").textContent = sectorLabel(source) + " → " + sectorLabel(target) +
    " · quedan " + (state.cells[source].troops - amount) +
    " · llegan " + (state.cells[target].troops + amount);
}

function confirmMove() {
  if (!pendingMove || state.winner || state.ap <= 0) return;
  const {source,target} = pendingMove;
  const max = state.cells[source].troops - 1;
  const amount = Math.max(1, Math.min(max, Number(el("moveAmount").value) || 1));
  state.cells[source].troops -= amount;
  state.cells[target].troops += amount;
  pendingMove = null;
  selected = target;
  useAction();
  addLog("Moviste " + amount + (amount === 1 ? " tropa" : " tropas") + " a " + sectorLabel(target) + ".");
  closeDialog("move");
  save();
  syncUI();
}

function requestAttack() {
  if (!canAction("attack")) {
    toast("Ese territorio no se puede atacar ahora.");
    return;
  }
  const target = selected;
  const source = strongestAdjacent(target,"p");
  pendingAttack = {source,target};
  const a = state.cells[source];
  const d = state.cells[target];
  el("attackPreview").textContent =
    sectorLabel(source) + " (" + a.troops + " tropas) → " + sectorLabel(target) + " (" + d.troops + " tropas)" +
    (d.fort ? " · defensor fortificado" : "") +
    " · cada lado tira 1d6 · ganás esta tirada con 15/36 (42%).";
  el("attackDialog").showModal();
}

function confirmAttack() {
  if (!pendingAttack || state.winner || state.ap <= 0) return;
  const target = pendingAttack.target;
  selected = target;
  pendingAttack = null;
  closeDialog("attack");
  const result = resolveCombat("p",target);
  addLog(result ? "Ataque: " + result.message + "." : "El ataque dejó de estar disponible.");
  useAction();
  checkVictory();
  save();
  syncUI();
}

function act(action) {
  if (action === "move") {
    beginMove();
    return;
  }
  if (action === "attack") {
    requestAttack();
    return;
  }
  if (!canAction(action)) {
    toast("Esa acción no está disponible en la zona seleccionada.");
    return;
  }

  moveSource = null;
  const c = state.cells[selected];
  const t = terrain[selected];

  if (action === "expand") {
    const source = strongestAdjacent(selected,"p");
    state.cells[source].troops -= 1;
    c.owner = "p";
    c.troops = 1;
    addLog("Expandiste la frontera hacia " + TERRAIN_LABELS[t].toLowerCase() + ".");
  }

  if (action === "reinforce") {
    const gain = selected === state.playerCapital ? 2 : 1;
    c.troops += gain;
    addLog("Reforzaste " + sectorLabel(selected) + ": +" + gain + (gain === 1 ? " tropa" : " tropas") + " gratis.");
  }

  if (action === "fortify") {
    state.resources.money -= FORT_COST; c.fort = true;
    addLog("Fortificación lista: absorbe una derrota al defender. Costó ¤4.");
  }

  useAction();
  checkVictory();
  save();
  syncUI();
}

function grantIncome(owner) {
  const gain = incomeFor(owner);
  if (owner === "p") state.resources.money += gain;
  else state.aiResources.money += gain;
  return gain;
}

function aiMoveTowardPlayer() {
  const options = [];
  for (let i=0; i<state.cells.length; i++) {
    const c = state.cells[i];
    if (c.owner !== "ai" || c.troops <= 1) continue;
    const from = xy(i);
    const fromDist = Math.abs(from.x-xy(state.playerCapital).x) + Math.abs(from.y-xy(state.playerCapital).y);
    for (const n of neighbors(i)) {
      if (state.cells[n].owner !== "ai") continue;
      const to = xy(n);
      const toDist = Math.abs(to.x-xy(state.playerCapital).x) + Math.abs(to.y-xy(state.playerCapital).y);
      if (toDist < fromDist) options.push([i,n,toDist]);
    }
  }
  if (!options.length) return false;
  options.sort((a,b) => a[2]-b[2]);
  const [from,to] = options[Math.floor(Math.random()*Math.min(5,options.length))];
  state.cells[from].troops -= 1;
  state.cells[to].troops += 1;
  return true;
}

function aiTurn() {
  const note = [];
  const record = (text,tile=null) => note.push({text,tile});
  for (let move=0; move<MAX_AP && !state.winner; move++) {
    const attackables = [];
    const expandables = [];
    const reinforceables = [];
    for (let i=0; i<state.cells.length; i++) {
      const c = state.cells[i];
      if (!isLand(i)) continue;
      if (c.owner === "p" && strongestAdjacent(i,"ai") != null) attackables.push(i);
      if (c.owner === null && strongestAdjacent(i,"ai") != null) expandables.push(i);
      if (c.owner === "ai") reinforceables.push(i);
    }

    attackables.sort((a,b) => (a === state.playerCapital ? -1 : b === state.playerCapital ? 1 : state.cells[a].troops-state.cells[b].troops));
    if (attackables.length && (attackables[0] === state.playerCapital || Math.random() < .55)) {
      const i = attackables[0];
      const result = resolveCombat("ai",i);
      if (result) record("Atacó " + sectorLabel(i) + ": " + result.message + ".", i);
      checkVictory();
      continue;
    }

    if (expandables.length && Math.random() < .62) {
      const targets = POSTS.filter(i => state.cells[i].owner !== "ai");
      const distance = i => Math.min(...(targets.length ? targets : [state.playerCapital]).map(t => Math.abs(xy(i).x-xy(t).x)+Math.abs(xy(i).y-xy(t).y)));
      expandables.sort((a,b) => distance(a)-distance(b));
      const i = expandables[0];
      const source = strongestAdjacent(i,"ai");
      state.cells[source].troops -= 1;
      state.cells[i].owner = "ai";
      state.cells[i].troops = 1;
      record("Expandió su frontera hacia " + sectorLabel(i) + ".", i);
      checkVictory();
      continue;
    }

    const exposedPost = reinforceables.find(i => (POSTS.includes(i) || i === state.enemyCapital) && !state.cells[i].fort && adjacentOwner(i,"p"));
    if (exposedPost != null && state.aiResources.money >= FORT_COST) {
      state.cells[exposedPost].fort = true; state.aiResources.money -= FORT_COST;
      record("Fortificó " + sectorLabel(exposedPost) + ".", exposedPost); continue;
    }
    if (reinforceables.length) {
      const frontier = reinforceables.filter((i) => neighbors(i).some((n) => state.cells[n].owner !== "ai" && isLand(n)));
      const pool = frontier.length ? frontier : reinforceables;
      const goals = POSTS.filter(i => state.cells[i].owner !== "ai");
      const score = i => Math.min(...(goals.length ? goals : [state.playerCapital]).map(t => Math.abs(xy(i).x-xy(t).x)+Math.abs(xy(i).y-xy(t).y))) + state.cells[i].troops*2;
      pool.sort((a,b) => score(a)-score(b));
      const i = pool[0];
      state.cells[i].troops += 1;
      record("Reforzó " + sectorLabel(i) + ".", i);
      continue;
    }

    if (aiMoveTowardPlayer()) record("Movió tropas hacia tu frente.");
    else record("Consolidó posiciones.");
  }
  return note;
}

function requestEndTurn() {
  if (state.winner) return showVictory();
  const copy = el("endTurnCopy");
  const used = MAX_AP - state.ap;
  const planCount = state.plans.length;
  copy.textContent = "Usaste " + used + " de " + MAX_AP + " acciones. " +
    (state.ap ? "Te quedan " + state.ap + ". " : "") +
    (planCount ? "Tenés " + planCount + " marcas de planificación activas. " : "") +
    "No hay reloj: cerrá solamente cuando estés conforme.";
  el("endTurnDialog").showModal();
}

function endTurn() {
  if (state.winner) return showVictory();
  moveSource = null;
  pendingMove = null;
  pendingAttack = null;
  state.plans = [];
  grantIncome("ai");
  const note = aiTurn();
  state.lastRivalReport = note;
  if (state.winner) {
    save();
    syncUI();
    return;
  }
  state.turn++;
  state.day++;
  state.ap = MAX_AP;
  const playerIncome = grantIncome("p");
  const compact = note.length ? note.slice(0,2).map(x=>x.text).join(" · ") : "Consolidó su territorio.";
  state.turnHistory.push({turn:state.turn-1, rival:note, income:playerIncome});
  state.turnHistory = state.turnHistory.slice(-12);
  addLog("Rival: " + compact + " Vos recibís ¤" + playerIncome + ".");
  save();
  syncUI();
  toast("Tu turno. Sin reloj · ingreso ¤" + playerIncome + ".");
}

function terrainColor(t, x, y) {
  const palette = {water:["#168eea","#198fe8"], valley:["#bbeb35","#b5e52e"], forest:["#81d719","#8adc1e"], hills:["#ffb52b","#f7aa23"], scrub:["#d2c83b","#d9ce41"], plains:["#d6e74a","#cee344"]};
  return palette[t][hash(state.seed ^ 0xabc123,x,y) > .5 ? 1 : 0];
}

// Deterministic ink marks stay attached to the terrain while the camera moves.
function drawGroundInk(p,t,x,y) {
  ctx.save(); ctx.translate(p.x,p.y); ctx.scale(zoom,zoom);
  ctx.strokeStyle = t === "water" ? "#075296" : "#24300d";
  ctx.lineWidth = .55;
  ctx.beginPath();
  for (let k=0;k<12;k++) {
    const u=hash(state.seed+k*137,x,y)*.8+.1;
    const v=hash(state.seed+k*311+17,x,y)*.8+.1;
    const a=(u-v)*24,b=(u+v)*12;
    ctx.moveTo(a,b);
    if(t === "water") {ctx.lineTo(a+2,b+.5);ctx.lineTo(a+4,b);}
    else {ctx.lineTo(a+.8,b-.6); if(t === "valley" || t === "scrub") ctx.lineTo(a+1.6,b+1);}
  }
  ctx.stroke(); ctx.restore();
}

function iso(x,y) {
  return {
    x:(x-y)*(TW/2)*zoom + viewW/2 + camera.x,
    y:((x+y)*(TH/2) + 28)*zoom + camera.y
  };
}

function screenToTile(sx,sy) {
  const px = (sx - viewW/2 - camera.x) / zoom;
  const py = (sy - camera.y) / zoom - 28;
  const x = Math.floor(px/TW + py/TH);
  const y = Math.floor(py/TH - px/TW);
  if (!inside(x,y)) return null;
  return idx(x,y);
}

function setZoom(nextZoom, anchorX=viewW/2, anchorY=viewH/2) {
  const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
  const worldX = (anchorX - viewW/2 - camera.x) / zoom;
  const worldY = (anchorY - camera.y) / zoom;
  camera.x = anchorX - viewW/2 - worldX * next;
  camera.y = anchorY - worldY * next;
  zoom = next;
}

function diamond(p, fill, stroke) {
  const tw = TW * zoom;
  const th = TH * zoom;
  ctx.beginPath();
  ctx.moveTo(p.x,p.y);
  ctx.lineTo(p.x+tw/2,p.y+th/2);
  ctx.lineTo(p.x,p.y+th);
  ctx.lineTo(p.x-tw/2,p.y+th/2);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(.7, zoom);
    ctx.stroke();
  }
}

function outlineDiamond(p, color, width=2, dashed=false) {
  const tw = TW * zoom;
  const th = TH * zoom;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (dashed) ctx.setLineDash([5*zoom,4*zoom]);
  ctx.beginPath();
  ctx.moveTo(p.x,p.y+1);
  ctx.lineTo(p.x+tw/2,p.y+th/2);
  ctx.lineTo(p.x,p.y+th-1);
  ctx.lineTo(p.x-tw/2,p.y+th/2);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function inkShape(points,fill) {
  ctx.beginPath(); points.forEach(([x,y],i)=>i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); ctx.stroke();
}
function drawTree(x,y,s) {
  ctx.save(); ctx.translate(x,y); ctx.scale(zoom*s,zoom*s);
  ctx.strokeStyle="#101808"; ctx.lineWidth=.9;
  inkShape([[-1,2],[0,-12],[2,-13],[1,2]],"#e5af37");
  for(let side of [-1,1]) {
    inkShape([[1,-12],[side*5,-16],[side*10,-12],[side*12,-7],[side*6,-10],[side*3,-9]],"#8deb1d");
    ctx.beginPath();ctx.moveTo(1,-12);ctx.lineTo(side*8,-11);ctx.stroke();
  }
  inkShape([[0,-12],[-3,-18],[0,-20],[4,-17],[5,-12]],"#a2ec29");
  ctx.restore();
}
function drawRuin(x,y,explored) {
  ctx.save();ctx.translate(x,y);ctx.scale(zoom,zoom);ctx.strokeStyle="#10120d";ctx.lineWidth=1;
  const color=explored ? "#b7af70" : "#fff9d9";
  inkShape([[-7,1],[-7,-9],[-4,-11],[-2,-8],[-2,1]],color);
  inkShape([[2,1],[2,-13],[7,-15],[8,1]],color);
  ctx.beginPath();ctx.moveTo(4,-11);ctx.lineTo(6,-8);ctx.lineTo(4,-5);ctx.moveTo(-5,-7);ctx.lineTo(-5,-2);ctx.stroke();
  ctx.restore();
}
function drawBuilding(x,y,type,owner,time,i) {
  const scale=(type === "capital" ? 1.35 : 1)*zoom;
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  ctx.strokeStyle="#11120e";ctx.lineWidth=.9;
  ctx.fillStyle="#fffbe8";ctx.fillRect(-7,-10,14,10);ctx.strokeRect(-7,-10,14,10);
  inkShape([[2,-10],[7,-10],[7,0],[2,-1]],"#d3d0ac");
  inkShape([[-9,-10],[0,-17],[9,-10]],owner === "p" ? "#f5ba2c" : owner === "ai" ? "#f06a50" : "#bbed3d");
  ctx.fillStyle="#10120d";ctx.fillRect(-3,-5,3,5);ctx.fillRect(3,-7,2,2);
  ctx.beginPath();ctx.moveTo(-5,-11);ctx.lineTo(0,-15);ctx.moveTo(0,-11);ctx.lineTo(3,-13);ctx.stroke();
  if(type === "capital" || type === "outpost") {
    ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(8,-24);ctx.stroke();
    inkShape([[8,-24],[16,-23],[16,-17],[8,-18]],owner === "p" ? "#fffbe8" : owner === "ai" ? "#f06a50" : "#fff36b");
    ctx.fillStyle="#10120d";ctx.font="bold 7px sans-serif";ctx.textAlign="center";
    ctx.fillText(owner === "p" ? "+" : owner === "ai" ? "×" : "★",12,-18);
  }
  ctx.restore();
}
function drawAgents(x,y,owner,time,i) {
  for(let a=0;a<2;a++) {
    const phase=time/1800+i*.8+a*2.4;
    const dx=(Math.sin(phase)*8+(a?4:-3))*zoom,dy=(Math.cos(phase*.8)*3+3)*zoom;
    ctx.save();ctx.translate(x+dx,y+dy);ctx.scale(zoom,zoom);
    ctx.strokeStyle="#11120e";ctx.lineWidth=.8;
    inkShape([[-2,1],[-2,-3],[-1,-4],[-1,-6],[1,-6],[1,-4],[2,-3],[2,1],[.5,1],[0,-1],[-.5,1]],owner === "p" ? "#fffef0" : "#ff7158");
    ctx.restore();
  }
}
function drawTroops(p,c) {
  if (!c.owner || !c.troops) return;
  const x = p.x + 11*zoom;
  const y = p.y + 9*zoom;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x,y,Math.max(6,7*zoom),0,Math.PI*2);
  ctx.fillStyle = "#0b0c09";
  ctx.fill();
  ctx.strokeStyle = c.owner === "p" ? "#fffef2" : "#ff7965";
  ctx.lineWidth = Math.max(1,1.5*zoom);
  ctx.stroke();
  ctx.fillStyle = c.owner === "p" ? "#fffef2" : "#ff7965";
  ctx.font = `900 ${Math.max(8,9*zoom)}px system-ui,sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(c.troops),x,y+.5);
  ctx.restore();
}
function drawHills(p) {
  ctx.save();ctx.translate(p.x,p.y+13*zoom);ctx.scale(zoom,zoom);ctx.strokeStyle="#35230b";ctx.lineWidth=.8;
  inkShape([[-12,0],[-9,-5],[-5,-12],[-2,-14],[1,-12],[6,0]],"#ffb32a");
  inkShape([[0,0],[3,-6],[7,-10],[10,-8],[14,0]],"#ffc340");
  ctx.beginPath();ctx.moveTo(-2,-12);ctx.lineTo(-4,-6);ctx.lineTo(-1,-3);ctx.moveTo(7,-8);ctx.lineTo(5,-3);
  for(let k=0;k<6;k++){ctx.moveTo(-8+k*3,-2);ctx.lineTo(-7+k*3,-4);}ctx.stroke();ctx.restore();
}

function render(time=0) {
  ctx.clearRect(0,0,viewW,viewH);
  ctx.fillStyle = "#168eea";
  ctx.fillRect(0,0,viewW,viewH);

  for (let layer=0; layer<2; layer++) {
    for (let s=0; s<W+H-1; s++) {
      for (let x=0; x<W; x++) {
        const y = s-x;
        if (y<0 || y>=H) continue;
        const i = idx(x,y);
        const p = iso(x,y);
        if (p.x < -TW*zoom || p.x > viewW+TW*zoom || p.y < -50*zoom || p.y > viewH+60*zoom) continue;
        const t = terrain[i];
        const c = state.cells[i];
        if (layer === 0) {
        diamond(p, terrainColor(t,x,y), t === "water" ? null : "rgba(20,25,8,.5)");

        drawGroundInk(p,t,x,y);
        if (c.owner) {
          ctx.fillStyle = c.owner === "p" ? "rgba(255,255,225,.12)" : "rgba(237,74,54,.22)";
          const tw = TW*zoom, th = TH*zoom;
          ctx.beginPath();
          ctx.moveTo(p.x,p.y+2*zoom); ctx.lineTo(p.x+tw/2-2*zoom,p.y+th/2); ctx.lineTo(p.x,p.y+th-2*zoom); ctx.lineTo(p.x-tw/2+2*zoom,p.y+th/2); ctx.closePath(); ctx.fill();
        }

        if(c.owner) {
          ctx.save();ctx.font=`bold ${8*zoom}px sans-serif`;ctx.textAlign="center";
          ctx.strokeStyle="#111";ctx.lineWidth=2*zoom;ctx.fillStyle=c.owner === "p" ? "#fffef2" : "#ff7965";
          const emblem=c.owner === "p" ? "+" : "×";
          ctx.strokeText(emblem,p.x,p.y+21*zoom);ctx.fillText(emblem,p.x,p.y+21*zoom);ctx.restore();
        }
        if (state.ap > 0 && isLand(i) && c.owner === null && strongestAdjacent(i,"p") != null) {
          outlineDiamond(p,"#fffef2",Math.max(1.5,2.2*zoom),true);
        } else if (state.ap > 0 && c.owner === "ai" && strongestAdjacent(i,"p") != null) {
          outlineDiamond(p,"#ff695b",Math.max(1.3,2*zoom),true);
        }

        if (state.plans.includes(i)) {
          outlineDiamond(p,"#62e8ff",Math.max(2,2.6*zoom),true);
          ctx.save();
          ctx.fillStyle="#0b0c09";
          ctx.strokeStyle="#62e8ff";
          ctx.lineWidth=Math.max(1,1.3*zoom);
          ctx.beginPath();
          ctx.arc(p.x-11*zoom,p.y+9*zoom,Math.max(6,7*zoom),0,Math.PI*2);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle="#62e8ff";
          ctx.font=`900 ${Math.max(8,9*zoom)}px system-ui,sans-serif`;
          ctx.textAlign="center"; ctx.textBaseline="middle";
          ctx.fillText(String(state.plans.indexOf(i)+1),p.x-11*zoom,p.y+9*zoom+.5);
          ctx.restore();
        }
        if (selected === i) outlineDiamond(p,"#ffffff",Math.max(2,2.8*zoom));
        continue;
        }

        if (t === "forest") {
          const n = hash(state.seed ^ 99,x,y);
          drawTree(p.x-7*zoom,p.y+11*zoom,.85);
          if (n>.35) drawTree(p.x+5*zoom,p.y+8*zoom,.7);
        }
        if (t === "hills") drawHills(p);
        if (c.building) {
          drawBuilding(p.x,p.y+11*zoom,c.building,c.owner,time,i);
          if (c.owner) drawAgents(p.x,p.y+14*zoom,c.owner,time,i);
        }
        if (c.building === "outpost") {
          ctx.save(); ctx.font = `900 ${12*zoom}px system-ui`; ctx.textAlign="center";
          ctx.lineWidth=3*zoom; ctx.strokeStyle="#0b0c09"; ctx.fillStyle=c.owner === "ai" ? "#ff7965" : "#fff36b";
          ctx.strokeText("★",p.x,p.y-20*zoom); ctx.fillText("★",p.x,p.y-20*zoom); ctx.restore();
        }
        if (c.fort) outlineDiamond(p,"#62e8ff",Math.max(2,3*zoom));
        if (moveSource != null && c.owner === "p" && neighbors(moveSource).includes(i)) outlineDiamond(p,"#62e8ff",3,true);
        drawTroops(p,c);


      }
    }

  }
  if(selected !== null) { const q=xy(selected);outlineDiamond(iso(q.x,q.y),"#111",5);outlineDiamond(iso(q.x,q.y),"#fffef2",2.5); }
  requestAnimationFrame(render);
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  const nextW = Math.max(1,rect.width);
  const nextH = Math.max(1,rect.height);
  const nextDpr = Math.min(2,window.devicePixelRatio || 1);
  if (viewW === nextW && viewH === nextH && dpr === nextDpr) return;
  if (viewH > 1) camera.y += (nextH-viewH)/2;
  viewW = nextW;
  viewH = nextH;
  dpr = nextDpr;
  canvas.width = Math.round(viewW*dpr);
  canvas.height = Math.round(viewH*dpr);
  ctx.setTransform(canvas.width/viewW,0,0,canvas.height/viewH,0,0);
  resetGesture();
}

function canvasPoint(clientX,clientY) {
  const rect = canvas.getBoundingClientRect();
  return {x:(clientX-rect.left)*viewW/rect.width, y:(clientY-rect.top)*viewH/rect.height};
}

// Pick visible objects from front to back before testing the ground diamond.
function pointInPolygon(x,y,points) {
  let hit = false;
  for (let i=0,j=points.length-1; i<points.length; j=i++) {
    const [xi,yi] = points[i], [xj,yj] = points[j];
    if ((yi>y)!==(yj>y) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) hit=!hit;
  }
  return hit;
}

function pickTile(sx,sy) {
  for (let sum=W+H-2; sum>=0; sum--) for (let x=W-1; x>=0; x--) {
    const y=sum-x;
    if (!inside(x,y)) continue;
    const i=idx(x,y), c=state.cells[i], p=iso(x,y);
    const dx=(sx-p.x)/zoom, dy=(sy-p.y)/zoom;
    if (c.building) {
      const scale=c.building === "capital" ? 1.35 : 1;
      const bx=dx/scale, by=(dy-11)/scale;
      if (pointInPolygon(bx,by,[[-7,0],[7,0],[7,-10],[9,-10],[0,-17],[-9,-10],[-7,-10]])) return i;
      if (c.building === "outpost" && ((dx>=7 && dx<=9 && dy>=-9 && dy<=9) || (dx>=8 && dx<=16 && dy>=-9 && dy<=-4))) return i;
      if (c.building === "capital" && dx>=9 && dx<=11 && dy>=-15 && dy<=9) return i;
    }
    if (c.ruin && ((dx>=-5 && dx<=-1 && dy>=2 && dy<=10) || (dx>=1 && dx<=6 && dy>=-1 && dy<=10))) return i;
  }
  return screenToTile(sx,sy);
}

function selectAt(clientX,clientY) {
  const p = canvasPoint(clientX,clientY);
  const picked = pickTile(p.x,p.y);
  if (moveSource != null) {
    if (finishMove(picked)) {
      el("mapHint").style.opacity = "0";
      return;
    }
  }
  selected = picked;
  updateSelectionUI();
  el("mapHint").style.opacity = "0";
}

function resetGesture() {
  const ids = [...pointers.keys()];
  pointers.clear();
  dragging = false;
  moved = false;
  pinchStart = null;
  mapShell.classList.remove("dragging");
  ids.forEach(id => { if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id); });
}

function rebaseGesture() {
  const pts = [...pointers.values()];
  pointerStart = pts[0];
  cameraStart = {...camera};
  pinchStart = null;
  if (pts.length >= 2) {
    const mid = {x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2};
    pinchStart = {distance:Math.max(1,Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)), zoom,
      worldX:(mid.x-viewW/2-camera.x)/zoom, worldY:(mid.y-camera.y)/zoom};
  }
}

function centerOnTile(i) {
  const p = xy(i);
  const rawX = (p.x-p.y)*(TW/2);
  const rawY = (p.x+p.y)*(TH/2)+28;
  camera.x = -rawX*zoom;
  camera.y = viewH*.42 - rawY*zoom;
}

function centerOnPlayer() { centerOnTile(state.playerCapital); }

function toast(text) {
  const t = el("toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"),2200);
}

function closeDialog(which) {
  const ids = {
    help:"helpDialog", victory:"victoryDialog", store:"storeDialog", menu:"menuDialog",
    report:"reportDialog", endturn:"endTurnDialog", move:"moveDialog", attack:"attackDialog"
  };
  const d = el(ids[which] || "menuDialog");
  if (d && d.open) d.close();
}

const TUTORIAL_STEPS = [
  {title:"1 · El objetivo", target:"#enemyCountry", text:"Tu meta principal es abrirte camino y tomar el cuartel rival. El territorio, los puestos y la economía existen para ayudarte a llegar mejor preparado."},
  {title:"2 · Leé el mapa", target:"#mapShell", text:"Antes de tocar nada, recorré el continente. Número = tropas. + es tu territorio; × es rival. Blanco punteado se puede expandir; rojo punteado se puede atacar."},
  {title:"3 · Seleccioná y compará", target:"#selection", text:"Tocá cualquier sector para ver dueño, tropas, terreno, fortificación y si es atacable. Mirar, hacer zoom y mover la cámara nunca gasta acciones."},
  {title:"4 · Expandir", target:'[data-action="expand"]', text:"Seleccioná un neutral junto a tus tierras. Un vecino propio necesita al menos 2 tropas: una pasa al territorio nuevo. Expandir gasta 1 acción."},
  {title:"5 · Reforzar", target:'[data-action="reinforce"]', text:"En un territorio propio, Reforzar suma +1 tropa gratis. Cuesta 1 acción, no monedas. Elegí dónde concentrar fuerza."},
  {title:"6 · Mover", target:'[data-action="move"]', text:"Elegí un territorio propio con 2+ tropas, tocá Mover y después un vecino propio. Antes de confirmar elegís cuántas tropas trasladar y ves cuántas quedan y llegan. Todo el traslado gasta 1 acción."},
  {title:"7 · Atacar", target:'[data-action="attack"]', text:"Seleccioná un territorio rival adyacente. Antes de tirar, el juego muestra origen, fuerzas, fortificación y probabilidad. Confirmar recién entonces consume la acción."},
  {title:"8 · Economía y tienda", target:"#resources", text:"Las monedas llegan por territorio y por hitos. No compran tropas normales: sirven para decisiones especiales como fortificar un sector desde Menú → Tienda."},
  {title:"9 · Pensá el turno", target:"#planBtn", text:"PLAN es gratis: marcá hasta 5 sectores con números para recordar un orden, una amenaza o un objetivo. Las marcas desaparecen al cerrar el turno."},
  {title:"10 · Revisá al rival", target:"#reportBtn", text:"Después del turno rival, RIVAL guarda cada movimiento importante. Tocá un evento y el mapa te lleva a ese sector. Sirve especialmente si retomás la partida más tarde."},
  {title:"11 · Cerrá cuando quieras", target:"#endTurnBtn", text:"Tenés 6 acciones, pero ningún reloj. Podés pasar varios minutos mirando y pensando. Terminá el turno sólo cuando estés conforme; el juego te pide confirmación."},
  {title:"12 · Cómo ganar", target:"#mapShell", text:"Protegé tu cuartel, construí un frente, usá puestos y fortificaciones cuando convenga y buscá el cuartel enemigo. El tutorial termina acá: el ritmo lo ponés vos."}
];
let tutorialStep = 0;

function paintTutorialStep() {
  document.querySelectorAll(".tutorial-focus").forEach(n=>n.classList.remove("tutorial-focus"));
  const step = TUTORIAL_STEPS[tutorialStep];
  el("tutorialTitle").textContent = step.title;
  el("tutorialText").textContent = step.text;
  el("tutorialCounter").textContent = (tutorialStep+1) + "/" + TUTORIAL_STEPS.length;
  el("tutorialPrev").disabled = tutorialStep === 0;
  el("tutorialNext").textContent = tutorialStep === TUTORIAL_STEPS.length-1 ? "TERMINAR" : "SIGUIENTE";
  const target = document.querySelector(step.target);
  if (target) target.classList.add("tutorial-focus");
}

function startTutorial() {
  ["menuDialog","helpDialog","storeDialog","reportDialog"].forEach(id=>{const d=el(id); if(d?.open)d.close();});
  tutorialStep = 0;
  el("tutorialPanel").hidden = false;
  paintTutorialStep();
}

function stopTutorial() {
  el("tutorialPanel").hidden = true;
  document.querySelectorAll(".tutorial-focus").forEach(n=>n.classList.remove("tutorial-focus"));
  localStorage.setItem("guerra-minima-tutorial-version",VERSION);
}

function bindEvents() {
  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (pointers.size === 0) moved = false;
    pointers.set(e.pointerId,canvasPoint(e.clientX,e.clientY));
    canvas.setPointerCapture(e.pointerId);
    dragging = true;
    if (pointers.size > 1) moved = true;
    rebaseGesture();
    mapShell.classList.add("dragging");
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    const pt = canvasPoint(e.clientX,e.clientY);
    pointers.set(e.pointerId,pt);
    if (pointers.size >= 2 && pinchStart) {
      const pts = [...pointers.values()];
      const distance = Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);
      zoom = Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,pinchStart.zoom*distance/pinchStart.distance));
      // The original world point stays under the moving midpoint, including at zoom limits.
      camera.x = (pts[0].x+pts[1].x)/2-viewW/2-pinchStart.worldX*zoom;
      camera.y = (pts[0].y+pts[1].y)/2-pinchStart.worldY*zoom;
      moved = true;
      return;
    }
    const dx = pt.x-pointerStart.x, dy = pt.y-pointerStart.y;
    if (Math.hypot(dx,dy) > 6) moved = true;
    if (moved) {
      camera.x = cameraStart.x+dx;
      camera.y = cameraStart.y+dy;
    }
  });

  function releasePointer(e) {
    if (!pointers.has(e.pointerId)) return;
    const pt = canvasPoint(e.clientX,e.clientY);
    const tap = e.type === "pointerup" && pointers.size === 1 && !moved &&
      Math.hypot(pt.x-pointerStart.x,pt.y-pointerStart.y) <= 6;
    pointers.delete(e.pointerId);
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    if (tap) selectAt(e.clientX,e.clientY);
    if (!pointers.size) resetGesture();
    else { moved = true; rebaseGesture(); }
  }
  canvas.addEventListener("pointerup",releasePointer);
  canvas.addEventListener("pointercancel",releasePointer);
  canvas.addEventListener("lostpointercapture",releasePointer);
  window.addEventListener("blur",resetGesture);
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    resetGesture();
    const p = canvasPoint(e.clientX,e.clientY);
    const delta = e.deltaY*(e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? viewH : 1);
    setZoom(zoom*Math.exp(-delta*.0015),p.x,p.y);
  }, {passive:false});

  document.querySelectorAll(".actions button").forEach((b) => b.addEventListener("click",() => act(b.dataset.action)));
  el("objectiveBtn").addEventListener("click",() => {
    moveSource = null;
    const current = POSTS.indexOf(selected);
    selected = POSTS[(current+1)%POSTS.length]; centerOnTile(selected); updateSelectionUI();
  });
  el("storeBtn").addEventListener("click",() => { closeDialog("menu"); el("storeDialog").showModal(); });
  el("storeFortifyBtn").addEventListener("click",() => { closeDialog("store"); act("fortify"); });
  el("planBtn").addEventListener("click",togglePlan);
  el("clearPlanBtn").addEventListener("click",clearPlans);
  el("reportBtn").addEventListener("click",() => { refreshReportUI(); el("reportDialog").showModal(); });
  el("endTurnBtn").addEventListener("click",requestEndTurn);
  el("confirmEndTurnBtn").addEventListener("click",() => { closeDialog("endturn"); endTurn(); });
  el("moveAmount").addEventListener("input",refreshMovePreview);
  el("confirmMoveBtn").addEventListener("click",confirmMove);
  el("confirmAttackBtn").addEventListener("click",confirmAttack);
  el("menuBtn").addEventListener("click",() => el("menuDialog").showModal());
  el("helpBtn").addEventListener("click",() => { closeDialog("menu"); el("helpDialog").showModal(); });
  el("tutorialBtn").addEventListener("click",startTutorial);
  el("tutorialFromHelpBtn").addEventListener("click",startTutorial);
  el("tutorialPrev").addEventListener("click",() => { if(tutorialStep>0){tutorialStep--;paintTutorialStep();} });
  el("tutorialNext").addEventListener("click",() => {
    if (tutorialStep >= TUTORIAL_STEPS.length-1) stopTutorial();
    else { tutorialStep++; paintTutorialStep(); }
  });
  el("tutorialClose").addEventListener("click",stopTutorial);
  el("zoomInBtn").addEventListener("click",() => setZoom(zoom+0.15));
  el("zoomOutBtn").addEventListener("click",() => setZoom(zoom-0.15));
  el("centerBtn").addEventListener("click",centerOnPlayer);
  el("newGameBtn").addEventListener("click",resetGame);
  el("victoryNewGameBtn").addEventListener("click",() => { closeDialog("victory"); resetGame(); });
  document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click",() => closeDialog(b.dataset.close)));
  window.addEventListener("resize",resize);
  new ResizeObserver(resize).observe(mapShell);
  document.addEventListener("visibilitychange",() => {
    resetGesture();
    if (!document.hidden) checkVersion();
  });
}

async function checkVersion() {
  try {
    const response = await fetch("./version.json?t="+Date.now(),{cache:"no-store"});
    if (!response.ok) return;
    const remote = await response.json();
    if (remote.version && remote.version !== VERSION) el("updateOverlay").hidden = false;
  } catch {}
}

async function cleanReload() {
  if ("serviceWorker" in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.update().catch(()=>{})));
  }
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith("guerra-minima-")).map((k) => caches.delete(k)));
  }
  location.reload();
}

async function boot() {
  if (!load()) {
    state = newState();
    save();
  }
  terrain = generateTerrain(state.seed);
  syncUI();
  resize();
  centerOnPlayer();
  bindEvents();
  requestAnimationFrame(render);
  if (state.winner) showVictory();

  const tutorialKey = "guerra-minima-tutorial-version";
  if (localStorage.getItem(tutorialKey) !== VERSION) startTutorial();

  checkVersion();
  setInterval(checkVersion,60000);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  }
  el("updateBtn").addEventListener("click",cleanReload);
}

boot();
