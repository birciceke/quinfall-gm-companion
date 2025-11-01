import { simpleItemData } from "../data/simpleItemData";
import type { SimpleItem } from "../types";

export const parseSimpleItemId = (
  code: string,
  data: SimpleItem[]
): SimpleItem | null => {
  const cleanedCode = code.split("_")[0]; // Handle cases like '10901_0001' by taking the ID part.
  return (
    data.find(
      (item) => item.itemId === cleanedCode || item.localeId === cleanedCode
    ) || null
  );
};

export const findSimpleItemByName = (
  name: string,
  data: SimpleItem[],
  t: (key: string) => string
): SimpleItem | null => {
  if (!itemName) return null;
  const lowercasedName = itemName.toLowerCase();

  // Find the first item whose name includes the search query.
  const foundItem = data.find((item) =>
    (t(item.localeId || "") || item.itemName)
      .toLowerCase()
      .includes(lowercasedName)
  );

  return foundItem || null;
};

export const findSimpleItemsByName = (
  query: string,
  data: SimpleItem[],
  t: (key: string) => string
): SimpleItem[] => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  const lowercasedQuery = query.toLowerCase();
  return data.filter(
    (item) =>
      (t(item.localeId || "") || item.itemName)
        .toLowerCase()
        .includes(lowercasedQuery) ||
      item.itemId.includes(lowercasedQuery) ||
      (item.localeId && item.localeId.includes(lowercasedQuery))
  );
};
