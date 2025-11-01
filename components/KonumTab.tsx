import React, { useState, useEffect } from "react";
import type { Location } from "../types";
import AddLocationModal from "./AddLocationModal";
import { CopyIcon, PlusCircleIcon, EditIcon, DeleteIcon } from "./Icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "@/redux/locationSlicer";

interface KonumTabProps {
  isAdmin: boolean;
  locations: Location[];
  onSaveLocation: (location: Location, originalName?: string | null) => void;
  onDeleteLocation: (name: string) => void;
}

const KonumTab: React.FC<KonumTabProps> = ({
  isAdmin,
  onSaveLocation,
  onDeleteLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedTeleportCommand, setCopiedTeleportCommand] = useState<
    string | null
  >(null);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    location: Location | null;
  }>({
    isOpen: false,
    location: null,
  });

  const handleCopy = (teleportCommand: string) => {
    navigator.clipboard.writeText(teleportCommand).then(() => {
      setCopiedTeleportCommand(teleportCommand);
      setTimeout(() => copiedTeleportCommand(null), 2000);
    });
  };

  const handleDelete = (locationName: string, _id: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${locationName}"? This action cannot be undone.`
      )
    ) {
      onDeleteLocation(_id);
    }
  };

  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((store: any) => store.location);

  useEffect(() => {
    dispatch(fetchLocations() as any);
  }, [dispatch]);

  const filteredData = data.filter((location: Location) => {
    return location.locationName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-yellow-400">
            Teleport Lokasyonları
          </h2>
          {isAdmin && (
            <button
              onClick={() => setModalConfig({ isOpen: true, location: null })}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
              title="Add New Location"
              aria-label="Add New Location"
            >
              <PlusCircleIcon className="h-7 w-7" />
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Lokasyon Ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
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
                <th
                  scope="col"
                  className={`px-4 py-3 ${isAdmin ? "w-[25%]" : "w-[30%]"}`}
                >
                  KONUM
                </th>
                <th
                  scope="col"
                  className={`px-4 py-3 ${isAdmin ? "w-[60%]" : "w-[70%]"}`}
                >
                  TELEPORT KOMUTU
                </th>
                {isAdmin && (
                  <th scope="col" className="px-4 py-3 w-[15%] text-center">
                    ACTIONS
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((location, index) => (
                <tr
                  key={`${location.locationName}-${index}`}
                  className="border-b border-gray-700 hover:bg-gray-800/60"
                >
                  <td className="px-4 py-2 font-semibold break-words">
                    {location.locationName}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-300 break-all">
                        {location.teleportCommand}
                      </span>
                      <button
                        onClick={() => handleCopy(location.teleportCommand)}
                        className="ml-2 flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        aria-label="Copy Command"
                      >
                        {copiedTeleportCommand === location.teleportCommand ? (
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
                          onClick={() =>
                            setModalConfig({ isOpen: true, location: location })
                          }
                          className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                          title="Edit Location"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(location.locationName, location._id)
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Delete Location"
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
        <AddLocationModal
          onClose={() => setModalConfig({ isOpen: false, location: null })}
          onSave={(location, originalName) => {
            onSaveLocation(location, originalName);
            setModalConfig({ isOpen: false, location: null });
          }}
          locationToEdit={modalConfig.location}
        />
      )}
    </div>
  );
};

export default KonumTab;
