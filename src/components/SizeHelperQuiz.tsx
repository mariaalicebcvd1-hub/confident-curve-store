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

export function SizeHelperQuiz({
  onSelectSize,
}: {
  onSelectSize: (size: "P" | "M" | "G" | "GG" | "XG") => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState<"P" | "M" | "G" | "GG" | "XG" | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { heightCm: undefined as unknown as number, weightKg: undefined as unknown as number },
    mode: "onSubmit",
  });

  const onSubmit = (values: FormValues) => {
    const size = recommendSize(values);
    setResult(size);
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
          Qual meu tamanho?
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Vamos te indicar o tamanho</DialogTitle>
          <DialogDescription>
            É uma ajuda rápida pra você acertar com mais confiança. Se você prefere mais confortável, na dúvida escolha 1 tamanho maior.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="heightCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura (cm)</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" placeholder="Ex: 165" {...field} />
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
                      <Input inputMode="numeric" placeholder="Ex: 68" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormDescription>
              A gente usa só esses dados pra sugerir o tamanho. Não salvamos nada.
            </FormDescription>

            {result && (
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <p className="text-sm text-muted-foreground">Tamanho mais provável:</p>
                <p className="text-2xl font-black text-foreground leading-tight">
                  {result}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Dica: se você não gosta de peça mais firme, escolha 1 tamanho acima.
                </p>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                Ver sugestão
              </Button>
              <Button type="button" onClick={apply} disabled={!result} className="w-full sm:w-auto">
                Usar esse tamanho
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
