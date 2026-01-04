import { useState, useRef, useEffect } from "react";
import { Play, X, Volume2, VolumeX, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import videoSrc from "@/assets/video-produto.mp4";

const FloatingVideoButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Wait for video to be ready before showing the button
  useEffect(() => {
    const video = previewVideoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      video.play().catch(() => {});
      setIsReady(true);
    };

    if (video.readyState >= 3) {
      handleCanPlay();
    } else {
      video.addEventListener('canplay', handleCanPlay);
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Handle modal video when opening
  useEffect(() => {
    if (isOpen && modalVideoRef.current) {
      modalVideoRef.current.currentTime = 0;
      modalVideoRef.current.play().catch(() => {});
    }
  }, [isOpen]);

  const handleCTAClick = () => {
    setIsOpen(false);
    // Scroll to size selection section
    const sizeSection = document.querySelector('.size-option');
    if (sizeSection) {
      sizeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Video Button - hidden until video is ready */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 z-40 group cursor-pointer transition-all duration-500 ${
          isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
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
            preload="auto"
            className="w-full h-full object-cover"
          />
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
          </div>
        </div>
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
              autoPlay
              preload="auto"
              className="w-full h-full object-contain"
            />

            {/* CTA Button */}
            <div className="absolute bottom-16 left-4 right-4">
              <button
                onClick={handleCTAClick}
                className="w-full bg-success hover:bg-success/90 text-success-foreground font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:scale-[1.02] uppercase tracking-wide"
              >
                <ShoppingBag className="w-5 h-5" />
                Garantir Minha Oferta
              </button>
            </div>

            {/* Mute Button */}
            <div className="absolute bottom-4 left-4">
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
