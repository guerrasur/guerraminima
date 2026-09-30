const VERSION = "0.1.2";
const SAVE_KEY = "guerra-minima-save-v1";
const W = 40;
const H = 28;
const TW = 48;
const TH = 24;
const MAX_AP = 3;
const MAX_TRADES = 3;

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

const PRICES = { food:2, wood:3, stone:4, metal:6 };
const RES_LABELS = {
  food:["🌾","Comida"],
  wood:["🪵","Madera"],
  stone:["🪨","Piedra"],
  metal:["⛓","Metal"],
  money:["¤","Dinero"]
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
  const cells = new Array(W*H).fill(null).map(() => ({ owner:null, building:null, ruin:false, explored:false }));

  function claimAround(center, owner) {
    const p = xy(center);
    for (let y=p.y-2; y<=p.y+2; y++) for (let x=p.x-2; x<=p.x+2; x++) {
      if (!inside(x,y)) continue;
      const i = idx(x,y);
      if (isLand(i) && Math.abs(x-p.x)+Math.abs(y-p.y) <= 3) cells[i].owner = owner;
    }
  }
  claimAround(playerCapital, "p");
  claimAround(enemyCapital, "ai");
  cells[playerCapital].building = "capital";
  cells[enemyCapital].building = "capital";

  let ruins = 0;
  let guard = 0;
  while (ruins < 11 && guard < 1000) {
    guard++;
    const x = 10 + Math.floor(r()*(W-20));
    const y = 3 + Math.floor(r()*(H-6));
    const i = idx(x,y);
    if (isLand(i) && !cells[i].owner && !cells[i].ruin) {
      cells[i].ruin = true;
      ruins++;
    }
  }

  return {
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
    trades:0,
    day:1,
    turn:1,
    resources:{ food:12, wood:10, stone:8, metal:3, money:22 },
    aiResources:{ food:12, wood:10, stone:8, metal:3, money:22 },
    log:["El continente fue reclamado por dos países."]
  };
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
    return true;
  } catch {
    return false;
  }
}

function resetGame() {
  state = newState();
  selected = null;
  resetGesture();
  zoom = 1;
  centerOnPlayer();
  save();
  syncUI();
  closeDialog("menu");
  toast("Nuevo continente generado.");
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
  el("lastEvent").textContent = state.log[0] || "Elegí hasta 3 acciones.";

  el("resources").innerHTML = ["food","wood","stone","metal","money"].map((key) => {
    return '<div class="resource"><span>' + RES_LABELS[key][0] + '</span><b>' + state.resources[key] + '</b></div>';
  }).join("");

  updateSelectionUI();
  renderMarket();
}

function ownerLabel(owner) {
  if (owner === "p") return state.playerCountry[0];
  if (owner === "ai") return state.enemyCountry[0];
  return "Territorio neutral";
}

function updateSelectionUI() {
  if (selected == null) {
    el("selectionTitle").textContent = "Tocá una zona del mapa";
    el("selectionMeta").textContent = "El mundo sigue vivo mientras decidís.";
  } else {
    const c = state.cells[selected];
    const pos = xy(selected);
    let title = TERRAIN_LABELS[terrain[selected]];
    if (c.building === "capital") title = "Capital de " + ownerLabel(c.owner);
    else if (c.building === "village") title = "Asentamiento de " + ownerLabel(c.owner);
    else if (c.building === "outpost") title = "Puesto fronterizo de " + ownerLabel(c.owner);
    else if (c.ruin && !c.explored) title = "Ruinas antiguas";
    const bits = [ownerLabel(c.owner), "sector " + (pos.x+1) + "." + (pos.y+1)];
    if (c.owner === null && isLand(selected)) {
      bits.push(adjacentOwner(selected,"p") ? "DENTRO DE TU ALCANCE" : "fuera de alcance");
    }
    if (c.owner === "ai" && adjacentOwner(selected,"p")) bits.push("frontera rival alcanzable");
    if (c.ruin && !c.explored) bits.push("explorar da recursos");
    if (c.ruin && c.explored) bits.push("ruinas exploradas");
    el("selectionTitle").textContent = title;
    el("selectionMeta").textContent = bits.join(" · ");
  }

  document.querySelectorAll(".actions button").forEach((button) => {
    button.disabled = !canAction(button.dataset.action);
  });
}

function enough(cost) {
  return Object.entries(cost).every(([k,v]) => state.resources[k] >= v);
}

function canAction(action) {
  if (state.ap <= 0 || selected == null) return false;
  const c = state.cells[selected];
  if (action === "expand") return isLand(selected) && c.owner === null && adjacentOwner(selected,"p") && enough({food:2});
  if (action === "build") return c.owner === "p" && !c.building && enough({wood:6,stone:3,money:4});
  if (action === "harvest") return c.owner === "p";
  if (action === "explore") return c.ruin && !c.explored && (c.owner === "p" || (c.owner === null && adjacentOwner(selected,"p")));
  if (action === "attack") return c.owner === "ai" && adjacentOwner(selected,"p") && c.building !== "capital" && enough({food:3,metal:1});
  return false;
}

function spend(cost) {
  Object.entries(cost).forEach(([k,v]) => state.resources[k] -= v);
}

function addLog(text) {
  state.log.unshift(text);
  state.log = state.log.slice(0,8);
  el("lastEvent").textContent = text;
}

function useAction() {
  state.ap = Math.max(0, state.ap - 1);
}

function act(action) {
  if (!canAction(action)) {
    toast("Esa acción no está disponible en la zona seleccionada.");
    return;
  }
  const c = state.cells[selected];
  const t = terrain[selected];

  if (action === "expand") {
    spend({food:2});
    c.owner = "p";
    addLog("Tu frontera avanzó hacia " + TERRAIN_LABELS[t].toLowerCase() + ".");
  }

  if (action === "build") {
    spend({wood:6,stone:3,money:4});
    c.building = adjacentOwner(selected,"ai") ? "outpost" : "village";
    addLog(c.building === "outpost" ? "Levantaste un puesto fronterizo." : "Fundaste un pequeño asentamiento.");
  }

  if (action === "harvest") {
    const gain = t === "forest" ? {wood:5,food:1} :
      t === "hills" ? {stone:4,metal:1} :
      t === "valley" ? {food:5,wood:1} :
      t === "scrub" ? {wood:2,stone:2} : {food:3,wood:1};
    Object.entries(gain).forEach(([k,v]) => state.resources[k] += v);
    addLog("Recolectaste recursos de esta zona.");
  }

  if (action === "explore") {
    c.explored = true;
    if (!c.owner) c.owner = "p";
    const r = mulberry32((state.seed ^ selected ^ state.turn * 7919) >>> 0);
    const bonus = 5 + Math.floor(r()*7);
    state.resources.money += bonus;
    if (r() > .5) state.resources.metal += 2; else state.resources.stone += 3;
    addLog("Exploraste las ruinas: encontraste bienes por ¤" + bonus + ".");
  }

  if (action === "attack") {
    spend({food:3,metal:1});
    const chance = c.building ? .48 : .68;
    if (Math.random() < chance) {
      c.owner = "p";
      if (c.building === "village") c.building = "outpost";
      addLog("La intervención avanzó: el sector cambió de control.");
    } else {
      addLog("La intervención fracasó. La frontera no se movió.");
    }
  }

  useAction();
  save();
  syncUI();
}

function renderMarket() {
  const rows = Object.keys(PRICES).map((key) => {
    const label = RES_LABELS[key][1];
    const icon = RES_LABELS[key][0];
    const buy = PRICES[key];
    const sell = Math.max(1, Math.floor(buy*.6));
    return '<div class="market-row"><div><strong>' + icon + ' ' + label + '</strong><small>Tenés ' + state.resources[key] + ' · compra ¤' + buy + ' · venta ¤' + sell + '</small></div>' +
      '<button data-buy="' + key + '">Comprar</button><button data-sell="' + key + '">Vender</button></div>';
  }).join("");
  el("marketRows").innerHTML = rows;
  el("tradeCount").textContent = state.trades + " / " + MAX_TRADES + " operaciones";
  el("marketRows").querySelectorAll("button").forEach((b) => {
    const key = b.dataset.buy || b.dataset.sell;
    const buy = !!b.dataset.buy;
    b.disabled = state.trades >= MAX_TRADES || (buy ? state.resources.money < PRICES[key] : state.resources[key] <= 0);
    b.addEventListener("click", () => trade(key,buy));
  });
}

function trade(key, buy) {
  if (state.trades >= MAX_TRADES) return;
  const price = PRICES[key];
  if (buy) {
    if (state.resources.money < price) return;
    state.resources.money -= price;
    state.resources[key] += 1;
    addLog("Compraste 1 " + RES_LABELS[key][1].toLowerCase() + ".");
  } else {
    if (state.resources[key] <= 0) return;
    state.resources[key] -= 1;
    state.resources.money += Math.max(1,Math.floor(price*.6));
    addLog("Vendiste 1 " + RES_LABELS[key][1].toLowerCase() + ".");
  }
  state.trades++;
  save();
  syncUI();
}

function aiTurn() {
  let note = [];
  for (let move=0; move<MAX_AP; move++) {
    const attackables = [];
    const expandables = [];
    const buildables = [];
    for (let i=0; i<state.cells.length; i++) {
      const c = state.cells[i];
      if (!isLand(i)) continue;
      if (c.owner === "p" && c.building !== "capital" && adjacentOwner(i,"ai")) attackables.push(i);
      if (c.owner === null && adjacentOwner(i,"ai")) expandables.push(i);
      if (c.owner === "ai" && !c.building) buildables.push(i);
    }

    if (attackables.length && Math.random() < .42) {
      const i = attackables[Math.floor(Math.random()*attackables.length)];
      if (Math.random() < .58) {
        state.cells[i].owner = "ai";
        if (state.cells[i].building === "village") state.cells[i].building = "outpost";
        note.push("avanzó sobre tu frontera");
      } else note.push("intentó intervenir una frontera");
      continue;
    }

    if (expandables.length && Math.random() < .78) {
      expandables.sort((a,b) => xy(a).x - xy(b).x);
      const pool = expandables.slice(0,Math.min(7,expandables.length));
      const i = pool[Math.floor(Math.random()*pool.length)];
      state.cells[i].owner = "ai";
      note.push("expandió territorio");
      continue;
    }

    if (buildables.length) {
      const i = buildables[Math.floor(Math.random()*buildables.length)];
      state.cells[i].building = adjacentOwner(i,"p") ? "outpost" : "village";
      note.push("levantó un asentamiento");
    }
  }
  return note;
}

function endTurn() {
  const note = aiTurn();
  state.turn++;
  state.day++;
  state.ap = MAX_AP;
  state.trades = 0;
  const summary = note.length ? state.enemyCountry[0] + " " + note.slice(0,2).join(" y ") + "." : state.enemyCountry[0] + " consolidó su territorio.";
  addLog(summary + " Es tu turno.");
  save();
  syncUI();
  toast("Es tu turno contra " + state.enemyCountry[0] + ".");
}

function terrainColor(t, x, y) {
  const v = hash(state.seed ^ 0xabc123, x, y);
  if (t === "water") return v > .5 ? "#7899a0" : "#73929a";
  if (t === "valley") return v > .5 ? "#9da66b" : "#a6ae75";
  if (t === "forest") return v > .5 ? "#667c58" : "#6d835e";
  if (t === "hills") return v > .5 ? "#a89670" : "#9f8d69";
  if (t === "scrub") return v > .5 ? "#9b9c73" : "#92966e";
  return v > .5 ? "#aab47f" : "#b2bb87";
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

function drawTree(x,y,s) {
  const z = zoom;
  ctx.fillStyle = "#425d41";
  ctx.beginPath(); ctx.arc(x,y,3.5*s*z,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = "#334b35";
  ctx.beginPath(); ctx.arc(x+2*s*z,y-2*s*z,3*s*z,0,Math.PI*2); ctx.fill();
}

function drawRuin(x,y,explored) {
  const z = zoom;
  ctx.fillStyle = explored ? "#756f60" : "#625c50";
  ctx.fillRect(x-5*z,y-8*z,4*z,8*z);
  ctx.fillRect(x+1*z,y-11*z,5*z,11*z);
  ctx.fillStyle = "#c5b89a";
  ctx.fillRect(x+2*z,y-9*z,2*z,2*z);
}

function drawBuilding(x,y,type,owner,time,i) {
  const base = owner === "p" ? "#d9c978" : "#b46f67";
  const roof = owner === "p" ? "#78672d" : "#6d3531";
  const scale = (type === "capital" ? 1.35 : 1) * zoom;
  ctx.fillStyle = base;
  ctx.fillRect(x-7*scale,y-10*scale,14*scale,10*scale);
  ctx.fillStyle = roof;
  ctx.beginPath();
  ctx.moveTo(x-9*scale,y-10*scale);
  ctx.lineTo(x,y-17*scale);
  ctx.lineTo(x+9*scale,y-10*scale);
  ctx.closePath(); ctx.fill();

  if (type === "outpost") {
    ctx.strokeStyle = "#3b3426"; ctx.lineWidth = 2*zoom;
    ctx.beginPath(); ctx.moveTo(x+8*zoom,y-2*zoom); ctx.lineTo(x+8*zoom,y-20*zoom); ctx.stroke();
    ctx.fillStyle = owner === "p" ? "#e8da82" : "#cb6c64";
    ctx.fillRect(x+8*zoom,y-20*zoom,8*zoom,5*zoom);
  }

  if (type === "capital") {
    ctx.strokeStyle = "#3b3426"; ctx.lineWidth = 2*zoom;
    ctx.beginPath(); ctx.moveTo(x+10*zoom,y-2*zoom); ctx.lineTo(x+10*zoom,y-26*zoom); ctx.stroke();
    ctx.font = (18*zoom) + "px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(flag(owner === "p" ? state.playerCountry[1] : state.enemyCountry[1]),x+8*zoom,y-17*zoom);
  }

  const puff = (time/900 + i*.37) % 1;
  ctx.fillStyle = "rgba(80,75,65," + (0.22*(1-puff)) + ")";
  ctx.beginPath(); ctx.arc(x-3*zoom + Math.sin(time/600+i)*2*zoom, y-18*zoom-puff*14*zoom, (2+puff*3)*zoom, 0, Math.PI*2); ctx.fill();
}

function drawAgents(x,y,owner,time,i) {
  for (let a=0; a<2; a++) {
    const phase = time/900 + i*.8 + a*2.4;
    const dx = (Math.sin(phase)*10 + (a ? 4 : -3))*zoom;
    const dy = (Math.cos(phase*.8)*4 + 3)*zoom;
    ctx.fillStyle = owner === "p" ? "#f1df8b" : "#d77a70";
    ctx.beginPath(); ctx.arc(x+dx,y+dy,1.8*zoom,0,Math.PI*2); ctx.fill();
  }
}

function render(time=0) {
  ctx.clearRect(0,0,viewW,viewH);
  ctx.fillStyle = "#78969b";
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
        diamond(p, terrainColor(t,x,y), t === "water" ? "rgba(255,255,255,.07)" : "rgba(63,69,48,.15)");

        if (c.owner) {
          ctx.fillStyle = c.owner === "p" ? "rgba(228,207,98,.17)" : "rgba(177,75,67,.17)";
          const tw = TW*zoom, th = TH*zoom;
          ctx.beginPath();
          ctx.moveTo(p.x,p.y+2*zoom); ctx.lineTo(p.x+tw/2-2*zoom,p.y+th/2); ctx.lineTo(p.x,p.y+th-2*zoom); ctx.lineTo(p.x-tw/2+2*zoom,p.y+th/2); ctx.closePath(); ctx.fill();
        }

        if (state.ap > 0 && isLand(i) && c.owner === null && adjacentOwner(i,"p")) {
          outlineDiamond(p,"rgba(255,245,177,.95)",Math.max(1.5,2.2*zoom),true);
        } else if (state.ap > 0 && c.owner === "ai" && c.building !== "capital" && adjacentOwner(i,"p")) {
          outlineDiamond(p,"rgba(255,177,163,.9)",Math.max(1.3,2*zoom),true);
        }

        if (selected === i) outlineDiamond(p,"#fff4bd",Math.max(2,2.8*zoom));
        continue;
        }

        if (t === "forest") {
          const n = hash(state.seed ^ 99,x,y);
          drawTree(p.x-7*zoom,p.y+11*zoom,.85);
          if (n>.35) drawTree(p.x+5*zoom,p.y+8*zoom,.7);
        }
        if (t === "hills") {
          ctx.fillStyle = "#81765f";
          ctx.beginPath(); ctx.moveTo(p.x-10*zoom,p.y+13*zoom); ctx.lineTo(p.x-2*zoom,p.y+2*zoom); ctx.lineTo(p.x+5*zoom,p.y+13*zoom); ctx.fill();
          ctx.fillStyle = "#92866a";
          ctx.beginPath(); ctx.moveTo(p.x,p.y+13*zoom); ctx.lineTo(p.x+8*zoom,p.y+5*zoom); ctx.lineTo(p.x+13*zoom,p.y+13*zoom); ctx.fill();
        }
        if (c.ruin) drawRuin(p.x,p.y+10*zoom,c.explored);
        if (c.building) {
          drawBuilding(p.x,p.y+11*zoom,c.building,c.owner,time,i);
          drawAgents(p.x,p.y+14*zoom,c.owner,time,i);
        }


      }
    }

  }
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
  selected = pickTile(p.x,p.y);
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

function centerOnPlayer() {
  const p = xy(state.playerCapital);
  const rawX = (p.x-p.y)*(TW/2);
  const rawY = (p.x+p.y)*(TH/2)+28;
  camera.x = -rawX*zoom;
  camera.y = viewH*.42 - rawY*zoom;
}

function toast(text) {
  const t = el("toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"),2200);
}

function closeDialog(which) {
  const d = which === "market" ? el("marketDialog") : which === "help" ? el("helpDialog") : el("menuDialog");
  if (d.open) d.close();
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
  el("endTurnBtn").addEventListener("click",endTurn);
  el("marketBtn").addEventListener("click",() => { renderMarket(); el("marketDialog").showModal(); });
  el("menuBtn").addEventListener("click",() => el("menuDialog").showModal());
  el("helpBtn").addEventListener("click",() => { closeDialog("menu"); el("helpDialog").showModal(); });
  el("zoomInBtn").addEventListener("click",() => setZoom(zoom+0.15));
  el("zoomOutBtn").addEventListener("click",() => setZoom(zoom-0.15));
  el("centerBtn").addEventListener("click",centerOnPlayer);
  el("newGameBtn").addEventListener("click",resetGame);
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

  const guideKey = "guerra-minima-guide-version";
  if (localStorage.getItem(guideKey) !== VERSION) {
    localStorage.setItem(guideKey,VERSION);
    el("helpDialog").showModal();
  }

  checkVersion();
  setInterval(checkVersion,60000);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  }
  el("updateBtn").addEventListener("click",cleanReload);
}

boot();
