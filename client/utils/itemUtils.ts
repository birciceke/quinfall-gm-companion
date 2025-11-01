import {
  ARMOR_SLOTS,
  PHYSICAL_WEAPON_SLOTS,
  MAGICAL_WEAPON_SLOTS,
  WEAPON_SLOTS,
  BAG_SLOTS,
  ACCESSORY_SLOTS,
  HEAVY_ARMOR_NAMES_BY_LEVEL,
  LIGHT_ARMOR_NAMES_BY_LEVEL,
  ROBE_ARMOR_NAMES_BY_LEVEL,
  ACCESSORY_NAMES_BY_LEVEL,
  WEAPON_NAMES_BY_LEVEL,
  TOOL_SLOTS,
} from "../constants-alt";
import type { Item, ItemStat } from "../types";
import { PROPERTY_STATS_BY_LEVEL } from "../data/propertyStats";

type StatKey =
  | "physicalDP"
  | "magicalDP"
  | "hp"
  | "mp"
  | "physicalAP"
  | "magicalAP"
  | "accuracy"
  | "evasion"
  | "mpRegen"
  | "inventoryWeight"
  | "gatheringSpeed"
  | "valuableResource"
  | "professionLevel";
type StarColor = "dim" | "yellow" | "red" | "blue";

export const getStatsForSlot = (slot: string): StatKey[] => {
  if (TOOL_SLOTS.includes(slot)) {
    return ["gatheringSpeed", "valuableResource", "professionLevel"];
  }
  if (ARMOR_SLOTS.includes(slot)) {
    return ["physicalDP", "magicalDP", "hp"];
  }
  if (PHYSICAL_WEAPON_SLOTS.includes(slot)) {
    return ["physicalAP", "accuracy"];
  }
  if (MAGICAL_WEAPON_SLOTS.includes(slot)) {
    return ["magicalAP", "mpRegen"];
  }
  if (WEAPON_SLOTS.includes(slot)) {
    return ["physicalAP", "magicalAP"];
  }
  if (BAG_SLOTS.includes(slot)) {
    return ["inventoryWeight"];
  }
  switch (slot) {
    case "Bilezik":
      return ["magicalDP"];
    case "Yüzük":
      return ["physicalAP", "magicalAP"];
    case "Kolye":
      return ["physicalDP"];
    case "Küpe":
      return ["hp", "mp"];
    default:
      return [];
  }
};

export const calculateMainStatBonus = (
  base: number,
  starLevel: number
): number => {
  if (starLevel === 0) return 0;
  const bonus = base * starLevel * 0.152;
  return bonus;
};

export const getPropertyStatValue = (stat: ItemStat, level: number): number => {
  return PROPERTY_STATS_BY_LEVEL[level]?.[stat] ?? 0;
};

export const parseSetName = (setBonus: string): string => {
  if (!setBonus) return "";
  const match = setBonus.match(/^(.*?)\s*\(/);
  return match ? match[1].trim() : setBonus;
};

const getAccessoryNameIndex = (level: number): number => {
  switch (level) {
    case 10:
      return 0;
    case 20:
      return 1;
    case 30:
      return 2;
    case 40:
      return 3;
    default:
      return 4; // for 50, 60, 75, 100, 110
  }
};

const getArmorNameIndex = (level: number): number => {
  switch (level) {
    case 1:
      return 0;
    case 5:
      return 1;
    case 10:
      return 2;
    case 15:
      return 3;
    case 20:
      return 4;
    case 25:
      return 5;
    case 30:
      return 6;
    case 35:
      return 7;
    case 40:
      return 8;
    case 45:
      return 9;
    default:
      return 10; // for 50+ (50, 60, 75, 100, 110)
  }
};

export const getItemName = (item: Item): string => {
  const isAccessory = ACCESSORY_SLOTS.includes(item.slot);
  const isArmor = ARMOR_SLOTS.includes(item.slot);
  const isWeapon = WEAPON_SLOTS.includes(item.slot);
  const isBag = BAG_SLOTS.includes(item.slot);

  if (isAccessory || isBag) {
    const names = ACCESSORY_NAMES_BY_LEVEL[item.slot];
    if (names) return names[getAccessoryNameIndex(item.level)] || item.slot;
  }

  if (isArmor) {
    if (item.armorType === "[Ağır]") {
      const names = HEAVY_ARMOR_NAMES_BY_LEVEL[item.slot];
      if (names) return names[getArmorNameIndex(item.level)] || item.slot;
    }
    if (item.armorType === "[Hafif]") {
      const names = LIGHT_ARMOR_NAMES_BY_LEVEL[item.slot];
      if (names) return names[getArmorNameIndex(item.level)] || item.slot;
    }
    if (item.armorType === "[Cübbe]") {
      const names = ROBE_ARMOR_NAMES_BY_LEVEL[item.slot];
      if (names) return names[getArmorNameIndex(item.level)] || item.slot;
    }
  }

  if (isWeapon) {
    const names = WEAPON_NAMES_BY_LEVEL[item.slot];
    if (names) return names[getArmorNameIndex(item.level)] || item.slot;
  }

  return item.slot;
};

export const getStarColors = (starLevel: number): StarColor[] => {
  if (starLevel === 0) return [];

  const stars: StarColor[] = [];
  const totalStarsToDisplay = 5;

  if (starLevel <= 5) {
    // Tier 1: Yellow stars
    for (let i = 1; i <= totalStarsToDisplay; i++) {
      stars.push(i <= starLevel ? "yellow" : "dim");
    }
  } else if (starLevel <= 10) {
    // Tier 2: Blue stars transitioning from yellow
    const blueCount = starLevel - 5;
    for (let i = 1; i <= totalStarsToDisplay; i++) {
      if (i <= blueCount) {
        stars.push("blue");
      } else {
        stars.push("yellow");
      }
    }
  } else {
    // starLevel >= 11
    // Tier 3: Red stars transitioning from blue
    const redCount = starLevel - 10;
    for (let i = 1; i <= totalStarsToDisplay; i++) {
      if (i <= redCount) {
        stars.push("red");
      } else {
        stars.push("blue");
      }
    }
  }
  return stars;
};
