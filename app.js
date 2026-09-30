const VERSION = "0.9.0";
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
const EXTRA_ORDER_COST = 5;
const MARCH_RANGE = 3;
const POST_INCOME = 2;
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
let movePaths = new Map();
let effects = [];
let combatCardOpen = false;
let soundEnabled = localStorage.getItem("guerra-minima-sound") === "1";
let audioContext = null;
const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");

function playCue(kind) {
  if (!soundEnabled) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audioContext ||= new Audio();
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
    const tones = kind === "loss" ? [180,120] : kind === "capture" ? [330,440,660] : kind === "attack" ? [220,280] : [440,550];
    tones.forEach((frequency,i) => {
      const at = audioContext.currentTime + i*.065;
      const osc = audioContext.createOscillator(), gain = audioContext.createGain();
      osc.type = "sine"; osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0,at); gain.gain.linearRampToValueAtTime(.045,at+.01);
      gain.gain.exponentialRampToValueAtTime(.001,at+.13);
      osc.connect(gain); gain.connect(audioContext.destination); osc.start(at); osc.stop(at+.14);
    });
  } catch { /* Sound is optional; gameplay never depends on audio. */ }
}

function feedback(tile, label, kind="move", path=null) {
  effects.push({tile,label,kind,path,start:null});
  effects = effects.slice(-8);
  playCue(kind);
}

// Breadth-first traversal: only owned land, never across water or enemy territory.
function marchPaths(source, owner) {
  const paths = new Map();
  if (!Number.isInteger(source) || !isLand(source) || state.cells[source]?.owner !== owner) return paths;
  paths.set(source,[source]);
  const queue = [source];
  for (let head=0; head<queue.length; head++) {
    const at = queue[head], path = paths.get(at);
    if (path.length > MARCH_RANGE) continue;
    for (const next of neighbors(at)) {
      if (paths.has(next) || !isLand(next) || state.cells[next].owner !== owner) continue;
      paths.set(next,[...path,next]); queue.push(next);
    }
  }
  paths.delete(source);
  return paths;
}

function combatForecast(attacker, target, source=strongestAdjacent(target,attacker)) {
  const defender = attacker === "p" ? "ai" : "p";
  const origins = neighbors(target).filter(i => state.cells[i].owner === attacker && state.cells[i].troops > 1);
  if (!origins.includes(source) || state.cells[target].owner !== defender) return null;
  const attackBonus = origins.length >= 2 ? 1 : 0;
  const defenseBonus = ["forest","hills"].includes(terrain[target]) ? 1 : 0;
  let wins = 0;
  for (let a=1;a<=6;a++) for (let d=1;d<=6;d++) if(a+attackBonus>d+defenseBonus) wins++;
  return {source,target,attackBonus,defenseBonus,wins,percent:Math.round(wins/36*100)};
}

function refreshCombatCard() {
  const card = el("combatResult");
  card.hidden = !combatCardOpen || !state.lastCombat || rivalBriefingVisible();
  if (card.hidden) return;
  const result = state.lastCombat;
  el("combatDice").textContent = "VOS " + result.attackRoll + (result.attackBonus ? "+1" : "") + "  :  " + result.defendRoll + (result.defenseBonus ? "+1" : "") + " RIVAL";
  el("combatOutcome").textContent = result.message + ".";
  card.dataset.outcome = result.outcome;
}


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
    turnHistory:[],
    turnBaseline:null,
    turnDirty:false,
    turnCombatLocked:false,
    extraOrderTurn:null,
    rivalBriefingTurn:null,
    rivalBriefingSeen:true
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
    state.lastCombat ||= null;
    const oldPlayerMoney = Number(state.resources?.money);
    const oldAiMoney = Number(state.aiResources?.money);
    state.resources = { money:Number.isFinite(oldPlayerMoney) ? oldPlayerMoney : START_MONEY };
    state.aiResources = { money:Number.isFinite(oldAiMoney) ? oldAiMoney : START_MONEY };
    state.winner = state.winner || null;
    state.victoryReason = state.victoryReason || null;
    state.plans = Array.isArray(state.plans) ? state.plans.filter(Number.isInteger).slice(0,MAX_PLANS) : [];
    state.lastRivalReport = Array.isArray(state.lastRivalReport) ? state.lastRivalReport : [];
    state.turnHistory = Array.isArray(state.turnHistory) ? state.turnHistory.slice(-12) : [];
    state.turnBaseline = state.turnBaseline && state.turnBaseline.turn === state.turn ? state.turnBaseline : null;
    state.turnDirty = !!state.turnDirty;
    state.turnCombatLocked = !!state.turnCombatLocked;
    state.extraOrderTurn = Number.isInteger(state.extraOrderTurn) ? state.extraOrderTurn : null;
    const hadBriefingTurn = Number.isInteger(state.rivalBriefingTurn);
    state.rivalBriefingTurn = hadBriefingTurn ? state.rivalBriefingTurn : (state.lastRivalReport.length ? state.turn : null);
    state.rivalBriefingSeen = typeof state.rivalBriefingSeen === "boolean" ? state.rivalBriefingSeen : !state.lastRivalReport.length;
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
  effects = []; combatCardOpen = false; movePaths.clear();
  state = newState();
  selected = null;
  moveSource = null;
  pendingMove = null;
  pendingAttack = null;
  captureTurnBaseline();
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
  return Math.max(2, Math.floor(territoryCount(owner) / 5)) + postCount(owner) * POST_INCOME;
}

function strongestAdjacent(i, owner) {
  const candidates = neighbors(i).filter((n) => state.cells[n].owner === owner && state.cells[n].troops > 1);
  if (!candidates.length) return null;
  candidates.sort((a,b) => state.cells[b].troops - state.cells[a].troops);
  return candidates[0];
}

function makeTurnBaseline() {
  return {
    turn:state.turn,
    cells:state.cells.map((c) => ({...c})),
    resources:{...state.resources},
    ap:state.ap,
    log:[...state.log],
    milestones:{p:[...(state.milestones?.p || [])],ai:[...(state.milestones?.ai || [])]},
    extraOrderTurn:state.extraOrderTurn
  };
}

function captureTurnBaseline() {
  state.turnBaseline = makeTurnBaseline();
  state.turnDirty = false;
  state.turnCombatLocked = false;
}

function canReplan() {
  return !!state.turnBaseline &&
    state.turnBaseline.turn === state.turn &&
    state.turnDirty &&
    !state.turnCombatLocked &&
    !state.winner;
}

function replanTurn() {
  if (!canReplan()) {
    toast(state.turnCombatLocked
      ? "Después de atacar, la ronda queda fijada para evitar repetir tiradas."
      : "Todavía no hay cambios para replantear.");
    return false;
  }
  effects = []; combatCardOpen = false; movePaths.clear();
  const baseline = state.turnBaseline;
  state.cells = baseline.cells.map((c) => ({...c}));
  state.resources = {...baseline.resources};
  state.ap = baseline.ap;
  state.log = [...baseline.log];
  state.milestones = {p:[...baseline.milestones.p],ai:[...baseline.milestones.ai]};
  state.extraOrderTurn = baseline.extraOrderTurn;
  state.turnDirty = false;
  state.turnCombatLocked = false;
  moveSource = null;
  pendingMove = null;
  pendingAttack = null;
  selected = null;
  save();
  syncUI();
  toast("Replanteaste la ronda: volviste al inicio sin perder tus marcas PLAN.");
  return true;
}

function syncUI() {
  el("warName").textContent = state.name;
  el("playerCountry").textContent = state.playerCountry[0];
  el("enemyCountry").textContent = state.enemyCountry[0];
  el("playerFlag").textContent = flag(state.playerCountry[1]);
  el("enemyFlag").textContent = flag(state.enemyCountry[1]);
  el("dayLabel").textContent = "Día " + state.day + " · T" + state.turn;
  const actionBudget = MAX_AP + (state.extraOrderTurn === state.turn ? 1 : 0);
  el("apLabel").textContent = state.ap + "/" + actionBudget;
  el("versionLabel").textContent = "v" + VERSION;
  el("lastEvent").textContent = state.log[0] || "Sin reloj: revisá el mapa y cerrá el turno cuando quieras.";

  const pct = Math.round(territoryShare("p") * 100);
  el("resources").innerHTML =
    '<div class="resource"><span>¤</span><b>' + state.resources.money + '</b><small>+¤' + incomeFor("p") + '/turno</small></div>' +
    '<div class="resource"><span>♟</span><b>' + troopTotal("p") + '</b><small>tropas</small></div>' +
    '<div class="resource"><span>⚑</span><b>' + pct + '%</b><small>territorio · meta 60%</small></div>';

  const threats = state.cells.filter((c,i) => c.owner === "p" && strongestAdjacent(i,"ai") != null).length;
  el("threatLabel").textContent = threats
    ? "⚠ " + threats + " sectores bajo amenaza conocida"
    : "Frontera estable con las tropas visibles";
  el("threatLabel").classList[threats ? "add" : "remove"]("danger");

  const storeBtn = el("storeBtn");
  if (storeBtn) {
    storeBtn.disabled = !!state.winner;
    storeBtn.textContent = "TIENDA · ¤" + state.resources.money;
  }
  const storeBalance = el("storeBalance");
  if (storeBalance) storeBalance.textContent = "¤" + state.resources.money;

  const reportBtn = el("reportBtn");
  if (reportBtn) reportBtn.textContent = state.lastRivalReport.length ? "☷ RIVAL · " + state.lastRivalReport.length : "☷ RIVAL";

  const replanBtn = el("replanBtn");
  if (replanBtn) {
    replanBtn.disabled = !canReplan();
    replanBtn.textContent = state.turnCombatLocked ? "TURNO FIJADO" : "REPLANTEAR";
  }

  const extraBtn = el("storeExtraBtn");
  if (extraBtn) {
    const used = state.extraOrderTurn === state.turn;
    extraBtn.disabled = used || state.resources.money < EXTRA_ORDER_COST || !!state.winner;
    extraBtn.textContent = used ? "Orden extra · usada este turno" : "Orden extra · +1 acción · ¤" + EXTRA_ORDER_COST;
  }

  refreshReportUI();
  updateSelectionUI();
  refreshRivalBriefing();
  refreshCombatCard();
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
    el("selectionTitle").textContent = moveSource == null ? "Tocá una zona del mapa" : "Elegí un destino marcado en celeste";
    el("selectionMeta").textContent = moveSource == null
      ? "Los números son tropas. Inspeccionar, hacer zoom y pensar no gasta acciones."
      : "Después elegís cuántas tropas trasladar. El origen siempre conserva al menos 1.";
  } else {
    const c = state.cells[selected];
    const pos = xy(selected);
    let title = TERRAIN_LABELS[terrain[selected]];
    if (c.building === "capital") title = "Cuartel de " + ownerLabel(c.owner);
    if (c.building === "outpost") title = "★ " + POST_NAMES[POSTS.indexOf(selected)];

    const bits = [ownerLabel(c.owner), "sector " + (pos.x+1) + "." + (pos.y+1)];
    if (c.owner) bits.push((c.troops || 0) + ((c.troops || 0) === 1 ? " tropa" : " tropas"));
    if (c.building === "outpost") bits.push("+¤2 por turno al controlarlo");
    if (c.fort) bits.push("escudo: absorbe 1 derrota defensiva");
    if (c.owner === null && isLand(selected)) bits.push(strongestAdjacent(selected,"p") != null ? "PODÉS EXPANDIR" : "necesitás 2 tropas en un vecino");
    if (c.owner === "ai" && adjacentOwner(selected,"p")) bits.push(strongestAdjacent(selected,"p") != null ? "PODÉS ATACAR" : "frontera rival · necesitás 2 tropas");
    if (c.owner === "ai" && c.building === "capital") bits.push("tomarlo gana la partida");
    if (c.owner === "p" && selected === state.playerCapital) bits.push("protegé este cuartel");
    if (c.owner === "p" && strongestAdjacent(selected,"ai") != null) bits.push("AMENAZADO desde " + sectorLabel(strongestAdjacent(selected,"ai")));
    if (["forest","hills"].includes(terrain[selected])) bits.push("cobertura: +1 al dado defensor");
    const forecast = c.owner === "ai" ? combatForecast("p",selected) : null;
    if (forecast) bits.push("ganar tirada: " + forecast.percent + "%" + (forecast.attackBonus ? " · flanqueo +1" : ""));

    el("selectionTitle").textContent = title;
    el("selectionMeta").textContent = bits.join(" · ");
  }

  el("cancelMoveBtn").hidden = moveSource == null;
  mapShell.classList[moveSource != null ? "add" : "remove"]("moving-troops");
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
  if (reinforceLabel) reinforceLabel.textContent = "Reforzar +2";

  const storeFortify = el("storeFortifyBtn");
  const storeContext = el("storeContext");
  if (storeFortify) {
    storeFortify.disabled = !canAction("fortify");
    if (selected == null) storeFortify.textContent = "Fortificar · seleccioná un sector propio";
    else if (state.cells[selected].owner !== "p") storeFortify.textContent = "Fortificar · el sector debe ser tuyo";
    else if (state.cells[selected].fort) storeFortify.textContent = "Fortificación · este sector ya tiene escudo";
    else storeFortify.textContent = "Fortificar " + sectorLabel(selected) + " · ¤" + FORT_COST + " + 1 acción";
  }
  if (storeContext) {
    if (selected == null) storeContext.textContent = "Seleccioná un territorio propio para evaluar una fortificación.";
    else if (state.cells[selected].owner === "p") storeContext.textContent = sectorLabel(selected) + " · " + state.cells[selected].troops + " tropas" + (state.cells[selected].fort ? " · fortificado" : "");
    else storeContext.textContent = "La fortificación solo se compra para un territorio propio.";
  }
}

function canAction(action) {
  if (state.winner || state.ap <= 0 || selected == null) return false;
  const c = state.cells[selected];
  if (action === "expand") return isLand(selected) && c.owner === null && strongestAdjacent(selected,"p") != null;
  if (action === "fortify") return c.owner === "p" && !c.fort && state.resources.money >= FORT_COST;
  if (action === "reinforce") return c.owner === "p";
  if (action === "move") return c.owner === "p" && c.troops > 1 && marchPaths(selected,"p").size > 0;
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

function rivalBriefingVisible() {
  return !!(!state.winner &&
    state.lastRivalReport.length &&
    state.rivalBriefingTurn === state.turn &&
    !state.rivalBriefingSeen);
}

function acknowledgeRivalBriefing() {
  if (!state || state.rivalBriefingSeen) return;
  state.rivalBriefingSeen = true;
  save();
  refreshRivalBriefing();
  refreshCombatCard();
}

function focusRivalBriefingEvent(index) {
  const item = state.lastRivalReport[index];
  if (item && Number.isInteger(item.tile)) {
    moveSource = null;
    selected = item.tile;
    centerOnTile(item.tile);
    updateSelectionUI();
    toast("Parte rival: " + sectorLabel(item.tile) + " centrado.");
  }
  acknowledgeRivalBriefing();
}

function openRivalHistoryFromBriefing() {
  acknowledgeRivalBriefing();
  refreshReportUI();
  el("reportDialog").showModal();
}

function refreshRivalBriefing() {
  const card = el("rivalBriefing");
  if (!card || !state) return;
  const visible = rivalBriefingVisible();
  card.hidden = !visible;
  mapShell.classList[visible ? "add" : "remove"]("briefing-open");
  if (!visible) return;

  el("rivalBriefingTitle").textContent = "Ronda " + Math.max(1,state.turn-1) + " · " + state.enemyCountry[0];
  const body = el("rivalBriefingBody");
  const preview = state.lastRivalReport.slice(0,3);
  body.innerHTML = preview.map((line,i) =>
    '<button class="briefing-event" data-briefing-index="'+i+'"><b>'+(i+1)+'.</b><span>'+line.text+'</span></button>'
  ).join("") +
    (state.lastRivalReport.length > preview.length
      ? '<small class="briefing-more">+'+(state.lastRivalReport.length-preview.length)+' movimientos en el historial completo</small>'
      : '');
  body.querySelectorAll(".briefing-event").forEach((button) => button.addEventListener("click",() => {
    focusRivalBriefingEvent(Number(button.dataset.briefingIndex));
  }));
}

function useAction() {
  state.ap = Math.max(0, state.ap - 1);
  state.turnDirty = true;
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

function resolveCombat(attacker, target, chosenSource=strongestAdjacent(target,attacker)) {
  const forecast = combatForecast(attacker,target,chosenSource);
  if (!forecast) return null;
  const {source,attackBonus,defenseBonus} = forecast;
  const attackRoll = 1 + Math.floor(Math.random()*6);
  const defendRoll = 1 + Math.floor(Math.random()*6);
  const sourceCell = state.cells[source], targetCell = state.cells[target];
  const attackWon = attackRoll + attackBonus > defendRoll + defenseBonus;
  const dice = " (" + attackRoll + (attackBonus ? "+1" : "") + " contra " + defendRoll + (defenseBonus ? "+1" : "") + ")";
  let message, outcome;
  if (attackWon && targetCell.fort) {
    targetCell.fort = false; outcome = "shield";
    message = "rompió el escudo; no hubo bajas";
  } else if (attackWon) {
    targetCell.troops -= 1;
    if (targetCell.troops === 0) {
      sourceCell.troops -= 1; targetCell.owner = attacker; targetCell.troops = 1;
      outcome = "capture";
      message = "conquistó " + (targetCell.building === "capital" ? "el cuartel" : sectorLabel(target));
    } else { outcome = "hit"; message = "hizo perder 1 tropa al defensor"; }
  } else {
    sourceCell.troops -= 1; outcome = "loss";
    message = "perdió 1 tropa atacando";
  }
  return {source,target,message:message+dice,attackRoll,defendRoll,attackBonus,defenseBonus,outcome};
}

function beginMove() {
  if (!canAction("move")) return;
  moveSource = selected;
  movePaths = marchPaths(moveSource,"p");
  combatCardOpen = false; refreshCombatCard();
  updateSelectionUI();
  toast("Marcha: elegí un destino celeste hasta 3 casillas. Después elegís la cantidad.");
}

function cancelMove() {
  moveSource = null; movePaths.clear(); pendingMove = null;
  updateSelectionUI();
}

function finishMove(target) {
  if (moveSource == null) return false;
  const source = moveSource;
  if (state.winner || state.ap <= 0) { cancelMove(); return false; }
  const path = marchPaths(source,"p").get(target);
  if (!path || state.cells[source].troops <= 1) {
    toast("Elegí un destino celeste conectado por hasta 3 casillas propias, o Cancelar.");
    return false;
  }
  pendingMove = {source,target,path};
  moveSource = null; movePaths.clear();
  const max = state.cells[source].troops - 1;
  const input = el("moveAmount");
  input.max = String(max);
  input.value = String(Math.min(max, Math.max(1, Math.ceil(max/2))));
  updateSelectionUI(); refreshMovePreview();
  el("moveDialog").showModal();
  return true;
}

function refreshMovePreview() {
  if (!pendingMove) return;
  const {source,target} = pendingMove;
  const input = el("moveAmount");
  const max = state.cells[source].troops - 1;
  let amount = Math.max(1, Math.min(max, Math.floor(Number(input.value) || 1)));
  input.value = String(amount);
  el("moveAmountLabel").textContent = amount + (amount === 1 ? " tropa" : " tropas");
  el("movePreview").textContent = sectorLabel(source) + " → " + sectorLabel(target) +
    " · " + (pendingMove.path.length-1) + " casillas · 1 acción · quedan " + (state.cells[source].troops - amount) +
    " · llegan " + (state.cells[target].troops + amount);
}

function confirmMove() {
  if (!pendingMove || state.winner || state.ap <= 0) return;
  const {source,target} = pendingMove;
  const max = state.cells[source].troops - 1;
  const path = marchPaths(source,"p").get(target);
  if (!path || max < 1) { closeDialog("move"); toast("La ruta ya no está disponible."); return; }
  const amount = Math.max(1, Math.min(max, Math.floor(Number(el("moveAmount").value) || 1)));
  state.cells[source].troops -= amount;
  state.cells[target].troops += amount;
  feedback(target,"+" + amount + " tropas","move",path);
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
  const origins = neighbors(target).filter(i => state.cells[i].owner === "p" && state.cells[i].troops > 1);
  el("attackSource").innerHTML = origins.map(i => '<option value="'+i+'">'+sectorLabel(i)+' · '+state.cells[i].troops+' tropas</option>').join("");
  el("attackSource").value = String(source);
  refreshAttackPreview();
  el("attackDialog").showModal();
}

function refreshAttackPreview() {
  if (!pendingAttack) return;
  const source = Number(el("attackSource").value), target = pendingAttack.target;
  const forecast = combatForecast("p",target,source);
  if (!forecast) return;
  pendingAttack.source = source;
  const a = state.cells[source], d = state.cells[target];
  el("attackOdds").textContent = forecast.percent + "%";
  el("attackModifiers").textContent = (forecast.attackBonus ? "Flanqueo +1" : "Sin flanqueo") + " · " + (forecast.defenseBonus ? "Cobertura rival +1" : "Rival sin cobertura");
  el("attackPreview").textContent = sectorLabel(source) + " (" + a.troops + " tropas) → " + sectorLabel(target) + " (" + d.troops + " tropas).\n" +
    "Si ganás: " + (d.fort ? "rompés el escudo, sin bajas." : d.troops === 1 ? "conquistás y trasladás 1 tropa." : "el rival pierde 1 tropa; no conquistás todavía.") +
    "\nSi perdés o empatás: perdés 1 tropa en origen.\n" +
    "Ganar la tirada: " + forecast.wins + "/36. Más tropas permiten resistir; no suman al dado.";
}

function confirmAttack() {
  if (!pendingAttack || state.winner || state.ap <= 0) return;
  const {target,source} = pendingAttack;
  closeDialog("attack");
  const result = resolveCombat("p",target,source);
  if (!result) { toast("El ataque dejó de estar disponible. No gastaste acciones."); return; }
  selected = target;
  state.turnCombatLocked = true;
  state.lastCombat = result; combatCardOpen = true;
  const labels = {capture:"CONQUISTA",hit:"−1 rival",loss:"−1 tropa",shield:"ESCUDO ROTO"};
  feedback(result.outcome === "loss" ? source : target,labels[result.outcome],result.outcome === "loss" ? "loss" : result.outcome === "capture" ? "capture" : "attack",[source,target]);
  addLog("Ataque: " + result.message + ".");
  useAction(); checkVictory(); save(); syncUI();
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

  moveSource = null; movePaths.clear(); combatCardOpen = false;
  const c = state.cells[selected];
  const t = terrain[selected];

  if (action === "expand") {
    const source = strongestAdjacent(selected,"p");
    state.cells[source].troops -= 1;
    c.owner = "p";
    c.troops = 1;
    feedback(selected,"+1 territorio","capture",[source,selected]);
    addLog("Expandiste la frontera hacia " + TERRAIN_LABELS[t].toLowerCase() + ".");
  }

  if (action === "reinforce") {
    c.troops += 2;
    feedback(selected,"+2 tropas","reinforce");
    addLog("Reforzaste " + sectorLabel(selected) + ": +2 tropas gratis.");
  }

  if (action === "fortify") {
    state.resources.money -= FORT_COST; c.fort = true;
    feedback(selected,"ESCUDO +1","fortify");
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

function buyExtraOrder() {
  if (state.winner) return false;
  if (state.extraOrderTurn === state.turn) {
    toast("La Orden extra ya se usó en esta ronda.");
    return false;
  }
  if (state.resources.money < EXTRA_ORDER_COST) {
    toast("Necesitás ¤" + EXTRA_ORDER_COST + " para una Orden extra.");
    return false;
  }
  state.resources.money -= EXTRA_ORDER_COST;
  state.ap += 1;
  state.extraOrderTurn = state.turn;
  state.turnDirty = true;
  addLog("Orden extra comprada: +1 acción para esta ronda.");
  save();
  syncUI();
  toast("+1 acción. No agrega tiempo ni apuro: usala cuando quieras.");
  return true;
}

function aiMoveTowardPlayer() {
  const options = [];
  const goalDistance = i => Math.min(...[state.playerCapital,...POSTS.filter(t => state.cells[t].owner !== "ai")].map(t => Math.abs(xy(i).x-xy(t).x)+Math.abs(xy(i).y-xy(t).y)));
  for (let i=0;i<state.cells.length;i++) {
    const c = state.cells[i];
    if (c.owner !== "ai" || c.troops <= 1 || neighbors(i).some(n => state.cells[n].owner === "p")) continue;
    for (const [to,path] of marchPaths(i,"ai")) {
      if (goalDistance(to) >= goalDistance(i) || !neighbors(to).some(n => isLand(n) && state.cells[n].owner !== "ai")) continue;
      if (state.cells[to].troops >= 5) continue;
      options.push({from:i,to,path,score:goalDistance(to)+state.cells[to].troops});
    }
  }
  options.sort((a,b) => a.score-b.score);
  if (!options.length) return null;
  const best = options[0];
  best.amount = state.cells[best.from].troops-1;
  state.cells[best.from].troops -= best.amount;
  state.cells[best.to].troops += best.amount;
  return best;
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
    const marched = aiMoveTowardPlayer();
    if (marched) {
      record("Trasladó " + marched.amount + " tropas de " + sectorLabel(marched.from) + " a " + sectorLabel(marched.to) + " por territorio propio.",marched.to);
      continue;
    }
    if (reinforceables.length) {
      const frontier = reinforceables.filter((i) => neighbors(i).some((n) => state.cells[n].owner !== "ai" && isLand(n)));
      const pool = frontier.length ? frontier : reinforceables;
      const goals = POSTS.filter(i => state.cells[i].owner !== "ai");
      const score = i => Math.min(...(goals.length ? goals : [state.playerCapital]).map(t => Math.abs(xy(i).x-xy(t).x)+Math.abs(xy(i).y-xy(t).y))) + state.cells[i].troops*2;
      pool.sort((a,b) => score(a)-score(b));
      const i = pool[0];
      state.cells[i].troops += 2;
      record("Reforzó " + sectorLabel(i) + " con +2 tropas.", i);
      continue;
    }

    const movedToward = aiMoveTowardPlayer();
    if (movedToward) record("Movió una tropa de " + sectorLabel(movedToward.from) + " a " + sectorLabel(movedToward.to) + ".", movedToward.to);
    else record("Consolidó posiciones.", state.enemyCapital);
  }
  return note;
}

function requestEndTurn() {
  if (state.winner) return showVictory();
  const copy = el("endTurnCopy");
  const budget = MAX_AP + (state.extraOrderTurn === state.turn ? 1 : 0);
  const used = Math.max(0,budget - state.ap);
  const planCount = state.plans.length;

  copy.textContent = "Usaste " + used + " de " + budget + " acciones disponibles. " +
    (state.ap ? "Te quedan " + state.ap + ". " : "") +
    (planCount ? "Tenés " + planCount + " marcas PLAN activas; se limpian al cerrar. " : "") +
    "No hay reloj: cerrá solamente cuando estés conforme.";

  el("endTurnDialog").showModal();
}

function endTurn() {
  if (state.winner) return showVictory();
  effects = []; combatCardOpen = false; movePaths.clear();
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
  state.rivalBriefingTurn = state.turn;
  state.rivalBriefingSeen = note.length === 0;
  const playerIncome = grantIncome("p");
  const compact = note.length ? note.slice(0,2).map(x=>x.text).join(" · ") : "Consolidó su territorio.";

  state.turnHistory.push({turn:state.turn-1, rival:note, income:playerIncome});
  state.turnHistory = state.turnHistory.slice(-12);
  addLog("Rival: " + compact + " Vos recibís ¤" + playerIncome + ".");

  captureTurnBaseline();
  save();
  syncUI();
  toast("Nueva ronda. Sin reloj · el resumen rival quedó sobre el mapa.");
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
  if (motionQuery?.matches) time = 0;
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

        if (c.owner === "p" && strongestAdjacent(i,"ai") != null) {
          outlineDiamond(p,"#ff7965",Math.max(1.1,1.7*zoom),true);
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
        if (moveSource != null && c.owner === "p" && movePaths.has(i)) outlineDiamond(p,"#62e8ff",3,true);
        drawTroops(p,c);


      }
    }

  }
  if(selected !== null) { const q=xy(selected);outlineDiamond(iso(q.x,q.y),"#111",5);outlineDiamond(iso(q.x,q.y),"#fffef2",2.5); }
  drawFeedback();
  requestAnimationFrame(render);
}

function drawFeedback() {
  const now = Date.now(), reduced = !!motionQuery?.matches;
  effects = effects.filter(fx => { fx.start ??= now; return now-fx.start < (reduced ? 1200 : 950); });
  for (const fx of effects) {
    const progress = reduced ? 0 : Math.min(1,(now-fx.start)/950);
    const q = xy(fx.tile), p = iso(q.x,q.y);
    const color = fx.kind === "loss" ? "#ff7965" : fx.kind === "capture" ? "#fff36b" : "#62e8ff";
    ctx.save(); ctx.globalAlpha = reduced ? 1 : Math.min(1,(1-progress)*3);
    if (fx.path?.length > 1) {
      ctx.strokeStyle=color; ctx.lineWidth=3; ctx.setLineDash([5,4]); ctx.beginPath();
      fx.path.forEach((i,n) => { const at=xy(i),pt=iso(at.x,at.y); if(n)ctx.lineTo(pt.x,pt.y+TH/2*zoom);else ctx.moveTo(pt.x,pt.y+TH/2*zoom); });
      ctx.stroke(); ctx.setLineDash([]);
      if (!reduced) {
        const position = Math.min(.999,progress*2)*(fx.path.length-1), segment = Math.floor(position), t=position-segment;
        const a=xy(fx.path[segment]),b=xy(fx.path[segment+1]),pa=iso(a.x,a.y),pb=iso(b.x,b.y);
        ctx.fillStyle=color;ctx.beginPath();ctx.arc(pa.x+(pb.x-pa.x)*t,pa.y+(pb.y-pa.y)*t+TH/2*zoom,5,0,Math.PI*2);ctx.fill();
      }
    }
    outlineDiamond(p,color,3);
    const y=p.y-24*zoom-progress*25;
    ctx.font="900 12px system-ui,sans-serif";ctx.textAlign="center";
    ctx.strokeStyle="#0b0c09";ctx.lineWidth=5;ctx.strokeText(fx.label,p.x,y);
    ctx.fillStyle=color;ctx.fillText(fx.label,p.x,y);ctx.restore();
  }
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
    finishMove(picked);
    el("mapHint").style.opacity = "0";
    return;
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
  if (which === "move") pendingMove = null;
  if (which === "attack") pendingAttack = null;
}

const TUTORIAL_STEPS = [
  {title:"1 · El NEXO", target:"#mapShell", text:"Guerra Mínima se juega sin presión. No hay reloj, premio por rapidez ni cierre automático. Una ronda puede durar varios minutos: primero mirá y pensá; después actuá."},
  {title:"2 · El objetivo", target:"#enemyCountry", text:"Tu meta principal es abrirte camino y tomar el cuartel rival. También ganás al controlar 60% de la tierra. Territorio, puestos y economía sirven para construir esa ventaja."},
  {title:"3 · Leé el mapa", target:"#mapShell", text:"Número = tropas. + es tu territorio; × es rival. Blanco punteado se puede expandir; rojo sobre el rival se puede atacar; rojo sobre tus zonas señala amenazas conocidas."},
  {title:"4 · Seleccioná y compará", target:"#selection", text:"Tocá cualquier sector para ver dueño, tropas, terreno, fortificación y riesgo. Mirar, hacer zoom, mover cámara y consultar información nunca gasta acciones."},
  {title:"5 · Tus 6 acciones", target:".actions", text:"Expandir, reforzar, mover, atacar y fortificar consumen acciones. Tener 6 no significa jugar rápido: son margen para desarrollar una ronda con más decisiones."},
  {title:"6 · Expandir", target:'[data-action="expand"]', text:"Seleccioná un neutral junto a tus tierras. Un vecino propio necesita al menos 2 tropas: una pasa al territorio nuevo. Expandir gasta 1 acción."},
  {title:"7 · Reforzar", target:'[data-action="reinforce"]', text:"En cualquier territorio propio, Reforzar suma +2 tropas gratis. Cuesta 1 acción y no usa monedas."},
  {title:"8 · Mover varias tropas", target:'[data-action="move"]', text:"Elegí un territorio propio con 2+ tropas, tocá Mover y después un destino celeste a hasta 3 casillas por tierras propias. Antes de confirmar elegís cuántas trasladar, cuánto queda atrás y cuánto llega. Siempre queda 1 tropa en origen. Todo el traslado cuesta 1 acción."},
  {title:"9 · Atacar con información", target:'[data-action="attack"]', text:"Seleccioná un rival adyacente. Elegí el origen. Dos vecinos tuyos con 2+ tropas dan flanqueo +1; bosque o colinas dan cobertura +1 al defensor. La vista previa muestra la probabilidad exacta y qué pasa si ganás o perdés. Al confirmar el primer ataque, REPLANTEAR se bloquea para impedir repetir tiradas."},
  {title:"10 · Economía y Tienda", target:"#storeBtn", text:"La Tienda está siempre al lado de la selección. Las monedas no compran tropas normales: sirven para fortificar un sector propio o comprar una Orden extra. Cada puesto ★ controlado suma +¤2 al ingreso por turno; tomalo y defendelo."},
  {title:"11 · PLAN", target:"#planBtn", text:"PLAN es una libreta táctica gratis. Marcá hasta 5 sectores numerados para recordar un orden, una amenaza o un objetivo. No modifica el tablero."},
  {title:"12 · REPLANTEAR", target:"#replanBtn", text:"Antes de atacar, REPLANTEAR restaura tropas, acciones, dinero, hitos y fortificaciones al estado del inicio de la ronda. Tus marcas PLAN quedan para que pruebes otra idea."},
  {title:"13 · Revisá al rival", target:"#reportBtn", text:"Al volver a tu turno aparece un resumen rival sobre el mapa. RIVAL conserva además el historial de las últimas rondas: tocá un evento y el mapa te lleva al sector."},
  {title:"14 · Cerrá cuando quieras", target:"#endTurnBtn", text:"TERMINAR TURNO siempre pide confirmación. Aunque te queden acciones, podés seguir mirando todo el tiempo que quieras. El ritmo lo ponés vos; al cerrar juega el rival."},
  {title:"15 · Cómo ganar", target:"#mapShell", text:"Protegé tu cuartel, construí un frente, usá puestos, PLAN, replanteo y fortificaciones cuando convenga, y buscá el cuartel enemigo. Ya conocés el juego de punta a punta."}
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
  ["menuDialog","helpDialog","storeDialog","reportDialog","moveDialog","attackDialog","endTurnDialog"].forEach(id=>{const d=el(id); if(d?.open)d.close();});
  tutorialStep = 0;
  el("tutorialPanel").hidden = false;
  paintTutorialStep();
}

function stopTutorial() {
  el("tutorialPanel").hidden = true;
  document.querySelectorAll(".tutorial-focus").forEach(n=>n.classList.remove("tutorial-focus"));
  localStorage.setItem("guerra-minima-tutorial-version",VERSION);
  localStorage.setItem("guerra-minima-tutorial-complete-v1","1");
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
  el("storeBtn").addEventListener("click",() => el("storeDialog").showModal());
  el("storeFortifyBtn").addEventListener("click",() => { closeDialog("store"); act("fortify"); });
  el("storeExtraBtn").addEventListener("click",buyExtraOrder);
  el("planBtn").addEventListener("click",togglePlan);
  el("clearPlanBtn").addEventListener("click",clearPlans);
  el("reportBtn").addEventListener("click",() => { acknowledgeRivalBriefing(); refreshReportUI(); el("reportDialog").showModal(); });
  el("briefingDismissBtn").addEventListener("click",acknowledgeRivalBriefing);
  el("briefingOkBtn").addEventListener("click",acknowledgeRivalBriefing);
  el("briefingHistoryBtn").addEventListener("click",openRivalHistoryFromBriefing);
  el("replanBtn").addEventListener("click",replanTurn);
  el("endTurnBtn").addEventListener("click",requestEndTurn);
  el("confirmEndTurnBtn").addEventListener("click",() => { closeDialog("endturn"); endTurn(); });
  el("moveAmount").addEventListener("input",refreshMovePreview);
  el("confirmMoveBtn").addEventListener("click",confirmMove);
  el("confirmAttackBtn").addEventListener("click",confirmAttack);
  el("attackSource").addEventListener("change",refreshAttackPreview);
  el("cancelMoveBtn").addEventListener("click",cancelMove);
  el("moveAllBtn").addEventListener("click",() => { el("moveAmount").value=el("moveAmount").max; refreshMovePreview(); });
  el("moveHalfBtn").addEventListener("click",() => { el("moveAmount").value=String(Math.ceil(Number(el("moveAmount").max)/2)); refreshMovePreview(); });
  el("combatDismissBtn").addEventListener("click",() => { combatCardOpen=false; refreshCombatCard(); });
  el("lastCombatBtn").addEventListener("click",() => {
    closeDialog("menu");
    if (!state.lastCombat) return toast("Todavía no atacaste en esta partida.");
    acknowledgeRivalBriefing(); combatCardOpen=true; centerOnTile(state.lastCombat.target); refreshCombatCard();
  });
  const soundBtn=el("soundBtn");
  soundBtn.textContent="SONIDO · " + (soundEnabled ? "ACTIVADO" : "APAGADO");
  soundBtn.setAttribute?.("aria-pressed",String(soundEnabled));
  soundBtn.addEventListener("click",() => {
    soundEnabled=!soundEnabled; localStorage.setItem("guerra-minima-sound",soundEnabled ? "1" : "0");
    soundBtn.textContent="SONIDO · " + (soundEnabled ? "ACTIVADO" : "APAGADO");
    soundBtn.setAttribute?.("aria-pressed",String(soundEnabled)); playCue("move");
  });
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
  if (!state.turnBaseline || state.turnBaseline.turn !== state.turn) captureTurnBaseline();
  save();
  syncUI();
  resize();
  centerOnPlayer();
  bindEvents();
  requestAnimationFrame(render);
  if (state.winner) showVictory();

  const tutorialCompleteKey = "guerra-minima-tutorial-complete-v1";
  const legacyTutorialKey = "guerra-minima-tutorial-version";
  if (localStorage.getItem(tutorialCompleteKey) !== "1" && !localStorage.getItem(legacyTutorialKey)) startTutorial();

  checkVersion();
  setInterval(checkVersion,60000);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  }
  el("updateBtn").addEventListener("click",cleanReload);
}

boot();
