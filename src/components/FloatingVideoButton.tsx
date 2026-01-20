import { useState, useRef, useEffect, useCallback } from "react";
import { Play, ShoppingBag, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import videoProduto from "@/assets/video-produto.mp4";
import { trackEventDirect } from "@/hooks/useTracking";

// Lista de vídeos do Stories
const storyVideos = [
  { id: 1, src: videoProduto, label: "Produto" },
  // (mantendo apenas o primeiro vídeo)
];

const FloatingVideoButton = ({
  onOpenOptionsDrawer,
}: {
  onOpenOptionsDrawer?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState<number[]>(storyVideos.map(() => 0));
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);

  // Preload do primeiro vídeo para o botão flutuante
  useEffect(() => {
    const video = previewVideoRef.current;
    
    const fallbackTimeout = setTimeout(() => {
      if (!isReady) {
        setIsReady(true);
        if (video) video.play().catch(() => {});
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

  // Navegar para o próximo story
  const goToNextStory = useCallback(() => {
    if (currentStoryIndex < storyVideos.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(prev => {
        const newProgress = [...prev];
        newProgress[currentStoryIndex] = 100;
        return newProgress;
      });
    } else {
      // Fecha ao terminar o último story
      setIsOpen(false);
    }
  }, [currentStoryIndex]);

  // Navegar para o story anterior
  const goToPrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(prev => {
        const newProgress = [...prev];
        newProgress[currentStoryIndex] = 0;
        newProgress[currentStoryIndex - 1] = 0;
        return newProgress;
      });
    }
  }, [currentStoryIndex]);

  // Gerenciar progresso e reprodução do vídeo
  useEffect(() => {
    if (!isOpen || !modalVideoRef.current) return;

    const video = modalVideoRef.current;
    video.currentTime = 0;
    
    // Reset progress do story atual
    setProgress(prev => {
      const newProgress = [...prev];
      newProgress[currentStoryIndex] = 0;
      return newProgress;
    });

    // Tentar reproduzir com som
    const playVideo = () => {
      video.muted = isMuted;
      video.play().catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
    };

    setTimeout(playVideo, 50);

    // Atualizar progresso baseado no tempo do vídeo
    const handleTimeUpdate = () => {
      if (video.duration && !isPaused) {
        const percent = (video.currentTime / video.duration) * 100;
        setProgress(prev => {
          const newProgress = [...prev];
          newProgress[currentStoryIndex] = percent;
          return newProgress;
        });
      }
    };

    const handleEnded = () => {
      goToNextStory();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isOpen, currentStoryIndex, goToNextStory, isMuted, isPaused]);

  // Reset ao abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentStoryIndex(0);
      setProgress(storyVideos.map(() => 0));
      setIsPaused(false);
    }
  }, [isOpen]);

  // Pausar/resumir vídeo quando isPaused muda
  useEffect(() => {
    if (!modalVideoRef.current || !isOpen) return;
    
    if (isPaused) {
      modalVideoRef.current.pause();
    } else {
      modalVideoRef.current.play().catch(() => {});
    }
  }, [isPaused, isOpen]);

  // Touch handlers para navegação estilo Instagram
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    
    // Long press para pausar
    holdTimeout.current = setTimeout(() => {
      setIsPaused(true);
    }, 200);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
    }
    
    if (isPaused) {
      setIsPaused(false);
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX.current;
    const diffY = Math.abs(touchEndY - touchStartY.current);
    
    // Só considera swipe se o movimento horizontal for maior que vertical
    if (diffY > 50) return;
    
    const screenWidth = window.innerWidth;
    const tapPosition = touchStartX.current / screenWidth;
    
    // Se foi um toque rápido (não swipe)
    if (Math.abs(diffX) < 30) {
      if (tapPosition < 0.3) {
        goToPrevStory();
      } else if (tapPosition > 0.7) {
        goToNextStory();
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPosition = clickX / width;
    
    if (clickPosition < 0.3) {
      goToPrevStory();
    } else if (clickPosition > 0.7) {
      goToNextStory();
    }
  };

  const handleCTAClick = () => {
    setIsOpen(false);
    if (onOpenOptionsDrawer) {
      onOpenOptionsDrawer();
      return;
    }

    const sizeSection = document.querySelector('.size-option');
    if (sizeSection) {
      sizeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isMuted;
    }
  };

  const currentVideo = storyVideos[currentStoryIndex];

  return (
    <>
      {/* Floating Video Button */}
      <button
        onClick={() => {
          trackEventDirect('video_view', 'Opened stories video', 'floating_video_button');
          setIsOpen(true);
        }}
        className={`fixed bottom-24 right-4 z-50 group cursor-pointer transition-all duration-500 ${
          isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Assistir vídeos do produto"
      >
        {/* Stories-style ring with gradient */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary via-destructive to-accent animate-spin-slow" style={{ animationDuration: '3s' }} />
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-background shadow-lg">
            <video
              ref={previewVideoRef}
              src={storyVideos[0].src}
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
        </div>
      </button>

      {/* Stories Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[min(90vw,400px)] w-full p-0 bg-black border-none overflow-hidden rounded-xl">
          <DialogTitle className="sr-only">Vídeos do Produto</DialogTitle>
          <div 
            className="relative aspect-[9/16] w-full select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleClick}
          >
            {/* Progress Bars */}
            <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
              {storyVideos.map((_, index) => (
                <div 
                  key={index}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-100"
                    style={{ 
                      width: index < currentStoryIndex 
                        ? '100%' 
                        : index === currentStoryIndex 
                          ? `${progress[index]}%` 
                          : '0%'
                    }}
                  />
                </div>
              ))}
            </div>


            {/* Video */}
            <video
              ref={modalVideoRef}
              src={currentVideo.src}
              loop={false}
              playsInline
              autoPlay
              muted={isMuted}
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />

            {/* Paused Overlay */}
            {isPaused && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-2 h-8 bg-white rounded" />
                    <div className="w-2 h-8 bg-white rounded" />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation hints */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevStory(); }}
                className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                disabled={currentStoryIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); goToNextStory(); }}
                className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="absolute top-6 right-12 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* CTA Button */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <button
                onClick={handleCTAClick}
                className="w-full bg-success hover:bg-success/90 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-success/40 transition-all duration-200 hover:scale-[1.02] uppercase tracking-wide"
              >
                <ShoppingBag className="w-5 h-5" />
                Ver Produto
              </button>
            </div>

            {/* Close removed (mantém a experiência limpa) */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingVideoButton;
