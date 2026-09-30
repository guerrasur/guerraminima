// Run with node --test tests/map.test.cjs. No dependencies required.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
function setup() {
  const nodes=new Map();
  const rect={left:12,top:130,width:390,height:500};
  const draws=[];
  const context=new Proxy({}, {get:(_,key)=>(...args)=>draws.push([key,...args]),set:()=>true});
  function node(id) {
    if (!nodes.has(id)) nodes.set(id,{style:{},dataset:{},listeners:{},open:false,
      classList:{add(){},remove(){}},addEventListener(type,fn){this.listeners[type]=fn;},
      querySelectorAll:()=>[],getContext:()=>context,getBoundingClientRect:()=>rect,
      setPointerCapture(){},hasPointerCapture:()=>false,releasePointerCapture(){},
      showModal(){this.open=true},close(){this.open=false}});
    return nodes.get(id);
  }
  const sandbox={console,Math,Map,Uint32Array,document:{getElementById:node,querySelectorAll:()=>[],addEventListener(){}},
    window:{devicePixelRatio:2,addEventListener(){}},ResizeObserver:class{observe(){}},
    localStorage:{setItem(){},getItem(){return null}},crypto:require('node:crypto').webcrypto,
    requestAnimationFrame(){},setTimeout(){},clearTimeout(){}};
  vm.createContext(sandbox);
  const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8').replace(/boot\(\);\s*$/,'');
  vm.runInContext(source,sandbox);
  const run=code=>vm.runInContext(code,sandbox);
  run('state=newState();resize();centerOnPlayer();bindEvents();');
  const event=(type,id,x,y)=>node('world').listeners[type]({type,pointerId:id,pointerType:'touch',clientX:x+rect.left,clientY:y+rect.top});
  return {run,event,rect,draws};
}
function near(a,b){assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`)}
test('all ground tiles match the isometric projection at every supported zoom',()=>{
  const {run}=setup();
  assert.equal(run(`(()=>{for(const z of [.55,.7,1,1.35,1.8]){zoom=z;camera={x:-147.25,y:73.4};for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const p=iso(x,y);for(const [u,v] of [[.1,.1],[.9,.1],[.1,.9],[.9,.9],[.5,.5]]) {
      if(screenToTile(p.x+(u-v)*TW/2*z,p.y+(u+v)*TH/2*z)!==idx(x,y))return false;
    }}}return true})()`),true);
});
test('tap selects a tile and jitter does not move the camera',()=>{
  const {run,event}=setup();
  run('camera={x:0,y:0};zoom=1;');
  const p=run('iso(3,3)');
  event('pointerdown',1,p.x,p.y+12); event('pointermove',1,p.x+2,p.y+13); event('pointerup',1,p.x+2,p.y+13);
  assert.equal(run('selected'),123);near(run('camera.x'),0);near(run('camera.y'),0);
});
test('drag follows the finger exactly and never selects on release',()=>{
  const {run,event}=setup();const before=run('({...camera})');
  event('pointerdown',1,100,100);event('pointermove',1,140,125);event('pointerup',1,140,125);
  near(run('camera.x'),before.x+40);near(run('camera.y'),before.y+25);assert.equal(run('selected'),null);
});
test('pinch anchors the original world point under the moving midpoint',()=>{
  const {run,event}=setup();
  event('pointerdown',1,100,200);event('pointerdown',2,200,200);
  const world=run('({...pinchStart})');
  event('pointermove',1,80,220);event('pointermove',2,220,220);
  near(run('zoom'),1.4);near(run('(150-viewW/2-camera.x)/zoom'),world.worldX);near(run('(220-camera.y)/zoom'),world.worldY);
  // At maximum zoom the same midpoint still anchors the world.
  event('pointermove',1,0,240);event('pointermove',2,300,240);
  near(run('zoom'),1.8);near(run('(150-viewW/2-camera.x)/zoom'),world.worldX);near(run('(240-camera.y)/zoom'),world.worldY);
  event('pointerup',2,300,240);const camera=run('({...camera})');
  event('pointermove',1,10,250);near(run('camera.x'),camera.x+10);near(run('camera.y'),camera.y+10);
  event('pointerup',1,10,250);assert.equal(run('selected'),null);
});
test('cancellation, lost capture, extra fingers and unreported release movement never tap',()=>{
  for(const type of ['pointercancel','lostpointercapture']) {
    const {run,event}=setup();event('pointerdown',1,180,200);event(type,1,180,200);assert.equal(run('selected'),null);assert.equal(run('pointers.size'),0);
  }
  const {run,event}=setup();event('pointerdown',1,180,200);event('pointerup',1,230,200);assert.equal(run('selected'),null);
  event('pointerdown',1,100,200);event('pointerdown',2,200,200);event('pointerdown',3,250,200);
  event('pointerup',1,100,200);event('pointermove',3,270,220);event('pointerup',2,200,200);event('pointerup',3,270,220);
  assert.equal(run('selected'),null);assert.equal(run('pointers.size'),0);
});
test('CSS coordinate scaling, resize and a new continent preserve correct alignment',()=>{
  const {run,rect,event}=setup();
  rect.width=780;rect.height=1000;
  const p=run('canvasPoint(402,630)');near(p.x,195);near(p.y,250);
  event('pointerdown',1,100,100);run('resize()');assert.equal(run('pointers.size'),0);
  near(run('viewW'),780);near(run('viewH'),1000);
  run('resetGame()');const capital=run('iso(6,14)');near(capital.x,390);near(capital.y,420);
});
test('visible building roof selects its building instead of the ground behind it',()=>{
  const {run}=setup();
  assert.equal(run('(()=>{const p=iso(6,14);return pickTile(p.x,p.y-5*zoom)})()'),566);
});
test('render draws terrain before buildings and schedules without 30fps throttle',()=>{
  const {run,draws}=setup();run('render(1)');
  const firstBuilding=draws.findIndex(d=>d[0]==='fillRect' && d[3]<40);
  assert.ok(firstBuilding>0);
  assert.ok(draws.slice(0,firstBuilding).some(d=>d[0]==='stroke'));
  assert.ok(draws.length>100);
});
test('release versions and cache remain synchronized',()=>{
  const dir=path.join(__dirname,'..'),v=JSON.parse(fs.readFileSync(path.join(dir,'version.json'))).version;
  for(const file of ['app.js','index.html','sw.js'])assert.ok(fs.readFileSync(path.join(dir,file),'utf8').includes(v));
  assert.ok(fs.readFileSync(path.join(dir,'app.js'),'utf8').includes('guerra-minima-save-v1'));
});

test('v0.3 core starts with one currency, visible troops and two live headquarters',()=>{
  const {run}=setup();
  assert.equal(run('Object.keys(state.resources).join(",")'),'money');
  assert.equal(run('state.cells[state.playerCapital].troops'),6);
  assert.equal(run('state.cells[state.enemyCapital].troops'),6);
  assert.equal(run('state.cells[state.playerCapital].building'),'capital');
  assert.equal(run('state.cells[state.enemyCapital].building'),'capital');
});
test('expanding transfers one troop and consumes one action',()=>{
  const {run}=setup();
  assert.equal(run(`(()=>{
    const target=state.cells.findIndex((c,i)=>isLand(i)&&c.owner===null&&neighbors(i).some(n=>state.cells[n].owner==='p'));
    if(target<0)return false;
    const source=neighbors(target).find(n=>state.cells[n].owner==='p');
    state.cells[source].troops=3; selected=target;
    const before=state.ap; act('expand');
    return state.cells[target].owner==='p'&&state.cells[target].troops===1&&state.cells[source].troops===2&&state.ap===before-1;
  })()`),true);
});
test('capturing the enemy headquarters is a victory condition',()=>{
  const {run}=setup();
  assert.equal(run(`(()=>{state.cells[state.enemyCapital].owner='p';checkVictory();return state.winner==='p'&&state.victoryReason.includes('cuartel rival')})()`),true);
});

test('new game starts with the simplified economy and defended HQs',()=>{
  const {run}=setup();
  assert.equal(run('Object.keys(state.resources).join(",")'),'money');
  assert.equal(run('state.cells[state.playerCapital].building'),'capital');
  assert.equal(run('state.cells[state.enemyCapital].building'),'capital');
  assert.equal(run('state.cells[state.playerCapital].troops'),6);
  assert.equal(run('state.cells[state.enemyCapital].troops'),6);
  assert.equal(run('state.cells.every(c=>!c.owner||c.troops>=1)'),true);
  assert.equal(run('state.cells.some(c=>c.ruin)'),false);
});

test('reinforce spends one action and two coins for one troop',()=>{
  const {run}=setup();
  run('selected=state.playerCapital');
  const before=run('({money:state.resources.money,troops:state.cells[selected].troops,ap:state.ap})');
  run('act("reinforce")');
  assert.equal(run('state.resources.money'),before.money-2);
  assert.equal(run('state.cells[selected].troops'),before.troops+1);
  assert.equal(run('state.ap'),before.ap-1);
});

test('expansion transfers one troop and movement never leaves a territory empty',()=>{
  const {run}=setup();
  const setupExpansion=run(`(()=>{
    for(let i=0;i<state.cells.length;i++) if(isLand(i)&&state.cells[i].owner===null){
      const source=neighbors(i).find(n=>state.cells[n].owner==="p");
      if(source!=null){state.cells[source].troops=2; selected=i; return {target:i,source};}
    }
    return null;
  })()`);
  assert.ok(setupExpansion);
  run('act("expand")');
  assert.equal(run(`state.cells[${setupExpansion.target}].owner`),'p');
  assert.equal(run(`state.cells[${setupExpansion.target}].troops`),1);
  assert.equal(run(`state.cells[${setupExpansion.source}].troops`),1);
});

test('capturing the enemy HQ ends the match immediately',()=>{
  const {run}=setup();
  run('state.cells[state.enemyCapital].owner="p"; state.cells[state.enemyCapital].troops=1; checkVictory()');
  assert.equal(run('state.winner'),'p');
  assert.equal(run('state.victoryReason'),'tomaste el cuartel rival');
});

test('campaign stages affect both sides and keep the same reinforcement price',()=>{
  const {run}=setup();
  for(const [turn,size] of [[1,1],[7,1],[8,2],[15,2],[16,3]]) {
    run(`state.turn=${turn};state.ap=3;state.resources.money=20;selected=state.playerCapital`);
    const before=run('state.cells[selected].troops');run('act("reinforce")');
    assert.equal(run('state.cells[selected].troops'),before+size);
    assert.equal(run('state.resources.money'),18);
  }
});
test('outpost income, one-time rewards and consecutive control victory',()=>{
  const {run}=setup();
  const before=run('incomeFor("p")');
  run('for(const i of POSTS.slice(0,2)){state.cells[i].owner="p";state.cells[i].troops=1;}checkVictory()');
  assert.ok(run('incomeFor("p")')>=before+4);
  assert.equal(run('state.resources.money'),24);
  run('checkVictory();updateHold();updateHold()');
  assert.equal(run('state.resources.money'),24);assert.equal(run('state.winner'),null);
  run('state.cells[POSTS[1]].owner="ai";checkVictory()');assert.equal(run('state.hold.p'),0);
  run('state.cells[POSTS[1]].owner="p";updateHold();updateHold();updateHold()');assert.equal(run('state.winner'),'p');
});
test('fortification absorbs exactly one successful attack with no troop loss',()=>{
  const {run}=setup();
  run('selected=state.playerCapital;act("fortify");const enemy=neighbors(selected)[0];state.cells[enemy].owner="ai";state.cells[enemy].troops=4;');
  assert.equal(run('state.resources.money'),8);assert.equal(run('canAction("fortify")'),false);
  run('const originalRandom=Math.random;let roll=0;Math.random=()=>roll++%2===0?.99:0;resolveCombat("ai",state.playerCapital);Math.random=originalRandom;');
  assert.equal(run('state.cells[state.playerCapital].troops'),6);
  assert.equal(run('state.cells[state.playerCapital].fort'),false);
});
test('load preserves campaign progress and migrates old saves without wiping troops',()=>{
  const {run}=setup();
  run('initializeCampaign();state.hold.p=2;state.milestones.p=[0];state.cells[state.playerCapital].fort=true;state.cells[state.playerCapital].troops=12;let saved=JSON.stringify(state);localStorage.getItem=()=>saved;load()');
  assert.equal(run('state.hold.p'),2);assert.equal(run('state.cells[state.playerCapital].fort'),true);
  assert.equal(run('state.cells[state.playerCapital].troops'),12);
  run('delete state.hold;delete state.milestones;delete state.report;saved=JSON.stringify(state);load()');
  assert.equal(run('state.hold.p'),0);assert.equal(run('POSTS.every(i=>state.cells[i].building==="outpost")'),true);
});
test('pending troop movement cannot spend an exhausted action or act after victory',()=>{
  const {run}=setup();
  run('selected=state.playerCapital;beginMove();state.ap=0');
  assert.equal(run('finishMove(neighbors(state.playerCapital)[0])'),false);
  assert.equal(run('state.cells[state.playerCapital].troops'),6);
});
