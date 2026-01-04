import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, X } from "lucide-react";

const names = [
  "Maria", "Ana", "Juliana", "Fernanda", "Camila", "Patrícia",
  "Larissa", "Beatriz", "Amanda", "Gabriela", "Isabela", "Rafaela"
];

// Cidades por região para fallback
const regionCities: Record<string, Array<{ city: string; state: string }>> = {
  SP: [
    { city: "São Paulo", state: "SP" },
    { city: "Campinas", state: "SP" },
    { city: "Santos", state: "SP" },
    { city: "Ribeirão Preto", state: "SP" },
    { city: "Guarulhos", state: "SP" },
  ],
  RJ: [
    { city: "Rio de Janeiro", state: "RJ" },
    { city: "Niterói", state: "RJ" },
    { city: "Petrópolis", state: "RJ" },
    { city: "Duque de Caxias", state: "RJ" },
  ],
  MG: [
    { city: "Belo Horizonte", state: "MG" },
    { city: "Uberlândia", state: "MG" },
    { city: "Contagem", state: "MG" },
    { city: "Juiz de Fora", state: "MG" },
  ],
  PR: [
    { city: "Curitiba", state: "PR" },
    { city: "Londrina", state: "PR" },
    { city: "Maringá", state: "PR" },
  ],
  RS: [
    { city: "Porto Alegre", state: "RS" },
    { city: "Caxias do Sul", state: "RS" },
    { city: "Canoas", state: "RS" },
  ],
  SC: [
    { city: "Florianópolis", state: "SC" },
    { city: "Joinville", state: "SC" },
    { city: "Blumenau", state: "SC" },
  ],
  BA: [
    { city: "Salvador", state: "BA" },
    { city: "Feira de Santana", state: "BA" },
    { city: "Vitória da Conquista", state: "BA" },
  ],
  DEFAULT: [
    { city: "São Paulo", state: "SP" },
    { city: "Rio de Janeiro", state: "RJ" },
    { city: "Belo Horizonte", state: "MG" },
    { city: "Curitiba", state: "PR" },
    { city: "Porto Alegre", state: "RS" },
  ],
};

interface UserLocation {
  city: string;
  state: string;
}

const RecentPurchasePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCount, setShowCount] = useState(0);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [localCities, setLocalCities] = useState<Array<{ city: string; state: string }>>(regionCities.DEFAULT);
  const [currentPurchase, setCurrentPurchase] = useState<{ name: string; city: string; state: string; time: string } | null>(null);

  // Busca localização do usuário via IP
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.city && data.region_code) {
          const location = { city: data.city, state: data.region_code };
          setUserLocation(location);
          
          // Pega cidades da região do usuário ou fallback
          const regionKey = data.region_code as string;
          const cities = regionCities[regionKey] || regionCities.DEFAULT;
          
          // Adiciona a cidade do usuário se não estiver na lista
          const userCityExists = cities.some(c => c.city === data.city);
          if (!userCityExists) {
            setLocalCities([location, ...cities.slice(0, 4)]);
          } else {
            setLocalCities(cities);
          }
        }
      } catch {
        // Mantém cidades padrão em caso de erro
      }
    };
    fetchLocation();
  }, []);

  const getRandomPurchase = useCallback(() => {
    const name = names[Math.floor(Math.random() * names.length)];
    
    // Nas 2 primeiras notificações, prioriza cidade do usuário
    if (showCount < 2 && userLocation) {
      const times = ["agora mesmo", "1 min atrás"];
      return { 
        name, 
        city: userLocation.city, 
        state: userLocation.state, 
        time: times[showCount] 
      };
    }
    
    // Depois mostra cidades próximas
    const location = localCities[Math.floor(Math.random() * localCities.length)];
    const times = ["2 min atrás", "3 min atrás", "5 min atrás", "7 min atrás", "10 min atrás"];
    const time = times[Math.floor(Math.random() * times.length)];
    
    return { name, city: location.city, state: location.state, time };
  }, [showCount, userLocation, localCities]);

  useEffect(() => {
    // Não mostra mais após 12 notificações
    if (showCount >= 12) return;

    // Mostra o primeiro popup após 12 segundos
    const initialTimeout = setTimeout(() => {
      setCurrentPurchase(getRandomPurchase());
      setIsVisible(true);
      setShowCount(prev => prev + 1);
    }, 12000);

    return () => clearTimeout(initialTimeout);
  }, [getRandomPurchase, showCount]);

  useEffect(() => {
    if (!isVisible || showCount >= 12) return;

    // Esconde o popup após 5 segundos
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Prepara o próximo popup após 18 segundos (5s visível + 13s pausa)
    const nextTimeout = setTimeout(() => {
      if (showCount < 12) {
        setCurrentPurchase(getRandomPurchase());
        setIsVisible(true);
        setShowCount(prev => prev + 1);
      }
    }, 18000);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(nextTimeout);
    };
  }, [isVisible, showCount, getRandomPurchase]);

  const handleClose = () => {
    setIsVisible(false);
  };

  // Não renderiza se ainda não tem dados ou já mostrou todas
  if (!currentPurchase) return null;

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
            className="h-full bg-success rounded-full animate-[shrink_5s_linear]"
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default RecentPurchasePopup;
