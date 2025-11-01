import React, { useState, useEffect } from "react";
import type { ServerCommand } from "../types";

interface AddCommandModalProps {
  onClose: () => void;
  onSave: (command: ServerCommand, originalKey?: string) => void;
  commandToEdit?: ServerCommand | null;
  allCommands: ServerCommand[];
}

const AddCommandModal: React.FC<AddCommandModalProps> = ({
  onClose,
  onSave,
  commandToEdit,
  allCommands,
}) => {
  const isEditMode = Boolean(commandToEdit);
  const [originalKey, setOriginalKey] = useState<string | null>(null);

  const [_id, setObjectId] = useState("");
  const [serverCommand, setServerCommand] = useState("");
  const [uniqueKey, setUniqueKey] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (commandToEdit) {
      setObjectId(commandToEdit._id);
      setServerCommand(commandToEdit.serverCommand);
      setUniqueKey(commandToEdit.uniqueKey);
      setValue(commandToEdit.value);
      setDescription(commandToEdit.description);
      setOriginalKey(commandToEdit.uniqueKey);
    }
  }, [commandToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverCommand.trim() || !uniqueKey.trim()) {
      return;
    }

    onSave(
      {
        _id,
        serverCommand,
        uniqueKey,
        value,
        description: description,
      },
      originalKey || undefined
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
          {isEditMode ? "Edit Server Command" : "Add New Server Command"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="commandKomut"
                className="block text-xs font-medium text-gray-400 mb-1"
              >
                Command
              </label>
              <input
                id="commandKomut"
                type="text"
                value={serverCommand}
                onChange={(e) => setServerCommand(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm font-mono"
                required
                autoFocus
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="commandKey"
                className="block text-xs font-medium text-gray-400 mb-1"
              >
                Unique Key
              </label>
              <input
                id="commandKey"
                type="text"
                value={uniqueKey}
                onChange={(e) =>
                  setUniqueKey(e.target.value.replace(/\s+/g, "_"))
                }
                className={`w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm ${
                  isEditMode ? "bg-gray-800 cursor-not-allowed" : ""
                }`}
                required
                readOnly={isEditMode}
                placeholder="e.g., new_command_key"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="commandDeger"
              className="block text-xs font-medium text-gray-400 mb-1"
            >
              Value/Format
            </label>
            <textarea
              id="commandDeger"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm"
              rows={2}
            />
          </div>

          <div>
            <label
              htmlFor="commandDescTr"
              className="block text-xs font-medium text-gray-400 mb-1"
            >
              Description (TR)
            </label>
            <textarea
              id="commandDescTr"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm"
              rows={3}
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
              {isEditMode ? "Save Changes" : "Add Command"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCommandModal;
