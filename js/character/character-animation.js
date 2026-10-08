const ANIMATIONS = {
  idle: { duration: 900, loop: true, keyframes: [{y:0,scale:1},{y:-1,scale:1},{y:0,scale:1}] },
  walk: { duration: 520, loop: true, keyframes: [{x:0,y:0},{x:1,y:-1},{x:0,y:0},{x:-1,y:-1}] },
  basic_attack: { duration: 460, loop: false, keyframes: [{x:0,y:0,rotate:0},{x:2,y:-1,rotate:-5},{x:-1,y:0,rotate:3}] }
};

export function playCharacterAnimation(container, type = "idle") {
  const animation = ANIMATIONS[type] || ANIMATIONS.idle;
  const layers = [...container.querySelectorAll("img")];
  const started = performance.now();

  function frame(now) {
    let progress = (now - started) / animation.duration;
    if (animation.loop) progress %= 1;
    else progress = Math.min(progress, 1);

    const points = animation.keyframes;
    const scaled = progress * (points.length - 1);
    const index = Math.min(Math.floor(scaled), points.length - 2);
    const local = scaled - index;
    const a = points[index];
    const b = points[index + 1];
    const x = (a.x || 0) + ((b.x || 0) - (a.x || 0)) * local;
    const y = (a.y || 0) + ((b.y || 0) - (a.y || 0)) * local;
    const rotate = (a.rotate || 0) + ((b.rotate || 0) - (a.rotate || 0)) * local;

    container.style.transform = `translate(${x}px,${y}px) rotate(${rotate}deg)`;

    if (animation.loop || progress < 1) requestAnimationFrame(frame);
    else container.style.transform = "";
  }

  requestAnimationFrame(frame);
  return animation;
}

export function getCharacterAnimation(type) {
  return ANIMATIONS[type] || ANIMATIONS.idle;
}
