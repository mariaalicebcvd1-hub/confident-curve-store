import React from "react";
import { Star, Truck, ShieldCheck, CreditCard, Zap, Check, Minus, Plus, ShoppingCart, Ruler, MessageCircle } from "lucide-react";
import { ColorKey } from "./ProductGallery";
import tabelaMedidas from "@/assets/tabela-medidas.avif";
import { trackEventDirect } from "@/hooks/useTracking";
import { trackInitiateCheckout } from "@/lib/facebook-pixel";
import { buildCheckoutUrl } from "@/lib/checkout";

const colors: { name: string; value: string; key: ColorKey }[] = [
  { name: "Preto", value: "#1a1a1a", key: "preto" },
  { name: "Bege", value: "#d4b896", key: "bege" },
  { name: "Rose", value: "#e8b4b8", key: "rose" },
  { name: "Kit Misto", value: "mixed", key: "misto" },
];

const sizes = ["P", "M", "G", "GG", "XG"];

const benefits = [
  "Levanta o bumbum sem parecer artificial",
  "Suaviza a barriga sem comprimir a respiração",
  "Costura fina + tecido liso = não marca na roupa",
  "Tecido que respira — dá pra usar o dia inteiro",
  "Se não servir, troca grátis. A gente resolve.",
];

interface ProductInfoProps {
  selectedColor: ColorKey;
  onColorChange: (color: ColorKey) => void;
}

const ProductInfo = ({ selectedColor, onColorChange }: ProductInfoProps) => {
  const selectedColorData = colors.find((c) => c.key === selectedColor);
  const [selectedSize, setSelectedSize] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    trackInitiateCheckout({
      content_name: 'Calcinha Modeladora - Kit 3 unidades',
      value: 87.90 * quantity,
      num_items: 3 * quantity,
    });

    trackEventDirect(
      'checkout_start',
      'Primary CTA → Checkout',
      'primary_cta',
      { size: sizes[selectedSize], qty: quantity, color: selectedColor }
    );

    const checkoutUrl = buildCheckoutUrl({
      cor: selectedColor,
      tamanho: sizes[selectedSize],
    });

    window.open(checkoutUrl, "_blank");
  };

  return (
    <div className="space-y-5 px-1 sm:px-0">
      {/* Title & Rating */}
      <div className="text-center sm:text-left">
        <p className="text-xs sm:text-sm text-primary font-semibold mb-1 uppercase tracking-wide">Pague 1, Leve 3</p>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
          Bumbum Empinado, Barriga Suave, <span className="text-primary">Sem Apertar</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2">Calcinha modeladora que você usa o dia todo e esquece que tá vestindo — mas o espelho lembra.</p>
        
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-3">
          <div className="flex items-center gap-1 review-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            ))}
          </div>
          <span className="font-semibold text-sm sm:text-base">4.8</span>
          <span className="text-muted-foreground text-sm">(2.341 avaliações reais)</span>
        </div>
      </div>

      {/* Price */}
      <div className="bg-gradient-hero rounded-xl p-4 sm:p-5 space-y-2 border border-border">
        <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-2 sm:gap-3">
          <span className="price-old text-base sm:text-lg">R$ 179,90</span>
          <span className="price-new text-2xl sm:text-3xl">R$ 87,90</span>
          <span className="badge-discount text-xs">Kit com 3</span>
        </div>
        
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">ou <strong className="text-foreground">12x</strong> de <strong className="text-foreground">R$ 8,74</strong> sem juros</span>
        </div>
        
        <div className="flex items-center justify-center sm:justify-start gap-2 text-success font-semibold text-sm bg-success/10 py-2 px-3 rounded-lg">
          <Zap className="w-4 h-4" />
          <span>PIX com 10% de desconto: R$ 79,11</span>
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
            <span className="text-xs text-muted-foreground ml-auto">Dica: na dúvida, peça um número maior</span>
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
            Você recebe <strong className="text-success">{quantity * 3} calcinhas</strong> (kit com 3)
          </span>
        </div>
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

      {/* Guarantee Badge */}
      <div className="bg-success/5 border border-success/20 rounded-xl p-4">
        <p className="text-sm font-semibold text-success text-center">30 dias pra testar sem risco</p>
        <p className="text-xs text-muted-foreground mt-1 text-center">Não gostou? Tamanho errado? A gente troca ou devolve o dinheiro. Sem burocracia.</p>
      </div>

      {/* Add to Cart Button */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="btn-compra w-full text-sm sm:text-base inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-success text-white hover:bg-success/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 uppercase tracking-wide h-12 sm:h-14 px-4 sm:px-8"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          QUERO MEU KIT COM 3
        </button>
        <p className="text-xs text-center text-muted-foreground">Pagamento 100% seguro • Frete grátis pra todo Brasil • Rastreio por WhatsApp</p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="badge-trust flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-trust flex-shrink-0" />
          <span>Frete Grátis Brasil</span>
        </div>
        <div className="badge-trust flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-trust flex-shrink-0" />
          <span>Loja com CNPJ</span>
        </div>
        <div className="badge-trust flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-trust flex-shrink-0" />
          <span>Suporte WhatsApp</span>
        </div>
        <div className="badge-trust flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-trust flex-shrink-0" />
          <span>12x sem juros</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
