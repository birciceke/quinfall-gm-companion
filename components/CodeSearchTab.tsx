import React, { useState, useMemo, useEffect } from "react";
import type { Item, Pet, SimpleItem } from "../types";
import { useTranslation } from "../i18n";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "@/redux/itemSlicer";
import { parseItemCode } from "../utils/itemCodeParser";
import { parsePetCode } from "../utils/petCodeParser";
import ItemPreviewCard from "./ItemPreviewCard";
import PetPreviewCard from "./PetPreviewCard";
import SimpleItemPreviewCard from "./SimpleItemPreviewCard";

const CodeSearchTab: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: items, isLoading } = useSelector((state: any) => state.item);

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SimpleItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    dispatch(fetchItems() as any);
  }, [dispatch]);

  const parseSimpleItemById = (input: string) => {
    const num = Number(input);
    if (isNaN(num)) return null;
    return items.find((i) => i.itemId === num) || null;
  };

  const findSimpleItemByNameOrLocale = (input: string) => {
    const lowerInput = input.toLowerCase();
    return (
      items.find(
        (i) =>
          (i.itemName?.toLowerCase() === lowerInput ||
            i.localeId?.toString().toLowerCase() === lowerInput) ??
          false
      ) || null
    );
  };

  const findSimpleItemsSuggestions = (input: string) => {
    const lowerInput = input.toLowerCase();
    return items.filter(
      (i) =>
        i.itemName?.toLowerCase().includes(lowerInput) ||
        i.localeId?.toString().toLowerCase().includes(lowerInput)
    );
  };

  const decodedResult = useMemo(() => {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError(null);
      return null;
    }

    try {
      const item = parseItemCode(trimmedCode);
      if (item) {
        setError(null);
        return { type: "item", data: item };
      }
    } catch {}

    try {
      const pet = parsePetCode(trimmedCode);
      if (pet) {
        setError(null);
        return { type: "pet", data: pet };
      }
    } catch {}

    const simpleItemById = parseSimpleItemById(trimmedCode);
    if (simpleItemById) {
      setError(null);
      return { type: "simpleItem", data: simpleItemById };
    }

    const simpleItemByName = findSimpleItemByNameOrLocale(trimmedCode);
    if (simpleItemByName) {
      setError(null);
      return { type: "simpleItem", data: simpleItemByName };
    }

    const partialMatch = findSimpleItemsSuggestions(trimmedCode)[0];
    if (partialMatch) {
      setError(null);
      return { type: "simpleItem", data: partialMatch };
    }

    setError(
      "Geçersiz veya desteklenmeyen kod/isim. Lütfen formatı kontrol edin."
    );
    return null;
  }, [code, items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCode(value);

    if (value.trim().length > 1) {
      const foundSuggestions = findSimpleItemsSuggestions(value);
      const exactMatch =
        foundSuggestions.length === 1 &&
        (foundSuggestions[0].itemName.toLowerCase() === value.toLowerCase() ||
          foundSuggestions[0].localeId?.toString().toLowerCase() ===
            value.toLowerCase());

      setSuggestions(foundSuggestions);
      setShowSuggestions(foundSuggestions.length > 0 && !exactMatch);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SimpleItem) => {
    const name = suggestion.itemName || suggestion.localeId?.toString() || "";
    setCode(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (code.trim().length > 1) {
      const foundSuggestions = findSimpleItemsSuggestions(code);
      const exactMatch =
        foundSuggestions.length === 1 &&
        (foundSuggestions[0].itemName.toLowerCase() === code.toLowerCase() ||
          foundSuggestions[0].localeId?.toString().toLowerCase() ===
            code.toLowerCase());
      if (foundSuggestions.length > 0 && !exactMatch) {
        setSuggestions(foundSuggestions);
        setShowSuggestions(true);
      }
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <main className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-1/2">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Item Arama
          </h2>
          <p className="text-gray-400 mb-4 text-sm">
            Bir item, pet veya basit ID kodunu ayrıştırmak ve özelliklerini
            görüntülemek için aşağıdaki alana yapıştırın.
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="Örn: 10901 veya Klan Kapasite Arttırıcı"
              value={code}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              autoComplete="off"
              className="w-full bg-gray-900/50 p-4 rounded-md font-mono text-lg text-cyan-300 tracking-widest border border-gray-600 focus:ring-yellow-500 focus:border-yellow-500 transition"
              aria-label="Item, Pet, or ID Code Input"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((item, index) => (
                  <li key={`${item.itemId}-${index}`}>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-yellow-500 hover:text-gray-900 transition-colors"
                      onMouseDown={() => handleSuggestionClick(item)}
                    >
                      {item.itemName || item.localeId}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {decodedResult && (
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg mt-8">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              Ayrıştırılan Veri
            </h3>
            {decodedResult.type === "item" && (
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <strong>Tür:</strong>{" "}
                  <span className="font-semibold text-white">
                    Generated Item
                  </span>
                </p>
                <p>
                  <strong>Slot:</strong>{" "}
                  <span className="font-semibold text-white">
                    {(decodedResult.data as Item).slot}
                  </span>
                </p>
                <p>
                  <strong>Level:</strong>{" "}
                  <span className="font-semibold text-white">
                    {(decodedResult.data as Item).level}
                  </span>
                </p>
                <p>
                  <strong>{t("grade")}:</strong>{" "}
                  <span className="font-semibold text-white">
                    {(decodedResult.data as Item).tier}
                  </span>
                </p>
              </div>
            )}
            {decodedResult.type === "pet" && (
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <strong>Tür:</strong>{" "}
                  <span className="font-semibold text-white">Pet</span>
                </p>
                <p>
                  <strong>Pet Tipi:</strong>{" "}
                  <span className="font-semibold text-white">
                    {(decodedResult.data as Pet).petType}
                  </span>
                </p>
                <p>
                  <strong>Seviye:</strong>{" "}
                  <span className="font-semibold text-white">
                    {(decodedResult.data as Pet).level}
                  </span>
                </p>
              </div>
            )}
            {decodedResult.type === "simpleItem" && (
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <strong>Tür:</strong>{" "}
                  <span className="font-semibold text-white">Basit Item</span>
                </p>
                <p>
                  <strong>Ad:</strong>{" "}
                  <span className="font-semibold text-white">
                    {decodedResult.data.itemName || decodedResult.data.localeId}
                  </span>
                </p>
                <p>
                  <strong>ID:</strong>{" "}
                  <span className="font-semibold text-white">
                    {decodedResult.data.itemId}
                  </span>
                </p>
                <p>
                  <strong>Locale ID:</strong>{" "}
                  <span className="font-semibold text-white">
                    {decodedResult.data.localeId || "N/A"}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/2 sticky top-8">
        {{
          item: <ItemPreviewCard item={decodedResult?.data as Item} />,
          pet: <PetPreviewCard pet={decodedResult?.data as Pet} />,
          simpleItem: (
            <SimpleItemPreviewCard item={decodedResult?.data as SimpleItem} />
          ),
        }[decodedResult?.type || ""] || (
          <div className="w-full max-w-sm mx-auto p-2.5">
            <div className="bg-[#1a1410] rounded-lg border border-dashed border-gray-700 h-[40rem] flex flex-col items-center justify-center text-center p-6">
              <h3 className="text-lg font-semibold text-gray-400">
                Item/Pet Önizlemesi
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {error ||
                  "Geçerli bir kod girildiğinde önizleme burada görünecektir."}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CodeSearchTab;
