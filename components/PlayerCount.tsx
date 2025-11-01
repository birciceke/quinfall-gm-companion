import React, { useState, useEffect, useCallback } from "react";

const APP_ID = "2294660";
const TARGET_URL = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${APP_ID}`;

// A list of CORS proxies to try in order, from most to least reliable.
const PROXIES = [
  // allorigins.win is generally stable.
  (url: string) =>
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  // corsproxy.io has had issues but is a good fallback.
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  // thingproxy is another option.
  (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
];

const PROXY_URLS = PROXIES.map((proxyFn) => proxyFn(TARGET_URL));

const PlayerCountIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const PlayerCount: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    setIsLoading(true);

    for (const url of PROXY_URLS) {
      try {
        // Add a 5-second timeout to each proxy request.
        const response = await fetch(url, {
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
          console.warn(
            `Proxy ${url.substring(0, 40)}... failed with status: ${
              response.status
            }`
          );
          continue; // Try next proxy in the list.
        }

        const steamData = await response.json();

        if (steamData.response && steamData.response.result === 1) {
          setCount(steamData.response.player_count);
          setError(null);
          setIsLoading(false);
          return; // Success! Exit the function.
        } else {
          console.warn(
            `Invalid data from Steam API via proxy ${url.substring(0, 40)}...`
          );
        }
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") {
          console.error(
            `Fetch via proxy ${url.substring(0, 40)}... timed out.`
          );
        } else {
          console.error(
            `Failed to fetch via proxy ${url.substring(0, 40)}...:`,
            e
          );
        }
      }
    }

    setError("Veri alınamadı");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCount();
    const intervalId = setInterval(fetchCount, 60000); // Refetch every 60 seconds

    return () => clearInterval(intervalId);
  }, [fetchCount]);

  const renderContent = () => {
    if (isLoading && count === null) {
      return <span className="animate-pulse">Yükleniyor...</span>;
    }

    if (count !== null) {
      return (
        <div
          className="relative flex items-center"
          title={error ? `Son güncelleme başarısız: ${error}` : "Canlı"}
        >
          <span className="relative flex h-3 w-3 mr-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                error ? "bg-red-400" : "bg-green-400"
              } opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                error ? "bg-red-500" : "bg-green-500"
              }`}
            ></span>
          </span>
          <span className="font-semibold text-white">
            {count.toLocaleString("tr-TR")}
          </span>
        </div>
      );
    }

    return (
      <span title={error || "Player count could not be retrieved"}>N/A</span>
    );
  };

  return (
    <div
      className="flex items-center text-gray-300"
      title="Anlık Oyuncu Sayısı"
    >
      <PlayerCountIcon />
      {renderContent()}
    </div>
  );
};

export default PlayerCount;
