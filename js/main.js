const gameState={name:"무명",job:"무사",level:1};
const colors={무사:0xc94b3b,궁수:0x4f8f58,기사:0x6c88a8,아처:0x87985b};
function boot(){document.querySelector("#game").innerHTML='<div id="overlay"><div class="panel"><div class="eyebrow">WUXIA KNIGHTS</div><h1>무협기사단</h1><p>2D 픽셀 RPG 프로토타입</p><button id="start">게임 시작</button></div></div>';document.querySelector("#start").onclick=()=>{document.querySelector("#overlay").remove();new Phaser.Game(config)}}
class WorldScene extends Phaser.Scene{
constructor(){super("World")}
create(){
this.cameras.main.setBackgroundColor("#18251a");this.worldW=2200;this.worldH=1400;
this.add.rectangle(this.worldW/2,this.worldH/2,this.worldW,this.worldH,0x587844);this.drawWorld();
this.player=this.add.container(1100,850);
const shadow=this.add.ellipse(0,17,34,12,0x000000,.28),body=this.add.rectangle(0,0,28,34,colors[gameState.job]).setStrokeStyle(3,0x241c14),head=this.add.rectangle(0,-25,24,20,0xf1c59b).setStrokeStyle(3,0x241c14),hair=this.add.rectangle(0,-35,25,9,0x2b211c);
this.player.add([shadow,body,head,hair]);this.player.setDepth(20);this.playerSpeed=210;
this.keys=this.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT");this.joystick={active:false,x:0,y:0};this.createTouchControls();this.cameras.main.startFollow(this.player,true,.08,.08);this.cameras.main.setBounds(0,0,this.worldW,this.worldH);
this.add.text(24,24,"청운촌",{fontSize:"28px",color:"#fff",fontStyle:"bold",stroke:"#1a1712",strokeThickness:6}).setScrollFactor(0).setDepth(100);
this.add.text(24,60,gameState.name+" · "+gameState.job+" · Lv."+gameState.level,{fontSize:"15px",color:"#f2dfbd",backgroundColor:"#171411cc",padding:{x:8,y:6}}).setScrollFactor(0).setDepth(100);
this.add.text(24,108,"WASD / 방향키로 이동 · 마을을 자유롭게 탐색하세요",{fontSize:"14px",color:"#e7d8bc",backgroundColor:"#171411aa",padding:{x:8,y:6}}).setScrollFactor(0).setDepth(100);
this.add.text(24,140,"※ 이동 테스트 단계 · 전투/몬스터는 다음 단계에서 추가",{fontSize:"12px",color:"#cbbda6"}).setScrollFactor(0).setDepth(100);
}
drawWorld(){
const g=this.add.graphics();g.lineStyle(8,0x9c8053,1);g.strokeRect(80,80,this.worldW-160,this.worldH-160);
g.fillStyle(0xbda06b);g.fillRect(100,770,2000,150);g.fillRect(1020,100,160,1300);g.fillStyle(0xa88b5b);g.fillCircle(1100,850,250);
[["주막",550,650,0x8c5d3c],["대장간",1500,620,0x6f5540],["상점",1550,1000,0x80613f],["기사단 길드",650,1050,0x5d6670]].forEach(([name,x,y,c])=>{g.fillStyle(c);g.fillRoundedRect(x-120,y-75,240,150,14);g.lineStyle(5,0x3d2b20);g.strokeRoundedRect(x-120,y-75,240,150,14);this.add.text(x,y-8,name,{fontSize:"22px",color:"#fff",fontStyle:"bold",stroke:"#201812",strokeThickness:5}).setOrigin(.5)});
for(let x=150;x<2050;x+=170)for(let y=180;y<1380;y+=210){if(Math.abs(x-1100)<420&&Math.abs(y-850)<350)continue;this.tree(x+(y%70),y)}
g.fillStyle(0x4f8490,.9);g.fillRect(1750,100,260,420);this.add.text(1880,310,"청운강",{fontSize:"18px",color:"#e5f4f6",fontStyle:"bold"}).setOrigin(.5)
}
tree(x,y){const c=this.add.graphics();c.fillStyle(0x315a37);c.fillCircle(x,y,38);c.fillStyle(0x704d32);c.fillRect(x-8,y+28,16,35);c.setDepth(5)}
createTouchControls(){
const ui=this.add.container(0,0).setScrollFactor(0).setDepth(200);
const base=this.add.circle(92,625,58,0x171411,.72).setStrokeStyle(3,0xd5b16d,.7);
const knob=this.add.circle(92,625,26,0xd5b16d,.9);
ui.add([base,knob]);
this.add.text(92,625,"",{fontSize:"1px"}).setOrigin(.5);
const update=(p)=>{const dx=p.x-92,dy=p.y-625,d=Math.min(Math.hypot(dx,dy),48),a=Math.atan2(dy,dx);this.joystick.x=Math.cos(a)*(d/48);this.joystick.y=Math.sin(a)*(d/48);knob.x=92+this.joystick.x*48;knob.y=625+this.joystick.y*48};
const release=()=>{this.joystick.active=false;this.joystick.x=0;this.joystick.y=0;knob.x=92;knob.y=625};
base.setInteractive({useHandCursor:false});
base.on("pointerdown",p=>{this.joystick.active=true;update(p)});
base.on("pointermove",p=>{if(this.joystick.active)update(p)});
this.input.on("pointermove",p=>{if(this.joystick.active)update(p)});
this.input.on("pointerup",release);
this.input.on("pointerout",release);
this.add.text(92,695,"이동",{fontSize:"13px",color:"#fff",backgroundColor:"#171411aa",padding:{x:8,y:4}}).setOrigin(.5).setScrollFactor(0).setDepth(201);
}
update(){
let dx=0,dy=0;if(this.keys.A.isDown||this.keys.LEFT.isDown)dx--;if(this.keys.D.isDown||this.keys.RIGHT.isDown)dx++;if(this.keys.W.isDown||this.keys.UP.isDown)dy--;if(this.keys.S.isDown||this.keys.DOWN.isDown)dy++;
dx+=this.joystick.x;dy+=this.joystick.y;if(dx||dy){const l=Math.hypot(dx,dy);this.player.x=Phaser.Math.Clamp(this.player.x+dx/l*this.playerSpeed*this.game.loop.delta/1000,110,2090);this.player.y=Phaser.Math.Clamp(this.player.y+dy/l*this.playerSpeed*this.game.loop.delta/1000,110,1290);this.player.list[1].y=Math.sin(this.time.now/80)*2}
}}
const config={type:Phaser.AUTO,parent:"game",width:1280,height:720,backgroundColor:"#18251a",scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},pixelArt:true,scene:[WorldScene]};boot();