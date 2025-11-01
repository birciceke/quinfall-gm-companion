import React from "react";
import type { Pet } from "../types";
import { useTranslation } from "../i18n";
import {
  RARITY_INFO,
  PET_TYPES,
  PET_PROFESSIONS,
  PET_PROFESSION_DESCRIPTIONS,
} from "../constants-alt";
import { getPetDisplayRarity } from "../utils/rarity";
import { PawIcon, PropertyIcon } from "./Icons";

interface PetPreviewCardProps {
  pet: Pet;
}

const StatRow: React.FC<{
  label: string;
  value?: string | number;
  children?: React.ReactNode;
}> = ({ label, value, children }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-400">{label}:</span>
    {children || <span className="text-white font-semibold">{value}</span>}
  </div>
);

const getProfessionDescription = (
  professionCode: string,
  level: number
): string => {
  const descriptions = PET_PROFESSION_DESCRIPTIONS[professionCode];
  if (!descriptions) return "";

  const rarity = getPetDisplayRarity(level);
  let index = 0;
  switch (rarity) {
    case "common":
      index = 1;
      break;
    case "uncommon":
      index = 2;
      break;
    case "epic":
      index = 3;
      break;
    case "legendary":
      index = 4;
      break;
    default:
      index = 0; // standard
  }
  return descriptions[index] || descriptions[0]; // Fallback to the first description
};

const PetPreviewCard: React.FC<{ pet: Pet }> = ({ pet }) => {
  const { t, t_rarity } = useTranslation();
  const rarity = getPetDisplayRarity(pet.level);
  const rarityInfo = RARITY_INFO[rarity];

  const headerGlowStyle = {
    boxShadow: `0 0 15px 3px ${rarityInfo.glowHex}${
      rarity === "standard" ? "22" : "55"
    }`,
  };

  const borderStyle = {
    backgroundImage:
      "url(https://storage.cloud.google.com/qfitempictures/pet/panel_background2.png)",
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
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

  const petGlowStyle = {
    filter: `drop-shadow(0 0 4px ${rarityInfo.glowHex}80) drop-shadow(0 0 8px ${rarityInfo.glowHex}40)`,
  };

  const petInfo = PET_TYPES.find((p) => p.code === pet.petType);
  const professionInfo = PET_PROFESSIONS.find(
    (p) => p.code === pet.petProfession
  );

  const professionName = professionInfo
    ? t(professionInfo.nameKey)
    : pet.petProfession;
  const professionDisplay =
    pet.petProfession === "20"
      ? professionName
      : `${professionName} ${t("pet_profession_booster")}`;

  const petImage = petInfo?.imageUrl;
  const professionDescription = getProfessionDescription(
    pet.petProfession,
    pet.level
  );

  return (
    <div
      className="w-full max-w-sm mx-auto p-2.5 shadow-2xl relative"
      style={borderStyle}
    >
      <div className="bg-[#1a1410] overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.7)] border border-yellow-900/40">
        {/* Header */}
        <div
          style={headerGlowStyle}
          className={`p-3 ${rarityInfo.headerColor} relative overflow-hidden`}
        >
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
          <div className="sparkle-container z-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="sparkle"></div>
            ))}
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-1 border border-gray-600">
                <div
                  className="w-16 h-16 item-icon-container flex items-center justify-center"
                  style={itemIconStyle}
                >
                  {petImage ? (
                    <img
                      src={petImage}
                      alt={petInfo ? t(petInfo.nameKey) : pet.petType}
                      className="w-full h-full object-contain"
                      style={petGlowStyle}
                    />
                  ) : (
                    <div style={petGlowStyle}>
                      <PawIcon />
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-1">
                <h2 className="text-base font-bold text-gray-200 truncate whitespace-nowrap">
                  {petInfo ? t(petInfo.nameKey) : pet.petType}
                </h2>
                <p className="text-gray-400 font-semibold text-xs mt-1">
                  {professionDisplay}
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
        <div className="p-4 space-y-3">
          <StatRow label={t("level")} value={pet.level} />
          <StatRow label={t("satiety")}>
            <div className="w-1/2 bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${pet.satiety}%` }}
              ></div>
            </div>
          </StatRow>
          <StatRow label={t("xp")}>
            <div className="w-1/2 bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${pet.xp}%` }}
              ></div>
            </div>
          </StatRow>
        </div>

        {/* Description */}
        {professionDescription && (
          <div className="px-4 pb-4">
            <hr className="border-yellow-900/50 mb-3" />
            <div className="flex items-start gap-2.5">
              <PropertyIcon />
              <p className="text-cyan-300 text-sm font-semibold">
                {professionDescription}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetPreviewCard;
