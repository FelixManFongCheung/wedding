"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const videoSettings = {
  autoplay: true,
  showControls: false,
} as const;

/** WebKit needs this in the first paint, not only from useLayoutEffect, or inline playback / autoplay can block. */
const webkitPlaysinline = { "webkit-playsinline": "true" } as const;

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  /** Gated so loadeddata/canplay retries never re-mute after the user turns sound on. */
  const userWantsAudioRef = useRef(false);
  const [audioOn, setAudioOn] = useState(false);
  const [soundMessage, setSoundMessage] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.setAttribute("playsinline", "");
    el.playsInline = true;
    el.defaultMuted = true;
    el.muted = true;
  }, []);

  const tryMutedAutoplay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!userWantsAudioRef.current) {
      el.muted = true;
    }
    return el.play();
  }, []);

  useEffect(() => {
    void tryMutedAutoplay()?.catch(() => {});
  }, [tryMutedAutoplay]);

  const runAfterDecode = useCallback(() => {
    void tryMutedAutoplay()?.catch(() => {});
  }, [tryMutedAutoplay]);

  const enableSound = useCallback(() => {
    setSoundMessage(null);
    const el = videoRef.current;
    if (!el) return;
    userWantsAudioRef.current = true;
    el.muted = false;
    setAudioOn(true);
    void el.play().catch(() => {
      el.muted = true;
      userWantsAudioRef.current = false;
      setAudioOn(false);
      setSoundMessage(
        "This browser may block sound until you allow audio for this site. Use the lock or site icon in the address bar, allow sound, then tap again."
      );
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#F5F3F1]">
      <div className="relative flex h-full w-full items-center justify-center">
        <video
          ref={videoRef}
          className="max-h-full max-w-full bg-[#F5F3F1] object-contain"
          src="/wedding.mp4"
          autoPlay={videoSettings.autoplay}
          loop
          playsInline
          {...webkitPlaysinline}
          muted={!audioOn}
          controls={videoSettings.showControls}
          preload="auto"
          disablePictureInPicture
          onLoadedData={runAfterDecode}
          onCanPlay={runAfterDecode}
        />

        <div className="absolute top-4 right-4 z-20 flex max-w-[min(20rem,calc(100%-2rem))] flex-col items-end gap-2">
          {!audioOn ? (
            <button
              type="button"
              onClick={enableSound}
              className="rounded-full border border-zinc-300/80 bg-white/90 px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-sm backdrop-blur-sm transition hover:bg-white"
            >
              Turn on sound
            </button>
          ) : (
            <p
              className="rounded-full border border-emerald-200/80 bg-white/90 px-4 py-2.5 text-sm font-medium text-emerald-900 shadow-sm backdrop-blur-sm"
              role="status"
            >
              Sound on
            </p>
          )}
          {soundMessage && (
            <p
              className="rounded-lg border border-amber-200/90 bg-amber-50/95 px-3 py-2 text-left text-xs leading-snug text-amber-950 shadow-sm"
              role="alert"
            >
              {soundMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
