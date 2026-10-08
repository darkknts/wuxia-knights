import data from "../../data/monster-animations.json" with { type: "json" };

function reset(container){container.style.transform="";container.style.opacity="1"}

export function playMonsterAnimation(container,type="idle",onComplete=null){
 const animation=data.animations[type]||data.animations.idle;
 const started=performance.now();
 function frame(now){
  let progress=(now-started)/animation.duration;
  if(animation.loop) progress%=1; else progress=Math.min(progress,1);
  const points=animation.keyframes, scaled=progress*(points.length-1);
  const index=Math.min(Math.floor(scaled),points.length-2), local=scaled-index;
  const a=points[index],b=points[index+1];
  const lerp=k=>(a[k]??0)+((b[k]??0)-(a[k]??0))*local;
  container.style.transform=`translate(${lerp("x")}px,${lerp("y")}px) rotate(${lerp("rotate")}deg) scale(${lerp("scale")||1})`;
  container.style.opacity=lerp("opacity")||1;
  if(animation.loop||progress<1) requestAnimationFrame(frame);
  else {if(type!=="death") reset(container);if(onComplete)onComplete(type)}
 }
 requestAnimationFrame(frame);return animation;
}
export function getMonsterAnimation(type){return data.animations[type]||data.animations.idle}