"use client";

import { useCallback, useState } from "react";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  const onVideoReady = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#F5F3F1]">
      {/* Low-opacity bloom backdrops (visible in letterbox / pillarbox when video doesn’t fill the window) */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        <div className="absolute -left-[15%] top-[5%] h-[min(85vh,80vw)] w-[min(85vh,80vw)] rounded-full bg-rose-300/18 blur-[100px]" />
        <div className="absolute -right-[10%] bottom-[0%] h-[min(75vh,75vw)] w-[min(75vh,75vw)] rounded-full bg-sky-300/18 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[18%] h-[min(80vh,78vw)] w-[min(80vh,78vw)] rounded-full bg-emerald-300/16 blur-[110px]" />
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <video
          className={[
            "max-h-full max-w-full object-contain",
            "transition-[filter,opacity] duration-[1200ms] ease-out will-change-[filter,opacity]",
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
