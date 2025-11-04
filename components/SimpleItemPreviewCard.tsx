import React, { useState, useCallback } from "react";
import { useTranslation } from "../i18n";
import { GenericItemIcon, CopyIcon } from "./Icons";

interface SimpleItemPreviewCardProps {
  item: {
    name: string;
    id: string;
    localeId?: string;
    command: string;
    imageUrl?: string;
  };
}

const SimpleItemPreviewCard: React.FC<SimpleItemPreviewCardProps> = ({
  item,
}) => {
  const { t } = useTranslation();
  const [showNotification, setShowNotification] = useState(false);
  const itemName = t(item.localeId || "") || item.name;

  const borderStyle = {
    backgroundImage:
      "url(https://storage.cloud.google.com/qfitempictures/pet/panel_background2.png)",
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
  };

  const handleCopy = useCallback(() => {
    if (showNotification || !item.spawnCommand) return;

    navigator.clipboard
      .writeText(item.spawnCommand)
      .then(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2500);
      })
      .catch((err) => {
        console.error("Failed to copy item command:", err);
      });
  }, [item.spawnCommand, showNotification]);

  return (
    <div
      className="w-full max-w-sm mx-auto p-2.5 shadow-2xl relative"
      style={borderStyle}
    >
      {showNotification && (
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-4 bg-green-600/95 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow-lg z-10 animate-fade-in-out">
          Komut kopyalandı
        </div>
      )}
      <div className="bg-[#1a1410] overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.7)] border border-yellow-900/40">
        {/* Header */}
        <div className={`p-3 bg-gradient-to-b from-gray-800/80 to-gray-900/80`}>
          <div className="relative z-10 flex items-center gap-3 min-w-0">
            <div className="p-1 border border-gray-600">
              <div className="w-16 h-16 bg-gray-900/50 flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={itemName}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <GenericItemIcon />
                )}
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-200">{itemName}</h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Item ID:</span>
            <span className="text-white font-semibold font-mono">
              {item.itemId || "N/A"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Locale ID:</span>
            <span className="text-white font-semibold font-mono">
              {item.localeId || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Komut:</span>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-semibold font-mono break-all">
                {item.spawnCommand}
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                aria-label="Copy Command"
              >
                <CopyIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleItemPreviewCard;
