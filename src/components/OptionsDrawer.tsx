import * as React from "react";

import type { ColorKey } from "@/components/ProductGallery";
import { SizeHelperQuiz } from "@/components/SizeHelperQuiz";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import tabelaMedidas from "@/assets/tabela-medidas.avif";
import { Ruler, ShieldCheck, ShoppingBag } from "lucide-react";

const sizeOptions = [
  { value: "P", label: "P" },
  { value: "M", label: "M" },
  { value: "G", label: "G" },
  { value: "GG", label: "GG" },
  { value: "XG", label: "XG" },
] as const;

const colorOptions = [
  { key: "preto" as const, label: "Preto", swatch: "#1a1a1a" },
  { key: "bege" as const, label: "Bege", swatch: "#d4b896" },
  { key: "rose" as const, label: "Rose", swatch: "#e8b4b8" },
  {
    key: "misto" as const,
    label: "Kit Misto",
    swatch: "linear-gradient(135deg, #1a1a1a 33%, #d4b896 33%, #d4b896 66%, #e8b4b8 66%)",
  },
] as const;

const colorLabelMap: Record<ColorKey, string> = {
  preto: "Preto",
  bege: "Bege",
  rose: "Rose",
  misto: "Kit Misto",
};

export function OptionsDrawer({
  open,
  onOpenChange,
  selectedColor,
  onSelectColor,
  selectedSizeIndex,
  onSelectSizeIndex,
  showSizeHint,
  setShowSizeHint,
  onProceed,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedColor: ColorKey;
  onSelectColor: (color: ColorKey) => void;
  selectedSizeIndex: number;
  onSelectSizeIndex: (idx: number) => void;
  showSizeHint: boolean;
  setShowSizeHint: (v: boolean) => void;
  onProceed: () => void;
}) {
  const selectedSize = selectedSizeIndex >= 0 ? sizeOptions[selectedSizeIndex]?.value : "";
  const isSelectionMissing = selectedSizeIndex < 0;
  const [showSizeTable, setShowSizeTable] = React.useState(true);

  const selectedColorLabel = colorLabelMap[selectedColor] ?? selectedColor;

  const handleSelectSizeValue = React.useCallback(
    (size: (typeof sizeOptions)[number]["value"]) => {
      const idx = sizeOptions.findIndex((s) => s.value === size);
      if (idx >= 0) onSelectSizeIndex(idx);
      setShowSizeHint(false);
    },
    [onSelectSizeIndex, setShowSizeHint]
  );

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setShowSizeHint(false);
          setShowSizeTable(true);
        }
      }}
    >
      <DrawerContent className="mx-auto w-full max-w-lg max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Escolha cor e tamanho</DrawerTitle>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-semibold text-foreground">
              Cor: <span className="ml-1 text-primary font-bold">{selectedColorLabel}</span>
            </span>
            <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-semibold text-foreground">
              Tam: <span className="ml-1 text-primary font-bold">{selectedSize || "Escolha"}</span>
            </span>
          </div>
        </DrawerHeader>

         <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-4 text-center">
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Cor</p>
            <ToggleGroup
              type="single"
              value={selectedColor}
              onValueChange={(v) => {
                if (!v) return;
                onSelectColor(v as ColorKey);
              }}
              className="flex flex-wrap justify-center gap-2"
            >
              {colorOptions.map((c) => (
                <ToggleGroupItem
                  key={c.key}
                  value={c.key}
                  aria-label={`Cor ${c.label}`}
                  className="h-11 px-4 rounded-full border border-border bg-background shadow-sm text-foreground hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-foreground"
                >
                  <span
                    className="h-4 w-4 rounded-full border border-border ring-1 ring-border"
                    style={{
                      background: c.swatch.includes("gradient") ? undefined : c.swatch,
                      ...(c.swatch.includes("gradient") ? { backgroundImage: c.swatch } : {}),
                    }}
                  />
                  <span className="ml-2 text-sm font-bold">{c.label}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-sm font-semibold text-foreground">Tamanho</p>
              <div className="flex items-center gap-2">
                <SizeHelperQuiz onSelectSize={(size) => handleSelectSizeValue(size)} />
              </div>
            </div>

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
                handleSelectSizeValue(v as (typeof sizeOptions)[number]["value"]);
              }}
              className="flex flex-wrap justify-center gap-2"
            >
              {sizeOptions.map((s) => (
                <ToggleGroupItem
                  key={s.value}
                  value={s.value}
                  aria-label={`Tamanho ${s.label}`}
                  className="h-11 w-14 rounded-xl border border-border bg-background shadow-sm text-foreground hover:text-foreground text-sm font-extrabold data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-foreground"
                >
                  {s.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            {showSizeTable && (
              <div className="mt-3 rounded-xl border border-border bg-secondary/50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Tabela de Medidas</p>
                  <span className="text-xs text-muted-foreground ml-auto">
                    Na dúvida, peça 1 tamanho maior
                  </span>
                </div>
                <img
                  src={tabelaMedidas}
                  alt="Tabela de medidas - Guia de tamanhos"
                  className="w-full rounded-lg"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </div>
        </div>

        <DrawerFooter>
          <button
            type="button"
            onClick={(e) => {
              if (isSelectionMissing) {
                e.preventDefault();
                setShowSizeHint(true);
                return;
              }
              onProceed();
            }}
            className="btn-compra w-full inline-flex items-center justify-center gap-2 rounded-md bg-success text-success-foreground font-extrabold uppercase tracking-wide h-12 px-4"
          >
            <ShoppingBag className="w-5 h-5" />
            Levar 3 por R$ 69,90
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Frete e troca grátis • Compra segura</span>
          </div>

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
  );
}
