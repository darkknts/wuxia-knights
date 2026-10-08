const ATTACKS = {
  east_warrior: {
    duration: 620,
    keyframes: [{x:0,r:0},{x:-2,r:-8},{x:3,r:18},{x:0,r:0}]
  },
  east_archer: {
    duration: 680,
    keyframes: [{x:0,r:0},{x:-1,r:-2},{x:1,r:2},{x:0,r:0}]
  },
  west_knight: {
    duration: 600,
    keyframes: [{x:0,r:0},{x:-1,r:-6},{x:2,r:12},{x:0,r:0}]
  },
  west_archer: {
    duration: 680,
    keyframes: [{x:0,r:0},{x:-1,r:-2},{x:1,r:2},{x:0,r:0}]
  }
};

export function playJobAttack(container, jobId, onHit) {
  const attack = ATTACKS[jobId] || ATTACKS.east_warrior;
  const start = performance.now();
  let hitCalled = false;

  function frame(now) {
    const progress = Math.min((now - start) / attack.duration, 1);
    const scaled = progress * (attack.keyframes.length - 1);
    const index = Math.min(Math.floor(scaled), attack.keyframes.length - 2);
    const local = scaled - index;
    const a = attack.keyframes[index];
    const b = attack.keyframes[index + 1];
    const x = a.x + (b.x - a.x) * local;
    const rotate = a.r + (b.r - a.r) * local;

    container.style.transform = `translate(${x}px,0) rotate(${rotate}deg)`;

    if (!hitCalled && progress >= 0.55) {
      hitCalled = true;
      if (onHit) onHit({ jobId, effect: jobId.includes("archer") ? "arrow_shot" : "slash" });
    }

    if (progress < 1) requestAnimationFrame(frame);
    else container.style.transform = "";
  }
  requestAnimationFrame(frame);
}
