import { useState, useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";

const recentPurchases = [
  { name: "Maria", city: "São Paulo", state: "SP", time: "agora mesmo" },
  { name: "Ana", city: "Rio de Janeiro", state: "RJ", time: "2 min atrás" },
  { name: "Juliana", city: "Belo Horizonte", state: "MG", time: "5 min atrás" },
  { name: "Fernanda", city: "Curitiba", state: "PR", time: "8 min atrás" },
  { name: "Camila", city: "Salvador", state: "BA", time: "12 min atrás" },
  { name: "Patrícia", city: "Fortaleza", state: "CE", time: "15 min atrás" },
  { name: "Larissa", city: "Recife", state: "PE", time: "18 min atrás" },
  { name: "Beatriz", city: "Porto Alegre", state: "RS", time: "22 min atrás" },
  { name: "Amanda", city: "Brasília", state: "DF", time: "25 min atrás" },
  { name: "Gabriela", city: "Goiânia", state: "GO", time: "28 min atrás" },
  { name: "Isabela", city: "Manaus", state: "AM", time: "32 min atrás" },
  { name: "Rafaela", city: "Florianópolis", state: "SC", time: "35 min atrás" },
  { name: "Thais", city: "Vitória", state: "ES", time: "38 min atrás" },
  { name: "Priscila", city: "Natal", state: "RN", time: "42 min atrás" },
  { name: "Vanessa", city: "Campo Grande", state: "MS", time: "45 min atrás" },
];

const RecentPurchasePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(recentPurchases[0]);
  const [purchaseIndex, setPurchaseIndex] = useState(0);

  useEffect(() => {
    // Mostra o primeiro popup após 8 segundos (delay maior para não competir com LCP)
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 8000);

    return () => clearTimeout(initialTimeout);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Esconde o popup após 4 segundos
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    // Prepara o próximo popup após 6 segundos (4s visível + 2s pausa)
    const nextTimeout = setTimeout(() => {
      const nextIndex = (purchaseIndex + 1) % recentPurchases.length;
      setPurchaseIndex(nextIndex);
      setCurrentPurchase(recentPurchases[nextIndex]);
      setIsVisible(true);
    }, 12000);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(nextTimeout);
    };
  }, [isVisible, purchaseIndex]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div
      className={`fixed bottom-20 left-4 z-40 max-w-[280px] sm:max-w-xs transition-all duration-500 ${
        isVisible
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0"
      }`}
    >
      <div className="bg-card rounded-xl shadow-xl border border-border p-3 sm:p-4 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 hover:bg-secondary rounded-full transition-colors"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>

        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-success/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-xs sm:text-sm font-semibold text-foreground leading-tight">
              {currentPurchase.name} de {currentPurchase.city}/{currentPurchase.state}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              acabou de comprar o <span className="text-primary font-medium">Kit 3 Calcinhas</span>
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-1">
              {currentPurchase.time}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-success rounded-full animate-[shrink_4s_linear]"
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default RecentPurchasePopup;