export enum ItemStat {
  FizikselSaldiri = "Fiziksel AP",
  BuyuSaldiri = "Büyü AP",
  FizikselSavunma = "Fiziksel DP",
  BuyuSavunma = "Büyü DP",
  HP = "HP",
  MP = "MP",
  HPYenilenmesi = "HP Yenilenmesi",
  MPYenilenmesi = "MP Yenilenmesi",
  Isabet = "İsabet",
  Kacinma = "Kaçınma",
  KritikSansi = "Kritik Şansı",
  KritikDefansSansi = "Kritik Defans Şansı",
}

export interface Item {
  slot: string;
  armorType: string;
  level: number;
  property1: ItemStat | "";
  property2: ItemStat | "";
  property3: ItemStat | "";
  setBonus: string;
  starLevel: number;
  tier: number;
  durability: number;
}

export interface Pet {
  petType: string;
  petProfession: string;
  satiety: number;

  level: number;
  xp: number;
}

// FIX: Added Location and Costume interfaces here to centralize types and fix import errors.
export interface Location {
  name: string;
  command: string;
}

export interface Costume {
  name: string;
  command: string;
  category: string;
  imageUrl?: string;
}

export interface ServerCommand {
  _id: string;
  serverCommand: string;
  key: string;
  value: string;
  description: string;
}

// --- Log Decoder Types ---

export interface Position {
  x: number;
  y: number;
  z: number;
  timestamp: Date;
}

export interface ChatMessage {
  timestamp: string;
  type:
    | "Global"
    | "Çevre"
    | "Klan"
    | "Parti"
    | "Alliance"
    | "PM"
    | "Bilinmeyen Kanal";
  target?: string;
  channelNumber?: string;
  message: string;
}

export type DecodedItemInfo = {
  type: "simple" | "complex";
  data: SimpleItem | Item;
  quantity: number;
  originalCode: string;
};

export interface ItemEvent {
  timestamp: string;
  fullText: string;
  decodedItems: DecodedItemInfo[];
}

export interface ItemUpgrade {
  timestamp: string;
  fullText: string;
  status: "success" | "fail_burn" | "fail_tera";
  itemBefore: DecodedItemInfo;
  itemAfter?: DecodedItemInfo; // Only for success
}

export interface BossKill {
  timestamp: string;
  typeId: string;
  damage: number;
  actionCoin: number;
  itemsDropped: number;
}

export interface Session {
  startTime: Date;
  endTime: Date | null;
  duration: string;
}

export interface ParsedData {
  sessions: Session[];
  positions: Position[];
  chats: ChatMessage[];
  items: ItemEvent[];
  marketTransactions: ItemEvent[];
  bossKills: BossKill[];
  itemUpgrades: ItemUpgrade[];
  summary: {
    totalPlayTime: string;
    totalBossKills: number;
    totalItemsGained: number;
    totalMarketTransactions: number;
    totalChatMessages: number;
    firstLogin?: string;
    lastLogout?: string;
    totalItemUpgrades: {
      success: number;
      fail_burn: number;
      fail_tera: number;
      total: number;
    };
  };
}

export interface SimpleItem {
  name: string;
  id: string;
  localeId?: string;
  command: string;
  imageUrl?: string;
}
