const gameState={name:"무명",job:"무사",level:1};
const KENNEY="https://raw.githubusercontent.com/BennyLinntu/RPG_Game_dev/83c1ee321a4cf6fb2c2a5c1a6c38c1f550963eb6/kenney_tiny-dungeon/Tiles/";

class WorldScene extends Phaser.Scene{
 constructor(){super("World")}

 preload(){
  // Kenney Tiny Dungeon - 실제 16x16 PNG 에셋
  const tiles=[1,2,3,4,5,13,15,16,17,25,26,27,28,29,40,48,49,57,59,84,85,86];
  tiles.forEach(n=>{
   const id=String(n).padStart(4,"0");
   this.load.image("k"+n,KENNEY+"tile_"+id+".png");
  });
 }

 create(){
  this.cameras.main.setBackgroundColor("#17231a");
  this.worldW=2560; this.worldH=1600;

  // 실제 Kenney 바닥 타일을 반복해 전체 월드 구성
  this.add.tileSprite(1280,800,this.worldW,this.worldH,"k48").setOrigin(.5).setScale(2);

  this.drawMap();
  this.createPlayer();
  this.createMonsters();
  this.createCombatUI();
  this.createTouchControls();

  this.keys=this.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT");
  this.cameras.main.startFollow(this.player,true,.08,.08);
  this.cameras.main.setBounds(0,0,this.worldW,this.worldH);

  this.add.text(24,24,"청운촌",{
   fontSize:"28px",color:"#fff",fontStyle:"bold",stroke:"#1a1712",strokeThickness:6
  }).setScrollFactor(0).setDepth(100);

  this.add.text(24,60,gameState.name+" · "+gameState.job+" · Lv."+gameState.level,{
   fontSize:"15px",color:"#f2dfbd",backgroundColor:"#171411cc",
   padding:{x:8,y:6}
  }).setScrollFactor(0).setDepth(100);

  this.add.text(24,108,"Kenney Tiny Dungeon · 이동해서 마을을 탐험하세요",{
   fontSize:"14px",color:"#e7d8bc",backgroundColor:"#171411aa",
   padding:{x:8,y:6}
  }).setScrollFactor(0).setDepth(100);
 }

 drawMap(){
  // 중앙 광장과 주요 이동로
  this.add.tileSprite(1280,800,1120,96,"k49").setScale(2).setDepth(2);
  this.add.tileSprite(1280,800,96,1120,"k49").setScale(2).setDepth(2);

  // 실제 타일로 만든 4개의 건물/시설
  // 시작 위치에서 바로 보이도록 주요 건물을 중앙 광장 주변에 배치
  this.makeBuilding("주막",1030,520,9,6,"k40");
  this.makeBuilding("대장간",1530,520,9,6,"k28");
  this.makeBuilding("상점",1030,1080,9,6,"k29");
  this.makeBuilding("기사단",1530,1080,9,6,"k40");

  // 중앙 광장 장식
  this.add.image(1280,800,"k85").setScale(2.5).setDepth(8);
  this.add.image(1160,690,"k85").setScale(2).setDepth(8);
  this.add.image(1400,690,"k86").setScale(2).setDepth(8);

  // 월드 외곽 벽
  for(let x=64;x<this.worldW-64;x+=32){
   this.add.image(x,48,"k2").setScale(2).setDepth(5);
   this.add.image(x,this.worldH-48,"k26").setScale(2).setDepth(5);
  }
  for(let y=80;y<this.worldH-80;y+=32){
   this.add.image(48,y,"k13").setScale(2).setDepth(5);
   this.add.image(this.worldW-48,y,"k15").setScale(2).setDepth(5);
  }
 }

 makeBuilding(label,cx,cy,cols,rows,faceKey){
  const tile=32;
  const startX=cx-(cols-1)*tile/2;
  const startY=cy-(rows-1)*tile/2;

  for(let r=0;r<rows;r++){
   for(let c=0;c<cols;c++){
    let key=faceKey;
    if(r===0) key="k2";
    if(r===rows-1) key="k26";
    if(c===0) key="k13";
    if(c===cols-1) key="k15";
    this.add.image(startX+c*tile,startY+r*tile,key).setScale(2).setDepth(4);
   }
  }

  this.add.text(cx,cy+rows*tile/2+12,label,{
   fontSize:"22px",color:"#fff",fontStyle:"bold",
   stroke:"#201812",strokeThickness:6,
   backgroundColor:"#171411bb",padding:{x:10,y:6}
  }).setOrigin(.5).setDepth(30);
 }

 createPlayer(){
  this.player=this.add.container(1280,800).setDepth(50);
  this.playerSprite=this.add.image(0,0,"k86").setScale(3);
  this.player.add(this.playerSprite);
  this.playerSpeed=220;
  this.playerHP=100;
  this.walkTime=0;
 }

 createMonsters(){
  this.monsters=[];
  const spots=[
   {x:760,y:520,name:"산적",hp:30,atk:5},
   {x:1800,y:720,name:"해골병",hp:36,atk:6},
   {x:820,y:1210,name:"고블린",hp:28,atk:4},
   {x:1810,y:1190,name:"던전 수호자",hp:45,atk:8}
  ];
  spots.forEach((s,i)=>{
   const m=this.add.container(s.x,s.y).setDepth(45);
   const sprite=this.add.image(0,0,i===3?"k84":"k85").setScale(2.6);
   m.add(sprite);
   const tag=this.add.text(0,32,s.name,{fontSize:"13px",color:"#fff",fontStyle:"bold",stroke:"#201812",strokeThickness:4}).setOrigin(.5);
   m.add(tag);
   m.setDataEnabled();
   m.setData("name",s.name);m.setData("hp",s.hp);m.setData("maxHp",s.hp);m.setData("atk",s.atk);m.setData("alive",true);
   this.monsters.push(m);
  });
 }

 createCombatUI(){
  this.combat={active:false,target:null,turn:false};
  const shade=this.add.rectangle(0,0,this.scale.width,this.scale.height,0x0b0806,.82)
   .setOrigin(0).setScrollFactor(0).setDepth(500).setVisible(false);
  const panel=this.add.rectangle(this.scale.width/2,this.scale.height/2,Math.min(560,this.scale.width-36),Math.min(430,this.scale.height-120),0x241a13,.98)
   .setOrigin(.5).setScrollFactor(0).setDepth(501).setVisible(false);
  const title=this.add.text(this.scale.width/2,130,"전투",{
   fontSize:"30px",color:"#f8e8c9",fontStyle:"bold",stroke:"#120e0b",strokeThickness:6
  }).setOrigin(.5).setScrollFactor(0).setDepth(502).setVisible(false);
  const enemy=this.add.text(this.scale.width/2,185,"",{
   fontSize:"21px",color:"#fff",fontStyle:"bold",align:"center"
  }).setOrigin(.5).setScrollFactor(0).setDepth(502).setVisible(false);
  const status=this.add.text(this.scale.width/2,225,"",{
   fontSize:"15px",color:"#d9c4a1",align:"center",wordWrap:{width:Math.min(480,this.scale.width-70)}
  }).setOrigin(.5).setScrollFactor(0).setDepth(502).setVisible(false);
  const attack=this.add.text(this.scale.width/2,320,"공격",{
   fontSize:"20px",color:"#fff",backgroundColor:"#70472d",padding:{x:34,y:14},
   fontStyle:"bold"
  }).setOrigin(.5).setScrollFactor(0).setDepth(503).setInteractive({useHandCursor:true}).setVisible(false);
  const run=this.add.text(this.scale.width/2,390,"도망가기",{
   fontSize:"16px",color:"#ead9bd",backgroundColor:"#3a2a20",padding:{x:22,y:10}
  }).setOrigin(.5).setScrollFactor(0).setDepth(503).setInteractive({useHandCursor:true}).setVisible(false);

  this.combatUI={shade,panel,title,enemy,status,attack,run};
  attack.on("pointerdown",()=>this.combatAttack());
  run.on("pointerdown",()=>this.endCombat(false));

  const resize=()=>{
   shade.setSize(this.scale.width,this.scale.height);
   panel.setPosition(this.scale.width/2,this.scale.height/2);
   title.setPosition(this.scale.width/2,Math.max(90,this.scale.height*.20));
   enemy.setPosition(this.scale.width/2,Math.max(145,this.scale.height*.29));
   status.setPosition(this.scale.width/2,Math.max(190,this.scale.height*.36));
   attack.setPosition(this.scale.width/2,Math.max(280,this.scale.height*.55));
   run.setPosition(this.scale.width/2,Math.max(350,this.scale.height*.68));
  };
  resize();this.scale.on("resize",resize);
 }

 startCombat(monster){
  if(this.combat.active||!monster.getData("alive"))return;
  this.combat.active=true;this.combat.target=monster;
  this.physics?.pause?.();
  const u=this.combatUI;
  [u.shade,u.panel,u.title,u.enemy,u.status,u.attack,u.run].forEach(x=>x.setVisible(true));
  u.enemy.setText(monster.getData("name")+"  ·  HP "+monster.getData("hp")+"/"+monster.getData("maxHp"));
  u.status.setText("무명 · HP "+this.playerHP+"/100\n적을 공격해서 쓰러뜨리세요.");
 }

 combatAttack(){
  if(!this.combat.active||!this.combat.target)return;
  const m=this.combat.target;
  let hp=Math.max(0,m.getData("hp")-14);
  m.setData("hp",hp);
  if(hp<=0){
   m.setData("alive",false);
   m.setVisible(false);
   this.combatUI.status.setText("승리! 경험치와 금화를 획득했습니다.");
   this.time.delayedCall(700,()=>this.endCombat(true));
   return;
  }
  this.playerHP=Math.max(0,this.playerHP-m.getData("atk"));
  this.combatUI.enemy.setText(m.getData("name")+"  ·  HP "+hp+"/"+m.getData("maxHp"));
  this.combatUI.status.setText("공격 성공!\n무명 · HP "+this.playerHP+"/100");
  if(this.playerHP<=0){
   this.combatUI.status.setText("패배했습니다. 다시 일어섭니다.");
   this.time.delayedCall(900,()=>{this.playerHP=100;this.endCombat(false)});
  }
 }

 endCombat(win){
  this.combat.active=false;this.combat.target=null;
  const u=this.combatUI;
  [u.shade,u.panel,u.title,u.enemy,u.status,u.attack,u.run].forEach(x=>x.setVisible(false));
  if(win)this.playerHP=100;
 }

 createTouchControls(){
  this.joystick={active:false,x:0,y:0};

  const base=this.add.circle(90,this.scale.height-82,58,0x171411,.82)
   .setStrokeStyle(4,0xd5b16d,.95).setScrollFactor(0).setDepth(200);

  const knob=this.add.circle(90,this.scale.height-82,27,0xd5b16d,.95)
   .setStrokeStyle(3,0xffedc2,.95).setScrollFactor(0).setDepth(201);

  const label=this.add.text(90,this.scale.height-16,"이동",{
   fontSize:"13px",color:"#fff",fontStyle:"bold",
   backgroundColor:"#171411cc",padding:{x:8,y:4}
  }).setOrigin(.5).setScrollFactor(0).setDepth(202);

  const center={x:90,y:this.scale.height-82};
  const radius=58,knobRadius=34;
  let activePointerId=null;

  const place=()=>{
   center.x=Math.max(76,Math.min(110,this.scale.width*.14));
   center.y=this.scale.height-82;
   base.setPosition(center.x,center.y);
   knob.setPosition(center.x,center.y);
   label.setPosition(center.x,this.scale.height-16);
  };
  place();
  this.scale.on("resize",place);

  const move=p=>{
   let dx=p.x-center.x,dy=p.y-center.y,d=Math.hypot(dx,dy);
   if(d>knobRadius){dx=dx/d*knobRadius;dy=dy/d*knobRadius}
   this.joystick.x=dx/knobRadius;
   this.joystick.y=dy/knobRadius;
   knob.setPosition(center.x+dx,center.y+dy);
  };

  const release=p=>{
   if(activePointerId!==null&&p&&p.id!==activePointerId)return;
   activePointerId=null;
   this.joystick.active=false;
   this.joystick.x=0;this.joystick.y=0;
   knob.setPosition(center.x,center.y);
  };

  this.input.on("pointerdown",p=>{
   if(Math.hypot(p.x-center.x,p.y-center.y)<=radius*1.25){
    activePointerId=p.id;
    this.joystick.active=true;
    move(p);
   }
  });
  this.input.on("pointermove",p=>{
   if(this.joystick.active&&p.id===activePointerId)move(p);
  });
  this.input.on("pointerup",release);
  this.input.on("pointerupoutside",release);
 }

 update(){
  if(this.combat?.active)return;
  let dx=0,dy=0;
  if(this.keys.A.isDown||this.keys.LEFT.isDown)dx--;
  if(this.keys.D.isDown||this.keys.RIGHT.isDown)dx++;
  if(this.keys.W.isDown||this.keys.UP.isDown)dy--;
  if(this.keys.S.isDown||this.keys.DOWN.isDown)dy++;
  dx+=this.joystick.x;dy+=this.joystick.y;

  if(dx||dy){
   this.walkTime+=this.game.loop.delta;
   const step=Math.sin(this.walkTime/70)*2.2;
   this.playerSprite.y=step;
   this.playerSprite.scale=3+Math.abs(Math.sin(this.walkTime/70))*0.04;
   const l=Math.hypot(dx,dy);
   this.player.x=Phaser.Math.Clamp(
    this.player.x+dx/l*this.playerSpeed*this.game.loop.delta/1000,110,2450
   );
   this.player.y=Phaser.Math.Clamp(
    this.player.y+dy/l*this.playerSpeed*this.game.loop.delta/1000,110,1490
   );
  }else{
   this.playerSprite.y=0;
   this.playerSprite.scale=3;
  }

  if(!this.combat?.active){
   for(const m of this.monsters){
    if(m.getData("alive")&&Phaser.Math.Distance.Between(this.player.x,this.player.y,m.x,m.y)<58){
     this.startCombat(m);
     break;
    }
   }
  }
 }
}

const config={
 type:Phaser.AUTO,
 parent:"game",
 width:1280,
 height:720,
 backgroundColor:"#17231a",
 scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},
 pixelArt:true,
 scene:[WorldScene]
};

new Phaser.Game(config);

// 새 버전이 배포되면 10초 이내 자동 새로고침
const APP_VERSION="13";
setInterval(async()=>{
 try{
  const r=await fetch("./version.json?t="+Date.now(),{cache:"no-store"});
  const v=await r.json();
  if(v.version!==APP_VERSION)location.reload();
 }catch(e){}
},10000);
