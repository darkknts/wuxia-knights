const REACTIONS = {
  hit: {
    duration: 280,
    loop: false,
    keyframes: [
      { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
      { x: -2, y: 0, rotate: -3, scale: 1, opacity: 1 },
      { x: 3, y: -1, rotate: 3, scale: 1, opacity: 1 },
      { x: -1, y: 0, rotate: 0, scale: 1, opacity: 1 }
    ]
  },
  death: {
    duration: 720,
    loop: false,
    keyframes: [
      { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
      { x: 2, y: 1, rotate: 12, scale: 1, opacity: 1 },
      { x: 5, y: 8, rotate: 48, scale: 0.96, opacity: 0.82 },
      { x: 8, y: 16, rotate: 82, scale: 0.9, opacity: 0 }
    ]
  },
  respawn: {
    duration: 520,
    loop: false,
    keyframes: [
      { x: 0, y: 4, rotate: 0, scale: 0.92, opacity: 0 },
      { x: 0, y: 1, rotate: 0, scale: 0.98, opacity: 0.7 },
      { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
    ]
  }
};

function resetReaction(container) {
  container.style.transform = "";
  container.style.opacity = "1";
}

export function playCharacterReaction(container, type = "hit", onComplete = null) {
  const reaction = REACTIONS[type] || REACTIONS.hit;
  const started = performance.now();

  function frame(now) {
    let progress = Math.min((now - started) / reaction.duration, 1);
    const points = reaction.keyframes;
    const scaled = progress * (points.length - 1);
    const index = Math.min(Math.floor(scaled), points.length - 2);
    const local = scaled - index;
    const a = points[index];
    const b = points[index + 1];

    const lerp = (key, fallback = 0) =>
      (a[key] ?? fallback) + ((b[key] ?? fallback) - (a[key] ?? fallback)) * local;

    const x = lerp("x");
    const y = lerp("y");
    const rotate = lerp("rotate");
    const scale = lerp("scale", 1);
    const opacity = lerp("opacity", 1);

    container.style.transform =
      `translate(${x}px,${y}px) rotate(${rotate}deg) scale(${scale})`;
    container.style.opacity = opacity;

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      if (type !== "death") resetReaction(container);
      if (onComplete) onComplete(type);
    }
  }

  requestAnimationFrame(frame);
  return reaction;
}

export function getCharacterReaction(type) {
  return REACTIONS[type] || REACTIONS.hit;
}
