import {
  BASE_GRADE_PER_LEVEL,
  SET_BONUSES,
  NO_SET,
  TOOL_SLOTS,
} from "../constants-alt";
import type { DisplayRarity, SetRarity } from "../constants-alt";

export const getDisplayRarity = (
  tier: number,
  level: number,
  slot: string
): DisplayRarity => {
  const isTool = TOOL_SLOTS.includes(slot);

  if (isTool && level === 50) {
    if (tier <= 104) return "uncommon";
    if (tier <= 124) return "epic";
    return "legendary";
  }

  const baseGrade = BASE_GRADE_PER_LEVEL[level];
  if (baseGrade === undefined) {
    return "standard"; // Safety fallback
  }

  if (tier < baseGrade * 0.9) return "standard";
  if (tier < baseGrade * 1.2) return "common";
  if (tier < baseGrade * 1.5) return "uncommon";
  if (tier < baseGrade * 1.8) return "epic";
  return "legendary";
};

export const getPetDisplayRarity = (level: number): DisplayRarity => {
  if (level >= 40) return "legendary";
  if (level >= 30) return "epic";
  if (level >= 20) return "uncommon";
  if (level >= 10) return "common";
  return "standard";
};

export const getSetRarity = (
  tier: number,
  level: number,
  slot: string
): SetRarity => {
  const displayRarity = getDisplayRarity(tier, level, slot);
  switch (displayRarity) {
    case "legendary":
      return "legendary";
    case "epic":
      return "epic";
    case "uncommon":
      return "common";
    default:
      return "default";
  }
};

export const getSetBonuses = (
  tier: number,
  level: number,
  slot: string
): string[] => {
  const rarity = getSetRarity(tier, level, slot);
  if (rarity === "default") {
    return [NO_SET];
  }
  return [NO_SET, ...SET_BONUSES[rarity]];
};
