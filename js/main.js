const gameState={name:"무명",job:"무사",level:1};
const colors={무사:0xc94b3b,궁수:0x4f8f58,기사:0x6c88a8,아처:0x87985b};
function boot(){document.querySelector("#game").innerHTML='<div id="overlay"><div class="panel"><div class="eyebrow">WUXIA KNIGHTS</div><h1>무협기사단</h1><p>2D 픽셀 RPG 프로토타입</p><button id="start">게임 시작</button></div></div>';document.querySelector("#start").onclick=()=>{document.querySelector("#overlay").remove();new Phaser.Game(config)}}
class WorldScene extends Phaser.Scene{
constructor(){super("World")}
create(){
this.cameras.main.setBackgroundColor("#18251a");this.worldW=2200;this.worldH=1400;
this.add.rectangle(this.worldW/2,this.worldH/2,this.worldW,this.worldH,0x587844);this.createPixelArtWorld();
this.player=this.add.container(1100,850);this.createPixelPlayer();
const shadow=this.add.ellipse(0,17,36,12,0x000000,.3),body=this.add.rectangle(0,0,30,36,colors[gameState.job]).setStrokeStyle(3,0x241c14),head=this.add.rectangle(0,-27,25,21,0xf1c59b).setStrokeStyle(3,0x241c14),hair=this.add.rectangle(0,-38,27,10,0x2b211c),sword=this.add.rectangle(17,-2,5,30,0xd7d2c5).setAngle(25);
this.player.add([shadow,body,head,hair]);this.player.setDepth(20);this.playerSpeed=210;
this.keys=this.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT");this.joystick={active:false,x:0,y:0};this.createTouchControls();this.cameras.main.startFollow(this.player,true,.08,.08);this.cameras.main.setBounds(0,0,this.worldW,this.worldH);
this.add.text(24,24,"청운촌",{fontSize:"28px",color:"#fff",fontStyle:"bold",stroke:"#1a1712",strokeThickness:6}).setScrollFactor(0).setDepth(100);
this.add.text(24,60,gameState.name+" · "+gameState.job+" · Lv."+gameState.level,{fontSize:"15px",color:"#f2dfbd",backgroundColor:"#171411cc",padding:{x:8,y:6}}).setScrollFactor(0).setDepth(100);
this.add.text(24,108,"WASD / 방향키로 이동 · 마을을 자유롭게 탐색하세요",{fontSize:"14px",color:"#e7d8bc",backgroundColor:"#171411aa",padding:{x:8,y:6}}).setScrollFactor(0).setDepth(100);
this.add.text(24,140,"※ 이동 테스트 단계 · 전투/몬스터는 다음 단계에서 추가",{fontSize:"12px",color:"#cbbda6"}).setScrollFactor(0).setDepth(100);
}
createPixelPlayer(){return;}\ncreatePixelArtWorld(){
const g=this.add.graphics();
const tile=32;
for(let x=0;x<this.worldW;x+=tile)for(let y=0;y<this.worldH;y+=tile){
const n=(x*17+y*31)%100;
g.fillStyle(n<10?0x496b3f:n<18?0x5f7c46:0x6b884f,1);g.fillRect(x,y,tile,tile);
}
for(let x=0;x<this.worldW;x+=128){for(let y=0;y<this.worldH;y+=128){
if(Math.abs(x-1100)<430&&Math.abs(y-850)<330)continue;
this.pixelTree(x+32+(y%64),y+40);
}}
this.pixelRoad(100,770,2000,150);this.pixelRoad(1020,100,160,1300);
this.pixelBuilding(430,540,"주막",0x9b6847);this.pixelBuilding(1450,510,"대장간",0x665044);
this.pixelBuilding(1480,900,"상점",0x8a6945);this.pixelBuilding(530,990,"기사단",0x596979);
g.fillStyle(0x4e8794,.95);g.fillRect(1760,90,250,430);
this.add.text(1885,305,"청운강",{fontSize:"20px",color:"#eef8fa",fontStyle:"bold",stroke:"#31555b",strokeThickness:4}).setOrigin(.5);
}
pixelRoad(x,y,w,h){const g=this.add.graphics();g.fillStyle(0xc2a56d,1);g.fillRect(x,y,w,h);g.lineStyle(2,0xa78b5c,.8);for(let i=x;i<x+w;i+=48)g.lineBetween(i,y,i,y+h);}
pixelTree(x,y){const g=this.add.graphics();g.fillStyle(0x754d31,1);g.fillRect(x-7,y+20,14,35);g.fillStyle(0x254b2d,1);g.fillCircle(x,y,32);g.fillStyle(0x3f7040,1);g.fillRect(x-20,y-24,18,12);g.fillRect(x+6,y-12,16,13);}
pixelBuilding(x,y,name,color){
const g=this.add.graphics();g.fillStyle(0x3b2a20,1);g.fillRect(x-126,y-82,252,164);g.fillStyle(color,1);g.fillRect(x-116,y-68,232,136);
g.fillStyle(0x4b3024,1);g.fillTriangle(x-132,y-68,x,y-130,x+132,y-68);g.fillStyle(0xead6a7,1);g.fillRect(x-30,y+5,60,63);
this.add.text(x,y-100,name,{fontSize:"21px",color:"#fff",fontStyle:"bold",stroke:"#201812",strokeThickness:5}).setOrigin(.5);
}

tree(x,y){const c=this.add.graphics();c.fillStyle(0x315a37);c.fillCircle(x,y,38);c.fillStyle(0x704d32);c.fillRect(x-8,y+28,16,35);c.setDepth(5)}
createTouchControls(){
const base=this.add.circle(90,this.scale.height-82,58,0x171411,.82).setStrokeStyle(4,0xd5b16d,.95).setScrollFactor(0).setDepth(200);
const knob=this.add.circle(90,this.scale.height-82,27,0xd5b16d,.95).setStrokeStyle(3,0xffedc2,.95).setScrollFactor(0).setDepth(201);
const label=this.add.text(90,this.scale.height-16,"이동",{fontSize:"13px",color:"#fff",fontStyle:"bold",backgroundColor:"#171411cc",padding:{x:8,y:4}}).setOrigin(.5).setScrollFactor(0).setDepth(202);
const center={x:90,y:this.scale.height-82},radius=58,knobRadius=34;
let activePointerId=null;
const place=()=>{
center.x=Math.max(76,Math.min(110,this.scale.width*.14));
center.y=this.scale.height-82;
base.setPosition(center.x,center.y);knob.setPosition(center.x,center.y);label.setPosition(center.x,this.scale.height-16);
};
place();this.scale.on("resize",place);
const move=p=>{
let dx=p.x-center.x,dy=p.y-center.y,d=Math.hypot(dx,dy);
if(d>knobRadius){dx=dx/d*knobRadius;dy=dy/d*knobRadius}
this.joystick.x=dx/knobRadius;this.joystick.y=dy/knobRadius;
knob.setPosition(center.x+dx,center.y+dy);
};
const release=p=>{
if(activePointerId!==null&&p&&p.id!==activePointerId)return;
activePointerId=null;this.joystick.active=false;this.joystick.x=0;this.joystick.y=0;knob.setPosition(center.x,center.y);
};
this.input.on("pointerdown",p=>{
if(Math.hypot(p.x-center.x,p.y-center.y)<=radius*1.25){
activePointerId=p.id;this.joystick.active=true;move(p);
}
});
this.input.on("pointermove",p=>{if(this.joystick.active&&p.id===activePointerId)move(p)});
this.input.on("pointerup",release);
this.input.on("pointerupoutside",release);
}
update(){
let dx=0,dy=0;if(this.keys.A.isDown||this.keys.LEFT.isDown)dx--;if(this.keys.D.isDown||this.keys.RIGHT.isDown)dx++;if(this.keys.W.isDown||this.keys.UP.isDown)dy--;if(this.keys.S.isDown||this.keys.DOWN.isDown)dy++;
dx+=this.joystick.x;dy+=this.joystick.y;if(dx||dy){const l=Math.hypot(dx,dy);this.player.x=Phaser.Math.Clamp(this.player.x+dx/l*this.playerSpeed*this.game.loop.delta/1000,110,2090);this.player.y=Phaser.Math.Clamp(this.player.y+dy/l*this.playerSpeed*this.game.loop.delta/1000,110,1290);this.player.list[1].y=Math.sin(this.time.now/80)*2}
}}
const config={type:Phaser.AUTO,parent:"game",width:1280,height:720,backgroundColor:"#18251a",scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},pixelArt:true,scene:[WorldScene]};boot();
const APP_VERSION="7";
setInterval(async()=>{try{const r=await fetch("./version.json?t="+Date.now(),{cache:"no-store"});const v=await r.json();if(v.version!==APP_VERSION)location.reload()}catch(e){}},10000);
