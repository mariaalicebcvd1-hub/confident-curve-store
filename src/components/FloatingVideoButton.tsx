import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, X, ShoppingBag, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import videoSrc from "@/assets/video-produto.mp4";

const FloatingVideoButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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
      const video = modalVideoRef.current;
      video.currentTime = 0;
      setProgress(0);
      setCurrentTime(0);
      
      const playVideo = () => {
        video.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      };

      setTimeout(playVideo, 50);
    } else {
      setIsPlaying(false);
    }
  }, [isOpen]);

  // Update progress bar
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isOpen]);

  const togglePlayPause = useCallback(() => {
    const video = modalVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = modalVideoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = modalVideoRef.current;
    const progressBar = progressRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    video.currentTime = clickPosition * video.duration;
  }, []);

  const handleCTAClick = () => {
    setIsOpen(false);
    const sizeSection = document.querySelector('.size-option');
    if (sizeSection) {
      sizeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Video Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 z-40 group cursor-pointer transition-all duration-500 ${
          isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Assistir vídeo do produto"
      >
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
            {/* Video Element */}
            <video
              ref={modalVideoRef}
              src={videoSrc}
              muted={isMuted}
              loop
              playsInline
              autoPlay
              preload="auto"
              onClick={togglePlayPause}
              className="w-full h-full object-contain cursor-pointer"
            />

            {/* Play/Pause Overlay (shows when paused) */}
            {!isPlaying && (
              <div 
                onClick={togglePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
            )}

            {/* Custom Controls Bar */}
            <div className="absolute bottom-32 left-0 right-0 px-4">
              {/* Progress Bar */}
              <div 
                ref={progressRef}
                onClick={handleProgressClick}
                className="relative h-1.5 bg-white/30 rounded-full cursor-pointer group/progress mb-3"
              >
                <div 
                  className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlayPause}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    )}
                  </button>

                  {/* Mute Button */}
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>

                {/* Time Display */}
                <div className="text-white/80 text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={handleCTAClick}
                className="w-full bg-success hover:bg-success/90 text-success-foreground font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:scale-[1.02] uppercase tracking-wide text-sm"
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
