import React, { useState, useMemo, useEffect } from "react";
import type { Costume } from "../types";
import AddCostumeModal from "./AddCostumeModal";
import { useTranslation } from "../i18n";
import { CopyIcon, PlusCircleIcon, EditIcon, DeleteIcon } from "./Icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchCostumes } from "@/redux/costumeSlicer";

interface KostumlerTabProps {
  isAdmin: boolean;
  costumes: Costume[];
  onSaveCostume: (costume: Costume, originalName?: string | null) => void;
  onDeleteCostume: (name: string) => void;
}

const KostumlerTab: React.FC<KostumlerTabProps> = ({
  isAdmin,
  onSaveCostume,
  onDeleteCostume,
}) => {
  const { t } = useTranslation();

  const categories = [
    "Hepsi",
    "Silahlar",
    "Kasklar",
    "Erkek Kostümleri",
    "Kadın Kostümleri",
    "Pet Kostümleri",
  ];

  const { data, isLoading } = useSelector((state: any) => state.costume);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCostumes() as any);
  }, [dispatch]);

  const [activeCategory, setActiveCategory] = useState("Hepsi");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSpawnCommand, setCopiedSpawnCommand] = useState<string | null>(
    null
  );
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    costume: Costume | null;
  }>({
    isOpen: false,
    costume: null,
  });

  const handleCopy = (spawnCommand: string) => {
    navigator.clipboard.writeText(spawnCommand).then(() => {
      setCopiedSpawnCommand(spawnCommand);
      setTimeout(() => setCopiedSpawnCommand(null), 2000);
    });
  };

  const handleDelete = (_id: string, costumeName: string) => {
    if (
      window.confirm(t("delete_confirm_message", { itemName: costumeName }))
    ) {
      onDeleteCostume(_id);
    }
  };

  const filteredData = data.filter((costume: Costume) => {
    const matchesCategory =
      activeCategory === "Hepsi" || costume.category === activeCategory;

    const matchesSearch =
      !searchQuery ||
      costume.costumeName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-yellow-400">
            {t("costumes_title")}
          </h2>
          {isAdmin && (
            <button
              onClick={() => setModalConfig({ isOpen: true, costume: null })}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
              title={t("costumes_add_new")}
              aria-label={t("costumes_add_new")}
            >
              <PlusCircleIcon className="h-7 w-7" />
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder={t("costumes_search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mb-4 border-b border-gray-700">
        <nav className="-mb-px flex flex-wrap gap-x-6" aria-label="Tabs">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`${
                activeCategory === category
                  ? "border-yellow-500 text-yellow-400"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: "65vh" }}>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Arama sonucu bulunamadı.
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-300 table-fixed">
            <thead className="text-xs text-yellow-400 uppercase bg-gray-800 sticky top-0">
              <tr>
                <th scope="col" className="px-4 py-3 w-[15%]">
                  {t("preview")}
                </th>
                <th
                  scope="col"
                  className={`px-4 py-3 ${isAdmin ? "w-[35%]" : "w-[42.5%]"}`}
                >
                  {t("item_name")}
                </th>
                <th
                  scope="col"
                  className={`px-4 py-3 ${isAdmin ? "w-[40%]" : "w-[42.5%]"}`}
                >
                  {t("spawn_command")}
                </th>
                {isAdmin && (
                  <th scope="col" className="px-4 py-3 w-[10%] text-center">
                    {t("actions")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((costume, index) => (
                <tr
                  key={`${costume.costumeName}-${index}`}
                  className="border-b border-gray-700 hover:bg-gray-800/60"
                >
                  <td className="px-4 py-2">
                    <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center">
                      {costume.imageUrl ? (
                        <img
                          src={costume.imageUrl}
                          alt={costume.costumeName}
                          className="w-full h-full object-contain rounded-md p-0.5"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs text-center p-1">
                          {t("no_image")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 break-words">
                    {costume.costumeName}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-300 break-all">
                        {costume.spawnCommand}
                      </span>
                      <button
                        onClick={() => handleCopy(costume.spawnCommand)}
                        className="ml-2 flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        aria-label={t("copy_spawnCommand")}
                      >
                        {copiedSpawnCommand === costume.spawnCommand ? (
                          <span className="text-xs text-green-400">
                            {t("copied")}
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
                          onClick={() =>
                            setModalConfig({ isOpen: true, costume: costume })
                          }
                          className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                          title={t("costumes_edit")}
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(costume._id, costume.costumeName)
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title={t("costumes_delete")}
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
        <AddCostumeModal
          onClose={() => setModalConfig({ isOpen: false, costume: null })}
          onSave={async (costume: Costume, originalName: string) => {
            await onSaveCostume(costume, originalName);
            dispatch(fetchCostumes() as any);
            setModalConfig({ isOpen: false, costume: null });
          }}
          costumeToEdit={modalConfig.costume}
          existingCategories={categories.map((category) => category)}
        />
      )}
    </div>
  );
};

export default KostumlerTab;
