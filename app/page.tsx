export default function Home() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#F5F3F1]">
      <div className="flex h-full w-full items-center justify-center">
        <video
          className="max-h-full max-w-full bg-[#F5F3F1] object-contain"
          src="/wedding.mp4"
          autoPlay
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
        />
      </div>
    </div>
  );
}
