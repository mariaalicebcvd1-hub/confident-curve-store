import React from "react";
import { Star, Truck, ShieldCheck, CreditCard, Check, Minus, Plus, ShoppingCart, Ruler, MessageCircle, RotateCcw } from "lucide-react";
import { ColorKey } from "./ProductGallery";
import tabelaMedidas from "@/assets/tabela-medidas.avif";
import { trackEventDirect } from "@/hooks/useTracking";
import { trackInitiateCheckout } from "@/lib/facebook-pixel";
import { buildCheckoutUrl } from "@/lib/checkout";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SizeHelperQuiz } from "@/components/SizeHelperQuiz";

const colors: { name: string; value: string; key: ColorKey }[] = [
  { name: "Preto", value: "#1a1a1a", key: "preto" },
  { name: "Bege", value: "#d4b896", key: "bege" },
  { name: "Rose", value: "#e8b4b8", key: "rose" },
  { name: "Kit Misto", value: "mixed", key: "misto" },
];

const sizes = ["P", "M", "G", "GG", "XG"];

const benefits = [
  "Levanta o bumbum — corte estratégico, não enchimento",
  "Suaviza a barriga sem apertar a respiração",
  "Costura fina + tecido liso = invisível na roupa",
  "Tecido que respira — usa o dia todo sem abafar",
  "Não serviu? Troca grátis, sem burocracia",
];

interface ProductInfoProps {
  selectedColor: ColorKey;
  onColorChange: (color: ColorKey) => void;
  selectedSizeIndex: number;
  onSizeChange: (sizeIndex: number) => void;
  onOpenOptionsDrawer?: (showSizeHint: boolean) => void;
}

const ProductInfo = ({ selectedColor, onColorChange, selectedSizeIndex, onSizeChange, onOpenOptionsDrawer }: ProductInfoProps) => {
  const selectedColorData = colors.find((c) => c.key === selectedColor);
  const [quantity, setQuantity] = React.useState(1);

  const selectedSizeLabel = selectedSizeIndex >= 0 ? (sizes[selectedSizeIndex] as (typeof sizes)[number]) : undefined;

  const handleSelectSizeLabel = (size: (typeof sizes)[number]) => {
    const idx = sizes.indexOf(size);
    if (idx >= 0) onSizeChange(idx);
  };

  const handleAddToCart = () => {
    if (selectedSizeIndex < 0) {
      if (onOpenOptionsDrawer) {
        onOpenOptionsDrawer(true);
        return;
      }

      document.getElementById("product-options")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    trackInitiateCheckout({
      content_name: 'Calcinha Modeladora - Kit 3 unidades',
      value: 69.90 * quantity,
      num_items: 3 * quantity,
    });

    trackEventDirect(
      'checkout_start',
      'Primary CTA → Checkout',
      'primary_cta',
      { size: sizes[selectedSizeIndex], qty: quantity, color: selectedColor }
    );

    const checkoutUrl = buildCheckoutUrl({
      cor: selectedColor,
      tamanho: sizes[selectedSizeIndex],
    });

    window.open(checkoutUrl, "_blank");
  };

  return (
    <div className="space-y-5 px-1 sm:px-0">
      {/* Title & Rating */}
      <div className="text-center sm:text-left">
        
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
          Barriga mais lisa.
          <br />
          Bumbum mais alto.
          <br />
          <span className="text-primary">Sem marcar — sem sufocar.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          <strong className="text-foreground">Modelagem de verdade</strong> (corte + tecido): você veste, se olha no espelho e já sente a diferença.
        </p>
        
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2">
          <div className="inline-flex items-center justify-center sm:justify-start gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1.5 w-fit mx-auto sm:mx-0">
            <Star className="w-4 h-4 fill-current text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">4.8</span>
            <span className="text-sm text-muted-foreground">— +2.000 brasileiras já testaram</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div
        id="price-card"
        className="bg-gradient-hero rounded-2xl p-4 sm:p-6 space-y-4 border border-border shadow-elegant"
      >
        {/* Topo do card */}
        <div className="text-center sm:text-left space-y-2">
          <p className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-background/60 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary">
            ⚡ Direto da fábrica (sem revenda no meio)
          </p>
          <p className="text-sm sm:text-base font-semibold text-foreground">
            Kit com 3 (pra usar, trocar e não ficar na mão)
          </p>
        </div>

        {/* Preço */}
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            De <span className="line-through">R$ 179,90</span>
          </p>
          <p className="text-2xl sm:text-3xl font-black text-foreground leading-tight">
            R$ <span className="text-success">69,90</span>
            <span className="text-base sm:text-lg font-extrabold text-foreground"> no Pix</span>
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
            Sem “história” no preço: é <strong className="text-foreground">custo de fábrica</strong> + envio + suporte. Simples.
          </p>

          <div className="pt-1">
            <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 text-sm font-semibold text-foreground">
              Dá <span className="mx-1 text-success font-black">R$ 23</span> por peça
            </span>
          </div>
        </div>

        {/* Garantias & confiança */}
        <ul className="grid gap-2 sm:grid-cols-3">
          <li className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm">
            <RotateCcw className="w-4 h-4 text-success flex-shrink-0" />
            <span>
              <strong className="text-foreground">Troca grátis</strong> (sem burocracia)
            </span>
          </li>
          <li className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm">
            <Truck className="w-4 h-4 text-success flex-shrink-0" />
            <span>
              <strong className="text-foreground">Rastreio</strong> em todos os pedidos
            </span>
          </li>
          <li className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm">
            <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
            <span>
              <strong className="text-foreground">30 dias</strong> pra testar sem risco
            </span>
          </li>
        </ul>

        {/* Cartão */}
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Ou <strong className="text-foreground">R$ 77,70</strong> no cartão (12x de{" "}
            <strong className="text-foreground">R$ 6,47</strong> sem juros)
          </span>
        </div>

        <p className="text-xs font-semibold text-foreground/80 text-center sm:text-left">
          Frete grátis • Loja com CNPJ • Rastreio por WhatsApp
        </p>
      </div>

      {/* Options (make it impossible to miss) */}
      <section
        id="product-options"
        aria-label="Escolha sua cor e tamanho"
        className="rounded-2xl border border-border bg-secondary/30 p-4 sm:p-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
          <div>
            <p className="text-sm font-extrabold text-foreground">Escolha aqui 👇</p>
            <p className="text-xs text-muted-foreground">
              Pra comprar sem erro, selecione <strong className="text-foreground">cor</strong> e <strong className="text-foreground">tamanho</strong>.
            </p>
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <p className="font-semibold mb-2 text-center sm:text-left">
            Cor: <span className="text-primary">{selectedColorData?.name}</span>
          </p>

          <ToggleGroup
            type="single"
            value={selectedColor}
            onValueChange={(v) => {
              if (!v) return;
              onColorChange(v as ColorKey);
            }}
            className="flex flex-wrap justify-center sm:justify-start gap-2"
          >
            {colors.map((color) => (
              <ToggleGroupItem
                key={color.key}
                value={color.key}
                aria-label={`Cor ${color.name}`}
                className="h-11 px-4 rounded-full border border-border bg-background shadow-sm hover:bg-secondary data-[state=on]:border-primary data-[state=on]:bg-primary/10"
              >
                <span
                  className="h-4 w-4 rounded-full border border-border ring-1 ring-border"
                  style={{
                    background:
                      color.value === "mixed"
                        ? "linear-gradient(135deg, #1a1a1a 33%, #d4b896 33%, #d4b896 66%, #e8b4b8 66%)"
                        : color.value,
                  }}
                />
                <span className="ml-2 text-sm font-bold">{color.name}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="h-4" />

        {/* Size Selection */}
        <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <p className="font-semibold text-center sm:text-left">
            Tamanho:{" "}
            <span className="text-primary">{selectedSizeLabel ?? "Escolha"}</span>
          </p>
          <div className="flex justify-center sm:justify-end">
            <SizeHelperQuiz onSelectSize={handleSelectSizeLabel} />
          </div>
        </div>

        <ToggleGroup
          type="single"
          value={selectedSizeLabel}
          onValueChange={(v) => {
            if (!v) return;
            handleSelectSizeLabel(v as (typeof sizes)[number]);
          }}
          className="flex flex-wrap justify-center sm:justify-start gap-2"
        >
          {sizes.map((size) => (
            <ToggleGroupItem
              key={size}
              value={size}
              aria-label={`Tamanho ${size}`}
              className="h-11 w-14 rounded-xl border border-border bg-background shadow-sm hover:bg-secondary text-sm font-extrabold data-[state=on]:border-primary data-[state=on]:bg-primary/10"
            >
              {size}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {selectedSizeIndex < 0 && (
          <p className="mt-2 text-xs text-muted-foreground text-center sm:text-left">
            Escolha um tamanho pra gente liberar a compra com segurança.
          </p>
        )}

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
      </section>

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
            LEVAR 3 POR <span className="font-black">R$ 69,90</span> AGORA
        </button>
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
