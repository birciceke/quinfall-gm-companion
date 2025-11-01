import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import type {
  Item,
  Pet,
  SimpleItem,
  Location,
  Costume,
  ServerCommand,
} from "./types";
import { ItemStat } from "./types";
import { LanguageProvider, useTranslation } from "./i18n";
import ItemBuilderForm from "./components/ItemBuilderForm";
import ItemPreviewCard from "./components/ItemPreviewCard";
import ItemCodeDisplay from "./components/ItemCodeDisplay";
import PetGeneratorTab from "./components/PetGeneratorTab";
import CodeSearchTab from "./components/CodeSearchTab";
import MatrixEffect from "./components/MatrixEffect";
import AliEffect from "./components/AliEffect";
import ServerCommandsTab from "./components/ServerCommandsTab";
import ItemIdTableTab from "./components/ItemIdTableTab";
import ProfessionCodesTab from "./components/ProfessionCodesTab";
import KonumTab from "./components/KonumTab";
import KostumlerTab from "./components/KostumlerTab";
import PlayerCount from "./components/PlayerCount";
import AddToHomeScreenPrompt from "./components/AddToHomeScreenPrompt";
import PasswordPrompt from "./components/PasswordPrompt";
import LogDecoderTab from "./components/LogDecoderTab";
import { getSetBonuses } from "./utils/rarity";
import {
  ARMOR_SLOTS,
  ARMOR_ITEM_LEVELS,
  ACCESSORY_ITEM_LEVELS,
  WEAPON_SLOTS,
  NO_SET,
  BASE_GRADE_PER_LEVEL,
  BAG_SLOTS,
  TOOL_SLOTS,
  TOOL_LEVELS,
  TOOL_GRADE_RANGES,
} from "./constants-alt";
import { simpleItemData } from "./data/simpleItemData";
import { locationData } from "./data/locationData";
import { costumeData } from "./data/costumeData";
import {
  SearchIcon,
  ServerCommandsIcon,
  ItemGeneratorIcon,
  PetGeneratorIcon,
  ItemIdTableIcon,
  ProfessionCodesIcon,
  TeleportIcon,
  CostumesIcon,
  KeyIcon,
  LogDecoderIcon,
} from "./components/Icons";
import useLocalStorage from "./hooks/useLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCostume,
  saveCostume,
  updateCostume,
} from "./redux/costumeSlicer";
import {
  deleteLocation,
  fetchLocations,
  saveLocation,
  updateLocation,
} from "./redux/locationSlicer";
import LoginScreen from "./components/LoginScreen";
import {
  deleteServerCommand,
  fetchServerCommands,
  saveServerCommand,
  updateServerCommand,
} from "./redux/serverCommandsSlicer";

const AppContent: React.FC<{ isAuthenticated: boolean }> = ({
  isAuthenticated,
}) => {
  const { t, language, setLanguage } = useTranslation();
  const [item, setItem] = useState<Item>({
    slot: "Zırh",
    armorType: "[Ağır]",
    level: 100,
    property1: ItemStat.FizikselSavunma,
    property2: ItemStat.BuyuSavunma,
    property3: "",
    setBonus: "Divine Aegis (288-320)",
    starLevel: 5,
    tier: 320,
    durability: 1000,
  });

  const [lastStarLevel, setLastStarLevel] = useState<number>(item.starLevel);

  const [pet, setPet] = useState<Pet>({
    petType: "01",
    petProfession: "20",
    satiety: 100,
    level: 40,
    xp: 100,
  });

  const [items, setItems] = useState();
  const [locations, setLocations] = useLocalStorage<Location[]>(
    "teleportLocations",
    locationData
  );
  const [costumes, setCostumes] = useLocalStorage<Costume[]>(
    "costumes",
    costumeData
  );

  const [activeTab, setActiveTab] = useState("serverCommands");
  const [showMatrix, setShowMatrix] = useState(false);
  const [showAli, setShowAli] = useState(false);
  const [showJupi, setShowJupi] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState({ matrix: false });
  const audioContextRef = useRef<AudioContext | null>(null);
  const matrixAudioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showA2HS, setShowA2HS] = useState(false);

  const [showEditIcon, setShowEditIcon] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const keySequenceRef = useRef("");
  const sequenceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(
      // today.toLocaleDateString(language === "tr" ? "tr-TR" : "en-US", options)
      language === "tr" ? "29 Ekim 2025" : "October 29, 2025"
    );
  }, [language]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sequenceTimeoutRef.current) {
        clearTimeout(sequenceTimeoutRef.current);
      }

      keySequenceRef.current += e.key.toLowerCase();

      if (keySequenceRef.current.endsWith("jkl")) {
        setShowEditIcon(true);
        keySequenceRef.current = ""; // Reset sequence
      }

      sequenceTimeoutRef.current = window.setTimeout(() => {
        keySequenceRef.current = "";
      }, 1000); // Reset if no key is pressed for 1 second
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (sequenceTimeoutRef.current) {
        clearTimeout(sequenceTimeoutRef.current);
      }
    };
  }, []);

  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  const isMobile = () => /Mobi/i.test(window.navigator.userAgent);

  const isInStandaloneMode = () =>
    ("standalone" in window.navigator &&
      (window.navigator as any).standalone) ||
    window.matchMedia("(display-mode: standalone)").matches;

  useEffect(() => {
    if (
      isMobile() &&
      !isInStandaloneMode() &&
      !localStorage.getItem("a2hs-dismissed")
    ) {
      setShowA2HS(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    (installPrompt as any).prompt();
    const { outcome } = await (installPrompt as any).userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
      setShowA2HS(false);
    } else {
      console.log("User dismissed the A2HS prompt");
    }
    setInstallPrompt(null);
  };

  const handleDismissClick = () => {
    localStorage.setItem("a2hs-dismissed", "true");
    setShowA2HS(false);
  };

  // Effect to fetch and decode audio files
  useEffect(() => {
    if (audioContextRef.current) return;

    const context = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    audioContextRef.current = context;

    const loadAudio = async (url: string): Promise<AudioBuffer> => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return context.decodeAudioData(arrayBuffer);
    };

    const matrixAudioUrl =
      "https://archive.org/download/TetrisThemeMusic/Tetris.mp3";

    loadAudio(matrixAudioUrl)
      .then((buffer) => {
        matrixAudioBufferRef.current = buffer;
        setIsAudioReady({ matrix: true });
      })
      .catch((error) =>
        console.error("Failed to preload Matrix audio:", error)
      );

    return () => {
      audioContextRef.current?.close().catch(console.error);
    };
  }, []);

  const triggerMatrixEffect = useCallback(() => {
    const audioContext = audioContextRef.current;
    const audioBuffer = matrixAudioBufferRef.current;

    if (showMatrix || !isAudioReady.matrix || !audioContext || !audioBuffer)
      return;

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }

    setShowMatrix(true);

    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.loop = true;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    sourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    sourceNode.start(0);
    sourceNodeRef.current = sourceNode;

    setTimeout(() => {
      setShowMatrix(false);
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
      }
    }, 10000);
  }, [showMatrix, isAudioReady.matrix]);

  const triggerAliEffect = useCallback(() => {
    if (showAli) return;
    setShowAli(true);
    setTimeout(() => {
      setShowAli(false);
    }, 10000);
  }, [showAli]);

  const triggerJupiEffect = useCallback(() => {
    if (showJupi) return;

    setShowJupi(true);

    setTimeout(() => {
      setShowJupi(false);
    }, 10000);
  }, [showJupi]);

  const handleItemChange = useCallback(
    (field: keyof Item, value: string | number) => {
      setItem((prevItem) => {
        let newItem = { ...prevItem, [field]: value };

        if (field === "slot") {
          const newSlot = value as string;

          // --- Star Level Handling ---
          const isNewSlotDisablingStars =
            BAG_SLOTS.includes(newSlot) || TOOL_SLOTS.includes(newSlot);
          const isOldSlotDisablingStars =
            BAG_SLOTS.includes(prevItem.slot) ||
            TOOL_SLOTS.includes(prevItem.slot);

          if (isNewSlotDisablingStars && !isOldSlotDisablingStars) {
            setLastStarLevel(prevItem.starLevel); // save the star level
            newItem.starLevel = 0;
          } else if (!isNewSlotDisablingStars && isOldSlotDisablingStars) {
            newItem.starLevel = lastStarLevel; // restore it
          } else if (isNewSlotDisablingStars) {
            newItem.starLevel = 0; // ensure it's 0 if both old and new are bags/tools
          }

          // --- Level Dropdown Handling ---
          const isArmorOrWeapon =
            ARMOR_SLOTS.includes(newSlot) || WEAPON_SLOTS.includes(newSlot);
          const isTool = TOOL_SLOTS.includes(newSlot);

          let availableLevels: number[];
          if (isArmorOrWeapon) availableLevels = ARMOR_ITEM_LEVELS;
          else if (isTool) availableLevels = TOOL_LEVELS;
          else availableLevels = ACCESSORY_ITEM_LEVELS; // Bag or Accessory

          if (!availableLevels.includes(newItem.level)) {
            newItem.level = availableLevels[0];
          }

          // --- Properties/Set Bonus Reset for Tools ---
          if (isTool) {
            newItem.property1 = "";
            newItem.property2 = "";
            newItem.property3 = "";
            newItem.setBonus = NO_SET;
          }
        } else if (field === "starLevel") {
          // Only update the "last" star level if it's not a bag or tool item
          if (
            !BAG_SLOTS.includes(prevItem.slot) &&
            !TOOL_SLOTS.includes(prevItem.slot)
          ) {
            setLastStarLevel(value as number);
          }
        }

        // --- Tier Clamping and Set Bonus Recalculation (applies to all changes) ---
        const isCurrentSlotTool = TOOL_SLOTS.includes(newItem.slot);
        let minTier: number;
        let maxTier: number;

        if (isCurrentSlotTool) {
          const range = TOOL_GRADE_RANGES[newItem.level];
          minTier = range ? range.min : 0;
          maxTier = range ? range.max : 0;
        } else {
          const baseGrade = BASE_GRADE_PER_LEVEL[newItem.level] || 0;
          minTier = Math.floor(baseGrade / 2);
          maxTier = baseGrade * 2;
        }

        if (newItem.tier < minTier || newItem.tier > maxTier) {
          newItem.tier = Math.max(minTier, Math.min(newItem.tier, maxTier));
        }

        if (isCurrentSlotTool) {
          newItem.setBonus = NO_SET;
        } else {
          const newSetBonuses = getSetBonuses(
            newItem.tier,
            newItem.level,
            newItem.slot
          );
          if (!newSetBonuses.includes(newItem.setBonus)) {
            newItem.setBonus = newSetBonuses[0] ?? NO_SET;
          }
        }

        return newItem;
      });
    },
    [lastStarLevel]
  );

  const handlePetChange = useCallback(
    (field: keyof Pet, value: string | number) => {
      setPet((prevPet) => ({ ...prevPet, [field]: value }));
    },
    []
  );

  const handleSaveLocation = async (
    locationToSave: Location,
    originalName?: string | null
  ) => {
    if (originalName) {
      await dispatch(updateLocation(locationToSave) as any);
    } else {
      await dispatch(saveLocation(locationToSave) as any);
    }
    await dispatch(fetchLocations() as any);
  };

  const handleDeleteLocation = (IdToDelete) => {
    dispatch(deleteLocation(IdToDelete) as any);
  };

  const dispatch = useDispatch();

  const handleSaveCostume = async (
    costumeToSave: any,
    originalName?: string
  ) => {
    if (originalName) {
      await dispatch(updateCostume(costumeToSave) as any);
    } else {
      await dispatch(saveCostume(costumeToSave) as any);
    }
  };

  const handleDeleteCostume = (idToDelete: any) => {
    dispatch(deleteCostume(idToDelete) as any);
  };

  const handleSaveCommand = async (
    commandToSave: ServerCommand,
    originalKey?: string | null
  ) => {
    if (originalKey) {
      await dispatch(updateServerCommand(commandToSave) as any);
    } else {
      await dispatch(saveServerCommand(commandToSave) as any);
    }
  };

  const handleDeleteCommand = (idToDelete) => {
    dispatch(deleteServerCommand(idToDelete) as any);
  };

  const tabItems = [
    {
      id: "serverCommands",
      title: (
        <span className="flex items-center gap-1.5">
          <ServerCommandsIcon className="h-4 w-4" />
          {t("tab_serverCommands")}
        </span>
      ),
    },
    {
      id: "itemGenerator",
      title: (
        <span className="flex items-center gap-1.5">
          <ItemGeneratorIcon className="h-4 w-4" />
          {t("tab_itemGenerator")}
        </span>
      ),
    },
    {
      id: "petGenerator",
      title: (
        <span className="flex items-center gap-1.5">
          <PetGeneratorIcon className="h-4 w-4" />
          {t("tab_petGenerator")}
        </span>
      ),
    },
    {
      id: "codeSearch",
      title: (
        <span className="flex items-center gap-1.5">
          <SearchIcon className="h-4 w-4" />
          {t("tab_codeSearch")}
        </span>
      ),
    },
    {
      id: "itemIdTable",
      title: (
        <span className="flex items-center gap-1.5">
          <ItemIdTableIcon className="h-4 w-4" />
          {t("tab_itemIdTable")}
        </span>
      ),
    },
    {
      id: "professionCodes",
      title: (
        <span className="flex items-center gap-1.5">
          <ProfessionCodesIcon className="h-4 w-4" />
          {t("tab_professionCodes")}
        </span>
      ),
    },
    {
      id: "konum",
      title: (
        <span className="flex items-center gap-1.5">
          <TeleportIcon className="h-4 w-4" />
          {t("tab_teleportLocations")}
        </span>
      ),
    },
    {
      id: "kostumler",
      title: (
        <span className="flex items-center gap-1.5">
          <CostumesIcon className="h-4 w-4" />
          {t("tab_costumes")}
        </span>
      ),
    },
    {
      id: "logDecoder",
      title: (
        <span className="flex items-center gap-1.5">
          <LogDecoderIcon className="h-4 w-4" />
          {t("tab_logDecoder")}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      {showMatrix && <MatrixEffect />}
      {showAli && <AliEffect />}
      <div
        className={`container mx-auto max-w-7xl ${
          showJupi ? "jupi-active" : ""
        }`}
        style={{ maxWidth: "85rem" }}
      >
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              {t("mainTitle")}
            </h1>
            <p className="text-gray-400 mt-2">{t("madeBy")}</p>
            <p className="font-bold text-red-500 text-xs mt-1">
              Updated : {currentDate}
            </p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 shadow-md flex items-center gap-4">
            <PlayerCount />
            <button
              onClick={() => setLanguage(language === "en" ? "tr" : "en")}
              className="w-10 h-10 flex items-center justify-center bg-gray-700 text-gray-300 font-bold text-sm rounded-full hover:bg-gray-600 transition-colors"
              title="Change Language"
            >
              {language.toUpperCase()}
            </button>
            {isAdminAuthenticated ? (
              <div className="flex items-center">
                <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">
                  {t("admin")}
                </span>
              </div>
            ) : (
              showEditIcon && (
                <button
                  onClick={() => setShowPasswordPrompt(true)}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                  title={t("adminPanel")}
                  aria-label="Open Admin Panel"
                >
                  <KeyIcon className="h-6 w-6" />
                </button>
              )
            )}
          </div>
        </header>

        <div className="mb-8">
          <div className="bg-gray-800/50 p-1 rounded-lg flex items-center justify-start space-x-1 overflow-x-auto">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900
                  ${
                    activeTab === tab.id
                      ? "bg-yellow-500 text-gray-900 shadow"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }
                `}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "serverCommands" && (
          <ServerCommandsTab
            onNavigate={setActiveTab}
            isAdmin={isAuthenticated}
            onSaveCommand={handleSaveCommand}
            onDeleteCommand={handleDeleteCommand}
          />
        )}

        {activeTab === "logDecoder" && <LogDecoderTab items={items} />}

        {activeTab === "itemGenerator" && (
          <main className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-1/2">
              <ItemBuilderForm
                item={item}
                onItemChange={handleItemChange}
                onTriggerMatrix={triggerMatrixEffect}
                onTriggerAli={triggerAliEffect}
                onTriggerJupi={triggerJupiEffect}
              />
              <ItemCodeDisplay item={item} />
            </div>
            <div className="w-full lg:w-1/2 sticky top-8">
              <ItemPreviewCard item={item} />
            </div>
          </main>
        )}

        {activeTab === "petGenerator" && (
          <PetGeneratorTab pet={pet} onPetChange={handlePetChange} />
        )}

        {activeTab === "codeSearch" && <CodeSearchTab items={items} />}

        {activeTab === "itemIdTable" && (
          <ItemIdTableTab isAdmin={isAuthenticated} items={items} />
        )}

        {activeTab === "professionCodes" && <ProfessionCodesTab />}

        {activeTab === "konum" && (
          <KonumTab
            isAdmin={isAuthenticated}
            locations={locations}
            onSaveLocation={handleSaveLocation}
            onDeleteLocation={handleDeleteLocation}
          />
        )}

        {activeTab === "kostumler" && (
          <KostumlerTab
            isAdmin={isAuthenticated}
            costumes={costumes}
            onSaveCostume={handleSaveCostume}
            onDeleteCostume={handleDeleteCostume}
          />
        )}
      </div>
      {showA2HS && (
        <AddToHomeScreenPrompt
          isIos={isIos()}
          hasInstallPrompt={!!installPrompt}
          onInstall={handleInstallClick}
          onDismiss={handleDismissClick}
        />
      )}
      {showPasswordPrompt && (
        <PasswordPrompt
          onClose={() => setShowPasswordPrompt(false)}
          onSuccess={() => {
            setIsAdminAuthenticated(true);
            setShowPasswordPrompt(false);
            // You can add a success notification here if you want
          }}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const checkAuth = (): boolean => {
    const loginTimestamp = localStorage.getItem("loginTimestamp");
    if (!loginTimestamp) {
      return false;
    }

    const timestamp = parseInt(loginTimestamp, 10);
    const now = Date.now();
    const fortyEightHours = 48 * 60 * 60 * 1000;

    if (now - timestamp > fortyEightHours) {
      localStorage.removeItem("loginTimestamp"); // Clear expired timestamp
      return false;
    }

    return true;
  };

  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth);

  const handleLoginSuccess = () => {
    localStorage.setItem("loginTimestamp", Date.now().toString());
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <LanguageProvider>
      <AppContent isAuthenticated={isAuthenticated} />
    </LanguageProvider>
  );
};

export default App;
