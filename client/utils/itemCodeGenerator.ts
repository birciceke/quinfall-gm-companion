import type { Item } from "../types";
import { ItemStat } from "../types";
import {
  ARMOR_SLOTS,
  ACCESSORY_SLOTS,
  NO_SET,
  WEAPON_SLOTS,
  BAG_SLOTS,
  TOOL_SLOTS,
} from "../constants-alt";

const ARMOR_SLOT_CODES: Record<string, string> = {
  Zırh: "1",
  Kask: "2",
  Eldiven: "3",
  Ayakkabı: "4",
};

const ACCESSORY_SLOT_CODES: Record<string, string> = {
  Kolye: "1",
  Bilezik: "2",
  Küpe: "3",
  Yüzük: "4",
};

const BAG_SLOT_CODES: Record<string, string> = {
  Çanta: "5",
};

const WEAPON_SLOT_CODES: Record<string, string> = {
  Kılıç: "A",
  Kalkan: "B",
  "Çift El Kılıç": "C",
  Mızrak: "D",
  "Çift Balta": "E",
  "Çift Bıçak": "F",
  Yay: "G",
  Arbalet: "H",
  Asa: "J",
  "Yaşam Asa": "K",
  "Savaş Çekici": "L",
};

const TOOL_SLOT_CODES: Record<string, string> = {
  Kazma: "61",
  Orak: "62",
  Olta: "63",
  Bıçak: "64",
  Balta: "60",
};

const ARMOR_TYPE_CODES: Record<string, string> = {
  "[Ağır]": "0",
  "[Hafif]": "2",
  "[Cübbe]": "4",
};

const ARMOR_WEAPON_LEVEL_CODES: Record<number, string> = {
  1: "01",
  5: "02",
  10: "03",
  15: "04",
  20: "05",
  25: "06",
  30: "07",
  35: "08",
  40: "09",
  45: "10",
  50: "11",
  60: "12",
  75: "13",
  100: "14",
  110: "15",
};

const ACCESSORY_LEVEL_CODES: Record<number, string> = {
  10: "01",
  20: "02",
  30: "03",
  40: "04",
  50: "05",
  60: "06",
  75: "07",
  100: "08",
  110: "09",
};

const TOOL_LEVEL_CODES: Record<number, string> = {
  1: "1",
  25: "2",
  50: "3",
};

const STAT_CODES: Record<string, string> = {
  [ItemStat.FizikselSaldiri]: "A",
  [ItemStat.BuyuSaldiri]: "B",
  [ItemStat.FizikselSavunma]: "C",
  [ItemStat.BuyuSavunma]: "D",
  [ItemStat.HP]: "E",
  [ItemStat.MP]: "F",
  [ItemStat.HPYenilenmesi]: "G",
  [ItemStat.MPYenilenmesi]: "H",
  [ItemStat.Isabet]: "I",
  [ItemStat.Kacinma]: "J",
  [ItemStat.KritikSansi]: "K",
  [ItemStat.KritikDefansSansi]: "L",
  "": "0", // For "None"
};

const SET_CODES: Record<string, string> = {
  [NO_SET]: "0",
  // Legendary
  "Sovereign's Legacy (288-320)": "A",
  "Ravager's Dominion (288-320)": "B",
  "Divine Aegis (288-320)": "C",
  "Tempestbound (288-320)": "D",
  "Bladeweaver (288-320)": "E",
  "Spellfire (288-320)": "F",
  "Astral Conflux (288-320)": "G",
  "Seraphic Grace Set (288-320)": "H",
  "Fortress of Valor (288-320)": "I",
  "Dragonclaw (288-320)": "J",
  "Eldritch Catalyst (288-320)": "K",
  "Divine Harmony (288-320)": "L",
  // Epic
  "Warlord's Honor Set (240-287)": "A",
  "Ironclad Fury Set (240-287)": "B",
  "Guardian of Light Set (240-287)": "C",
  "Whispering Gale Set (240-287)": "D",
  "Bladewind Set (240-287)": "E",
  "Etherstorm Set (240-287)": "F",
  "Celestial Flame Set (240-287)": "G",
  "Lifebinder Set (240-287)": "H",
  "Stoneguard Set (240-287)": "I",
  "Savage Strike Set (240-287)": "J",
  "Mystic Conduit Set (240-287)": "K",
  "Serene Blessing Set (240-287)": "L",
  // Common
  "Guardian's Resolve Set (191-238)": "A",
  "Steelbreaker Set (191-238)": "B",
  "Sanctified Bastion Set (191-238)": "C",
  "Sentinel's Guard Set (191-238)": "D",
  "Shadowstrike Set (191-238)": "E",
  "Arcane Wisp Set (191-238)": "F",
  "Mystic Ember Set (191-238)": "G",
  "Dawnbringer Set (191-238)": "H",
  "Ironwall Defender Set (150-239)": "I",
  "Swiftstrike Set (191-238)": "J",
  "Arcane Focus Set (191-238)": "K",
  "Lifeward Set (191-238)": "L",
};

const STAR_LEVEL_CODES: Record<number, string> = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "A",
  11: "B",
  12: "C",
  13: "D",
  14: "E",
  15: "F",
};

export const generateItemCode = (item: Item): string => {
  if (ARMOR_SLOTS.includes(item.slot)) {
    const categoryCode = "3";
    const slotCode = ARMOR_SLOT_CODES[item.slot] || "?";
    const typeCode = item.armorType ? ARMOR_TYPE_CODES[item.armorType] : "?";
    const levelCode = ARMOR_WEAPON_LEVEL_CODES[item.level] || "??";

    const part2 = `${slotCode}${typeCode}${levelCode}`;

    const prop1Code = STAT_CODES[item.property1] || "?";
    const prop2Code = STAT_CODES[item.property2] || "?";
    const prop3Code = STAT_CODES[item.property3] || "?";
    const setCode = SET_CODES[item.setBonus] || "?";
    const starLevelCode = STAR_LEVEL_CODES[item.starLevel] || "?";
    const gradeCode = String(item.tier).padStart(3, "0");

    const part3 = `${prop1Code}${prop2Code}${prop3Code}${setCode}${starLevelCode}00${gradeCode}`;

    const durabilityValue = item.durability === 1000 ? 999 : item.durability;
    const part4 = String(durabilityValue).padStart(3, "0");

    return `${categoryCode}_${part2}_${part3}_${part4}`;
  }

  if (WEAPON_SLOTS.includes(item.slot)) {
    const categoryCode = "0"; // Category for weapons
    const slotCode = WEAPON_SLOT_CODES[item.slot] || "?";
    const typeCodePlaceholder = "0";
    const levelCode = ARMOR_WEAPON_LEVEL_CODES[item.level] || "??";

    const part2 = `${slotCode}${typeCodePlaceholder}${levelCode}`;

    const prop1Code = STAT_CODES[item.property1] || "?";
    const prop2Code = STAT_CODES[item.property2] || "?";
    const prop3Code = STAT_CODES[item.property3] || "?";
    const setCode = SET_CODES[item.setBonus] || "?";
    const starLevelCode = STAR_LEVEL_CODES[item.starLevel] || "?";
    const gradeCode = String(item.tier).padStart(3, "0");

    const part3 = `${prop1Code}${prop2Code}${prop3Code}${setCode}${starLevelCode}00${gradeCode}`;

    const durabilityValue = item.durability === 1000 ? 999 : item.durability;
    const part4 = String(durabilityValue).padStart(3, "0");

    return `${categoryCode}_${part2}_${part3}_${part4}`;
  }

  if (BAG_SLOTS.includes(item.slot)) {
    const categoryCode = "0";
    const slotCode = BAG_SLOT_CODES[item.slot] || "?";
    const typeCodePlaceholder = "0";
    const levelCode = ACCESSORY_LEVEL_CODES[item.level] || "??";

    const part2 = `${slotCode}${typeCodePlaceholder}${levelCode}`;

    const prop1Code = STAT_CODES[item.property1] || "?";
    const prop2Code = STAT_CODES[item.property2] || "?";
    const prop3Code = STAT_CODES[item.property3] || "?";
    const setCode = SET_CODES[item.setBonus] || "?";
    const starLevelCode = STAR_LEVEL_CODES[item.starLevel] || "?";
    const gradeCode = String(item.tier).padStart(3, "0");

    const part3 = `${prop1Code}${prop2Code}${prop3Code}${setCode}${starLevelCode}00${gradeCode}`;

    const durabilityValue = item.durability === 1000 ? 999 : item.durability;
    const part4 = String(durabilityValue).padStart(3, "0");

    return `${categoryCode}_${part2}_${part3}_${part4}`;
  }

  if (ACCESSORY_SLOTS.includes(item.slot)) {
    const categoryCode = "0";
    const slotCode = ACCESSORY_SLOT_CODES[item.slot] || "?";
    const typeCodePlaceholder = "0";
    const levelCode = ACCESSORY_LEVEL_CODES[item.level] || "??";

    const part2 = `${slotCode}${typeCodePlaceholder}${levelCode}`;

    const prop1Code = STAT_CODES[item.property1] || "?";
    const prop2Code = STAT_CODES[item.property2] || "?";
    const prop3Code = STAT_CODES[item.property3] || "?";
    const setCode = SET_CODES[item.setBonus] || "?";
    const starLevelCode = STAR_LEVEL_CODES[item.starLevel] || "?";
    const gradeCode = String(item.tier).padStart(3, "0");

    const part3 = `${prop1Code}${prop2Code}${prop3Code}${setCode}${starLevelCode}00${gradeCode}`;

    const durabilityValue = item.durability === 1000 ? 999 : item.durability;
    const part4 = String(durabilityValue).padStart(3, "0");

    return `${categoryCode}_${part2}_${part3}_${part4}`;
  }

  if (TOOL_SLOTS.includes(item.slot)) {
    const categoryCode = "0";
    const slotCode = TOOL_SLOT_CODES[item.slot] || "??";
    const levelCode = TOOL_LEVEL_CODES[item.level] || "?";
    const typeCodePlaceholder = "0";

    const part2 = `${slotCode}${typeCodePlaceholder}${levelCode}`;

    const prop1Code = "0";
    const prop2Code = "0";
    const prop3Code = "0";
    const setCode = "0";
    const starLevelCode = "0";
    const gradeCode = String(item.tier).padStart(3, "0");

    const part3 = `${prop1Code}${prop2Code}${prop3Code}${setCode}${starLevelCode}00${gradeCode}`;

    const durabilityValue = item.durability === 1000 ? 999 : item.durability;
    const part4 = String(durabilityValue).padStart(3, "0");

    return `${categoryCode}_${part2}_${part3}_${part4}`;
  }

  return "N/A";
};
