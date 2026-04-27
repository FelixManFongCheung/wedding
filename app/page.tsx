"use client";

import { useCallback, useState } from "react";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  const onVideoReady = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#F5F3F1]">
      <div className="flex h-full w-full items-center justify-center">
        <video
          className={[
            "max-h-full max-w-full object-contain",
            "transition-[filter,opacity] duration-1200 ease-out will-change-[filter,opacity]",
            isReady ? "opacity-100 blur-0" : "opacity-90 blur-2xl",
          ].join(" ")}
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
        />
      </div>
    </div>
  );
}
