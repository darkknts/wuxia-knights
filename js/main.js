import { gameConfig } from "./core/game-config.js";

const status = document.querySelector("#status");
const startButton = document.querySelector("#startButton");

startButton.addEventListener("click", () => {
  status.textContent = `프로젝트 시작: ${gameConfig.title} · ${gameConfig.version}`;
});
