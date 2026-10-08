const ANIMATIONS={
  "design":{"style":"2등신 픽셀 아트","shared":"all four starter monsters"},
  "animations":{
    "idle":{"duration":900,"loop":true,"keyframes":[{"x":0,"y":0,"rotate":0,"scale":1},{"x":0,"y":-1,"rotate":0,"scale":1},{"x":0,"y":0,"rotate":0,"scale":1}]},
    "walk":{"duration":520,"loop":true,"keyframes":[{"x":-2,"y":0,"rotate":-2},{"x":2,"y":-1,"rotate":2},{"x":-2,"y":0,"rotate":-2},{"x":2,"y":-1,"rotate":2}]},
    "attack":{"duration":420,"loop":false,"keyframes":[{"x":0,"y":0,"rotate":0,"scale":1},{"x":-4,"y":0,"rotate":-3,"scale":1},{"x":10,"y":-1,"rotate":6,"scale":1.02},{"x":0,"y":0,"rotate":0,"scale":1}]},
    "hit":{"duration":280,"loop":false,"keyframes":[{"x":0,"y":0,"rotate":0,"scale":1,"opacity":1},{"x":-5,"y":0,"rotate":-5,"scale":1,"opacity":1},{"x":4,"y":-1,"rotate":5,"scale":1,"opacity":1},{"x":0,"y":0,"rotate":0,"scale":1,"opacity":1}]},
    "death":{"duration":650,"loop":false,"keyframes":[{"x":0,"y":0,"rotate":0,"scale":1,"opacity":1},{"x":2,"y":2,"rotate":12,"scale":0.98,"opacity":1},{"x":6,"y":9,"rotate":55,"scale":0.9,"opacity":0.65},{"x":10,"y":17,"rotate":85,"scale":0.84,"opacity":0}]},
    "respawn":{"duration":520,"loop":false,"keyframes":[{"x":0,"y":4,"rotate":0,"scale":0.9,"opacity":0},{"x":0,"y":1,"rotate":0,"scale":0.98,"opacity":0.7},{"x":0,"y":0,"rotate":0,"scale":1,"opacity":1}]}
  }
};
function reset(container){container.style.transform="";container.style.opacity="1"}
export function playMonsterAnimation(container,type="idle",onComplete=null){
 const animation=ANIMATIONS.animations[type]||ANIMATIONS.animations.idle,started=performance.now();
 function frame(now){
  let progress=(now-started)/animation.duration;
  if(animation.loop)progress%=1;else progress=Math.min(progress,1);
  const p=animation.keyframes,s=progress*(p.length-1),i=Math.min(Math.floor(s),p.length-2),l=s-i,a=p[i],b=p[i+1];
  const v=k=>(a[k]??0)+((b[k]??0)-(a[k]??0))*l;
  container.style.transform=`translate(${v("x")}px,${v("y")}px) rotate(${v("rotate")}deg) scale(${v("scale")||1})`;
  container.style.opacity=v("opacity")||1;
  if(animation.loop||progress<1)requestAnimationFrame(frame);else{if(type!=="death")reset(container);if(onComplete)onComplete(type)}
 }
 requestAnimationFrame(frame);return animation;
}
export function getMonsterAnimation(type){return ANIMATIONS.animations[type]||ANIMATIONS.animations.idle}