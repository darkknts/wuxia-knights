const gameState={name:"무명",job:"무사",level:1};
const KENNEY="https://raw.githubusercontent.com/BennyLinntu/RPG_Game_dev/83c1ee321a4cf6fb2c2a5c1a6c38c1f550963eb6/kenney_tiny-dungeon/Tiles/";
function boot(){
 document.querySelector("#game").innerHTML='<div id="overlay"><div class="panel"><div class="eyebrow">WUXIA KNIGHTS</div><h1>무협기사단</h1><p>Kenney Tiny Dungeon 에셋 적용 테스트</p><button id="start">게임 시작</button></div></div>';
 document.querySelector("#start").onclick=()=>{document.querySelector("#overlay").remove();new Phaser.Game(config)}
}
class WorldScene extends Phaser.Scene{
 constructor(){super("World")}
 preload(){
  this.load.image("floor",KENNEY+"tile_0048.png");
  this.load.image("player",KENNEY+"tile_0086.png");
 }
 create(){
  this.cameras.main.setBackgroundColor("#17231a");this.worldW=2200;this.worldH=1400;
  this.add.tileSprite(this.worldW/2,this.worldH/2,this.worldW,this.worldH,"floor").setOrigin(.5).setScale(2);
  this.drawWorld();
  this.player=this.add.container(1100,850);
  this.playerSprite=this.add.image(0,0,"player").setScale(3);
  this.player.add(this.playerSprite);this.player.setDepth(20);this.playerSpeed=210;
  this.keys=this.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT");
  this.joystick={active:false,x:0,y:0};this.createTouchControls();
  this.cameras.main.startFollow(this.player,true,.08,.08);this.cameras.main.setBounds(0,0,this.worldW,this.worldH);
  this.add.text(24,24,"청운촌",{fontSize:"28px",color:"#fff",fontStyle:"bold",stroke:"#1a1712",strokeThickness:6}).setScrollFactor(0).setDepth(100);
  this.add.text(24,60,gameState.name+" · "+gameState.job+" · Lv."+gameState.level,{fontSize:"15px",color:"#f2dfbd",backgroundColor:"#171411cc",padding:{x:8,y:6}}).setScrollFactor(0).setDepth(100);
  this.add.text(24,108,"실제 Kenney 픽셀 에셋 · 터치 조이스틱으로 이동",{fontSize:"14px",color:"#e7d8bc",backgroundColor:"#171411aa",padding:{x:8,y:6}}).setScrollFactor(0).setDepth(100);
 }
 drawWorld(){
  const g=this.add.graphics();
  g.fillStyle(0x9a7b4e,1);g.fillRect(100,770,2000,150);g.fillRect(1020,100,160,1300);
  [["주막",550,650],["대장간",1500,620],["상점",1550,1000],["기사단",650,1050]].forEach(([name,x,y])=>{
   g.fillStyle(0x5b4030,1);g.fillRect(x-110,y-70,220,140);
   this.add.text(x,y,name,{fontSize:"20px",color:"#fff",fontStyle:"bold",stroke:"#201812",strokeThickness:5}).setOrigin(.5)
  });
  g.fillStyle(0x4b808c,.95);g.fillRect(1760,100,250,420);
  this.add.text(1885,310,"청운강",{fontSize:"18px",color:"#eef8fa",fontStyle:"bold"}).setOrigin(.5);
 }
 createTouchControls(){
  const base=this.add.circle(90,this.scale.height-82,58,0x171411,.82).setStrokeStyle(4,0xd5b16d,.95).setScrollFactor(0).setDepth(200);
  const knob=this.add.circle(90,this.scale.height-82,27,0xd5b16d,.95).setStrokeStyle(3,0xffedc2,.95).setScrollFactor(0).setDepth(201);
  const label=this.add.text(90,this.scale.height-16,"이동",{fontSize:"13px",color:"#fff",fontStyle:"bold",backgroundColor:"#171411cc",padding:{x:8,y:4}}).setOrigin(.5).setScrollFactor(0).setDepth(202);
  const center={x:90,y:this.scale.height-82},radius=58,knobRadius=34;let activePointerId=null;
  const place=()=>{center.x=Math.max(76,Math.min(110,this.scale.width*.14));center.y=this.scale.height-82;base.setPosition(center.x,center.y);knob.setPosition(center.x,center.y);label.setPosition(center.x,this.scale.height-16)};place();this.scale.on("resize",place);
  const move=p=>{let dx=p.x-center.x,dy=p.y-center.y,d=Math.hypot(dx,dy);if(d>knobRadius){dx=dx/d*knobRadius;dy=dy/d*knobRadius}this.joystick.x=dx/knobRadius;this.joystick.y=dy/knobRadius;knob.setPosition(center.x+dx,center.y+dy)};
  const release=p=>{if(activePointerId!==null&&p&&p.id!==activePointerId)return;activePointerId=null;this.joystick.active=false;this.joystick.x=0;this.joystick.y=0;knob.setPosition(center.x,center.y)};
  this.input.on("pointerdown",p=>{if(Math.hypot(p.x-center.x,p.y-center.y)<=radius*1.25){activePointerId=p.id;this.joystick.active=true;move(p)}});
  this.input.on("pointermove",p=>{if(this.joystick.active&&p.id===activePointerId)move(p)});this.input.on("pointerup",release);this.input.on("pointerupoutside",release);
 }
 update(){
  let dx=0,dy=0;if(this.keys.A.isDown||this.keys.LEFT.isDown)dx--;if(this.keys.D.isDown||this.keys.RIGHT.isDown)dx++;if(this.keys.W.isDown||this.keys.UP.isDown)dy--;if(this.keys.S.isDown||this.keys.DOWN.isDown)dy++;
  dx+=this.joystick.x;dy+=this.joystick.y;
  if(dx||dy){const l=Math.hypot(dx,dy);this.player.x=Phaser.Math.Clamp(this.player.x+dx/l*this.playerSpeed*this.game.loop.delta/1000,110,2090);this.player.y=Phaser.Math.Clamp(this.player.y+dy/l*this.playerSpeed*this.game.loop.delta/1000,110,1290)}
 }
}
const config={type:Phaser.AUTO,parent:"game",width:1280,height:720,backgroundColor:"#17231a",scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},pixelArt:true,scene:[WorldScene]};
boot();
const APP_VERSION="9";setInterval(async()=>{try{const r=await fetch("./version.json?t="+Date.now(),{cache:"no-store"});const v=await r.json();if(v.version!==APP_VERSION)location.reload()}catch(e){}},10000);