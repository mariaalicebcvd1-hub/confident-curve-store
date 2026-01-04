import { useState, useRef, useEffect } from "react";
import { Play, X, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import videoSrc from "@/assets/video-produto.mp4";

// Format time as MM:SS
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const FloatingVideoButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [fakeDuration, setFakeDuration] = useState(0);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Wait for video to be ready before showing the button
  // Fallback: show button after 2 seconds even if video doesn't load (mobile safari issue)
  useEffect(() => {
    const video = previewVideoRef.current;
    
    // Fallback timeout - show button after 2 seconds regardless
    const fallbackTimeout = setTimeout(() => {
      if (!isReady) {
        setIsReady(true);
        if (video) {
          video.play().catch(() => {});
        }
      }
    }, 2000);

    if (!video) return () => clearTimeout(fallbackTimeout);

    const handleCanPlay = () => {
      video.play().catch(() => {});
      setIsReady(true);
    };

    if (video.readyState >= 3) {
      handleCanPlay();
    } else {
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadeddata', handleCanPlay);
    }

    return () => {
      clearTimeout(fallbackTimeout);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
    };
  }, [isReady]);

  // Handle modal video when opening - with retry for autoplay and time tracking
  useEffect(() => {
    if (isOpen && modalVideoRef.current) {
      const video = modalVideoRef.current;
      video.currentTime = 0;
      setCurrentTime(0);
      setFakeProgress(0);
      
      // Calculate fake duration (show ~40% of real duration to create urgency)
      const handleLoadedMetadata = () => {
        const realDuration = video.duration;
        // Show a shorter fake duration (around 40-50% of real)
        setFakeDuration(Math.floor(realDuration * 0.45));
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      if (video.duration) {
        handleLoadedMetadata();
      }
      
      // Track current time and fake progress
      const handleTimeUpdate = () => {
        const current = video.currentTime;
        setCurrentTime(current);
        // Fake progress moves faster (appears to be ending soon)
        const realDuration = video.duration || 1;
        const fakePercent = Math.min((current / realDuration) * 2.2, 100);
        setFakeProgress(fakePercent);
      };
      
      video.addEventListener('timeupdate', handleTimeUpdate);
      
      // Try to play immediately with sound
      const playVideo = () => {
        video.play().catch(() => {
          // If autoplay with sound fails, try muted first then unmute
          video.muted = true;
          video.play().then(() => {
            // Try to unmute after a short delay
            setTimeout(() => {
              video.muted = false;
            }, 100);
          }).catch(() => {});
        });
      };

      // Wait for dialog animation to complete
      setTimeout(playVideo, 50);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
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
        className={`fixed bottom-24 right-4 z-50 group cursor-pointer transition-all duration-500 ${
          isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Assistir vídeo do produto"
      >
        {/* Video Preview Circle */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-lg shadow-primary/30 animate-pulse-slow">
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
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
      </button>

      {/* Video Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-auto max-w-[90vw] sm:max-w-[400px] p-0 bg-transparent border-none overflow-hidden">
          <DialogTitle className="sr-only">Vídeo do Produto</DialogTitle>
          <div className="relative">
            <video
              ref={modalVideoRef}
              src={videoSrc}
              loop
              playsInline
              autoPlay
              preload="auto"
              className="w-full h-full object-contain"
            />

            {/* CTA Button - positioned at bottom */}
            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={handleCTAClick}
                className="w-full bg-success hover:bg-success/90 text-success-foreground font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-success/40 transition-all duration-200 hover:scale-[1.02] uppercase tracking-wide animate-pulse-slow"
              >
                <ShoppingBag className="w-5 h-5" />
                Garantir Minha Oferta
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
