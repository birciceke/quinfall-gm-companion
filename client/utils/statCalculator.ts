import {
  ARMOR_SLOTS,
  WEAPON_SLOTS,
  PHYSICAL_WEAPON_SLOTS,
  MAGICAL_WEAPON_SLOTS,
  BAG_SLOTS,
  TOOL_SLOTS,
} from "../constants-alt";
import { ARMOR_STATS } from "../data/armorStats";
import { RING_STATS } from "../data/ringStats";
import { NECKLACE_STATS } from "../data/necklaceStats";
import { EARRING_STATS } from "../data/earringStats";
import { BRACELET_MAGICAL_DP_STATS } from "../data/braceletStats";
import { SWORD_STATS } from "../data/swordStats";
import { STAFF_STATS } from "../data/staffStats";

/**
 * Gets the pre-calculated stat values for a specific item slot and tier from data tables.
 * @param slot The item slot (e.g., "Zırh", "Bilezik").
 * @param tier The item tier (1-320).
 * @returns An object containing the calculated base stats for that tier.
 */
export const getTierStats = (
  slot: string,
  tier: number
): Record<string, number> => {
  if (tier < 0) return {};

  if (TOOL_SLOTS.includes(slot)) {
    const grade = Math.min(140, Math.max(0, tier)); // Clamp grade between 0-140
    const gatheringSpeed = 5 + (grade / 140) * 25; // 5% to 30%
    const valuableResource = 1 + (grade / 140) * 9; // 1% to 10%
    const professionLevel = 1 + Math.floor(grade / 28); // 1 to 6
    return {
      gatheringSpeed: parseFloat(gatheringSpeed.toFixed(2)),
      valuableResource: parseFloat(valuableResource.toFixed(2)),
      professionLevel,
    };
  }

  const tierIndex = Math.max(0, Math.min(319, tier - 1));

  if (BAG_SLOTS.includes(slot)) {
    return { inventoryWeight: 0 };
  }

  if (ARMOR_SLOTS.includes(slot)) {
    return ARMOR_STATS[tierIndex] || {};
  }

  if (PHYSICAL_WEAPON_SLOTS.includes(slot)) {
    return SWORD_STATS[tierIndex] || {};
  }

  if (MAGICAL_WEAPON_SLOTS.includes(slot)) {
    return STAFF_STATS[tierIndex] || {};
  }

  if (WEAPON_SLOTS.includes(slot)) {
    // Use Ring (AP) stats for Weapons as a placeholder
    return RING_STATS[tierIndex] || {};
  }

  switch (slot) {
    case "Bilezik":
      const magicalDP = BRACELET_MAGICAL_DP_STATS[tierIndex];
      return typeof magicalDP === "number"
        ? { magicalDP: parseFloat(magicalDP.toFixed(1)) }
        : {};
    case "Yüzük":
      return RING_STATS[tierIndex] || {};
    case "Kolye":
      return NECKLACE_STATS[tierIndex] || {};
    case "Küpe":
      return EARRING_STATS[tierIndex] || {};
    default:
      return {};
  }
};
