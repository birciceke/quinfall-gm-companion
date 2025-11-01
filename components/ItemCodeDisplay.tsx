import React, { useState, useCallback } from "react";
import type { Item } from "../types";
import { generateItemCode } from "../utils/itemCodeGenerator";
import { useTranslation } from "../i18n";
import {
  ARMOR_SLOTS,
  ACCESSORY_SLOTS,
  WEAPON_SLOTS,
  BAG_SLOTS,
} from "../constants-alt";
import { CopyIcon } from "./Icons";

interface ItemCodeDisplayProps {
  item: Item;
}

const ItemCodeDisplay: React.FC<ItemCodeDisplayProps> = ({ item }) => {
  const { t, t_stat } = useTranslation();
  const [showNotification, setShowNotification] = useState(false);
  const itemCode = generateItemCode(item);

  const handleCopy = useCallback(() => {
    if (showNotification) return;

    const codeToCopy = `/item ${itemCode}`;
    navigator.clipboard
      .writeText(codeToCopy)
      .then(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2500);
      })
      .catch((err) => {
        console.error("Failed to copy item code:", err);
      });
  }, [itemCode, showNotification]);

  const breakdown = () => {
    const isArmor = ARMOR_SLOTS.includes(item.slot);
    const isAccessory = ACCESSORY_SLOTS.includes(item.slot);
    const isWeapon = WEAPON_SLOTS.includes(item.slot);
    const isBag = BAG_SLOTS.includes(item.slot);

    if (!isArmor && !isAccessory && !isWeapon && !isBag) {
      return <p>{itemCode}</p>;
    }

    const codeParts = itemCode.split("_");
    const detailsPart = codeParts[1] || "";
    const propertiesPart = codeParts[2] || "";
    const durabilityPart = codeParts[3] || "";

    const prop1Code = propertiesPart.substring(0, 1);
    const prop2Code = propertiesPart.substring(1, 2);
    const prop3Code = propertiesPart.substring(2, 3);
    const setCode = propertiesPart.substring(3, 4);
    const starLevelCode = propertiesPart.substring(4, 5);
    const placeholderCode = propertiesPart.substring(5, 7);
    const gradeCode = propertiesPart.substring(7, 10);

    const getCategoryAndDetails = () => {
      if (isArmor) {
        const slotCode = detailsPart.substring(0, 1);
        const weightCode = detailsPart.substring(1, 2);
        const levelCode = detailsPart.substring(2, 4);
        return (
          <>
            <li>
              {t("category")}:{" "}
              <span className="text-white font-semibold">{codeParts[0]}</span>{" "}
              (Armor)
            </li>
            <li>
              {t("details")}:{" "}
              <span className="text-white font-semibold">{detailsPart}</span>
              <ul className="list-disc list-inside pl-6 text-xs mt-1">
                <li>
                  {t("slot_code")}:{" "}
                  <span className="font-semibold text-gray-200">
                    {slotCode}
                  </span>{" "}
                  <em>(e.g., 1 for Zırh)</em>
                </li>
                <li>
                  {t("weight_code")}:{" "}
                  <span className="font-semibold text-gray-200">
                    {weightCode}
                  </span>{" "}
                  <em>(e.g., 0 for Ağır)</em>
                </li>
                <li>
                  {t("level_code")}:{" "}
                  <span className="font-semibold text-gray-200">
                    {levelCode}
                  </span>{" "}
                  <em>({t("maps_to_item_level")})</em>
                </li>
              </ul>
            </li>
          </>
        );
      }
      if (isWeapon) {
        const slotCode = detailsPart.substring(0, 1);
        const placeholder = detailsPart.substring(1, 2);
        const levelCode = detailsPart.substring(2, 4);
        return (
          <>
            <li>
              {t("category")}:{" "}
              <span className="text-white font-semibold">{codeParts[0]}</span>{" "}
              (Weapon)
            </li>
            <li>
              {t("details")}:{" "}
              <span className="text-white font-semibold">{detailsPart}</span>
              <ul className="list-disc list-inside pl-6 text-xs mt-1">
                <li>
                  {t("slot_code")}:{" "}
                  <span className="font-semibold text-gray-200">
                    {slotCode}
                  </span>{" "}
                  <em>(e.g., A for Kılıç)</em>
                </li>
                <li>
                  {t("placeholder")}:{" "}
                  <span className="font-semibold text-gray-200">
                    {placeholder}
                  </span>{" "}
                  <em>({t("reserved")})</em>
                </li>
                <li>
                  {t("level_code")}:{" "}
                  <span className="font-semibold text-gray-200">
                    {levelCode}
                  </span>{" "}
                  <em>({t("maps_to_item_level")})</em>
                </li>
              </ul>
            </li>
          </>
        );
      }
      if (isAccessory) {
        const slotCode = detailsPart.substring(0, 1);
        const placeholder = detailsPart.substring(1, 2);
        const levelCode = detailsPart.substring(2, 4);
        return (
          <>
            <li>
              {t("category")}:{" "}
              <span className="text-white font-semibold">{codeParts[0]}</span>{" "}
              (Accessory)
            </li>
            <li>
              {t("details")}:{" "}
              <span className="text-white font-semibold">{detailsPart}</span>
              <ul className="list-disc list-inside pl-6 text-xs mt-1">
                <li>
                  {t("slot_code")}:{" "}
                  <span className="font-semibold text-gray-200">
                    {slotCode}
                  </span>{" "}
                  <em>(e.g., 1 for Kolye)</em>
                </li>
                <li>
                  {t("placeholder")}:{" "}
                  <span className="font-semibold text-gray-200">
                    {placeholder}
                  </span>{" "}
                  <em>({t("reserved")})</em>
                </li>
                <li>
                  {t("level_code")}:{" "}
                  <span className="font-semibold text-gray-200">
                    {levelCode}
                  </span>{" "}
                  <em>({t("maps_to_item_level")})</em>
                </li>
              </ul>
            </li>
          </>
        );
      }
      if (isBag) {
        const slotCode = detailsPart.substring(0, 1);
        const placeholder = detailsPart.substring(1, 2);
        const levelCode = detailsPart.substring(2, 4);
        return (
          <>
            <li>
              {t("category")}:{" "}
              <span className="text-white font-semibold">{codeParts[0]}</span>{" "}
              (Equipment)
            </li>
            <li>
              {t("details")}:{" "}
              <span className="text-white font-semibold">{detailsPart}</span>
              <ul className="list-disc list-inside pl-6 text-xs mt-1">
                <li>
                  {t("slot_code")}:{" "}
                  <span className="font-semibold text-gray-200">
                    {slotCode}
                  </span>{" "}
                  <em>(e.g., 5 for Çanta)</em>
                </li>
                <li>
                  {t("placeholder")}:{" "}
                  <span className="font-semibold text-gray-200">
                    {placeholder}
                  </span>{" "}
                  <em>({t("reserved")})</em>
                </li>
                <li>
                  {t("level_code")}:{" "}
                  <span className="font-semibold text-gray-200">
                    {levelCode}
                  </span>{" "}
                  <em>({t("maps_to_item_level")})</em>
                </li>
              </ul>
            </li>
          </>
        );
      }
      return null;
    };

    return (
      <ul className="list-disc list-inside space-y-1">
        {getCategoryAndDetails()}
        <li>
          {t("properties")}:{" "}
          <span className="text-white font-semibold">{propertiesPart}</span>
          <ul className="list-disc list-inside pl-6 text-xs mt-1">
            <li>
              {t("property_code_1")}:{" "}
              <span className="font-semibold text-gray-200">{prop1Code}</span>{" "}
              <em>({item.property1 ? t_stat(item.property1) : t("none")})</em>
            </li>
            <li>
              {t("property_code_2")}:{" "}
              <span className="font-semibold text-gray-200">{prop2Code}</span>{" "}
              <em>({item.property2 ? t_stat(item.property2) : t("none")})</em>
            </li>
            <li>
              {t("property_code_3")}:{" "}
              <span className="font-semibold text-gray-200">{prop3Code}</span>{" "}
              <em>({item.property3 ? t_stat(item.property3) : t("none")})</em>
            </li>
            <li>
              {t("set_code")}:{" "}
              <span className="font-semibold text-gray-200">{setCode}</span>{" "}
              <em>({item.setBonus || "None"})</em>
            </li>
            <li>
              {t("star_level_code")}:{" "}
              <span className="font-semibold text-gray-200">
                {starLevelCode}
              </span>{" "}
              <em>
                ({item.starLevel} {t("stars")})
              </em>
            </li>
            <li>
              {t("placeholder_code")}:{" "}
              <span className="font-semibold text-gray-200">
                {placeholderCode}
              </span>{" "}
              <em>({t("reserved")})</em>
            </li>
            <li>
              {t("grade_code")}:{" "}
              <span className="font-semibold text-gray-200">{gradeCode}</span>{" "}
              <em>
                ({t("grade")} {item.tier})
              </em>
            </li>
          </ul>
        </li>
        <li>
          {t("durability")}:{" "}
          <span className="text-white font-semibold">{durabilityPart}</span>
          <ul className="list-disc list-inside pl-6 text-xs mt-1">
            <li>
              {t("durability_code")}:{" "}
              <span className="font-semibold text-gray-200">
                {durabilityPart}
              </span>{" "}
              <em>
                ({t("durability")}: {item.durability})
              </em>
            </li>
          </ul>
        </li>
      </ul>
    );
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg mt-8 relative">
      {showNotification && (
        <div className="absolute -top-3 right-4 bg-green-600/95 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow-lg z-10 animate-fade-in-out">
          {t("copied_item_id")}
        </div>
      )}
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">
        {t("item_code_table")}
      </h2>
      <div className="relative">
        <div className="bg-gray-900/50 p-4 rounded-md font-mono text-lg text-center text-cyan-300 tracking-widest break-all pr-12">
          {itemCode}
        </div>
        <button
          onClick={handleCopy}
          disabled={showNotification}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
          aria-label="Copy item code"
        >
          <CopyIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <h3 className="font-semibold text-gray-300 mb-2">
          {t("code_breakdown")}
        </h3>
        {breakdown()}
      </div>
    </div>
  );
};

export default ItemCodeDisplay;
