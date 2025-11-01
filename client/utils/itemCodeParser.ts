import type { Item } from "../types";
import { ItemStat } from "../types";
import {
  ARMOR_SLOTS,
  ACCESSORY_SLOTS,
  WEAPON_SLOTS,
  BAG_SLOTS,
  NO_SET,
  SET_BONUSES,
  TOOL_SLOTS,
} from "../constants-alt";
import { getSetRarity } from "./rarity";
import type { SetRarity } from "../constants-alt";

// Helper to create reverse maps
const reverseMap = (
  obj: Record<string, string | number>
): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [value, key])
  );
};

// --- REVERSE CODE MAPS ---

const REVERSE_ARMOR_SLOT_CODES = reverseMap({
  Zırh: "1",
  Kask: "2",
  Eldiven: "3",
  Ayakkabı: "4",
});
const REVERSE_ACCESSORY_SLOT_CODES = reverseMap({
  Kolye: "1",
  Bilezik: "2",
  Küpe: "3",
  Yüzük: "4",
});
const REVERSE_BAG_SLOT_CODES = reverseMap({ Çanta: "5" });
const REVERSE_WEAPON_SLOT_CODES = reverseMap({
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
});
const REVERSE_TOOL_SLOT_CODES = reverseMap({
  Kazma: "61",
  Orak: "62",
  Olta: "63",
  Bıçak: "64",
  Balta: "60",
});
const REVERSE_ARMOR_TYPE_CODES = reverseMap({
  "[Ağır]": "0",
  "[Hafif]": "2",
  "[Cübbe]": "4",
});
const REVERSE_ARMOR_WEAPON_LEVEL_CODES = reverseMap({
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
});
const REVERSE_ACCESSORY_LEVEL_CODES = reverseMap({
  10: "01",
  20: "02",
  30: "03",
  40: "04",
  50: "05",
  60: "06",
  75: "07",
  100: "08",
  110: "09",
});
const REVERSE_TOOL_LEVEL_CODES = reverseMap({ 1: "1", 25: "2", 50: "3" });
const REVERSE_STAT_CODES = reverseMap({
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
  "": "0",
});
const REVERSE_STAR_LEVEL_CODES = reverseMap({
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
});

const getSetBonusFromCode = (setCode: string, rarity: SetRarity): string => {
  if (setCode === "0" || rarity === "default") {
    return NO_SET;
  }
  const setsForRarity = SET_BONUSES[rarity];
  if (!setsForRarity) {
    return NO_SET;
  }
  const setCodeIndex = "ABCDEFGHIJKL".indexOf(setCode);
  return setsForRarity[setCodeIndex] || NO_SET;
};

export const parseItemCode = (code: string): Item | null => {
  let parts = code.split("_");
  let reconstructedCode = code;

  // Handle alternative formats by reconstructing them into the standard 4-part format
  if (parts.length === 6) {
    // e.g., 0_F014_CD0_00_258_999
    const [cat, det, props, setStar, tier, dura] = parts;
    if (
      cat &&
      det &&
      props &&
      setStar &&
      tier &&
      dura &&
      props.length === 3 &&
      setStar.length === 2 &&
      tier.length === 3
    ) {
      const reconstructedProps = `${props}${setStar}00${tier}`;
      reconstructedCode = `${cat}_${det}_${reconstructedProps}_${dura}`;
    }
  } else if (parts.length === 5) {
    // e.g., 3_2214_CE0E00_260_999
    const [cat, det, propsSetStar, tier, dura] = parts;
    if (
      cat &&
      det &&
      propsSetStar &&
      tier &&
      dura &&
      propsSetStar.length === 6 &&
      tier.length === 3
    ) {
      const reconstructedProps = `${propsSetStar}0${tier}`;
      reconstructedCode = `${cat}_${det}_${reconstructedProps}_${dura}`;
    }
  }

  parts = reconstructedCode.split("_");
  if (parts.length !== 4) return null;

  const categoryCode = parts[0];
  let item: Partial<Item> = {};

  const [, detailsPart, propertiesPart, durabilityPart] = parts;
  if (
    !detailsPart ||
    !propertiesPart ||
    !durabilityPart ||
    detailsPart.length !== 4 ||
    propertiesPart.length !== 10
  )
    return null;

  const durability = parseInt(durabilityPart, 10);
  item.durability = durability === 999 ? 1000 : durability;

  const prop1Code = propertiesPart.substring(0, 1);
  const prop2Code = propertiesPart.substring(1, 2);
  const prop3Code = propertiesPart.substring(2, 3);
  const setCode = propertiesPart.substring(3, 4);
  const starLevelCode = propertiesPart.substring(4, 5);
  const gradeCode = propertiesPart.substring(7, 10);

  item.property1 = (REVERSE_STAT_CODES[prop1Code] || "") as ItemStat | "";
  item.property2 = (REVERSE_STAT_CODES[prop2Code] || "") as ItemStat | "";
  item.property3 = (REVERSE_STAT_CODES[prop3Code] || "") as ItemStat | "";
  item.starLevel = parseInt(REVERSE_STAR_LEVEL_CODES[starLevelCode] || "0", 10);
  item.tier = parseInt(gradeCode, 10);

  // Armor
  if (categoryCode === "3") {
    const slotCode = detailsPart.substring(0, 1);
    const weightCode = detailsPart.substring(1, 2);
    const levelCode = detailsPart.substring(2, 4);

    item.slot = REVERSE_ARMOR_SLOT_CODES[slotCode];
    item.armorType = REVERSE_ARMOR_TYPE_CODES[weightCode];
    item.level = parseInt(
      REVERSE_ARMOR_WEAPON_LEVEL_CODES[levelCode] || "0",
      10
    );
  } // Weapon or Accessory or Bag or Tool
  else if (categoryCode === "0") {
    const toolSlotIdentifier = detailsPart.substring(0, 2);
    const toolLevelIdentifier = detailsPart.substring(3, 4);

    if (REVERSE_TOOL_SLOT_CODES[toolSlotIdentifier]) {
      item.slot = REVERSE_TOOL_SLOT_CODES[toolSlotIdentifier];
      item.level = parseInt(
        REVERSE_TOOL_LEVEL_CODES[toolLevelIdentifier] || "0",
        10
      );
      item.armorType = "";
    } else {
      const slotCode = detailsPart.substring(0, 1);
      const levelCode = detailsPart.substring(2, 4);

      if (REVERSE_WEAPON_SLOT_CODES[slotCode]) {
        item.slot = REVERSE_WEAPON_SLOT_CODES[slotCode];
        item.level = parseInt(
          REVERSE_ARMOR_WEAPON_LEVEL_CODES[levelCode] || "0",
          10
        );
        item.armorType = "";
      } else if (REVERSE_ACCESSORY_SLOT_CODES[slotCode]) {
        item.slot = REVERSE_ACCESSORY_SLOT_CODES[slotCode];
        item.level = parseInt(
          REVERSE_ACCESSORY_LEVEL_CODES[levelCode] || "0",
          10
        );
        item.armorType = "";
      } else if (REVERSE_BAG_SLOT_CODES[slotCode]) {
        item.slot = REVERSE_BAG_SLOT_CODES[slotCode];
        item.level = parseInt(
          REVERSE_ACCESSORY_LEVEL_CODES[levelCode] || "0",
          10
        );
        item.armorType = "";
      } else {
        return null;
      }
    }
  } else {
    return null;
  }

  if (!item.slot || !item.level || isNaN(item.tier)) return null;

  // FIX: Added 'item.slot' as the third argument to getSetRarity to match its function signature.
  const rarity = getSetRarity(item.tier, item.level, item.slot);
  item.setBonus = getSetBonusFromCode(setCode, rarity);

  return item as Item;
};
