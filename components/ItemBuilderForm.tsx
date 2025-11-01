import React, { useState, useEffect } from "react";
import type { Item } from "../types";
import { ItemStat } from "../types";
import Input from "./ui/Input";
import Select from "./ui/Select";
import { useTranslation } from "../i18n";
import {
  ARMOR_TYPES,
  STAT_OPTIONS,
  STAR_LEVELS,
  ACCESSORY_SLOTS,
  ARMOR_ITEM_LEVELS,
  ACCESSORY_ITEM_LEVELS,
  ARMOR_SLOTS,
  WEAPON_SLOTS,
  BASE_GRADE_PER_LEVEL,
  BAG_SLOTS,
  TOOL_SLOTS,
  TOOL_LEVELS,
  TOOL_GRADE_RANGES,
} from "../constants-alt";
import { getSetBonuses } from "../utils/rarity";

interface ItemBuilderFormProps {
  item: Item;
  onItemChange: (field: keyof Item, value: string | number) => void;
  onTriggerMatrix: () => void;
  onTriggerAli: () => void;
  onTriggerJupi: () => void;
}

const ItemBuilderForm: React.FC<ItemBuilderFormProps> = ({
  item,
  onItemChange,
  onTriggerMatrix,
  onTriggerAli,
  onTriggerJupi,
}) => {
  const { t, t_stat, t_slot, t_armor_type } = useTranslation();
  const [tierInputValue, setTierInputValue] = useState(item.tier.toString());

  const isTool = TOOL_SLOTS.includes(item.slot);

  let minTier: number;
  let maxTier: number;

  if (isTool) {
    const range = TOOL_GRADE_RANGES[item.level];
    minTier = range ? range.min : 0;
    maxTier = range ? range.max : 0;
  } else {
    const baseGrade = BASE_GRADE_PER_LEVEL[item.level] || 0;
    minTier = Math.floor(baseGrade / 2);
    maxTier = baseGrade * 2;
  }

  useEffect(() => {
    // This effect syncs the local input state if the parent component's
    // canonical state changes for any reason (e.g., changing level clamps tier).
    if (item.tier.toString() !== tierInputValue) {
      setTierInputValue(item.tier.toString());
    }
  }, [item.tier]);

  const updateTierFromInput = () => {
    const numValue = parseInt(tierInputValue, 10);
    const valueToSet = isNaN(numValue)
      ? minTier
      : Math.max(minTier, Math.min(maxTier, numValue));

    onItemChange("tier", valueToSet);
    // Forcefully sync the input display with the clamped value
    setTierInputValue(valueToSet.toString());
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "tier") {
      setTierInputValue(value); // Update local state immediately for responsiveness
      if (value.toLowerCase() === "bug") onTriggerMatrix();
      if (value.toLowerCase() === "ali") onTriggerAli();
      if (value.toLowerCase() === "jupi") onTriggerJupi();
      return; // Defer global state update to blur or Enter
    }

    const numericFields = ["level", "starLevel", "durability"];
    if (numericFields.includes(name)) {
      let numValue = parseInt(value, 10) || 0;
      if (name === "durability") {
        numValue = Math.max(0, Math.min(1000, numValue));
      }
      onItemChange(name as keyof Item, numValue);
    } else {
      onItemChange(name as keyof Item, value);
    }
  };

  const handleTierBlur = () => {
    // When the user clicks away, parse, clamp, and update the global state.
    updateTierFromInput();
  };

  const changeTier = (direction: "up" | "down") => {
    // Base the change on the actual item tier for consistency.
    const newTier = direction === "up" ? item.tier + 1 : item.tier - 1;
    const clampedTier = Math.max(minTier, Math.min(maxTier, newTier));

    onItemChange("tier", clampedTier);
    setTierInputValue(clampedTier.toString());
  };

  const handleTierKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      changeTier("up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      changeTier("down");
    } else if (e.key === "Enter") {
      e.preventDefault();
      updateTierFromInput();
      (e.target as HTMLInputElement).blur(); // Optional: remove focus after enter
    }
  };

  // FIX: Added 'item.slot' as the third argument to getSetBonuses to match its function signature.
  const availableSets = getSetBonuses(item.tier, item.level, item.slot);
  const isAccessory = ACCESSORY_SLOTS.includes(item.slot);
  const isWeapon = WEAPON_SLOTS.includes(item.slot);
  const isArmor = ARMOR_SLOTS.includes(item.slot);
  const isBag = BAG_SLOTS.includes(item.slot);

  let availableLevels: number[];
  if (isArmor || isWeapon) {
    availableLevels = ARMOR_ITEM_LEVELS;
  } else if (isTool) {
    availableLevels = TOOL_LEVELS;
  } else {
    // accessory or bag
    availableLevels = ACCESSORY_ITEM_LEVELS;
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        {t("item_configuration")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={t("equipment_slot")}
          name="slot"
          value={item.slot}
          onChange={handleInputChange}
        >
          <optgroup label={t("optgroup_armor")}>
            {ARMOR_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {t_slot(slot)}
              </option>
            ))}
          </optgroup>
          <optgroup label={t("optgroup_accessory")}>
            {ACCESSORY_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {t_slot(slot)}
              </option>
            ))}
          </optgroup>
          <optgroup label={t("optgroup_weapon")}>
            {WEAPON_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {t_slot(slot)}
              </option>
            ))}
          </optgroup>
          <optgroup label={t("optgroup_equipment")}>
            {BAG_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {t_slot(slot)}
              </option>
            ))}
          </optgroup>
          <optgroup label={t("optgroup_tools")}>
            {TOOL_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {t_slot(slot)}
              </option>
            ))}
          </optgroup>
        </Select>
        <Select
          label={t("armor_type")}
          name="armorType"
          value={item.armorType}
          onChange={handleInputChange}
          disabled={isAccessory || isWeapon || isBag || isTool}
        >
          {ARMOR_TYPES.map((type) => (
            <option key={type} value={type}>
              {t_armor_type(type)}
            </option>
          ))}
        </Select>
        <Select
          label={t("level")}
          name="level"
          value={item.level}
          onChange={handleInputChange}
        >
          {availableLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
        <Input
          label={t("grade")}
          name="tier"
          type="text"
          value={tierInputValue}
          onChange={handleInputChange}
          onBlur={handleTierBlur}
          onKeyDown={handleTierKeyDown}
          min={minTier}
          max={maxTier}
          onIncrement={() => changeTier("up")}
          onDecrement={() => changeTier("down")}
        />
        <Input
          label={t("durability")}
          name="durability"
          type="number"
          value={item.durability}
          onChange={handleInputChange}
          min="0"
          max="1000"
        />
        <Select
          label={t("star_level")}
          name="starLevel"
          value={item.starLevel}
          onChange={handleInputChange}
          disabled={isBag || isTool}
        >
          {STAR_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">
          {t("properties")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label={t("property_1")}
            name="property1"
            value={item.property1}
            onChange={handleInputChange}
            disabled={isTool}
          >
            <option value="">{t("none")}</option>
            {STAT_OPTIONS.map((stat) => (
              <option key={stat} value={stat}>
                {t_stat(stat)}
              </option>
            ))}
          </Select>
          <Select
            label={t("property_2")}
            name="property2"
            value={item.property2}
            onChange={handleInputChange}
            disabled={isTool}
          >
            <option value="">{t("none")}</option>
            {STAT_OPTIONS.map((stat) => (
              <option key={stat} value={stat}>
                {t_stat(stat)}
              </option>
            ))}
          </Select>
          <Select
            label={t("property_3")}
            name="property3"
            value={item.property3}
            onChange={handleInputChange}
            disabled={isTool}
          >
            <option value="">{t("none")}</option>
            {STAT_OPTIONS.map((stat) => (
              <option key={stat} value={stat}>
                {t_stat(stat)}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="mt-6">
        <Select
          label={t("set_bonus")}
          name="setBonus"
          value={item.setBonus}
          onChange={handleInputChange}
          disabled={isTool}
        >
          {availableSets.map((set) => (
            <option key={set} value={set}>
              {set}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default ItemBuilderForm;
