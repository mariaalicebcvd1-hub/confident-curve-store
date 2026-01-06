import { Truck, Percent, Gift } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-topbar-bg text-topbar-text py-2 px-2 sm:px-4">
      <div className="container mx-auto flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium flex-wrap">
        <div className="flex items-center gap-1 whitespace-nowrap">
          <Truck className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>FRETE GRÁTIS</span>
        </div>
        <span className="mx-1 sm:mx-2">•</span>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <Percent className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>10% OFF no PIX</span>
        </div>
        <span className="mx-1 sm:mx-2 hidden sm:inline">•</span>
        <div className="hidden sm:flex items-center gap-1 whitespace-nowrap">
          <Gift className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>Envio Imediato</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
