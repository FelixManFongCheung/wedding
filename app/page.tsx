"use client";

import { useCallback, useState } from "react";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  const onVideoReady = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#F5F3F1]">
      <div className="relative h-full w-full">
        <div className="flex h-full w-full items-center justify-center">
          <video
            className="max-h-full max-w-full bg-[#F5F3F1] object-contain"
            src="/wedding.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            onLoadedData={onVideoReady}
            onCanPlay={onVideoReady}
            onPlaying={onVideoReady}
          />
        </div>
        {/* Solid cream layer during decode/first frame so default black letterbox never shows */}
        <div
          className={[
            "pointer-events-none absolute inset-0 z-10 bg-[#F5F3F1]",
            "transition-opacity duration-1000 ease-out",
            isReady ? "opacity-0" : "opacity-100",
          ].join(" ")}
          aria-hidden
        />
      </div>
    </div>
  );
}
