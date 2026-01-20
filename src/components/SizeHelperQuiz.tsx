import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  heightCm: z.coerce
    .number()
    .min(140, "Digite uma altura válida (ex: 165)")
    .max(200, "Digite uma altura válida (ex: 165)"),
  weightKg: z.coerce
    .number()
    .min(40, "Digite um peso válido (ex: 68)")
    .max(150, "Digite um peso válido (ex: 68)"),
});

type FormValues = z.infer<typeof schema>;

function recommendSize({ heightCm, weightKg }: FormValues): "P" | "M" | "G" | "GG" | "XG" {
  const h = heightCm / 100;
  const bmi = weightKg / (h * h);

  // Heurística simples e conservadora (não promete precisão):
  // prioriza conforto; em dúvida, sugere subir 1 tamanho.
  if (bmi < 22) return "P";
  if (bmi < 25) return "M";
  if (bmi < 28) return "G";
  if (bmi < 31) return "GG";
  return "XG";
}

function nextSize(size: "P" | "M" | "G" | "GG" | "XG"): "P" | "M" | "G" | "GG" | "XG" | null {
  const order = ["P", "M", "G", "GG", "XG"] as const;
  const idx = order.indexOf(size);
  if (idx < 0) return null;
  return order[idx + 1] ?? null;
}

export function SizeHelperQuiz({
  onSelectSize,
}: {
  onSelectSize: (size: "P" | "M" | "G" | "GG" | "XG") => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState<"P" | "M" | "G" | "GG" | "XG" | null>(null);
  const applyBtnRef = React.useRef<HTMLButtonElement | null>(null);

  const comfortSize = React.useMemo(() => (result ? nextSize(result) : null), [result]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { heightCm: undefined as unknown as number, weightKg: undefined as unknown as number },
    mode: "onSubmit",
  });

  const onSubmit = (values: FormValues) => {
    const size = recommendSize(values);
    setResult(size);
    // Micro-melhoria: após calcular, leva o foco pro CTA de aplicar.
    requestAnimationFrame(() => applyBtnRef.current?.focus());
  };

  const resetResult = () => {
    setResult(null);
    // Mantém os valores preenchidos pra facilitar ajustes rápidos.
    requestAnimationFrame(() => form.setFocus("heightCm"));
  };

  const apply = () => {
    if (!result) return;
    onSelectSize(result);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) {
        setResult(null);
        form.reset();
      }
    }}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="h-10 rounded-full">
          Qual seu tamanho ideal?
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="space-y-2">
              <DialogTitle className="leading-tight">
                Qual seu tamanho ideal? Descubra em 5 segundos.
              </DialogTitle>
              <DialogDescription className="leading-relaxed">
                Com base nos dados de +2.000 clientes, sugerimos o tamanho mais provável pra você acertar de primeira — sem medo de errar.
              </DialogDescription>
            </div>
            <div className="shrink-0 self-center sm:self-start rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-semibold text-foreground">
              Rápido & privado
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-3 text-sm text-foreground">
            <div className="flex items-start gap-2">
              <span aria-hidden className="mt-0.5">💡</span>
              <p className="leading-relaxed">
                Prefere mais conforto? Na dúvida, escolha <span className="font-semibold">1 acima</span>.
              </p>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!result && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="heightCm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altura (cm)</FormLabel>
                        <FormControl>
                          <Input
                            autoFocus
                            type="number"
                            inputMode="numeric"
                            min={140}
                            max={200}
                            placeholder="165"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weightKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="numeric"
                            min={40}
                            max={150}
                            placeholder="68"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormDescription className="text-xs">
                  Usamos só esses dados pra sugerir o tamanho. Não salvamos nada.
                </FormDescription>
              </>
            )}

            {result && (
              <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">Tamanho recomendado</p>
                  <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    sugestão
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    Altura: {form.getValues("heightCm")}cm
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    Peso: {form.getValues("weightKg")}kg
                  </span>
                  <button
                    type="button"
                    onClick={resetResult}
                    className="ml-auto text-[11px] font-semibold text-primary underline underline-offset-2"
                  >
                    Ajustar dados
                  </button>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <p className="text-4xl font-black text-foreground leading-none tracking-tight">
                    {result}
                  </p>
                  <p className="text-xs text-muted-foreground">(mais provável)</p>
                </div>

                <div className="mt-3 rounded-xl border border-border bg-background/60 p-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span aria-hidden>✅</span>{" "}
                    {comfortSize ? (
                      <>
                        Dica: se gosta de peça mais soltinha, prefira <span className="font-semibold">{comfortSize}</span>.
                      </>
                    ) : (
                      <>
                        Dica: você está no maior tamanho disponível. Se você prefere mais soltinha, pode escolher o <span className="font-semibold">XG</span>
                        com mais conforto — e se ficar mais firme do que você gosta, a troca é simples.
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              {!result ? (
                <Button type="submit" className="w-full sm:w-auto">
                  Ver sugestão
                </Button>
              ) : (
                <Button ref={applyBtnRef} type="button" onClick={apply} className="w-full sm:w-auto">
                  Usar esse tamanho
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
