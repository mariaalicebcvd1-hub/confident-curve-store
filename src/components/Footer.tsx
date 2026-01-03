import { ShieldCheck, Lock, Truck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-white py-8">
      <div className="container mx-auto px-4">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="w-5 h-5 text-success" />
            <span>Compra 100% Segura</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Lock className="w-5 h-5 text-success" />
            <span>Site Protegido</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Truck className="w-5 h-5 text-success" />
            <span>Frete Grátis Brasil</span>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">
            Bella<span className="text-primary">Shape</span>
          </h3>
        </div>

        {/* Company Info */}
        <div className="text-center text-sm text-white/60 space-y-2">
          <p>© 2026 BellaShape. Todos os direitos reservados.</p>
          <p className="font-medium text-white/80">M3 DESENVOLVIMENTO DE NEGOCIOS Ltda</p>
          <p>CNPJ: 57.628.238/0001-83</p>
          <p className="text-xs leading-relaxed max-w-md mx-auto">
            SEDE - Rua Miguel Matte, 687, Sala 1801 Anexo A, Pioneiros - Balneário Camboriú/SC - CEP: 88331-030
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
