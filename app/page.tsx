"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** What we want in the ideal case. Safari often requires a one-time gesture to hear audio. */
const videoConstraints = {
  autoplay: true,
  showControls: false,
  /** Target end state; Safari may need an initial muted start + gesture to reach audible. */
  preferAudible: true,
} as const;

type PlayPhase =
  | "starting"
  | "audible"
  | "mutedAutoplay" /** playing without the native “press play” block */
  | "needsTap";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<PlayPhase>("starting");

  /** WebKit / iOS: inline playback must be explicit or Safari can push fullscreen + play overlay. */
  useLayoutEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "true");
    el.playsInline = true;
  }, []);

  const tryUnmute = useCallback((el: HTMLVideoElement) => {
    el.muted = false;
    return el.play() as Promise<void> | undefined;
  }, []);

  const tryStartMuted = useCallback((el: HTMLVideoElement) => {
    el.muted = true;
    return el.play() as Promise<void> | undefined;
  }, []);

  const beginAutoplay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;

    const p = tryUnmute(el);
    if (p && typeof p.then === "function") {
      void p
        .then(() => setPhase("audible"))
        .catch(() => {
          // Apply muted in React before play() finishes so nothing resets `muted` mid-flight.
          setPhase("mutedAutoplay");
          el.muted = true;
          const p2 = el.play() as Promise<void> | undefined;
          if (p2 && typeof p2.then === "function") {
            void p2.catch(() => setPhase("needsTap"));
          } else {
            setPhase("needsTap");
          }
        });
    } else {
      setPhase("needsTap");
    }
  }, [tryUnmute]);

  useEffect(() => {
    beginAutoplay();
  }, [beginAutoplay]);

  /** After quiet autoplay, first user gesture unmutes. Phase must switch before play() or React `muted` forces muted back on. */
  useEffect(() => {
    if (phase !== "mutedAutoplay") return;
    const onFirstGesture = () => {
      const el = videoRef.current;
      if (!el || !videoConstraints.preferAudible) return;
      setPhase("audible");
      el.muted = false;
      if (el.paused) {
        void el.play().catch(() => setPhase("mutedAutoplay"));
      }
    };
    window.addEventListener("pointerup", onFirstGesture, { capture: true, passive: true });
    return () => window.removeEventListener("pointerup", onFirstGesture, { capture: true });
  }, [phase]);

  const onTapToPlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const p = tryUnmute(el);
    if (p && typeof p.then === "function") {
      void p
        .then(() => setPhase("audible"))
        .catch(() => {
          const p2 = tryStartMuted(el);
          if (p2 && typeof p2.then === "function") {
            void p2
              .then(() => setPhase("mutedAutoplay"))
              .catch(() => {});
          }
        });
    } else {
      void tryStartMuted(el);
    }
  }, [tryStartMuted, tryUnmute]);

  const showTapOverlay = phase === "needsTap";

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#F5F3F1]">
      <div className="relative flex h-full w-full items-center justify-center">
        <video
          ref={videoRef}
          className="max-h-full max-w-full bg-[#F5F3F1] object-contain"
          src="/wedding.mp4"
          autoPlay={videoConstraints.autoplay}
          loop
          playsInline
          muted={phase === "mutedAutoplay"}
          controls={videoConstraints.showControls}
          preload="auto"
          disablePictureInPicture
        />
        {showTapOverlay && (
          <button
            type="button"
            onClick={onTapToPlay}
            className="absolute inset-0 z-10 m-0 cursor-pointer border-0 bg-transparent p-0"
            aria-label="Start video"
          />
        )}
      </div>
    </div>
  );
}
