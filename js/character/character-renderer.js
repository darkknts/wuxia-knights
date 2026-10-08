export class CharacterRenderer {
  constructor({ canvas, assetResolver }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.assetResolver = assetResolver;
    this.ctx.imageSmoothingEnabled = false;
  }

  async render(character) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const layer of character.layers) {
      const asset = await this.assetResolver(layer.assetId);
      if (!asset) continue;
      this.ctx.drawImage(asset, 0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
