import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { trackEventDirect } from "@/hooks/useTracking";
import { trackInitiateCheckout } from "@/lib/facebook-pixel";
import { buildCheckoutUrl } from "@/lib/checkout";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ColorKey } from "@/components/ProductGallery";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const sizes = [
  { value: "P", label: "P", description: "36-38" },
  { value: "M", label: "M", description: "38-40" },
  { value: "G", label: "G", description: "42-44" },
  { value: "GG", label: "GG", description: "44-46" },
  { value: "XG", label: "XG", description: "48-50" },
];

const FloatingCTA = ({
  selectedColor,
  onSelectColor,
  selectedSizeIndex,
  onSelectSizeIndex,
}: {
  selectedColor: ColorKey;
  onSelectColor: (color: ColorKey) => void;
  selectedSizeIndex: number;
  onSelectSizeIndex: (idx: number) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSizeHint, setShowSizeHint] = useState(false);

  const selectedSize = useMemo(() => {
    if (selectedSizeIndex < 0) return "";
    return sizes[selectedSizeIndex]?.value ?? "";
  }, [selectedSizeIndex]);

  const isSelectionMissing = selectedSizeIndex < 0;

  const colorLabel = useMemo(() => {
    const map: Record<ColorKey, string> = {
      preto: "Preto",
      bege: "Bege",
      rose: "Rose",
      misto: "Kit Misto",
    };
    return map[selectedColor] ?? selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    const handleScroll = () => {
      // Mostra o sticky assim que o card de preço sair totalmente da tela (scroll mínimo após a dobra)
      const priceCard = document.getElementById("price-card");

      if (!priceCard || isDismissed) {
        setIsVisible(false);
        return;
      }

      const rect = priceCard.getBoundingClientRect();
      const isPastPriceCard = rect.bottom <= 0; // card ficou acima do topo da viewport
      setIsVisible(isPastPriceCard);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleClick = (e: React.MouseEvent) => {
    if (isSelectionMissing) {
      e.preventDefault();
      // Padrão e-commerce: mantém o CTA, mas abre o seletor imediatamente.
      setShowSizeHint(true);
      setDrawerOpen(true);
      return;
    }

    trackInitiateCheckout({
      content_name: 'Calcinha Modeladora - Kit 3 unidades',
      value: 69.90,
      num_items: 3,
    });

    trackEventDirect('checkout_start', 'Floating CTA → Checkout', 'floating_cta', {
      size: selectedSize,
      color: selectedColor,
    });

    const checkoutUrl = buildCheckoutUrl({
      cor: selectedColor,
      tamanho: selectedSize,
    });

    window.open(checkoutUrl, "_blank");
  };

  const handleSizeSelect = (size: string) => {
    const idx = sizes.findIndex((s) => s.value === size);
    if (idx >= 0) onSelectSizeIndex(idx);
    setShowSizeHint(false);
  };

  const handleColorSelect = (color: ColorKey) => {
    onSelectColor(color);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-xl p-3 sm:p-4">
      <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-3 max-w-full px-2 sm:px-4">
        <div className="hidden sm:block flex-shrink-0">
          <p className="font-bold text-foreground text-sm">Kit com 3 Calcinhas</p>
          <p className="text-xs text-muted-foreground">
            <span className="line-through">R$ 179,90</span>{" "}
            <span className="text-primary font-bold">por R$ 69,90 no PIX</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-semibold text-foreground">
              Cor: <span className="ml-1 text-primary font-bold">{colorLabel}</span>
            </span>
            <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-semibold text-foreground">
              Tam: <span className="ml-1 text-primary font-bold">{selectedSize || "Escolha"}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-0">
          <button
            type="button"
            onClick={handleClick}
            className="btn-compra flex-1 sm:flex-initial text-sm sm:text-base h-12 sm:h-12 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-extrabold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-success text-success-foreground hover:bg-success/90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 uppercase tracking-wide px-4"
          >
            <ShoppingBag className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Levar 3 por R$ 69,90</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Drawer: cor + tamanho juntos (padrão e-commerce grande) */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Escolha cor e tamanho</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-2 space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Cor</p>
              <ToggleGroup
                type="single"
                value={selectedColor}
                onValueChange={(v) => {
                  if (!v) return;
                  handleColorSelect(v as ColorKey);
                }}
                className="flex flex-wrap justify-start gap-2"
              >
                {(
                  [
                    { key: "preto" as const, label: "Preto", swatch: "#1a1a1a" },
                    { key: "bege" as const, label: "Bege", swatch: "#d4b896" },
                    { key: "rose" as const, label: "Rose", swatch: "#e8b4b8" },
                    {
                      key: "misto" as const,
                      label: "Kit Misto",
                      swatch: "linear-gradient(135deg, #1a1a1a 33%, #d4b896 33%, #d4b896 66%, #e8b4b8 66%)",
                    },
                  ]
                ).map((c) => (
                  <ToggleGroupItem
                    key={c.key}
                    value={c.key}
                    aria-label={`Cor ${c.label}`}
                    className="h-11 px-4 rounded-full border border-border bg-background shadow-sm data-[state=on]:border-primary data-[state=on]:bg-primary/10"
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-border ring-1 ring-border"
                      style={{ background: c.swatch.includes("gradient") ? undefined : c.swatch, ...(c.swatch.includes("gradient") ? { backgroundImage: c.swatch } : {}) }}
                    />
                    <span className="ml-2 text-sm font-bold">{c.label}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Tamanho</p>

              {showSizeHint && isSelectionMissing && (
                <div className="mb-2 rounded-xl border border-border bg-secondary/50 p-3 text-sm text-foreground animate-fade-in">
                  Falta escolher o tamanho pra finalizar com segurança
                </div>
              )}

              <ToggleGroup
                type="single"
                value={selectedSize || ""}
                onValueChange={(v) => {
                  if (!v) return;
                  handleSizeSelect(v);
                }}
                className="flex flex-wrap justify-start gap-2"
              >
                {sizes.map((s) => (
                  <ToggleGroupItem
                    key={s.value}
                    value={s.value}
                    aria-label={`Tamanho ${s.label}`}
                    className="h-11 w-14 rounded-xl border border-border bg-background shadow-sm text-sm font-extrabold data-[state=on]:border-primary data-[state=on]:bg-primary/10"
                  >
                    {s.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <DrawerFooter>
            <button
              type="button"
              onClick={(e) => {
                // Se ainda faltar tamanho, mantém no drawer com highlight.
                if (isSelectionMissing) {
                  e.preventDefault();
                  setShowSizeHint(true);
                  return;
                }
                setDrawerOpen(false);
              }}
              className="btn-compra w-full inline-flex items-center justify-center gap-2 rounded-md bg-success text-success-foreground font-extrabold uppercase tracking-wide h-12 px-4"
            >
              <ShoppingBag className="w-5 h-5" />
              Levar 3 por R$ 69,90
            </button>
            <DrawerClose asChild>
              <button
                type="button"
                className="w-full h-11 rounded-md border border-border bg-background text-foreground font-semibold"
                onClick={() => setShowSizeHint(false)}
              >
                Voltar
              </button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FloatingCTA;
