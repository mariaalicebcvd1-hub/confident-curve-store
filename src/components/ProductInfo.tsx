import React from "react";
import { Star, Truck, ShieldCheck, CreditCard, Zap, Check, Minus, Plus, ShoppingCart, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorKey, colorFirstImageIndex } from "./ProductGallery";
import tabelaMedidas from "@/assets/tabela-medidas.avif";

const colors: { name: string; value: string; key: ColorKey }[] = [
  { name: "Preto", value: "#1a1a1a", key: "preto" },
  { name: "Bege", value: "#d4b896", key: "bege" },
  { name: "Rose", value: "#e8b4b8", key: "rose" },
  { name: "Kit Misto", value: "mixed", key: "misto" },
];

const sizes = ["P", "M", "G", "GG", "XG"];

const benefits = [
  "Bumbum empinado em segundos (sem cirurgia!)",
  "Esconde a pochete instantaneamente",
  "Tecido invisível - ZERO marcas na roupa",
  "Tão confortável que você esquece que está usando",
  "Pode usar o dia inteiro sem apertar",
];

interface ProductInfoProps {
  selectedColor: ColorKey;
  onColorChange: (color: ColorKey) => void;
}

const ProductInfo = ({ selectedColor, onColorChange }: ProductInfoProps) => {
  const selectedColorData = colors.find(c => c.key === selectedColor);
  const [selectedSize, setSelectedSize] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    window.open("https://pay.caminhodasaude.com/nWrxGWAr01X3654", "_blank");
  };

  return (
    <div className="space-y-5 px-1 sm:px-0">
      {/* Title & Rating */}
      <div className="text-center sm:text-left">
        <p className="text-xs sm:text-sm text-primary font-semibold mb-1 uppercase tracking-wide">⚡ Oferta Especial de Lançamento</p>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
          Calcinha Empina Bumbum - <span className="text-primary">Pague 1 e Leve 3!</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2">O segredo das influenciadoras para um bumbum perfeito em qualquer roupa</p>
        
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-3">
          <div className="flex items-center gap-1 review-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            ))}
          </div>
          <span className="font-semibold text-sm sm:text-base">4.9</span>
          <span className="text-muted-foreground text-sm">(2.847+ clientes satisfeitas)</span>
          <span className="text-success font-medium text-sm">• Últimas unidades!</span>
        </div>
      </div>

      {/* Price */}
      <div className="bg-gradient-hero rounded-xl p-4 sm:p-5 space-y-2 border-2 border-primary/20">
        <p className="text-xs text-destructive font-bold animate-pulse">🔥 PROMOÇÃO ACABA EM BREVE - 70% OFF</p>
        <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-2 sm:gap-3">
          <span className="price-old text-base sm:text-lg">R$ 289,99</span>
          <span className="price-new text-2xl sm:text-3xl">R$ 87,00</span>
          <span className="badge-discount text-xs">-70% OFF</span>
        </div>
        
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">ou <strong className="text-foreground">12x</strong> de <strong className="text-foreground">R$ 8,74</strong> sem juros</span>
        </div>
        
        <div className="flex items-center justify-center sm:justify-start gap-2 text-success font-bold text-sm sm:text-base bg-success/10 py-2 px-3 rounded-lg">
          <Zap className="w-4 h-4" />
          <span>PIX COM 10% EXTRA = R$ 78,30 (só hoje!)</span>
        </div>
      </div>

      {/* Color Selection */}
      <div id="product-options">
        <p className="font-semibold mb-3 text-center sm:text-left">Cor: <span className="text-primary">{selectedColorData?.name}</span></p>
        <div className="flex justify-center sm:justify-start gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorChange(color.key)}
              className={`relative rounded-lg overflow-hidden transition-all duration-200 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center ${
                selectedColor === color.key
                  ? "ring-2 ring-primary ring-offset-2 scale-105"
                  : "hover:scale-105 border-2 border-border"
              }`}
              style={{
                background: color.value === "mixed" 
                  ? "linear-gradient(135deg, #1a1a1a 33%, #d4b896 33%, #d4b896 66%, #e8b4b8 66%)" 
                  : color.value
              }}
            >
              {selectedColor === color.key && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white drop-shadow-md" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <p className="font-semibold mb-3 text-center sm:text-left">Tamanho: <span className="text-primary">{sizes[selectedSize]}</span></p>
        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
          {sizes.map((size, index) => (
            <button
              key={size}
              onClick={() => setSelectedSize(index)}
              className={`size-option ${selectedSize === index ? "selected" : ""}`}
            >
              {size}
            </button>
          ))}
        </div>
        
        {/* Size Guide */}
        <div className="mt-4 bg-secondary/50 rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Ruler className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold">Tabela de Medidas</p>
          </div>
          <img 
            src={tabelaMedidas} 
            alt="Tabela de medidas - Guia de tamanhos" 
            className="w-full rounded-lg"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {/* Quantity */}
      <div>
        <p className="font-semibold mb-3 text-center sm:text-left">Quantidade:</p>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="flex items-center border-2 border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2.5 hover:bg-secondary transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-5 py-2.5 font-semibold min-w-[60px] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2.5 hover:bg-secondary transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            🎁 Você levará <strong className="text-success">{quantity * 3} calcinhas</strong> pelo preço de 1!
          </span>
        </div>
      </div>

      {/* Guarantee Badge */}
      <div className="bg-success/5 border border-success/20 rounded-xl p-4 text-center">
        <p className="text-sm font-semibold text-success">✅ GARANTIA TOTAL DE 30 DIAS</p>
        <p className="text-xs text-muted-foreground mt-1">Não gostou? Devolvemos 100% do seu dinheiro. Sem perguntas.</p>
      </div>

      {/* Benefits */}
      <div className="bg-secondary rounded-xl p-4 space-y-2">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-success flex-shrink-0" />
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      {/* Add to Cart Button */}
      <div className="space-y-2">
        <Button
          onClick={handleAddToCart}
          variant="success"
          size="xl"
          className="w-full text-sm sm:text-base animate-pulse"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          QUERO MEU KIT COM 70% OFF
        </Button>
        <p className="text-xs text-center text-muted-foreground">🔒 Compra 100% segura • Entrega garantida</p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="badge-trust flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-trust flex-shrink-0" />
          <span>Frete Grátis</span>
        </div>
        <div className="badge-trust flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-trust flex-shrink-0" />
          <span>Compra Segura</span>
        </div>
        <div className="badge-trust flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-trust flex-shrink-0" />
          <span>Envio Imediato</span>
        </div>
        <div className="badge-trust flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-trust flex-shrink-0" />
          <span>Parcelamos em 12x</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
