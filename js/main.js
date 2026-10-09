const gameState={name:"무명",job:"무사",level:1};
const KENNEY="https://raw.githubusercontent.com/BennyLinntu/RPG_Game_dev/83c1ee321a4cf6fb2c2a5c1a6c38c1f550963eb6/kenney_tiny-dungeon/Tiles/";

class WorldScene extends Phaser.Scene{
 constructor(){super("World")}

 preload(){
  // Kenney Tiny Dungeon - 실제 16x16 PNG 에셋
  this.load.image("hero-idle","./assets/characters/swordswoman-idle.png?v=25");
  this.load.spritesheet("hero-walk-natural","./assets/characters/swordswoman-walk-natural.png?v=25",{frameWidth:64,frameHeight:64});
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

  this.anims.create({key:"hero-walk-natural-loop",frames:this.anims.generateFrameNumbers("hero-walk-natural",{start:0,end:3}),frameRate:9,repeat:-1});

  this.drawMap();
  this.createPlayer();
  this.createMonsters();
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
  this.playerSprite=this.add.image(0,0,"hero-idle").setScale(0.82);
  this.player.add(this.playerSprite);
  this.walkSprite=this.add.sprite(0,0,"hero-walk-natural",0).setScale(0.82).setVisible(false);
  this.player.add(this.walkSprite);

  // 플레이어 손에 들린 검: 접근하면 실제로 휘두르는 모션
  this.weapon=this.add.graphics();
  this.weapon.fillStyle(0xe9e3d4,1);
  this.weapon.fillRect(-3,-30,6,27);
  this.weapon.fillStyle(0x9b7045,1);
  this.weapon.fillRect(-5,-5,10,4);
  this.weapon.fillStyle(0x4b3020,1);
  this.weapon.fillRect(-2,0,4,12);
  this.weapon.setPosition(18,-2);
  this.weapon.setRotation(-1.05);
  this.weapon.setVisible(false);
  this.player.add(this.weapon);

  this.slash=this.add.graphics().setVisible(false);
  this.slash.lineStyle(3,0xffe4a3,0.9);
  this.slash.arc(0,0,40,-0.85,0.85,false);
  this.slash.setPosition(0,-2);
  this.player.add(this.slash);

  this.playerSpeed=220;
  this.playerHP=100;
  this.facing="down";
  this.walkTime=0;
  this.attackCooldown=0;
  this.attackTimer=0;
  this.attackTarget=null;
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

 startMelee(monster){
  if(this.attackCooldown>0 || !monster.getData("alive"))return;
  this.attackTarget=monster;
  this.attackCooldown=650;
  this.attackTimer=0;

  const dx=monster.x-this.player.x;
  const dy=monster.y-this.player.y;
  // 캐릭터 본체는 정면을 유지하고, 무기만 적 방향으로 휘두른다.
  const attackAngle=Math.atan2(dy,dx);
  this.weapon.setPosition(Math.cos(attackAngle)*16,Math.sin(attackAngle)*16);
  this.weapon.setRotation(attackAngle-1.25);
  this.slash.setPosition(Math.cos(attackAngle)*18,Math.sin(attackAngle)*18);
  this.slash.setRotation(attackAngle);
  this.slash.setVisible(true);
  this.weapon.setVisible(false);

  // 검을 크게 휘두르는 420ms 공격 애니메이션
  this.tweens.add({
   targets:this.weapon,
   rotation:attackAngle+0.95,
   duration:260,
   ease:"Cubic.easeOut",
   onComplete:()=>{
    this.slash.setVisible(false);
   }
  });

  this.tweens.add({
   targets:this.playerSprite,
   x:2,scaleX:1.12,scaleY:0.96,
   duration:90,yoyo:true,ease:"Quad.easeOut"
  });

  // 타격 시점
  this.time.delayedCall(220,()=>{
   if(!monster.getData("alive"))return;
   const hp=Math.max(0,monster.getData("hp")-15);
   monster.setData("hp",hp);
   monster.setScale(2.9);
   this.tweens.add({targets:monster,alpha:0.35,duration:70,yoyo:true});
   if(hp<=0){
    monster.setData("alive",false);
    this.tweens.add({
     targets:monster,alpha:0,scaleX:0.2,scaleY:0.2,angle:120,
     duration:300,
     onComplete:()=>monster.destroy()
    });
    this.add.text(monster.x,monster.y-40,"+EXP  +GOLD",{
     fontSize:"14px",color:"#ffe9a6",fontStyle:"bold",
     stroke:"#24180f",strokeThickness:4
    }).setOrigin(.5).setDepth(90);
   }
  });
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
  this.attackCooldown=Math.max(0,this.attackCooldown-this.game.loop.delta);
  let dx=0,dy=0;
  if(this.keys.A.isDown||this.keys.LEFT.isDown)dx--;
  if(this.keys.D.isDown||this.keys.RIGHT.isDown)dx++;
  if(this.keys.W.isDown||this.keys.UP.isDown)dy--;
  if(this.keys.S.isDown||this.keys.DOWN.isDown)dy++;
  dx+=this.joystick.x;dy+=this.joystick.y;

  if(dx||dy){
   // 좌우 입력이 있을 때만 바라보는 방향을 갱신한다.
   // 위/아래 이동이나 정지 시에는 마지막 방향을 유지한다.
   if(Math.abs(dx)>0.12 && Math.abs(dx)>=Math.abs(dy)*0.75){
    this.facing=dx>0?"right":"left";
    this.playerSprite.setFlipX(this.facing==="left");
    this.playerSprite.setVisible(false);
    this.walkSprite.setVisible(true);
    this.walkSprite.setFlipX(this.facing==="left");
    this.walkSprite.play("hero-walk-natural-loop",true);
    this.walkSprite.setPosition(0,0);
    this.walkSprite.setScale(0.82,0.82);
   }else{
    // 위/아래는 기존 캐릭터 이미지를 사용한다.
    this.walkSprite.anims.stop();
    this.walkSprite.setVisible(false);
    this.playerSprite.setVisible(true);
    this.playerSprite.setFlipX(this.facing==="left");
    this.walkTime+=this.game.loop.delta;
    const step=(Math.sin(this.walkTime/75)+1)/2;
    this.playerSprite.y=-step*2.5;
    this.playerSprite.setScale(0.82-step*0.012,0.82+step*0.012);
   }
   const l=Math.hypot(dx,dy);
   this.player.x=Phaser.Math.Clamp(
    this.player.x+dx/l*this.playerSpeed*this.game.loop.delta/1000,110,2450
   );
   this.player.y=Phaser.Math.Clamp(
    this.player.y+dy/l*this.playerSpeed*this.game.loop.delta/1000,110,1490
   );
  }else{
   // 멈추면 걷기 애니메이션을 멈추고 마지막 바라보던 방향으로 대기한다.
   this.walkSprite.anims.stop();
   this.walkSprite.setVisible(false);
   this.playerSprite.setVisible(true);
   this.playerSprite.setFlipX(this.facing==="left");
   this.playerSprite.setPosition(0,0);
   this.playerSprite.setScale(0.82,0.82);
  }

  // 몬스터와 가까워지면 전투창 없이 바로 검을 휘두른다.
  let nearest=null;
  let nearestDist=Infinity;
  for(const m of this.monsters){
   if(!m.active||!m.getData("alive"))continue;
   const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,m.x,m.y);
   if(d<68&&d<nearestDist){nearest=m;nearestDist=d;}
  }
  if(nearest && this.attackCooldown<=0){
   this.startMelee(nearest);
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
const APP_VERSION="25";
setInterval(async()=>{
 try{
  const r=await fetch("./version.json?t="+Date.now(),{cache:"no-store"});
  const v=await r.json();
  if(v.version!==APP_VERSION)location.reload();
 }catch(e){}
},10000);
