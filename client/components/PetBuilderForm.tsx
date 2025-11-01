import React from "react";
import type { Pet } from "../types";
import Select from "./ui/Select";
import { useTranslation } from "../i18n";
import { PET_TYPES, PET_PROFESSIONS } from "../constants-alt";

interface PetBuilderFormProps {
  pet: Pet;
  onPetChange: (field: keyof Pet, value: string | number) => void;
}

const PetBuilderForm: React.FC<PetBuilderFormProps> = ({
  pet,
  onPetChange,
}) => {
  const { t } = useTranslation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "level" || name === "satiety" || name === "xp") {
      let numValue = parseInt(value, 10);
      if (isNaN(numValue)) numValue = 0;

      if (name === "level") numValue = Math.max(1, Math.min(40, numValue));
      if (name === "satiety" || name === "xp")
        numValue = Math.max(0, Math.min(100, numValue));

      onPetChange(name as keyof Pet, numValue);
    } else {
      onPetChange(name as keyof Pet, value);
    }
  };

  const handleRangeChange =
    (field: keyof Pet) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onPetChange(field, parseInt(e.target.value, 10));
    };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        {t("pet_configuration")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={t("pet_type")}
          name="petType"
          value={pet.petType}
          onChange={handleInputChange}
        >
          {PET_TYPES.map((p) => (
            <option key={p.code} value={p.code}>
              {t(p.nameKey)}
            </option>
          ))}
        </Select>
        <Select
          label={t("pet_profession")}
          name="petProfession"
          value={pet.petProfession}
          onChange={handleInputChange}
        >
          {PET_PROFESSIONS.map((p) => (
            <option key={p.code} value={p.code}>
              {t(p.nameKey)}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-4 mt-6">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            {t("pet_level")}:{" "}
            <span className="font-bold text-white">{pet.level}</span>
          </label>
          <input
            type="range"
            name="level"
            min="1"
            max="40"
            value={pet.level}
            onChange={handleRangeChange("level")}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            {t("pet_satiety")}:{" "}
            <span className="font-bold text-white">{pet.satiety}%</span>
          </label>
          <input
            type="range"
            name="satiety"
            min="0"
            max="100"
            value={pet.satiety}
            onChange={handleRangeChange("satiety")}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            {t("pet_xp")}:{" "}
            <span className="font-bold text-white">{pet.xp}%</span>
          </label>
          <input
            type="range"
            name="xp"
            min="0"
            max="100"
            value={pet.xp}
            onChange={handleRangeChange("xp")}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PetBuilderForm;
