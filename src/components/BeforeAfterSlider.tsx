import { useState, useRef } from "react";
import { Sparkles } from "lucide-react";

const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            RESULTADO REAL
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Veja a <span className="text-primary">Transformação</span>
          </h2>
          <p className="text-muted-foreground">
            Arraste o slider para comparar o antes e depois. Resultados visíveis desde o primeiro uso!
          </p>
        </div>

        {/* Slider Container */}
        <div className="max-w-2xl mx-auto">
          <div
            ref={containerRef}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={handleClick}
          >
            {/* After Image (Background) */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=750&fit=crop"
                alt="Depois - Com calcinha modeladora"
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute bottom-4 right-4 bg-success text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                DEPOIS
              </div>
            </div>

            {/* Before Image (Foreground with clip) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=750&fit=crop"
                alt="Antes - Sem calcinha modeladora"
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute bottom-4 left-4 bg-muted-foreground text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                ANTES
              </div>
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
              {/* Slider Handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-primary">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-4 bg-primary rounded-full" />
                  <div className="w-0.5 h-4 bg-primary rounded-full" />
                </div>
              </div>
            </div>

            {/* Instruction Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              ← Arraste para comparar →
            </div>
          </div>

          {/* Benefits below slider */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-secondary rounded-xl">
              <div className="text-2xl font-bold text-primary mb-1">+40%</div>
              <div className="text-xs text-muted-foreground">Elevação do Bumbum</div>
            </div>
            <div className="text-center p-4 bg-secondary rounded-xl">
              <div className="text-2xl font-bold text-primary mb-1">-2cm</div>
              <div className="text-xs text-muted-foreground">Na Cintura</div>
            </div>
            <div className="text-center p-4 bg-secondary rounded-xl">
              <div className="text-2xl font-bold text-primary mb-1">100%</div>
              <div className="text-xs text-muted-foreground">Conforto</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;
