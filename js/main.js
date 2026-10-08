const gameState={name:"무명",job:"무사",level:1};
const KENNEY="https://raw.githubusercontent.com/BennyLinntu/RPG_Game_dev/83c1ee321a4cf6fb2c2a5c1a6c38c1f550963eb6/kenney_tiny-dungeon/Tiles/";

class WorldScene extends Phaser.Scene{
 constructor(){super("World")}

 preload(){
  // Kenney Tiny Dungeon - 실제 16x16 PNG 에셋
  const tiles=[1,2,3,4,5,13,15,16,17,25,26,27,28,29,40,48,49,57,59,85,86];
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
  let dx=0,dy=0;
  if(this.keys.A.isDown||this.keys.LEFT.isDown)dx--;
  if(this.keys.D.isDown||this.keys.RIGHT.isDown)dx++;
  if(this.keys.W.isDown||this.keys.UP.isDown)dy--;
  if(this.keys.S.isDown||this.keys.DOWN.isDown)dy++;
  dx+=this.joystick.x;dy+=this.joystick.y;

  if(dx||dy){
   const l=Math.hypot(dx,dy);
   this.player.x=Phaser.Math.Clamp(
    this.player.x+dx/l*this.playerSpeed*this.game.loop.delta/1000,110,2450
   );
   this.player.y=Phaser.Math.Clamp(
    this.player.y+dy/l*this.playerSpeed*this.game.loop.delta/1000,110,1490
   );
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
const APP_VERSION="12";
setInterval(async()=>{
 try{
  const r=await fetch("./version.json?t="+Date.now(),{cache:"no-store"});
  const v=await r.json();
  if(v.version!==APP_VERSION)location.reload();
 }catch(e){}
},10000);
