import { Truck, Percent, RefreshCw } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-topbar-bg text-topbar-text py-2 px-4">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium">
        <Truck className="w-4 h-4" />
        <span>Frete Grátis</span>
        <span className="mx-2">•</span>
        <Percent className="w-4 h-4" />
        <span>10% no PIX</span>
        <span className="mx-2 hidden sm:inline">•</span>
        <RefreshCw className="w-4 h-4 hidden sm:inline" />
        <span className="hidden sm:inline">Troca Garantida</span>
      </div>
    </div>
  );
};

export default TopBar;
