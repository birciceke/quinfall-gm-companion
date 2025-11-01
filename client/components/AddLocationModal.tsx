import React, { useState, useEffect } from "react";
// FIX: Update import path to use centralized types.
import type { Location } from "../types";

interface AddLocationModalProps {
  onClose: () => void;
  onSave: (location: Location, originalName?: string | null) => void;
  locationToEdit?: Location | null;
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({
  onClose,
  onSave,
  locationToEdit,
}) => {
  const isEditMode = Boolean(locationToEdit);
  const [originalName, setOriginalName] = useState<string | null>(null);

  const [_id, setObjectId] = useState("");
  const [locationName, setLocationName] = useState("");
  const [teleportCommand, setTeleportCommand] = useState("");

  useEffect(() => {
    if (locationToEdit) {
      setObjectId(locationToEdit._id);
      setLocationName(locationToEdit.locationName);
      setTeleportCommand(locationToEdit.teleportCommand);
      setOriginalName(locationToEdit.locationName);
    }
  }, [locationToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim() || !teleportCommand.trim()) {
      return;
    }
    onSave({ _id, locationName, teleportCommand }, originalName);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 border border-yellow-500/50 rounded-lg shadow-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-yellow-400 mb-6 text-center">
          {isEditMode ? "Edit Teleport Location" : "Add New Teleport Location"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="locationName"
              className="block text-xs font-medium text-gray-400 mb-1"
            >
              Location Name
            </label>
            <input
              id="locationName"
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm"
              required
              autoFocus
            />
          </div>
          <div>
            <label
              htmlFor="locationCommand"
              className="block text-xs font-medium text-gray-400 mb-1"
            >
              Teleport Command
            </label>
            <input
              id="locationCommand"
              type="text"
              value={teleportCommand}
              onChange={(e) => setTeleportCommand(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm font-mono"
              required
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
              {isEditMode ? "Save Changes" : "Add Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocationModal;
