import type { Pet } from "../types";
import { PET_TYPES, PET_PROFESSIONS } from "../constants-alt";

export const parsePetCode = (code: string): Pet | null => {
  const parts = code.split("_");
  if (parts.length !== 5) return null;

  const [typePart, professionCode, satietyStr, levelStr, xpStr] = parts;

  if (!typePart || !professionCode || !satietyStr || !levelStr || !xpStr)
    return null;

  if (!typePart.startsWith("00") || typePart.length !== 4) return null;
  const typeCode = typePart.substring(2);

  const isValidPetType = PET_TYPES.some((p) => p.code === typeCode);
  const isValidProfession = PET_PROFESSIONS.some(
    (p) => p.code === professionCode
  );

  const satiety = parseInt(satietyStr, 10);
  const level = parseInt(levelStr, 10);
  const xpRaw = parseInt(xpStr, 10);

  if (
    !isValidPetType ||
    !isValidProfession ||
    isNaN(satiety) ||
    isNaN(level) ||
    isNaN(xpRaw)
  ) {
    return null;
  }

  // Per logic from generator: 100% XP -> 9999, 90% -> 9000, 10% -> 1000
  const xp = xpRaw === 9999 ? 100 : Math.floor(xpRaw / 100);

  return {
    petType: typeCode,
    petProfession: professionCode,
    satiety,
    level,
    xp,
  };
};
