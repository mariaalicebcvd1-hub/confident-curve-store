import { Truck, Percent, Gift } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-topbar-bg text-topbar-text py-2 px-4">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium">
        <Truck className="w-4 h-4" />
        <span>FRETE GRÁTIS</span>
        <span className="mx-2">•</span>
        <Percent className="w-4 h-4" />
        <span>10% OFF no PIX</span>
        <span className="mx-2 hidden sm:inline">•</span>
        <Gift className="w-4 h-4 hidden sm:inline" />
        <span className="hidden sm:inline">Envio Imediato</span>
      </div>
    </div>
  );
};

export default TopBar;
