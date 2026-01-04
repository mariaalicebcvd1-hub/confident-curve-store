import { useState, useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";

const names = [
  "Maria", "Ana", "Juliana", "Fernanda", "Camila", "Patrícia",
  "Larissa", "Beatriz", "Amanda", "Gabriela", "Isabela", "Rafaela"
];

const cities = [
  { city: "São Paulo", state: "SP" },
  { city: "Rio de Janeiro", state: "RJ" },
  { city: "Belo Horizonte", state: "MG" },
  { city: "Curitiba", state: "PR" },
  { city: "Salvador", state: "BA" },
  { city: "Fortaleza", state: "CE" },
  { city: "Recife", state: "PE" },
  { city: "Porto Alegre", state: "RS" },
  { city: "Brasília", state: "DF" },
  { city: "Goiânia", state: "GO" },
  { city: "Manaus", state: "AM" },
  { city: "Florianópolis", state: "SC" },
  { city: "Vitória", state: "ES" },
  { city: "Natal", state: "RN" },
  { city: "Campo Grande", state: "MS" },
  { city: "João Pessoa", state: "PB" },
  { city: "Maceió", state: "AL" },
  { city: "Teresina", state: "PI" },
  { city: "Cuiabá", state: "MT" },
  { city: "Aracaju", state: "SE" },
  { city: "Campinas", state: "SP" },
  { city: "Santos", state: "SP" },
  { city: "Ribeirão Preto", state: "SP" },
  { city: "Uberlândia", state: "MG" },
  { city: "Londrina", state: "PR" },
  { city: "Joinville", state: "SC" },
  { city: "Niterói", state: "RJ" },
  { city: "Belém", state: "PA" },
];

const times = [
  "agora mesmo",
  "1 min atrás",
  "2 min atrás",
  "3 min atrás",
  "5 min atrás",
  "8 min atrás",
  "10 min atrás",
  "12 min atrás",
  "15 min atrás",
];

const getRandomPurchase = () => {
  const name = names[Math.floor(Math.random() * names.length)];
  const location = cities[Math.floor(Math.random() * cities.length)];
  const time = times[Math.floor(Math.random() * times.length)];
  return { name, city: location.city, state: location.state, time };
};

const RecentPurchasePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(getRandomPurchase);

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

    // Prepara o próximo popup após 12 segundos (4s visível + 8s pausa)
    const nextTimeout = setTimeout(() => {
      setCurrentPurchase(getRandomPurchase());
      setIsVisible(true);
    }, 12000);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(nextTimeout);
    };
  }, [isVisible]);

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