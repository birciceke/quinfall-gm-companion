import React, { useState, useEffect } from "react";
import type { SimpleItem } from "../types";
import AddItemModal from "./AddItemModal";
import { useTranslation } from "../i18n";
import { CopyIcon, PlusCircleIcon, EditIcon, DeleteIcon } from "./Icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteItem,
  fetchItems,
  saveItem,
  updateItem,
} from "@/redux/itemSlicer";

interface ItemIdTableTabProps {
  isAdmin: boolean;
}

const ItemIdTableTab: React.FC<ItemIdTableTabProps> = ({ isAdmin }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((state: any) => state.item);

  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    item: SimpleItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  useEffect(() => {
    dispatch(fetchItems() as any);
  }, [dispatch]);

  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command).then(() => {
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(null), 2000);
    });
  };

  const handleDelete = (_id: any, itemName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      )
    ) {
      dispatch(deleteItem(_id) as any);
    }
  };

  const handleSaveItem = async (itemToSave: any) => {
    try {
      if (itemToSave._id) {
        await dispatch(updateItem(itemToSave) as any);
      } else {
        await dispatch(saveItem(itemToSave) as any);
      }
    } catch (err) {
      console.error("Eşya kaydedilirken bir hata meydana geldi: ", err);
    }
    setModalConfig({ isOpen: false, item: null });
  };

  const filteredItems = Array.isArray(data)
    ? data.filter((item: SimpleItem) => {
        const query = searchQuery.toLowerCase();

        const itemNameMatch =
          item.itemName?.toLowerCase().includes(query) ?? false;
        const itemIdMatch = item.itemId?.toString().includes(query) ?? false;
        const localeIdMatch =
          item.localeId?.toString().includes(query) ?? false;
        const spawnCommandMatch =
          item.spawnCommand?.toLowerCase().includes(query) ?? false;

        return (
          itemNameMatch || itemIdMatch || localeIdMatch || spawnCommandMatch
        );
      })
    : [];

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-yellow-400">
            Item ID Tablosu
          </h2>
          {isAdmin && (
            <button
              onClick={() => setModalConfig({ isOpen: true, item: null })}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
              title="Add New Item"
              aria-label="Add New Item"
            >
              <PlusCircleIcon className="h-7 w-7" />
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Arama sonucu bulunamadı.
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-300 table-fixed">
            <thead className="text-xs text-yellow-400 uppercase bg-gray-800 sticky top-0">
              <tr>
                <th scope="col" className="px-4 py-3 w-[10%]">
                  Preview
                </th>
                <th
                  scope="col"
                  className={`px-4 py-3 ${isAdmin ? "w-[25%]" : "w-[30%]"}`}
                >
                  ITEM ADI
                </th>
                <th scope="col" className="px-4 py-3 w-[15%]">
                  ITEM ID
                </th>
                <th scope="col" className="px-4 py-3 w-[15%]">
                  LOCALE ID
                </th>
                <th
                  scope="col"
                  className={`px-4 py-3 ${isAdmin ? "w-[25%]" : "w-[30%]"}`}
                >
                  SPAWN COMMAND
                </th>
                {isAdmin && (
                  <th scope="col" className="px-4 py-3 w-[10%] text-center">
                    ACTIONS
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item: SimpleItem, index: number) => (
                <tr
                  key={`${item.itemId}-${index}`}
                  className="border-b border-gray-700 hover:bg-gray-800/60"
                >
                  <td className="px-4 py-2">
                    <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.itemName}
                          className="w-full h-full object-contain rounded-md p-0.5"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs text-center p-1">
                          No Img
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 break-words">
                    {t(item.itemName || "") || item.localeId}
                  </td>
                  <td className="px-4 py-2 font-mono text-gray-400 break-words">
                    {item.itemId}
                  </td>
                  <td className="px-4 py-2 font-mono text-gray-400 break-words">
                    {item.localeId || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-300 break-all">
                        {item.spawnCommand}
                      </span>
                      <button
                        onClick={() => handleCopy(item.spawnCommand)}
                        className="ml-2 flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        aria-label="Copy Command"
                      >
                        {copiedCommand === item.spawnCommand ? (
                          <span className="text-xs text-green-400">
                            Kopyalandı!
                          </span>
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => setModalConfig({ isOpen: true, item })}
                          className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                          title="Edit Item"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              item._id,
                              item.itemName || t(item.localeId || "")
                            )
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Delete Item"
                        >
                          <DeleteIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalConfig.isOpen && (
        <AddItemModal
          onClose={() => setModalConfig({ isOpen: false, item: null })}
          onSave={handleSaveItem}
          itemToEdit={modalConfig.item}
        />
      )}
    </div>
  );
};

export default ItemIdTableTab;
