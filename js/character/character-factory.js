const LAYER_ORDER = [
  "body", "face", "hair", "clothes", "armor",
  "gloves", "boots", "weapon", "shield", "cape",
  "effect", "speech"
];

export function createCharacter({ gender, job, parts = {} }) {
  if (!["male", "female"].includes(gender)) {
    throw new Error("gender must be male or female");
  }

  return {
    id: crypto.randomUUID(),
    gender,
    job,
    parts: {
      ...parts
    },
    layers: LAYER_ORDER
      .filter(layer => parts[layer])
      .map(layer => ({ layer, assetId: parts[layer] }))
  };
}

export function replaceEquipment(character, slot, assetId) {
  if (!LAYER_ORDER.includes(slot)) {
    throw new Error(`Unknown character layer: ${slot}`);
  }

  return {
    ...character,
    parts: {
      ...character.parts,
      [slot]: assetId
    },
    layers: LAYER_ORDER
      .filter(layer => layer === slot ? assetId : character.parts[layer])
      .map(layer => ({
        layer,
        assetId: layer === slot ? assetId : character.parts[layer]
      }))
  };
}
