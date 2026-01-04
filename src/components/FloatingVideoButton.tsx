import { useState, useRef, useEffect } from "react";
import { Play, X, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import videoSrc from "@/assets/video-produto.mp4";

const FloatingVideoButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Play preview video on loop
  useEffect(() => {
    if (previewVideoRef.current) {
      previewVideoRef.current.play().catch(() => {
        // Autoplay blocked, that's fine
      });
    }
  }, []);

  // Handle modal video when opening
  useEffect(() => {
    if (isOpen && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {});
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Video Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 group cursor-pointer"
        aria-label="Assistir vídeo do produto"
      >
        {/* Video Preview Circle */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-primary shadow-lg shadow-primary/30 animate-pulse-slow">
          <video
            ref={previewVideoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
          </div>
        </div>

        {/* Label */}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-semibold text-foreground bg-background px-2 py-0.5 rounded shadow whitespace-nowrap">
          PLAY VIDEO
        </span>
      </button>

      {/* Video Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg p-0 bg-black border-none overflow-hidden">
          <DialogTitle className="sr-only">Vídeo do Produto</DialogTitle>
          <div className="relative aspect-[9/16] sm:aspect-[9/16] max-h-[85vh]">
            <video
              ref={modalVideoRef}
              src={videoSrc}
              muted={isMuted}
              loop
              playsInline
              controls={false}
              className="w-full h-full object-contain"
            />

            {/* Custom Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              {/* Mute Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Close Button */}
            <DialogClose className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
              <X className="w-5 h-5" />
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingVideoButton;
