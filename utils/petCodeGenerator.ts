import type { Pet } from '../types';

export const generatePetCode = (pet: Pet): string => {
  const typeCode = pet.petType || '??';
  const professionCode = pet.petProfession || '??';
  const satietyCode = String(pet.satiety).padStart(3, '0');
  const levelCode = String(pet.level).padStart(2, '0');
  
  // Per logic: 100% XP -> 9999, 90% -> 9000, 10% -> 1000
  const xpCodeValue = pet.xp === 100 ? 9999 : pet.xp * 100;
  const xpCode = String(xpCodeValue).padStart(4, '0');
  
  return `00${typeCode}_${professionCode}_${satietyCode}_${levelCode}_${xpCode}`;
};
