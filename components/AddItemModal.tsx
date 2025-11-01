import React, { useState, useEffect, useRef } from "react";

import type { SimpleItem } from "../types";

interface AddItemModalProps {
  onClose: () => void;
  onSave: (item: SimpleItem) => void;
  itemToEdit?: SimpleItem | null;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  onClose,
  onSave,
  itemToEdit,
}) => {
  const isEditMode = Boolean(itemToEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [itemName, setItemName] = useState("");
  const [itemId, setItemId] = useState("");
  const [localeId, setLocaleId] = useState("");
  const [spawnCommand, setSpawnCommand] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    setItemName(itemToEdit?.itemName || "");
    setItemId(itemToEdit?.itemId || "");
    setLocaleId(itemToEdit?.localeId || "");
    setSpawnCommand(itemToEdit?.spawnCommand || "");
    setImageUrl(itemToEdit?.imageUrl || "");
  }, [itemToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !spawnCommand.trim()) return;

    onSave({
      _id: itemToEdit?._id,
      itemName,
      itemId: Number(itemId),
      localeId: Number(localeId),
      spawnCommand,
      imageUrl,
    });
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
          {isEditMode ? "Edit Simple Item" : "Add New Simple Item"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-28">
              <label className="block text-xs font-medium text-gray-400 mb-1 text-center">
                Preview
              </label>
              <div className="w-28 h-28 bg-gray-700 rounded-md flex items-center justify-center border border-gray-600">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={itemName}
                    className="w-full h-full object-contain rounded-md p-1"
                  />
                ) : (
                  <span className="text-gray-500 text-xs text-center p-2">
                    No Image
                  </span>
                )}
              </div>
            </div>

            <div className="flex-grow space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-gray-400 mb-1"
                >
                  Item Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label
                    htmlFor="itemId"
                    className="block text-xs font-medium text-gray-400 mb-1"
                  >
                    Item ID
                  </label>
                  <input
                    id="itemId"
                    type="text"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    className={`w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm ${
                      isEditMode ? "bg-gray-800 cursor-not-allowed" : ""
                    }`}
                    required
                    readOnly={isEditMode}
                  />
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="localeId"
                    className="block text-xs font-medium text-gray-400 mb-1"
                  >
                    Locale ID
                  </label>
                  <input
                    id="localeId"
                    type="text"
                    value={localeId}
                    onChange={(e) => setLocaleId(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="spawnCommand"
              className="block text-xs font-medium text-gray-400 mb-1"
            >
              Spawn Command
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
              htmlFor="imageUrl"
              className="block text-xs font-medium text-gray-400 mb-1"
            >
              Image URL or Upload
            </label>
            <div className="flex items-center gap-2">
              <input
                id="imageUrl"
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
                Upload
              </button>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="flex-shrink-0 px-3 py-2 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-500 transition-colors"
                >
                  Clear
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
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md font-semibold hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              {isEditMode ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
