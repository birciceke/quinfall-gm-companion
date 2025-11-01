import type {
  ParsedData,
  Session,
  DecodedItemInfo,
  ChatMessage,
  ItemUpgrade,
} from "../types";
import type { SimpleItem, Item } from "../types";
import { parseItemCode } from "./itemCodeParser";
import { parseSimpleItemId } from "./simpleItemParser";

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const h = hours;
  const m = minutes % 60;
  const s = seconds % 60;
  return `${h > 0 ? `${h}s ` : ""}${m > 0 ? `${m}d ` : ""}${s}s`; // "s" for saat, "d" for dakika
};

export const parseLog = (
  content: string,
  allItems: SimpleItem[]
): ParsedData => {
  const lines = content.split("\n");
  const data: Omit<ParsedData, "summary"> = {
    sessions: [],
    positions: [],
    chats: [],
    items: [],
    bossKills: [],
    marketTransactions: [],
    itemUpgrades: [],
  };
  let currentSession: Session | null = null;

  const lineRegex =
    /^(\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2} (?:AM|PM)): {2}(.*)$/;
  const codeRegex = /\b([0-9a-zA-Z]+(?:_[0-9a-zA-Z]+)+)\b/g;

  lines.forEach((line) => {
    const match = line.match(lineRegex);
    if (!match) return;

    const [, timestampStr, details] = match;
    const timestamp = new Date(timestampStr);

    if (details.startsWith("GIRIS YAPILDI")) {
      if (currentSession) data.sessions.push(currentSession);
      currentSession = {
        startTime: timestamp,
        endTime: null,
        duration: "Active",
      };
    } else if (
      details.startsWith("KAYITLI CIKIS YAPILDI") ||
      details.startsWith("KAYITSIZ CIKIS YAPILDI")
    ) {
      if (currentSession) {
        currentSession.endTime = timestamp;
        currentSession.duration = formatDuration(
          timestamp.getTime() - currentSession.startTime.getTime()
        );
        data.sessions.push(currentSession);
        currentSession = null;
      }
    } else if (details.startsWith("POS:")) {
      const parts = details.substring(5).trim().split(/\s+/);
      if (parts.length >= 3) {
        data.positions.push({
          x: parseFloat(parts[0]),
          y: parseFloat(parts[1]),
          z: parseFloat(parts[2]),
          timestamp,
        });
      }
    } else if (details.startsWith("CHAT:")) {
      const chatMatch = details.match(/^CHAT: KANAL (\d+), MESAJ: (.*)/);
      if (chatMatch) {
        const [, channel, message] = chatMatch;
        let type: ChatMessage["type"] = "Bilinmeyen Kanal";
        switch (channel) {
          case "1":
            type = "Global";
            break;
          case "2":
            type = "Çevre";
            break;
          case "3":
            type = "Klan";
            break;
          case "4":
            type = "Parti";
            break;
          case "5":
            type = "Alliance";
            break;
        }

        data.chats.push({
          timestamp: timestampStr,
          type,
          channelNumber: type === "Bilinmeyen Kanal" ? channel : undefined,
          message,
        });
      }
    } else if (details.startsWith("CHAT PM:")) {
      const pmMatch = details.match(/^CHAT PM: HEDEF (.*?), MESAJ: (.*)/);
      if (pmMatch) {
        const [, target, message] = pmMatch;
        data.chats.push({
          timestamp: timestampStr,
          type: "PM",
          target,
          message,
        });
      }
    } else if (details.startsWith("UPGRADE ")) {
      const successMatch = details.match(
        /UPGRADE BASARILI: ([\w_]+) => ([\w_]+)/
      );
      const failMatch = details.match(
        /UPGRADE BASARISIZ - (YANDI|TERA): ([\w_]+)/
      );

      if (successMatch) {
        const [, beforeCode, afterCode] = successMatch;
        const itemBefore = parseItemCode(beforeCode as string);
        const itemAfter = parseItemCode(afterCode as string);
        if (itemBefore && itemAfter) {
          data.itemUpgrades.push({
            timestamp: timestampStr,
            fullText: details,
            status: "success",
            itemBefore: {
              type: "complex",
              data: itemBefore,
              quantity: 1,
              originalCode: beforeCode as string,
            },
            itemAfter: {
              type: "complex",
              data: itemAfter,
              quantity: 1,
              originalCode: afterCode as string,
            },
          });
        }
      } else if (failMatch) {
        const [, failType, itemCode] = failMatch;
        const item = parseItemCode(itemCode as string);
        if (item) {
          data.itemUpgrades.push({
            timestamp: timestampStr,
            fullText: details,
            status:
              (failType as string) === "YANDI" ? "fail_burn" : "fail_tera",
            itemBefore: {
              type: "complex",
              data: item,
              quantity: 1,
              originalCode: itemCode as string,
            },
          });
        }
      }
    } else if (details.startsWith("MARKET ")) {
      const decodedItems: DecodedItemInfo[] = [];
      const itemMatches = details.matchAll(codeRegex);

      for (const match of itemMatches) {
        const originalCode = match[0];
        if (!originalCode) continue;

        let quantity = 1;
        const parts = originalCode.split("_");
        const lastPart = parts[parts.length - 1];

        const complexItem = parseItemCode(originalCode);
        if (complexItem) {
          decodedItems.push({
            type: "complex",
            data: complexItem,
            quantity: 1,
            originalCode,
          });
          continue;
        }
        const simpleItem = parseSimpleItemId(originalCode, allItems);
        if (simpleItem) {
          if (parts.length === 2 && /^\d{4}$/.test(lastPart as string)) {
            quantity = parseInt(lastPart as string, 10);
            if (quantity === 0) quantity = 1;
          } else {
            quantity = 1;
          }
          decodedItems.push({
            type: "simple",
            data: simpleItem,
            quantity,
            originalCode,
          });
        }
      }
      if (decodedItems.length > 0) {
        data.marketTransactions.push({
          timestamp: timestampStr,
          fullText: details,
          decodedItems,
        });
      }
    } else if (
      details.startsWith("ITEM:") ||
      details.startsWith("DROP ALINDI:") ||
      details.startsWith("HAZINE SANDIGI") ||
      details.includes("WORLD BOSS ODULU")
    ) {
      const decodedItems: DecodedItemInfo[] = [];
      const itemMatches = details.matchAll(codeRegex);

      for (const match of itemMatches) {
        const originalCode = match[0];
        if (!originalCode) continue;

        let quantity = 1;
        const parts = originalCode.split("_");
        const lastPart = parts[parts.length - 1];

        const complexItem = parseItemCode(originalCode);
        if (complexItem) {
          decodedItems.push({
            type: "complex",
            data: complexItem,
            quantity: 1,
            originalCode,
          });
          continue;
        }
        const simpleItem = parseSimpleItemId(originalCode, allItems);
        if (simpleItem) {
          if (parts.length === 2 && /^\d{4}$/.test(lastPart as string)) {
            quantity = parseInt(lastPart as string, 10);
            if (quantity === 0) quantity = 1;
          } else {
            quantity = 1;
          }
          decodedItems.push({
            type: "simple",
            data: simpleItem,
            quantity,
            originalCode,
          });
        }
      }

      if (decodedItems.length > 0) {
        data.items.push({
          timestamp: timestampStr,
          fullText: details,
          decodedItems,
        });
      }
    } else if (details.startsWith("WORLD BOSS KILL")) {
      const bossMatch = details.match(
        /CESIT: (\d+) HASAR: ([\d.]+) ACTIONCOIN: (\d+) ITEMS: (\d+)/
      );
      if (bossMatch) {
        data.bossKills.push({
          timestamp: timestampStr,
          typeId: bossMatch[1],
          damage: parseFloat(bossMatch[2]),
          actionCoin: parseInt(bossMatch[3]),
          itemsDropped: parseInt(bossMatch[4]),
        });
      }
    }
  });

  if (currentSession) data.sessions.push(currentSession);

  const totalPlayTimeMs = data.sessions.reduce((acc, s) => {
    if (s.endTime) return acc + (s.endTime.getTime() - s.startTime.getTime());
    return acc;
  }, 0);

  const upgradeCounts = data.itemUpgrades.reduce(
    (acc, upg) => {
      if (upg.status === "success") acc.success++;
      else if (upg.status === "fail_burn") acc.fail_burn++;
      else if (upg.status === "fail_tera") acc.fail_tera++;
      return acc;
    },
    { success: 0, fail_burn: 0, fail_tera: 0 }
  );

  const summary = {
    totalPlayTime: formatDuration(totalPlayTimeMs),
    totalBossKills: data.bossKills.length,
    totalItemsGained: data.items.reduce(
      (sum, item) => sum + item.decodedItems.length,
      0
    ),
    totalMarketTransactions: data.marketTransactions.length,
    totalChatMessages: data.chats.length,
    firstLogin: data.sessions[0]?.startTime.toLocaleString("tr-TR"),
    lastLogout: [...data.sessions]
      .reverse()
      .find((s) => s.endTime)
      ?.endTime?.toLocaleString("tr-TR"),
    totalItemUpgrades: {
      ...upgradeCounts,
      total: data.itemUpgrades.length,
    },
  };

  return { ...data, summary };
};
