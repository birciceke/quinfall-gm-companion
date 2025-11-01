import React, { useMemo, useState, useEffect, useRef } from "react";
import type { Position } from "../types";
import {
  PlayIcon,
  PauseIcon,
  ResetIcon,
  CalendarIcon,
  FullscreenEnterIcon,
  FullscreenExitIcon,
} from "./Icons";

import MAP from "../assets/quinfallmap.png";

const MAP_URL = MAP;

const GAME_COORDS = {
  xMin: -14 * 2000,
  xMax: 14 * 2000,
  zMin: -9 * 2000,
  zMax: 9 * 2000,
};

const IMAGE_DIMENSIONS = {
  width: 1920,
  height: 1080,
};

const mapCoordinates = (
  gameX: number,
  gameZ: number
): { x: number; y: number } => {
  const percentX =
    (gameX - GAME_COORDS.xMin) / (GAME_COORDS.xMax - GAME_COORDS.xMin);
  const percentZ =
    (gameZ - GAME_COORDS.zMin) / (GAME_COORDS.zMax - GAME_COORDS.zMin);
  const pixelX = percentX * IMAGE_DIMENSIONS.width;
  const pixelY = (1 - percentZ) * IMAGE_DIMENSIONS.height;
  return { x: pixelX, y: pixelY };
};

interface InteractiveMapProps {
  positions: Position[];
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ positions }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLImageElement>(null);
  const animationIntervalRef = useRef<number | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const availableDays = useMemo(() => {
    const days = new Set<string>();
    positions.forEach((p) => {
      days.add(p.timestamp.toISOString().split("T")[0]);
    });
    return Array.from(days).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  }, [positions]);

  const filteredPositions = useMemo(() => {
    if (!selectedDay) return positions;
    return positions.filter((p) =>
      p.timestamp.toISOString().startsWith(selectedDay)
    );
  }, [positions, selectedDay]);

  const pathSegments = useMemo(() => {
    if (filteredPositions.length === 0)
      return { traveled: "", future: "", current: null };

    const allPoints = filteredPositions.map((p) => {
      const { x, y } = mapCoordinates(p.x, p.z);
      return `${x},${y}`;
    });

    const currentPos = filteredPositions[currentStep];

    return {
      traveled: allPoints.slice(0, currentStep + 1).join(" "),
      future: allPoints.slice(currentStep).join(" "),
      current: currentPos ? mapCoordinates(currentPos.x, currentPos.z) : null,
    };
  }, [filteredPositions, currentStep]);

  // Reset slider and animation when filter changes
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [filteredPositions]);

  useEffect(() => {
    if (isPlaying) {
      animationIntervalRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < filteredPositions.length - 1) {
            return prev + 1;
          }
          setIsPlaying(false);
          return prev;
        });
      }, 100);
    } else if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    return () => {
      if (animationIntervalRef.current)
        clearInterval(animationIntervalRef.current);
    };
  }, [isPlaying, filteredPositions.length]);

  useEffect(() => {
    if (mapRef.current?.complete) setIsMapLoaded(true);

    const onFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStep(parseInt(e.target.value, 10));
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (currentStep >= filteredPositions.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  const currentTimestamp =
    filteredPositions[currentStep]?.timestamp
      .toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(",", "") || "N/A";

  return (
    <div
      ref={containerRef}
      className="w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700"
    >
      <div className="relative">
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <p className="text-gray-400 animate-pulse">Harita Yükleniyor...</p>
          </div>
        )}
        <img
          ref={mapRef}
          src={MAP_URL}
          alt="Quinfall Dünya Haritası"
          className={`w-full h-auto transition-opacity duration-500 ${
            isMapLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsMapLoaded(true)}
        />
        {isMapLoaded && filteredPositions.length > 0 && (
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox={`0 0 ${IMAGE_DIMENSIONS.width} ${IMAGE_DIMENSIONS.height}`}
            preserveAspectRatio="none"
          >
            {pathSegments.future && (
              <polyline
                points={pathSegments.future}
                fill="none"
                stroke="rgba(156, 163, 175, 0.5)" // gray-400
                strokeWidth="3"
                strokeDasharray="8 8"
              />
            )}
            {pathSegments.traveled && (
              <polyline
                points={pathSegments.traveled}
                fill="none"
                stroke="rgba(239, 68, 68, 0.9)" // red-500
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.7))" }}
              />
            )}
            {pathSegments.current && filteredPositions[currentStep] && (
              <circle
                cx={pathSegments.current.x}
                cy={pathSegments.current.y}
                r="10"
                fill="rgba(59, 130, 246, 0.8)" // blue-500
                stroke="white"
                strokeWidth="2.5"
                style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,1))" }}
              >
                <title>
                  Mevcut: (X: {filteredPositions[currentStep].x.toFixed(0)}, Z:{" "}
                  {filteredPositions[currentStep].z.toFixed(0)})
                </title>
              </circle>
            )}
          </svg>
        )}
      </div>

      {isMapLoaded && positions.length > 1 && (
        <div className="p-4 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 bg-gray-700 rounded-full text-white hover:bg-yellow-500 hover:text-gray-900 transition-colors"
                aria-label={isPlaying ? "Duraklat" : "Oynat"}
              >
                {isPlaying ? (
                  <PauseIcon className="w-5 h-5" />
                ) : (
                  <PlayIcon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleReset}
                className="p-2 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors"
                aria-label="Sıfırla"
              >
                <ResetIcon className="w-5 h-5" />
              </button>
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePicker((s) => !s)}
                  className="p-2 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors"
                  aria-label="Gün Seç"
                >
                  <CalendarIcon className="w-5 h-5" />
                </button>
                {showDatePicker && (
                  <div className="absolute bottom-full mb-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedDay(null);
                        setShowDatePicker(false);
                      }}
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-yellow-500 hover:text-gray-900 ${
                        !selectedDay
                          ? "bg-yellow-500 text-gray-900"
                          : "text-white"
                      }`}
                    >
                      Tüm Günler
                    </button>
                    {availableDays.map((day) => (
                      <button
                        key={day}
                        onClick={() => {
                          setSelectedDay(day);
                          setShowDatePicker(false);
                        }}
                        className={`block w-full text-left px-3 py-2 text-sm hover:bg-yellow-500 hover:text-gray-900 ${
                          selectedDay === day
                            ? "bg-yellow-500 text-gray-900"
                            : "text-white"
                        }`}
                      >
                        {new Date(day).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleFullscreenToggle}
                className="p-2 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors"
                aria-label={
                  isFullscreen ? "Tam Ekrandan Çık" : "Tam Ekrana Geç"
                }
              >
                {isFullscreen ? (
                  <FullscreenExitIcon className="w-5 h-5" />
                ) : (
                  <FullscreenEnterIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <span className="text-sm font-mono bg-gray-900/50 px-3 py-1.5 rounded-md text-cyan-300 whitespace-nowrap">
              {currentTimestamp}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.max(0, filteredPositions.length - 1)}
            value={currentStep}
            onChange={handleSliderChange}
            disabled={filteredPositions.length < 2}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 disabled:opacity-50"
            aria-label="Zaman Çizelgesi Kaydırıcısı"
          />
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
