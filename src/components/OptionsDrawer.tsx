import * as React from "react";

import type { ColorKey } from "@/components/ProductGallery";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ShoppingBag } from "lucide-react";

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

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setShowSizeHint(false);
      }}
    >
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
                onSelectColor(v as ColorKey);
              }}
              className="flex flex-wrap justify-start gap-2"
            >
              {colorOptions.map((c) => (
                <ToggleGroupItem
                  key={c.key}
                  value={c.key}
                  aria-label={`Cor ${c.label}`}
                  className="h-11 px-4 rounded-full border border-border bg-background shadow-sm data-[state=on]:border-primary data-[state=on]:bg-primary/10"
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
                const idx = sizeOptions.findIndex((s) => s.value === v);
                if (idx >= 0) onSelectSizeIndex(idx);
                setShowSizeHint(false);
              }}
              className="flex flex-wrap justify-start gap-2"
            >
              {sizeOptions.map((s) => (
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
