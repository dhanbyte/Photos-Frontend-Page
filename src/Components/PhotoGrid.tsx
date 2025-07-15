// src/components/PhotoGrid.tsx
import { useState } from "react";
import dayjs from "dayjs";
import clsx from "clsx";

export type Photo = {
  imageUrl: string;
  uploadedAt: string;
};

type Props = {
  photos: Photo[];
};

export default function PhotoGrid({ photos }: Props) {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [filterDate, setFilterDate] = useState("all");
  const [fullScreen, setFullScreen] = useState<string | null>(null);

  const toggleSelect = (url: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const filteredPhotos = photos.filter((photo) => {
    if (filterDate === "all") return true;
    const diff = dayjs().diff(photo.uploadedAt, "month");
    if (filterDate === "1m") return diff <= 1;
    if (filterDate === "6m") return diff <= 6;
    if (filterDate === "1y") return diff <= 12;
    return true;
  });

  return (
    <div>
      {/* Filter */}
      <div className="mb-4 flex gap-2">
        {[
          { label: "All", value: "all" },
          { label: "1 Month", value: "1m" },
          { label: "6 Months", value: "6m" },
          { label: "1 Year", value: "1y" },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilterDate(value)}
            className={clsx(
              "px-3 py-1 rounded border",
              filterDate === value
                ? "bg-blue-600 text-white"
                : "bg-white text-black"
            )}
          >
            {label}
          </button>
        ))}
        {selectedPhotos.length > 0 && (
          <button
            onClick={() => {
              const shareText = selectedPhotos.join("%0A");
              window.open(`https://wa.me/?text=${shareText}`, "_blank");
            }}
            className="ml-auto bg-green-600 text-white px-3 py-1 rounded"
          >
            Share Selected ({selectedPhotos.length})
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {filteredPhotos.map((photo, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg border"
          >
            <img
              src={photo.imageUrl}
              alt="Uploaded"
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => setFullScreen(photo.imageUrl)}
            />
            <div className="p-2 text-sm text-gray-600">
              {dayjs(photo.uploadedAt).format("MMM D, YYYY")}
            </div>
            <input
              type="checkbox"
              checked={selectedPhotos.includes(photo.imageUrl)}
              onChange={() => toggleSelect(photo.imageUrl)}
              className="absolute top-0 left-0 h-5 w-5 cursor-pointer bg-gray-300 rounded-full"
        />
          </div>
        ))}
      </div>

      {/* Full screen modal */}
      {fullScreen && (
        <div
          onClick={() => setFullScreen(null)}
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
        >
          <img
            src={fullScreen}
            className="max-w-full max-h-full object-contain"
            alt="Fullscreen preview"
          />
        </div>
      )}
    </div>
  );
}
