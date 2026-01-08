import { ChevronLeft, ChevronRight } from "lucide-react";
import { CHECKOUT_URL } from "@/lib/constants";

// Todas as imagens do produto
const allImages = [
  { src: "https://eliteshop.com.br/cdn/shop/files/A100gservingofblackberriesprovides32percentthedailyvalueofmanganese._500x.jpg?v=1695350053", color: "misto" },
  { src: "https://eliteshop.com.br/cdn/shop/files/Designsemnome-2023-09-18T153806.773_1_500x.jpg?v=1695350053", color: "rose" },
  { src: "https://eliteshop.com.br/cdn/shop/files/Designsemnome-2023-09-18T153752.484_1_500x.jpg?v=1695350053", color: "bege" },
  { src: "https://eliteshop.com.br/cdn/shop/files/Designsemnome-2023-09-18T153739.278_1_500x.jpg?v=1695350053", color: "rose" },
  { src: "https://eliteshop.com.br/cdn/shop/products/Designsemnome-2023-09-18T153847.902_500x.jpg?v=1695350053", color: "preto" },
  { src: "https://eliteshop.com.br/cdn/shop/products/Designsemnome-2023-09-18T153834.463_1_500x.jpg?v=1695350053", color: "preto" },
];

// Índice da primeira imagem de cada cor
export const colorFirstImageIndex: Record<ColorKey, number> = {
  misto: 0,
  rose: 1,
  bege: 2,
  preto: 4,
};

export type ColorKey = "preto" | "bege" | "rose" | "misto";

interface ProductGalleryProps {
  selectedImageIndex: number;
  onImageChange: (index: number) => void;
}

const ProductGallery = ({ selectedImageIndex, onImageChange }: ProductGalleryProps) => {
  const nextImage = () => {
    onImageChange((selectedImageIndex + 1) % allImages.length);
  };

  const prevImage = () => {
    onImageChange((selectedImageIndex - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      {/* Main Image - Primeiro no mobile */}
      <div className="relative w-full aspect-square lg:flex-1 lg:aspect-auto lg:h-[500px] rounded-xl overflow-hidden bg-secondary order-1 lg:order-2">
        <img
          src={allImages[selectedImageIndex].src}
          alt="Calcinha Empina Bumbum"
          className="w-full h-full object-contain"
          loading={selectedImageIndex === 0 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={selectedImageIndex === 0 ? "high" : "auto"}
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Discount Badge */}
        <a 
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 left-3 badge-discount text-xs sm:text-sm hover:opacity-80 transition-opacity cursor-pointer z-10"
        >
          -70% OFF
        </a>
        
        {/* Offer Badge - Only show on images that are not the first */}
        {selectedImageIndex !== 0 && (
          <a 
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 bg-success text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-lg hover:bg-success/90 transition-colors cursor-pointer z-10"
          >
            LEVE 3 PAGUE 1
          </a>
        )}
      </div>

      {/* Thumbnails - Abaixo no mobile, centralizado */}
      <div className="flex justify-center lg:justify-start lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto scrollbar-hide order-2 lg:order-1 pb-1">
        {allImages.map((img, index) => (
          <button
            key={index}
            onClick={() => onImageChange(index)}
            className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedImageIndex === index
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
          >
            <img
              src={img.src}
              alt={`Calcinha Empina Bumbum - Imagem ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
