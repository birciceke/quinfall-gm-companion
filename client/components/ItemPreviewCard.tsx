import React, { useMemo } from "react";
import type { Item } from "../types";
import { ItemStat } from "../types";
import { useTranslation } from "../i18n";
import {
  STATIC_ITEM_ATTRIBUTES,
  ACCESSORY_SLOTS,
  NO_SET,
  ARMOR_SLOTS,
  RARITY_INFO,
  DisplayRarity,
  SET_BONUS_DETAILS,
  ARMOR_WEIGHTS,
  WEAPON_SLOTS,
  PHYSICAL_WEAPON_SLOTS,
  MAGICAL_WEAPON_SLOTS,
  BAG_SLOTS,
  ACCESSORY_NAMES_BY_LEVEL,
  HEAVY_ARMOR_NAMES_BY_LEVEL,
  LIGHT_ARMOR_NAMES_BY_LEVEL,
  ROBE_ARMOR_NAMES_BY_LEVEL,
  WEAPON_NAMES_BY_LEVEL,
  SET_BONUSES,
  SetRarity,
  TOOL_SLOTS,
} from "../constants-alt";
import { getDisplayRarity, getSetRarity } from "../utils/rarity";
import { getTierStats } from "../utils/statCalculator";
import { ITEM_IMAGES } from "../assets/images";
import { PROPERTY_STATS_BY_LEVEL } from "../data/propertyStats";
import type { SetBonusStatValues } from "../data/setBonusStats";
import { SET_BONUS_STATS } from "../data/setBonusStats";
import {
  ArmorIcon,
  BagIcon,
  PropertyIcon,
  ToolIcon,
  WeaponIcon,
} from "./Icons";

interface ItemPreviewCardProps {
  item: Item;
}

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

const getStatsForSlot = (slot: string): StatKey[] => {
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

type StarColor = "dim" | "yellow" | "red" | "blue";

const StarIcon: React.FC<{ color: StarColor }> = ({ color }) => {
  const colorClasses: Record<StarColor, string> = {
    dim: "text-gray-600/50",
    yellow: "text-yellow-400",
    red: "text-red-500",
    blue: "text-cyan-400",
  };
  const shadowStyle = {
    filter:
      color === "yellow"
        ? "drop-shadow(0 0 2px rgba(250, 204, 21, 0.7))"
        : color === "blue"
        ? "drop-shadow(0 0 2px rgba(34, 211, 238, 0.7))"
        : color === "red"
        ? "drop-shadow(0 0 2px rgba(239, 68, 68, 0.7))"
        : "none",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-4 h-4 ${colorClasses[color]}`}
      style={shadowStyle}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
        clipRule="evenodd"
      />
    </svg>
  );
};

const calculateMainStatBonus = (base: number, starLevel: number): number => {
  if (starLevel === 0) return 0;
  const bonus = base * starLevel * 0.152;
  return bonus;
};

const StatRow: React.FC<{
  label: string;
  value: string | number;
  bonus?: number | null;
}> = ({ label, value, bonus }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-400">{label}:</span>
    <span className="text-white font-semibold">
      {value}
      {bonus != null && bonus > 0 && (
        <span className="text-cyan-400"> +{Math.round(bonus)}</span>
      )}
    </span>
  </div>
);

const getPropertyStatValue = (stat: ItemStat, level: number): number => {
  return PROPERTY_STATS_BY_LEVEL[level]?.[stat] ?? 0;
};

const Property: React.FC<{
  stat: ItemStat | "" | null;
  level: number;
  t_stat: (s: ItemStat) => string;
}> = ({ stat, level, t_stat }) => {
  if (!stat) return null;

  const baseValue = getPropertyStatValue(stat, level);

  if (
    baseValue === 0 &&
    !Object.keys(PROPERTY_STATS_BY_LEVEL[level] || {}).includes(stat)
  ) {
    return null;
  }

  const isPercentage = stat.includes("Şansı");

  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-cyan-300 font-semibold">
        <PropertyIcon />
        <span>{t_stat(stat)}:</span>
      </div>
      <span className="text-white font-semibold">
        {isPercentage
          ? parseFloat(baseValue.toFixed(2))
          : Math.round(baseValue)}
      </span>
    </div>
  );
};

const parseSetName = (setBonus: string): string => {
  if (!setBonus) return "";
  const match = setBonus.match(/^(.*?)\s*\(/);
  return match ? match[1].trim() : setBonus;
};

type CurrentStats = typeof STATIC_ITEM_ATTRIBUTES &
  Partial<Record<StatKey, number>>;

const SET_BONUS_TIERS: Record<DisplayRarity, number[]> = {
  legendary: [2, 3, 4],
  epic: [3, 4],
  uncommon: [4],
  common: [],
  standard: [],
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

const getStarColors = (starLevel: number): StarColor[] => {
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

const ItemPreviewCard: React.FC<ItemPreviewCardProps> = ({ item }) => {
  const { t, t_rarity, t_stat, t_slot, t_armor_type } = useTranslation();
  const tierStats = item.tier > 0 ? getTierStats(item.slot, item.tier) : {};
  const currentStats: CurrentStats = {
    ...STATIC_ITEM_ATTRIBUTES,
    ...tierStats,
  };
  const rarity = getDisplayRarity(item.tier, item.level, item.slot);
  const rarityInfo = RARITY_INFO[rarity];

  const STAT_NAME_TO_KEY_FOR_BONUS: Record<string, keyof SetBonusStatValues> = {
    set_bonus_phy_ap: "phy_AP",
    set_bonus_magic_ap: "magic_AP",
    set_bonus_phy_dp: "phy_DP",
    set_bonus_magic_dp: "magic_DP",
    set_bonus_hp: "HP",
    set_bonus_mp: "MP",
    set_bonus_hp_regen: "HP_regen",
    set_bonus_mp_regen: "MP_regen",
    set_bonus_accuracy: "isabet",
    set_bonus_evasion: "kacinma",
    set_bonus_crit_chance: "kritik_sans",
    set_bonus_crit_def: "kritik_defans",
    set_bonus_crit_multiplier: "kritik_kat",
    set_bonus_healing_multiplier: "iyilestirme_kat",
    set_bonus_speed: "hareket_hizi",
  };

  const getSetBonusDisplayValue = (bonusKey: string, item: Item): string => {
    const statKey = STAT_NAME_TO_KEY_FOR_BONUS[bonusKey];
    if (!statKey) return t(bonusKey as any).replace("[Value]", "N/A");

    const rarity = getSetRarity(item.tier, item.level, item.slot);
    if (rarity === "default")
      return t(bonusKey as any).replace("[Value]", "N/A");

    const raritySets = SET_BONUSES[rarity as Exclude<SetRarity, "default">];
    if (!raritySets) return t(bonusKey as any).replace("[Value]", "N/A");

    const setIndexInRarity = raritySets.findIndex((s) => s === item.setBonus);
    if (setIndexInRarity === -1)
      return t(bonusKey as any).replace("[Value]", "N/A");

    const setCode = "ABCDEFGHIJKL"[setIndexInRarity];
    const rawValue = SET_BONUS_STATS[rarity]?.[setCode]?.[statKey];

    if (rawValue === undefined)
      return t(bonusKey as any).replace("[Value]", "N/A");

    const percentageStats: (keyof SetBonusStatValues)[] = [
      "kritik_sans",
      "kritik_defans",
      "kritik_kat",
      "iyilestirme_kat",
      "hareket_hizi",
    ];
    let finalValue: number;

    if (percentageStats.includes(statKey)) {
      finalValue = rawValue;
    } else {
      finalValue = rawValue * item.level;
    }

    let displayValue: string;

    if (percentageStats.includes(statKey)) {
      displayValue = `${finalValue}%`;
    } else {
      displayValue = `${Math.round(finalValue)}`;
    }

    return t(bonusKey as any).replace("[Value]", displayValue);
  };

  const headerGlowStyle = {
    boxShadow: `0 0 15px 3px ${rarityInfo.glowHex}${
      rarity === "standard" ? "22" : "55"
    }`,
  };

  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const itemIconStyle = {
    "--glow-color-inner": hexToRgba(rarityInfo.glowHex, 0.5),
    "--glow-color-outer": hexToRgba(rarityInfo.glowHex, 0.3),
    backgroundImage: rarityInfo.iconBackgroundGradient,
  } as React.CSSProperties;

  const itemGlowStyle = {
    filter: `drop-shadow(0 0 4px ${rarityInfo.glowHex}80) drop-shadow(0 0 8px ${rarityInfo.glowHex}40)`,
  };

  const mainStatBonuses: Record<string, number> = {
    physicalDP: calculateMainStatBonus(
      currentStats.physicalDP || 0,
      item.starLevel
    ),
    magicalDP: calculateMainStatBonus(
      currentStats.magicalDP || 0,
      item.starLevel
    ),
    hp: calculateMainStatBonus(currentStats.hp || 0, item.starLevel),
    evasion: calculateMainStatBonus(currentStats.evasion || 0, item.starLevel),
    physicalAP: calculateMainStatBonus(
      currentStats.physicalAP || 0,
      item.starLevel
    ),
    magicalAP: calculateMainStatBonus(
      currentStats.magicalAP || 0,
      item.starLevel
    ),
    accuracy: calculateMainStatBonus(
      currentStats.accuracy || 0,
      item.starLevel
    ),
    mpRegen: calculateMainStatBonus(currentStats.mpRegen || 0, item.starLevel),
    inventoryWeight: calculateMainStatBonus(
      currentStats.inventoryWeight || 0,
      item.starLevel
    ),
  };

  const starColors = getStarColors(item.starLevel);

  const setKeyName = parseSetName(item.setBonus);
  let setDisplayName = setKeyName;
  if (setKeyName && !setKeyName.endsWith(" Set")) {
    setDisplayName = `${setKeyName} ${t("set_suffix")}`;
  }

  const isAccessory = ACCESSORY_SLOTS.includes(item.slot);
  const isArmor = ARMOR_SLOTS.includes(item.slot);
  const isWeapon = WEAPON_SLOTS.includes(item.slot);
  const isBag = BAG_SLOTS.includes(item.slot);
  const isTool = TOOL_SLOTS.includes(item.slot);
  const showSetName = item.setBonus && item.setBonus !== NO_SET;
  const armorWeight = isArmor ? ARMOR_WEIGHTS[item.armorType] : undefined;
  const statsToDisplay = getStatsForSlot(item.slot);
  const bonusTiers = SET_BONUS_TIERS[rarity];
  const setDetails = SET_BONUS_DETAILS[setKeyName];

  const itemName = useMemo(() => {
    if (isTool) {
      return t_slot(item.slot);
    }

    if (isAccessory || isBag) {
      const names = ACCESSORY_NAMES_BY_LEVEL[item.slot];
      if (names) {
        const index = getAccessoryNameIndex(item.level);
        return names[index] || item.slot;
      }
    }

    if (isArmor) {
      if (item.armorType === "[Ağır]") {
        const names = HEAVY_ARMOR_NAMES_BY_LEVEL[item.slot];
        if (names) {
          const index = getArmorNameIndex(item.level);
          return names[index] || item.slot;
        }
      }
      if (item.armorType === "[Hafif]") {
        const names = LIGHT_ARMOR_NAMES_BY_LEVEL[item.slot];
        if (names) {
          const index = getArmorNameIndex(item.level);
          return names[index] || item.slot;
        }
      }
      if (item.armorType === "[Cübbe]") {
        const names = ROBE_ARMOR_NAMES_BY_LEVEL[item.slot];
        if (names) {
          const index = getArmorNameIndex(item.level);
          return names[index] || item.slot;
        }
      }
    }

    if (isWeapon) {
      const names = WEAPON_NAMES_BY_LEVEL[item.slot];
      if (names) {
        const index = getArmorNameIndex(item.level);
        return names[index] || item.slot;
      }
    }

    return item.slot;
  }, [
    item.slot,
    item.level,
    item.armorType,
    isAccessory,
    isBag,
    isArmor,
    isWeapon,
    isTool,
    t_slot,
  ]);

  const itemImage = ITEM_IMAGES[itemName];

  const borderStyle = {
    backgroundImage:
      "url(https://storage.cloud.google.com/qfitempictures/pet/panel_background2.png)",
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
  };

  const statLabels: Record<StatKey, string> = {
    physicalDP: t_stat(ItemStat.FizikselSavunma),
    magicalDP: t_stat(ItemStat.BuyuSavunma),
    hp: t_stat(ItemStat.HP),
    mp: t_stat(ItemStat.MP),
    physicalAP: t_stat(ItemStat.FizikselSaldiri),
    magicalAP: t_stat(ItemStat.BuyuSaldiri),
    accuracy: t_stat(ItemStat.Isabet),
    evasion: t_stat(ItemStat.Kacinma),
    mpRegen: t_stat(ItemStat.MPYenilenmesi),
    inventoryWeight: t_stat("inventoryWeight"),
    gatheringSpeed: t("gatheringSpeed"),
    valuableResource: t("valuableResource"),
    professionLevel: t("professionLevel"),
  };

  return (
    <div
      className="w-full max-w-xs mx-auto p-2 shadow-2xl relative"
      style={borderStyle}
    >
      <div className="bg-[#1a1410] overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.7)] border border-yellow-900/40">
        {/* Header */}
        <div
          style={headerGlowStyle}
          className={`p-2.5 ${rarityInfo.headerColor} relative overflow-hidden`}
        >
          {/* Animated Clouds */}
          <div className="absolute inset-0 z-0">
            <div
              className="cloud cloud-1"
              style={{ backgroundColor: rarityInfo.glowHex }}
            ></div>
            <div
              className="cloud cloud-2"
              style={{ backgroundColor: rarityInfo.glowHex }}
            ></div>
          </div>

          {/* Sparkle Effect */}
          <div className="sparkle-container z-0">
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
          </div>

          {/* Header Content */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-1 border border-gray-600">
                <div
                  className="w-14 h-14 item-icon-container flex items-center justify-center"
                  style={itemIconStyle}
                >
                  {itemImage ? (
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="w-full h-full object-contain"
                      style={itemGlowStyle}
                    />
                  ) : (
                    <div style={itemGlowStyle}>
                      {isBag ? (
                        <BagIcon />
                      ) : isWeapon ? (
                        <WeaponIcon />
                      ) : isTool ? (
                        <ToolIcon />
                      ) : (
                        <ArmorIcon />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-200 truncate whitespace-nowrap">
                  {!isTool && item.starLevel > 0 && (
                    <span className="text-purple-400">+{item.starLevel} </span>
                  )}
                  {itemName}
                  {showSetName && (
                    <span className="text-xs font-medium opacity-80 ml-1">
                      [{setDisplayName}]
                    </span>
                  )}
                </h2>
                <p className="text-gray-400 font-semibold text-xs mt-1">
                  {isArmor
                    ? `${t_slot(item.slot)} ${t_armor_type(item.armorType)}`
                    : t_slot(item.slot)}
                </p>
              </div>
            </div>
            <div
              className={`${rarityInfo.badgeColor} text-white text-xs font-bold px-2 py-1 rounded flex-shrink-0 translate-y-6`}
            >
              {t_rarity(rarity)}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-3 flex gap-3">
          <div className="flex-grow space-y-1.5">
            {statsToDisplay.map((statKey) => (
              <StatRow
                key={statKey}
                label={statLabels[statKey]}
                value={
                  statKey === "gatheringSpeed" || statKey === "valuableResource"
                    ? `${currentStats[statKey] || 0}%`
                    : Math.round(currentStats[statKey] || 0)
                }
                bonus={mainStatBonuses[statKey]}
              />
            ))}
            {isArmor && armorWeight !== undefined && (
              <StatRow label={t("armor_weight")} value={armorWeight} />
            )}
            {isArmor && (
              <StatRow
                label={t_stat(ItemStat.Kacinma)}
                value={Math.round(currentStats.evasion || 0)}
                bonus={mainStatBonuses.evasion}
              />
            )}
            <StatRow label={t("level")} value={item.level} />
            {!isTool && (
              <StatRow label={t("gender")} value={currentStats.gender} />
            )}
          </div>

          <div className="flex flex-col items-center justify-start flex-shrink-0">
            <div
              className="text-4xl font-black text-stone-300 font-calibri"
              style={{ WebkitTextStroke: "1px rgba(0,0,0,0.5)" }}
            >
              {item.tier}
            </div>
            <div className="text-xs text-stone-300 font-semibold">
              {t("grade")}
            </div>
            {!isBag && !isTool && item.starLevel > 0 && (
              <div className="flex justify-center gap-0.5 mt-2">
                {starColors.map((color, index) => (
                  <StarIcon key={index} color={color} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Properties */}
        {!isTool && (
          <div className="px-3 pb-3">
            <hr className="border-yellow-900/50 mb-3" />
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              {t("properties")}:
            </h3>
            <div className="space-y-1">
              <Property
                stat={item.property1}
                level={item.level}
                t_stat={t_stat}
              />
              <Property
                stat={item.property2}
                level={item.level}
                t_stat={t_stat}
              />
              <Property
                stat={item.property3}
                level={item.level}
                t_stat={t_stat}
              />
            </div>
          </div>
        )}

        {/* Set Bonus */}
        {showSetName && (
          <div className="px-3 pb-3">
            <hr className="border-yellow-900/50 mb-3" />
            <h3 className="text-lg font-bold text-yellow-500 text-center mb-2">
              {setDisplayName}
            </h3>
            <div className="space-y-2">
              {bonusTiers.map((tierCount) => {
                const bonuses = setDetails?.[tierCount];
                return (
                  <div key={tierCount} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 border-2 border-gray-500 rounded-full flex items-center justify-center text-sm font-bold text-gray-400">
                      {tierCount}
                    </div>
                    <div className="text-gray-300 text-sm leading-tight pt-0.5">
                      {bonuses ? (
                        bonuses.map((bonus, index) => {
                          const displayValue = getSetBonusDisplayValue(
                            bonus,
                            item
                          );
                          return <div key={index}>{displayValue}</div>;
                        })
                      ) : (
                        <div className="opacity-50 italic">
                          Set bonus not defined
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-black/30 p-3 border-t border-yellow-900/50 space-y-1.5">
          <StatRow
            label={t("durability")}
            value={`${item.durability} / 1000`}
          />
          {!isTool && (
            <>
              <StatRow
                label={t("repair_cost")}
                value={currentStats.repairCost}
              />
              <StatRow label={t("sell_price")} value={currentStats.sellPrice} />
              <StatRow label={t("weight")} value={currentStats.weight} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemPreviewCard;
