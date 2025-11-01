import React, { useState, useEffect, useRef } from "react";
// FIX: Update import path to use centralized types.
import type { Costume } from "../types";
import { useTranslation } from "../i18n";

interface AddCostumeModalProps {
  onClose: () => void;
  onSave: (costume: Costume, originalName?: string | null) => void;
  costumeToEdit?: Costume | null;
  existingCategories: string[];
}

const categories = [
  "Silahlar",
  "Kasklar",
  "Erkek Kostümleri",
  "Kadın Kostümleri",
  "Pet Kostümleri",
];

const AddCostumeModal: React.FC<AddCostumeModalProps> = ({
  onClose,
  onSave,
  costumeToEdit,
}) => {
  const { t } = useTranslation();
  const isEditMode = Boolean(costumeToEdit);
  const [originalName, setOriginalName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [_id, setObjectId] = useState("");
  const [costumeName, setCostumeName] = useState("");
  const [spawnCommand, setSpawnCommand] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (costumeToEdit) {
      setObjectId(costumeToEdit._id);
      setCostumeName(costumeToEdit.costumeName);
      setSpawnCommand(costumeToEdit.spawnCommand);
      setCategory(costumeToEdit.category);
      setImageUrl(costumeToEdit.imageUrl || "");
      setOriginalName(costumeToEdit.costumeName);
    }
  }, [costumeToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!costumeName.trim() || !spawnCommand.trim() || !category.trim()) {
      return;
    }
    onSave(
      { _id, costumeName, category, spawnCommand, imageUrl },
      originalName
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 border border-yellow-500/50 rounded-lg shadow-2xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-yellow-400 mb-6 text-center">
          {isEditMode ? t("costumes_edit_title") : t("costumes_add_title")}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-28">
              <label className="block text-xs font-medium text-gray-400 mb-1 text-center">
                {t("preview")}
              </label>
              <div className="w-28 h-28 bg-gray-700 rounded-md flex items-center justify-center border border-gray-600">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={costumeName}
                    className="w-full h-full object-contain rounded-md p-1"
                  />
                ) : (
                  <span className="text-gray-500 text-xs text-center p-2">
                    {t("no_image")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-grow space-y-4">
              <div>
                <label
                  htmlFor="costumeName"
                  className="block text-xs font-medium text-gray-400 mb-1"
                >
                  {t("costume_name")}
                </label>
                <input
                  id="costumeName"
                  type="text"
                  value={costumeName}
                  onChange={(e) => setCostumeName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label
                  htmlFor="costumeCategory"
                  className="block text-xs font-medium text-gray-400 mb-1"
                >
                  {t("category")}
                </label>
                <select
                  id="costumeCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm"
                  required
                >
                  <option value="" disabled>
                    {t("select_category")}
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="spawnCommand"
              className="block text-xs font-medium text-gray-400 mb-1"
            >
              {t("spawn_command")}
            </label>
            <input
              id="spawnCommand"
              type="text"
              value={spawnCommand}
              onChange={(e) => setSpawnCommand(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm font-mono"
              required
            />
          </div>
          <div>
            <label
              htmlFor="costumeImageUrl"
              className="block text-xs font-medium text-gray-400 mb-1"
            >
              {t("image_url_or_upload")}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="costumeImageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-grow w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 px-3 py-2 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
              >
                {t("upload")}
              </button>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="flex-shrink-0 px-3 py-2 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-500 transition-colors"
                >
                  {t("clear")}
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-gray-200 rounded-md font-semibold hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md font-semibold hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              {isEditMode ? t("save_changes") : t("add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCostumeModal;
