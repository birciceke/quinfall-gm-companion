import React, { useState, useEffect } from "react";
import { useTranslation } from "../i18n";
import type { ServerCommand } from "../types";
import AddCommandModal from "./AddCommandModal";
import { CopyIcon, PlusCircleIcon, EditIcon, DeleteIcon } from "./Icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchServerCommands } from "@/redux/serverCommandsSlicer";

interface ServerCommandsTabProps {
  onNavigate: (tabId: string) => void;
  isAdmin: boolean;
  commands: ServerCommand[];
  onSaveCommand: (command: ServerCommand, originalKey?: string) => void;
  onDeleteCommand: (key: string) => void;
}

const TEST_SERVER_IP = "79.137.98.184";

const ServerCommandsTab: React.FC<ServerCommandsTabProps> = ({
  onNavigate,
  isAdmin,
  commands,
  onSaveCommand,
  onDeleteCommand,
}) => {
  const { t, language } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    cmd: ServerCommand | null;
  }>({
    isOpen: false,
    cmd: null,
  });

  const handleCopy = (text: string, type: "ip" | "command") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleDelete = (command: ServerCommand) => {
    if (
      window.confirm(
        `Are you sure you want to delete the command "${command.serverCommand}"? This action cannot be undone.`
      )
    ) {
      onDeleteCommand(command._id);
    }
  };

  const { data, isLoading } = useSelector((state: any) => state.serverCommands);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchServerCommands() as any);
  }, [dispatch]);

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-3">
          <span>{t("server_commands")}</span>
          {isAdmin && (
            <button
              onClick={() => setModalConfig({ isOpen: true, command: null })}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
              title="Add New Command"
            >
              <PlusCircleIcon className="h-7 w-7" />
            </button>
          )}
        </h2>
      </div>

      <div className="bg-red-600 p-4 rounded-lg mb-6 text-center relative">
        <h3 className="text-white text-sm font-semibold mb-1">
          {t("test_server_ip")}
        </h3>
        <p className="text-white text-3xl font-bold tracking-wider">
          {TEST_SERVER_IP}
        </p>
        <button
          onClick={() => handleCopy(TEST_SERVER_IP, "ip")}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          aria-label="Copy IP Address"
        >
          {copied === TEST_SERVER_IP ? (
            <span className="text-sm">{t("copied")}</span>
          ) : (
            <CopyIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Arama sonucu bulunamadı.
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-yellow-400 uppercase bg-gray-700/50">
              <tr>
                <th scope="col" className="px-4 py-3 w-[25%]">
                  {t("command")}
                </th>
                <th scope="col" className="px-4 py-3 w-[40%]">
                  {t("description")}
                </th>
                <th scope="col" className="px-4 py-3 w-[25%]">
                  {t("value")}
                </th>
                {isAdmin && (
                  <th scope="col" className="px-4 py-3 w-[10%] text-center">
                    ACTIONS
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) &&
                data.map((cmd) => (
                  <tr
                    key={cmd.uniqueKey}
                    className="border-b border-gray-700 hover:bg-gray-800/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-cyan-300 break-all">
                          {cmd.serverCommand}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(cmd.serverCommand, "command")
                          }
                          className="ml-2 flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                          aria-label="Copy Command"
                        >
                          {copied === cmd.serverCommand ? (
                            <span className="text-xs text-green-400">
                              Copied!
                            </span>
                          ) : (
                            <CopyIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">{cmd.description}</td>
                    <td className="px-4 py-3">
                      {cmd.key === "item" ? (
                        <button
                          onClick={() => onNavigate("itemIdTable")}
                          className="font-semibold text-red-400 hover:text-red-300 underline"
                        >
                          {t("item_table_link")}
                        </button>
                      ) : (
                        <span
                          className={`${
                            cmd.value === "∞" ? "text-2xl" : ""
                          } whitespace-pre-line`}
                        >
                          {cmd.value}
                        </span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() =>
                              setModalConfig({ isOpen: true, cmd: cmd })
                            }
                            className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                            title="Edit Command"
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cmd)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Delete Command"
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
        <AddCommandModal
          onClose={() => setModalConfig({ isOpen: false, cmd: null })}
          onSave={(cmd, originalKey) => {
            onSaveCommand(cmd, originalKey);
            setModalConfig({ isOpen: false, cmd: null });
          }}
          commandToEdit={modalConfig.cmd}
          allCommands={commands}
        />
      )}
    </div>
  );
};

export default ServerCommandsTab;
