import { Truck, Percent, RefreshCw } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-topbar-bg text-topbar-text py-2 px-4">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium">
        <Truck className="w-4 h-4" />
        <span className="font-bold">Frete Grátis</span>
        <span className="mx-2">•</span>
        <Percent className="w-4 h-4" />
        <span>
          <span className="font-bold">10% no PIX</span>
        </span>
        <span className="mx-2 hidden sm:inline">•</span>
        <RefreshCw className="w-4 h-4 hidden sm:inline" />
        <span className="hidden sm:inline">
          <span className="font-bold">Troca Garantida</span>
        </span>
      </div>
    </div>
  );
};

export default TopBar;
