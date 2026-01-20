import { Shield, Truck, CreditCard, RefreshCw, Lock, Clock, HeadphonesIcon, Building2 } from "lucide-react";
import { CHECKOUT_URL } from "@/lib/constants";

const guarantees = [
  {
    icon: RefreshCw,
    title: "30 Dias pra Trocar",
    description: "Não serviu ou não gostou? A gente troca ou devolve o dinheiro. Sem burocracia.",
    highlight: true,
  },
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Entrega pra todo Brasil. Você acompanha pelo rastreio.",
    highlight: false,
  },
  {
    icon: Lock,
    title: "Pagamento Seguro",
    description: "Site protegido com criptografia. Seus dados estão seguros.",
    highlight: false,
  },
  {
    icon: Building2,
    title: "Loja Real com CNPJ",
    description: "Empresa brasileira registrada. Nota fiscal em todos os pedidos.",
    highlight: false,
  },
];

const paymentMethods = [
  { name: "PIX", discount: "10% OFF" },
  { name: "Cartão de Crédito" },
  { name: "Boleto" },
];

const TrustSection = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
            Compre com Tranquilidade
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Entendemos que comprar online pode gerar dúvidas. Por isso, garantimos uma experiência segura do início ao fim.
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {guarantees.map((item, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-5 text-center transition-all duration-300 ${
                item.highlight
                  ? "bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/30"
                  : "bg-card border border-border"
              }`}
            >
              {item.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-success text-white px-3 py-1 rounded-full text-xs font-bold">
                  GARANTIA
                </div>
              )}
              <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
                item.highlight ? "bg-success/20" : "bg-primary/10"
              }`}>
                <item.icon className={`w-7 h-7 ${item.highlight ? "text-success" : "text-primary"}`} />
              </div>
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Details Row */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-10">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Envio em até 24h</p>
                <p className="text-sm text-muted-foreground">Pedidos confirmados até 14h</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <HeadphonesIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Atendimento via WhatsApp</p>
                <p className="text-sm text-muted-foreground">Tire dúvidas antes e depois da compra</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Parcele em até 12x</p>
                <p className="text-sm text-muted-foreground">Sem juros no cartão</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Formas de pagamento</p>
          <div className="flex flex-wrap justify-center gap-3">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  method.discount
                    ? "bg-success/10 text-success border border-success/30"
                    : "bg-secondary text-foreground"
                }`}
              >
                {method.name}
                {method.discount && (
                  <span className="ml-1.5 text-xs font-bold">({method.discount})</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Security Info */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="w-5 h-5 text-success" />
              <span className="text-sm">Site seguro (SSL)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-success" />
              <span className="text-sm">Dados protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
