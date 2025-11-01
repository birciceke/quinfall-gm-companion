import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import type {
  Item,
  SimpleItem,
  Position,
  ChatMessage,
  DecodedItemInfo,
  ItemEvent,
  BossKill,
  Session,
  ParsedData,
} from "../types";
import { useTranslation } from "../i18n";
import { parseItemCode } from "../utils/itemCodeParser";
import { parseSimpleItemId } from "../utils/simpleItemParser";
import { parseLog } from "../utils/logParser";
import { getItemName } from "../utils/itemUtils";
import ItemPreviewCard from "./ItemPreviewCard";
import InteractiveMap from "./InteractiveMap";
import LogSection from "./LogSection";
import VirtualLogList from "./VirtualLogList";
import {
  MapIcon,
  ChatIcon,
  ItemIcon,
  BossIcon,
  MarketIcon,
  UploadIcon,
  UpgradeIcon,
} from "./Icons";
import { useSelector } from "react-redux";

// --- UI ICONS ---
// Icons moved to Icons.tsx

// --- HELPER FUNCTIONS ---
// Helper functions moved to logParser.ts and itemUtils.ts

const formatTimestamp = (timestampStr: string): string => {
  try {
    const date = new Date(timestampStr);
    return (
      date.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " " +
      date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  } catch (e) {
    const parts = timestampStr.split(" ");
    return parts.slice(0, 2).join(" "); // Fallback
  }
};

// --- SUB-COMPONENTS ---

const FilterCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500"
    />
    {label}
  </label>
);

// --- VIRTUALIZATION COMPONENTS ---

const ChatRow = React.memo(
  ({
    chat,
    getChatColor,
    getChatPrefix,
    formatTimestamp,
  }: {
    chat: ChatMessage;
    getChatColor: Function;
    getChatPrefix: Function;
    formatTimestamp: Function;
  }) => (
    <div className="flex gap-2 h-full items-start p-1 font-mono text-sm overflow-hidden">
      <span className="text-gray-500 flex-shrink-0">
        {formatTimestamp(chat.timestamp)}
      </span>
      <span className={`font-bold ${getChatColor(chat)} flex-shrink-0`}>
        {getChatPrefix(chat)}:
      </span>
      <span className="text-gray-200 break-all">{chat.message}</span>
    </div>
  )
);

const ItemEventRow = React.memo(
  ({
    event,
    handleItemHover,
    handleItemLeave,
    formatTimestamp,
    getItemName,
    t,
  }: {
    event: ItemEvent;
    handleItemHover: Function;
    handleItemLeave: Function;
    formatTimestamp: Function;
    getItemName: Function;
    t: (key: string) => string;
  }) => (
    <div className="flex flex-col gap-1 py-1 px-1 border-b border-gray-800 last:border-b-0 h-full font-mono text-sm overflow-hidden">
      <div className="flex gap-2 items-start">
        <span className="text-gray-500 flex-shrink-0">
          {formatTimestamp(event.timestamp)}
        </span>
        <span className="text-green-400 truncate">{event.fullText}</span>
      </div>
      {event.decodedItems.length > 0 && (
        <ul className="pl-12 list-disc list-inside">
          {event.decodedItems.map((decoded, j) => (
            <li key={j}>
              {decoded.type === "complex" ? (
                <span
                  onMouseEnter={(e) => handleItemHover(e, decoded.data as Item)}
                  onMouseLeave={() => handleItemLeave()}
                  className="text-yellow-300 cursor-pointer underline decoration-dotted"
                >
                  {getItemName(decoded.data as Item)} [Kademe:{" "}
                  {(decoded.data as Item).tier}]
                </span>
              ) : (
                <span className="text-yellow-300">
                  {t((decoded.data as SimpleItem).localeId || "") ||
                    (decoded.data as SimpleItem).name}{" "}
                  <span className="text-white">x{decoded.quantity}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
);

interface LogDecoderTabProps {
  items: SimpleItem[];
}

const LogDecoderTab: React.FC<LogDecoderTabProps> = ({ items }) => {
  const { t } = useTranslation();
  const [logContent, setLogContent] = useState("");
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<{
    item: Item;
    position: { top: number; left: number };
  } | null>(null);
  const [itemFilters, setItemFilters] = useState({
    search: "",
    eventTypes: {
      drop: true,
      chest: true,
      boss: true,
      other: true,
    },
    itemTypes: {
      simple: true,
      complex: true,
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [upgradeFilter, setUpgradeFilter] = useState<
    "all" | "success" | "fail"
  >("all");

  const processLogContent = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      setIsLoading(true);
      setParsedData(null);
      setLogContent(content);

      setTimeout(() => {
        try {
          const parsed = parseLog(content, items || []);
          setParsedData(parsed);
        } catch (e) {
          console.error("Error parsing log file:", e);
          setParsedData(null); // Ensure it's null on error
        } finally {
          setIsLoading(false);
        }
      }, 50);
    },
    [items]
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    let file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      let content = e.target?.result as string;
      if (content) {
        content = content.replace(/\r\n/g, "\n").replace(/\r/g, "");
        content = content.replace(/^\uFEFF/, "");

        processLogContent(content);
      }
    };
    reader.readAsText(
      file,
      navigator.language === "tr-TR" ? "windows-1254" : "utf-8"
    );

    if (event.target) {
      event.target.value = "";
    }
  };

  const UpgradeRow = React.memo(
    ({
      upgrade,
      handleItemHover,
      handleItemLeave,
      formatTimestamp,
      getItemName,
    }: {
      upgrade: ItemUpgrade;
      handleItemHover: Function;
      handleItemLeave: Function;
      formatTimestamp: Function;
      getItemName: Function;
    }) => {
      const statusInfo = {
        success: { text: "BAŞARILI", color: "text-green-400" },
        fail_burn: { text: "BAŞARISIZ (YANDI)", color: "text-red-400" },
        fail_tera: { text: "BAŞARISIZ (TERA)", color: "text-orange-400" },
      }[upgrade.status];

      const ItemNameDisplay = ({ itemInfo }: { itemInfo: DecodedItemInfo }) => (
        <span
          onMouseEnter={(e) => handleItemHover(e, itemInfo.data as Item)}
          onMouseLeave={() => handleItemLeave()}
          className="cursor-pointer underline decoration-dotted"
        >
          {getItemName(itemInfo.data as Item)} (+
          {(itemInfo.data as Item).starLevel})
        </span>
      );

      return (
        <div className="flex gap-2 items-start p-1 font-mono text-sm h-full">
          <span className="text-gray-500 flex-shrink-0">
            {formatTimestamp(upgrade.timestamp)}
          </span>
          <span className={`font-bold ${statusInfo.color} flex-shrink-0`}>
            [{statusInfo.text}]
          </span>
          <span className="text-gray-200">
            <ItemNameDisplay itemInfo={upgrade.itemBefore} />
            {upgrade.status === "success" && upgrade.itemAfter && (
              <>
                {" => "}
                <ItemNameDisplay itemInfo={upgrade.itemAfter} />
              </>
            )}
          </span>
        </div>
      );
    }
  );

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const filteredItems = useMemo(() => {
    if (!parsedData) return [];

    return parsedData.items.filter((event) => {
      const fullTextLower = event.fullText.toLowerCase();
      const isDrop = fullTextLower.includes("drop alindi");
      const isChest = fullTextLower.includes("hazine sandigi");
      const isBoss = fullTextLower.includes("world boss odulu");
      const isOther = !isDrop && !isChest && !isBoss;

      const eventTypeMatch =
        (itemFilters.eventTypes.drop && isDrop) ||
        (itemFilters.eventTypes.chest && isChest) ||
        (itemFilters.eventTypes.boss && isBoss) ||
        (itemFilters.eventTypes.other && isOther);

      if (!eventTypeMatch) return false;

      if (!itemFilters.itemTypes.simple && !itemFilters.itemTypes.complex)
        return false;

      const hasMatchingItem = event.decodedItems.some((decodedItem) => {
        const itemTypeMatch =
          (itemFilters.itemTypes.simple && decodedItem.type === "simple") ||
          (itemFilters.itemTypes.complex && decodedItem.type === "complex");
        if (!itemTypeMatch) return false;

        if (itemFilters.search) {
          const searchLower = itemFilters.search.toLowerCase();
          const itemName =
            decodedItem.type === "simple"
              ? t((decodedItem.data as SimpleItem).localeId || "") ||
                (decodedItem.data as SimpleItem).name
              : getItemName(decodedItem.data as Item);
          if (!itemName.toLowerCase().includes(searchLower)) {
            return false;
          }
        }

        return true;
      });

      return hasMatchingItem;
    });
  }, [parsedData, itemFilters, t]);

  const filteredUpgrades = useMemo(() => {
    if (!parsedData?.itemUpgrades) return [];
    if (upgradeFilter === "all") {
      return parsedData.itemUpgrades;
    }
    return parsedData.itemUpgrades.filter((upgrade) => {
      if (upgradeFilter === "success") return upgrade.status === "success";
      if (upgradeFilter === "fail") return upgrade.status.startsWith("fail_");
      return true;
    });
  }, [parsedData, upgradeFilter]);

  const handleItemHover = useCallback((e: React.MouseEvent, item: Item) => {
    const cardWidth = 320 + 20; // max-w-xs (320px) + some margin for safety
    const cardHeight = 620; // Approximate height, might need adjustment
    const margin = 15;

    let left = e.clientX + margin;
    let top = e.clientY;

    // Adjust horizontally: if it overflows right, flip to the left of the cursor
    if (left + cardWidth > window.innerWidth) {
      left = e.clientX - cardWidth;
    }

    // Adjust vertically: if it overflows bottom, align its bottom with the window's bottom
    if (top + cardHeight > window.innerHeight) {
      top = window.innerHeight - cardHeight - margin;
    }

    // Ensure it's not off-screen top or left
    if (top < margin) {
      top = margin;
    }
    if (left < margin) {
      left = margin;
    }

    setHoveredItem({ item, position: { top, left } });
  }, []);

  const handleItemLeave = useCallback(() => setHoveredItem(null), []);

  const handleReset = useCallback(() => {
    setLogContent("");
    setParsedData(null);
  }, []);

  const handleFilterChange = (
    category: "eventTypes" | "itemTypes",
    key: string,
    value: boolean
  ) => {
    setItemFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const getChatPrefix = useCallback((chat: ChatMessage) => {
    switch (chat.type) {
      case "PM":
        return `[PM to ${chat.target}]`;
      case "Global":
        return `[Global]`;
      case "Çevre":
        return `[Çevre]`;
      case "Klan":
        return `[Klan]`;
      case "Parti":
        return `[Parti]`;
      case "Alliance":
        return `[Alliance]`;
      case "Bilinmeyen Kanal":
        return `[Kanal ${chat.channelNumber}]`;
      default:
        return "[Bilinmeyen]";
    }
  }, []);
  const getChatColor = useCallback((chat: ChatMessage) => {
    switch (chat.type) {
      case "PM":
        return "text-purple-400";
      case "Global":
        return "text-yellow-300";
      case "Çevre":
        return "text-green-400";
      case "Klan":
        return "text-red-400";
      case "Parti":
        return "text-sky-400";
      case "Alliance":
        return "text-indigo-400";
      default:
        return "text-cyan-400";
    }
  }, []);

  return (
    <div className="relative">
      {!parsedData && !isLoading && (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Log Dosyasını Çöz
          </h2>
          <p className="text-gray-400 mb-4 text-sm">
            Bilgisayarınızdan bir log dosyası seçin veya analiz etmek için
            içeriğini aşağıdaki metin alanına yapıştırın.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".txt,.log"
            className="hidden"
          />

          <button
            onClick={handleSelectFileClick}
            className="w-full mb-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
          >
            <UploadIcon className="w-5 h-5" />
            Bilgisayardan Log Dosyası Seç
          </button>

          <div className="flex items-center text-gray-500 my-2">
            <hr className="flex-grow border-t border-gray-600" />
            <span className="px-4 text-xs font-semibold">VEYA</span>
            <hr className="flex-grow border-t border-gray-600" />
          </div>

          <textarea
            value={logContent}
            onChange={(e) => setLogContent(e.target.value)}
            placeholder="Log içeriğini buraya yapıştırın..."
            rows={15}
            className="w-full bg-gray-900/50 p-4 rounded-md font-mono text-sm text-gray-300 border border-gray-600 focus:ring-yellow-500 focus:border-yellow-500 transition"
          />
          <button
            onClick={() => processLogContent(logContent)}
            disabled={!logContent.trim()}
            className="mt-4 w-full bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Yapıştırılan İçeriği Analiz Et
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center p-10">
          <p className="text-lg text-yellow-400 animate-pulse">
            Log dosyası analiz ediliyor...
          </p>
        </div>
      )}

      {parsedData && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-yellow-400">
              Log Analiz Raporu
            </h2>
            <button
              onClick={handleReset}
              className="text-sm bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Yeni Log Analiz Et
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6 text-center">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-xs text-gray-400">İlk Giriş</div>
              <div className="font-bold text-white text-sm">
                {parsedData.summary.firstLogin || "N/A"}
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-xs text-gray-400">Son Çıkış</div>
              <div className="font-bold text-white text-sm">
                {parsedData.summary.lastLogout || "N/A"}
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-xs text-gray-400">Toplam Oynama Süresi</div>
              <div className="font-bold text-white">
                {parsedData.summary.totalPlayTime}
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-xs text-gray-400">Öldürülen Boss'lar</div>
              <div className="font-bold text-white">
                {parsedData.summary.totalBossKills}
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-xs text-gray-400">Sohbet Mesajları</div>
              <div className="font-bold text-white">
                {parsedData.summary.totalChatMessages}
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-xs text-gray-400">Pazar Hareketleri</div>
              <div className="font-bold text-white">
                {parsedData.summary.totalMarketTransactions}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <LogSection
              title="Konum Haritası"
              icon={<MapIcon className="w-6 h-6 text-yellow-400" />}
              count={parsedData.positions.length}
            >
              <InteractiveMap positions={parsedData.positions} />
            </LogSection>

            <LogSection
              title="Eşya Yükseltme Geçmişi"
              icon={<UpgradeIcon className="w-6 h-6 text-yellow-400" />}
              count={filteredUpgrades.length}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-center">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <div className="text-xs text-green-400">Başarılı</div>
                  <div className="font-bold text-white text-lg">
                    {parsedData.summary.totalItemUpgrades.success}
                  </div>
                </div>
                <div className="bg-gray-800 p-2 rounded-lg">
                  <div className="text-xs text-red-400">Yandı</div>
                  <div className="font-bold text-white text-lg">
                    {parsedData.summary.totalItemUpgrades.fail_burn}
                  </div>
                </div>
                <div className="bg-gray-800 p-2 rounded-lg">
                  <div className="text-xs text-orange-400">Tera Korumalı</div>
                  <div className="font-bold text-white text-lg">
                    {parsedData.summary.totalItemUpgrades.fail_tera}
                  </div>
                </div>
                <div className="bg-gray-800 p-2 rounded-lg">
                  <div className="text-xs text-gray-400">Toplam</div>
                  <div className="font-bold text-white text-lg">
                    {parsedData.summary.totalItemUpgrades.total}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4 bg-gray-800/50 p-1.5 rounded-lg max-w-xs mx-auto">
                {(["all", "success", "fail"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setUpgradeFilter(filter)}
                    className={`w-full rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                      upgradeFilter === filter
                        ? "bg-yellow-500 text-gray-900 shadow"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              <VirtualLogList
                items={filteredUpgrades}
                itemHeight={28}
                renderItem={(upgrade, index) => (
                  <UpgradeRow
                    key={index}
                    upgrade={upgrade}
                    handleItemHover={handleItemHover}
                    handleItemLeave={handleItemLeave}
                    formatTimestamp={formatTimestamp}
                    getItemName={getItemName}
                  />
                )}
              />
            </LogSection>

            <LogSection
              title="Sohbet Kayıtları"
              icon={<ChatIcon className="w-6 h-6 text-yellow-400" />}
              count={parsedData.chats.length}
            >
              <VirtualLogList
                items={parsedData.chats}
                itemHeight={32}
                renderItem={(chat, index) => (
                  <ChatRow
                    key={index}
                    chat={chat}
                    getChatColor={getChatColor}
                    getChatPrefix={getChatPrefix}
                    formatTimestamp={formatTimestamp}
                  />
                )}
              />
            </LogSection>

            <LogSection
              title="Pazar Hareketleri"
              icon={<MarketIcon className="w-6 h-6 text-yellow-400" />}
              count={parsedData.marketTransactions.length}
            >
              <VirtualLogList
                items={parsedData.marketTransactions}
                itemHeight={80}
                renderItem={(event, index) => (
                  <ItemEventRow
                    key={index}
                    event={event}
                    handleItemHover={handleItemHover}
                    handleItemLeave={handleItemLeave}
                    formatTimestamp={formatTimestamp}
                    getItemName={getItemName}
                    t={t}
                  />
                )}
              />
            </LogSection>

            <LogSection
              title="Eşya Hareketleri"
              icon={<ItemIcon className="w-6 h-6 text-yellow-400" />}
              count={filteredItems.length}
            >
              <div className="p-4 bg-gray-800/50 rounded-md mb-4 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      İsme Göre Ara
                    </label>
                    <input
                      type="text"
                      placeholder="Eşya adı..."
                      value={itemFilters.search}
                      onChange={handleSearchChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-xs font-medium text-gray-400 flex-shrink-0">
                        Etkinlik Türü:
                      </span>
                      <FilterCheckbox
                        label="Düşenler"
                        checked={itemFilters.eventTypes.drop}
                        onChange={(c) =>
                          handleFilterChange("eventTypes", "drop", c)
                        }
                      />
                      <FilterCheckbox
                        label="Sandıklar"
                        checked={itemFilters.eventTypes.chest}
                        onChange={(c) =>
                          handleFilterChange("eventTypes", "chest", c)
                        }
                      />
                      <FilterCheckbox
                        label="Boss"
                        checked={itemFilters.eventTypes.boss}
                        onChange={(c) =>
                          handleFilterChange("eventTypes", "boss", c)
                        }
                      />
                      <FilterCheckbox
                        label="Diğer"
                        checked={itemFilters.eventTypes.other}
                        onChange={(c) =>
                          handleFilterChange("eventTypes", "other", c)
                        }
                      />
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-xs font-medium text-gray-400 flex-shrink-0">
                        Eşya Türü:
                      </span>
                      <FilterCheckbox
                        label="Basit"
                        checked={itemFilters.itemTypes.simple}
                        onChange={(c) =>
                          handleFilterChange("itemTypes", "simple", c)
                        }
                      />
                      <FilterCheckbox
                        label="Üretilmiş"
                        checked={itemFilters.itemTypes.complex}
                        onChange={(c) =>
                          handleFilterChange("itemTypes", "complex", c)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <VirtualLogList
                items={filteredItems}
                itemHeight={80}
                renderItem={(event, index) => (
                  <ItemEventRow
                    key={index}
                    event={event}
                    handleItemHover={handleItemHover}
                    handleItemLeave={handleItemLeave}
                    formatTimestamp={formatTimestamp}
                    getItemName={getItemName}
                    t={t}
                  />
                )}
              />
              {filteredItems.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Mevcut filtrelere uygun eşya bulunamadı.
                </div>
              )}
            </LogSection>

            <LogSection
              title="Dünya Boss Kesimleri"
              icon={<BossIcon className="w-6 h-6 text-yellow-400" />}
              count={parsedData.bossKills.length}
            >
              <div className="space-y-2 text-sm">
                {parsedData.bossKills.map((kill, i) => (
                  <div key={i} className="p-2 bg-gray-800 rounded">
                    <span className="text-gray-500 font-mono mr-2">
                      {formatTimestamp(kill.timestamp)}
                    </span>
                    <span className="text-white">
                      Boss{" "}
                      <span className="font-bold text-red-400">
                        #{kill.typeId}
                      </span>{" "}
                      öldürüldü. Hasar:{" "}
                      <span className="font-semibold text-yellow-300">
                        {kill.damage.toFixed(2)}
                      </span>
                      , AP:{" "}
                      <span className="font-semibold text-yellow-300">
                        {kill.actionCoin}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </LogSection>
          </div>
        </div>
      )}
      {hoveredItem && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: `${hoveredItem.position.top}px`,
            left: `${hoveredItem.position.left}px`,
            position: "fixed",
          }}
        >
          <ItemPreviewCard item={hoveredItem.item} />
        </div>
      )}
    </div>
  );
};

export default LogDecoderTab;
