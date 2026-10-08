import { playCharacterAnimation } from "./character/character-animation.js";
import { playJobAttack } from "./character/job-attack-animation.js";
import { playCharacterReaction } from "./character/character-reaction.js";
import { playMonsterAnimation } from "./monster/monster-animation.js";
import { getMap } from "./map/map-data.js";

const JOBS=[
 {id:"east_warrior",name:"무사",faction:"동양",index:{male:0,female:1},skill:"청룡참",power:14},
 {id:"east_archer",name:"궁수",faction:"동양",index:{male:2,female:3},skill:"연속화살",power:12},
 {id:"west_knight",name:"기사",faction:"서양",index:{male:4,female:5},skill:"방패강타",power:13},
 {id:"west_archer",name:"아처",faction:"서양",index:{male:6,female:7},skill:"관통사격",power:12}
];
const MONSTERS=[
 {id:"east_wolf",name:"늑대",faction:"동양",asset:"east-wolf.png",hp:65,attack:7,exp:18,gold:8},
 {id:"east_bandit",name:"산적",faction:"동양",asset:"east-bandit.png",hp:80,attack:9,exp:22,gold:11},
 {id:"west_skeleton",name:"해골병사",faction:"서양",asset:"west-skeleton-fixed.svg",hp:90,attack:10,exp:25,gold:13},
 {id:"west_goblin",name:"고블린",faction:"서양",asset:"west-goblin.png",hp:72,attack:8,exp:20,gold:10}
];

const app=document.querySelector("#app");
let state={screen:"title",mapId:"village",gender:null,job:null,name:"무명",monsterIndex:0,wave:1,level:1,exp:0,gold:0,heroHp:100,monsterHp:0,auto:true,running:false,timer:null,skillCooldown:false};

function render(){
 if(state.screen==="title") return title();
 if(state.screen==="select") return select();
 if(state.screen==="map") return mapScreen();
 return battle();
}
function title(){
 app.innerHTML=`<section class="title-screen">
 <p class="eyebrow">WUXIA KNIGHTS</p><h1>무협기사단</h1>
 <p class="subtitle">동양의 무림과 서양의 기사단이 충돌하는 하나의 세계에서 펼쳐지는 방치형 RPG</p>
 <button id="startButton">게임 시작</button><p class="status">웹 게임 1차 실행 버전 · 캐릭터 / 몬스터 / 자동전투</p>
 </section>`;
 document.querySelector("#startButton").onclick=()=>{state.screen="select";render()};
}
function select(){
 app.innerHTML=`<section class="panel select-panel">
 <div class="eyebrow">CHARACTER CREATE</div><h2>캐릭터 생성</h2>
 <div class="step-title">1. 성별</div><div class="choices" id="gender"></div>
 <div class="step-title">2. 직업</div><div class="choices jobs" id="jobs"></div>
 <div class="name-row"><input id="name" maxlength="12" value="${state.name}" placeholder="캐릭터 이름"><button id="create">게임 시작</button></div>
 </section>`;
 const g=document.querySelector("#gender");
 [["male","남성"],["female","여성"]].forEach(([id,label])=>{const b=document.createElement("button");b.textContent=label;b.className=state.gender===id?"selected":"";b.onclick=()=>{state.gender=id;render()};g.appendChild(b)});
 const j=document.querySelector("#jobs");
 JOBS.forEach(job=>{const b=document.createElement("button");b.innerHTML=`<strong>${job.name}</strong><small>${job.faction} · ${job.skill}</small>`;b.className=state.job?.id===job.id?"selected":"";b.onclick=()=>{state.job=job;render()};j.appendChild(b)});
 document.querySelector("#create").onclick=()=>{const n=document.querySelector("#name").value.trim();if(!state.gender||!state.job||!n){alert("성별, 직업, 이름을 선택해주세요.");return}state.name=n;state.screen="map";state.running=false;state.monsterIndex=(state.wave-1)%MONSTERS.length;state.heroHp=100;spawnMonster();startLoop();render()};
}
function mapScreen(){
 const map=getMap(state.mapId);
 const isField=state.mapId==="east-field";
 const job=state.job;
 const buildings=map.buildings.map(b=>`<div class="map-object building" style="left:${b.x/9.6}%;top:${b.y/5.4}%;width:${b.w/9.6}%;height:${b.h/5.4}%"><div class="icon">${b.icon}</div><span>${b.name}</span></div>`).join("");
 const trees=map.trees.map(([x,y])=>`<div class="map-object tree" style="left:${x/9.6}%;top:${y/5.4}%"></div>`).join("");
 const portals=map.portals.map(p=>`<button class="map-object portal" data-map="${p.id}" style="left:${p.x/9.6}%;top:${p.y/5.4}%;width:${p.w/9.6}%;height:${p.h/5.4}%">${p.name}</button>`).join("");
 app.innerHTML=`<section class="map-screen"><header class="map-top"><div><span class="eyebrow">WUXIA KNIGHTS · WORLD MAP</span><h2>${map.name}</h2><small>${map.description||""}</small></div><div class="map-actions"><button id="battleTest">전투 테스트</button><button id="changeChar">캐릭터 변경</button></div></header><div class="map-wrap"><div class="map-frame"><div class="map-ground"></div><div class="map-road"></div>${isField?"<div class=\"map-river\"></div>":""}<div class="map-label"><b>${map.name}</b><small>현재 위치</small></div>${buildings}${trees}${portals}<div class="map-object player-marker" style="left:${(map.spawn.x/9.6)-2}%;top:${(map.spawn.y/5.4)-5}%"><div class="player-dot">●</div><span>${state.name}</span></div></div><div class="map-info"><div class="card"><b>현재 지역</b><span>${map.name}</span></div><div class="card"><b>진영</b><span>${job?.faction||"미정"} · ${job?.name||"미정"}</span></div><div class="card"><b>다음 단계</b><span>캐릭터 실시간 이동</span></div></div></div></section>`;
 document.querySelector("#battleTest").onclick=()=>{state.screen="battle";state.running=true;spawnMonster();startLoop();render()};
 document.querySelector("#changeChar").onclick=()=>{state.screen="select";render()};
 document.querySelectorAll("[data-map]").forEach(b=>b.onclick=()=>{state.mapId=b.dataset.map;render()});
}
function heroElement(){return document.querySelector("#heroSprite")}
function monsterElement(){return document.querySelector("#monsterSprite")}
function spawnMonster(){state.monsterIndex=(state.wave-1)%MONSTERS.length;state.monsterHp=MONSTERS[state.monsterIndex].hp}
function battle(){
 const job=state.job, monster=MONSTERS[state.monsterIndex];
 app.innerHTML=`<section class="game-shell">
 <header class="game-header"><div><span class="eyebrow">WUXIA KNIGHTS</span><h2>무협기사단</h2></div>
 <div class="resources"><span>Lv.${state.level}</span><span>EXP ${state.exp}</span><span>💰 ${state.gold}</span><span>WAVE ${state.wave}</span></div></header>
 <section class="battle-stage">
  <div class="battle-side hero-side"><div class="unit-name">${state.name}<small>${job.faction} · ${job.name}</small></div>
   <div class="unit-stage"><div class="bubble" id="heroBubble"></div><div class="hero-sprite" id="heroSprite"></div></div>
   <div class="bar"><span style="width:${state.heroHp}%"></span></div><div class="hp-text">HP ${Math.max(0,state.heroHp)} / 100</div>
  </div>
  <div class="vs">VS</div>
  <div class="battle-side monster-side"><div class="unit-name">${monster.name}<small>${monster.faction} · Lv.1</small></div>
   <div class="unit-stage"><div class="bubble enemy" id="monsterBubble"></div><img class="monster-sprite" id="monsterSprite" src="./assets/monsters/${monster.asset}?v=game1" alt="${monster.name}"></div>
   <div class="bar enemy-bar"><span style="width:${Math.max(0,state.monsterHp/monster.hp*100)}%"></span></div><div class="hp-text">HP ${Math.max(0,state.monsterHp)} / ${monster.hp}</div>
  </div>
 </section>
 <section class="control-panel">
  <div class="skill-box"><div><b>${job.skill}</b><small>자동 사용 가능</small></div><button id="skill" ${state.skillCooldown?"disabled":""}>스킬 사용</button></div>
  <div class="actions"><button id="auto">${state.auto?"자동전투 ON":"자동전투 OFF"}</button><button id="next">다음 몬스터</button><button id="back">캐릭터 변경</button></div>
  <p id="battleLog" class="battle-log">전투가 진행됩니다.</p>
 </section>
 </section>`;
 updateAnimationState();
 document.querySelector("#auto").onclick=()=>{state.auto=!state.auto;render()};
 document.querySelector("#next").onclick=()=>{state.wave++;spawnMonster();state.heroHp=100;render();say("새로운 적이 나타났다!")};
 document.querySelector("#back").onclick=()=>{stopLoop();state.screen="select";render()};
 document.querySelector("#skill").onclick=()=>useSkill();
}
function updateAnimationState(){playCharacterAnimation(heroElement(),"idle");playMonsterAnimation(monsterElement(),"idle")}
function say(text,enemy=false){const el=document.querySelector(enemy?"#monsterBubble":"#heroBubble");if(!el)return;el.textContent=text;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),900)}
function log(text){const el=document.querySelector("#battleLog");if(el)el.textContent=text}
function damageMonster(amount){
 state.monsterHp=Math.max(0,state.monsterHp-amount);render();
 if(state.monsterHp<=0){say("해냈다!");state.exp+=MONSTERS[state.monsterIndex].exp;state.gold+=MONSTERS[state.monsterIndex].gold;checkLevel();setTimeout(()=>{state.wave++;spawnMonster();render();say("다음 적이다!")},500)}
 else {const m=MONSTERS[state.monsterIndex];playMonsterAnimation(monsterElement(),"hit");say("아야!",true);setTimeout(()=>monsterAttack(m),350)}
}
function monsterAttack(m){if(!state.running)return;state.heroHp=Math.max(0,state.heroHp-m.attack);render();playCharacterReaction(heroElement(),"hit");say("윽!",false);if(state.heroHp<=0){playCharacterReaction(heroElement(),"death");log("캐릭터가 쓰러졌습니다. 부활 후 다시 전투합니다.");setTimeout(()=>{state.heroHp=100;render();say("다시 간다!")},900)}}
function heroAttack(){const j=state.job;playJobAttack(heroElement(),j.id,()=>{});say("받아라!");setTimeout(()=>damageMonster(j.power+Math.floor(Math.random()*5)),260)}
function useSkill(){if(state.skillCooldown||state.monsterHp<=0)return;state.skillCooldown=true;const j=state.job;playJobAttack(heroElement(),j.id,()=>{});say(j.skill+"!");setTimeout(()=>damageMonster(j.power*2+4),300);setTimeout(()=>{state.skillCooldown=false;render()},2200);render()}
function checkLevel(){const need=state.level*60;if(state.exp>=need){state.exp-=need;state.level++;say("레벨 업!")}}
function loop(){if(!state.running||state.screen!=="battle")return;if(state.auto&&!state.skillCooldown&&state.monsterHp>0)heroAttack();state.timer=setTimeout(loop,1600)}
function startLoop(){stopLoop();state.timer=setTimeout(loop,700)}
function stopLoop(){if(state.timer){clearTimeout(state.timer);state.timer=null}}
render();
