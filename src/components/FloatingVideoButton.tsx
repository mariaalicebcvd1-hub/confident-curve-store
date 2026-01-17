import { useState, useRef, useEffect } from "react";
import { Play, X, ShoppingBag, Volume2, VolumeX, Pause } from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import videoSrc from "@/assets/video-stories.mp4";
import { trackEventDirect } from "@/hooks/useTracking";

const FloatingVideoButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  // Wait for video to be ready before showing the button
  useEffect(() => {
    const video = previewVideoRef.current;
    
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

  // Handle modal video when opening
  useEffect(() => {
    if (isOpen && modalVideoRef.current) {
      const video = modalVideoRef.current;
      video.currentTime = 0;
      setProgress(0);
      setIsPaused(false);
      
      // Track progress for stories bar
      const handleTimeUpdate = () => {
        const progressPercent = (video.currentTime / video.duration) * 100;
        setProgress(progressPercent);
      };
      
      video.addEventListener('timeupdate', handleTimeUpdate);
      
      // Try to play with sound
      const playVideo = () => {
        video.muted = false;
        setIsMuted(false);
        video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      };

      setTimeout(playVideo, 50);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [isOpen]);

  const handleCTAClick = () => {
    setIsOpen(false);
    const sizeSection = document.querySelector('.size-option');
    if (sizeSection) {
      sizeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlayPause = () => {
    if (modalVideoRef.current) {
      if (isPaused) {
        modalVideoRef.current.play();
      } else {
        modalVideoRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  return (
    <>
      {/* Floating Video Button - Instagram Stories Style */}
      <button
        onClick={() => {
          trackEventDirect('video_view', 'Opened product video', 'floating_video_button');
          setIsOpen(true);
        }}
        className={`fixed bottom-24 right-4 z-50 group cursor-pointer transition-all duration-500 ${
          isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Assistir vídeo do produto"
      >
        {/* Stories Ring Animation */}
        <div className="relative">
          {/* Gradient ring like Instagram stories */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full animate-spin-slow" style={{ animationDuration: '3s' }} />
          
          {/* Video Preview Circle */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-[3px] border-white">
            <video
              ref={previewVideoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover scale-125"
            />
            
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
              <Play className="w-5 h-5 text-white fill-white drop-shadow-lg" />
            </div>
          </div>
        </div>
      </button>

      {/* Instagram Stories Style Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[min(90vw,420px)] w-full p-0 bg-black border-none overflow-hidden rounded-2xl">
          <DialogTitle className="sr-only">Vídeo do Produto</DialogTitle>
          <div className="relative aspect-[9/16] w-full bg-black">
            {/* Stories Progress Bar */}
            <div className="absolute top-3 left-3 right-3 z-20">
              <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Header with profile info - Stories style */}
            <div className="absolute top-6 left-3 right-3 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-black overflow-hidden">
                    <video
                      src={videoSrc}
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold">Legging Modeladora</span>
                  <span className="text-white/60 text-xs">Agora</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Mute/Unmute Button */}
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                
                {/* Close Button */}
                <DialogClose className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors">
                  <X className="w-4 h-4" />
                </DialogClose>
              </div>
            </div>

            {/* Video */}
            <video
              ref={modalVideoRef}
              src={videoSrc}
              loop
              playsInline
              autoPlay
              preload="auto"
              onClick={togglePlayPause}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            />

            {/* Pause Indicator */}
            {isPaused && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                  <Pause className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            )}

            {/* Gradient overlay for bottom content */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

            {/* CTA Button - Stories swipe up style */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <button
                onClick={handleCTAClick}
                className="w-full bg-white hover:bg-white/90 text-black font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:scale-[1.02] text-sm uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4" />
                Ver Produto
              </button>
              
              {/* Swipe up indicator */}
              <div className="flex flex-col items-center mt-2 animate-bounce">
                <div className="w-8 h-1 bg-white/50 rounded-full" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  );
};

export default FloatingVideoButton;
