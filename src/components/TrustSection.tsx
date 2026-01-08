import { Shield, Truck, CreditCard, RefreshCw, Lock, Award, Clock, HeadphonesIcon } from "lucide-react";
import { CHECKOUT_URL } from "@/lib/constants";

const guarantees = [
  {
    icon: Shield,
    title: "Garantia de 30 Dias",
    description: "Não gostou? Devolvemos 100% do seu dinheiro. Sem perguntas!",
    highlight: true,
  },
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Entrega gratuita para todo o Brasil. Sem taxa escondida!",
    highlight: false,
  },
  {
    icon: Lock,
    title: "Compra 100% Segura",
    description: "Seus dados protegidos com criptografia de ponta.",
    highlight: false,
  },
  {
    icon: RefreshCw,
    title: "Troca Facilitada",
    description: "Tamanho errado? Trocamos sem custo adicional.",
    highlight: false,
  },
];

const paymentMethods = [
  { name: "PIX", discount: "10% OFF" },
  { name: "Visa" },
  { name: "Mastercard" },
  { name: "Elo" },
  { name: "Amex" },
  { name: "Boleto" },
];

const TrustSection = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <a 
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-bold mb-4 hover:bg-success/20 transition-colors cursor-pointer"
          >
            <Award className="w-4 h-4" />
            COMPRA 100% GARANTIDA
          </a>
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
            Sua Satisfação é Nossa Prioridade
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mais de <strong className="text-foreground">47.000 clientes satisfeitas</strong> em todo o Brasil. Compre com total segurança!
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {guarantees.map((item, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105 ${
                item.highlight
                  ? "bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/30 shadow-lg"
                  : "bg-card border border-border shadow-soft hover:shadow-md"
              }`}
            >
              {item.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-bold">
                  GARANTIA TOTAL
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

        {/* Trust Badges Row */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft mb-10">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Envio em 24h</p>
                <p className="text-sm text-muted-foreground">Pedidos confirmados até 14h</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <HeadphonesIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Suporte WhatsApp</p>
                <p className="text-sm text-muted-foreground">Atendimento humanizado</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Até 12x Sem Juros</p>
                <p className="text-sm text-muted-foreground">Em todos os cartões</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Formas de Pagamento Aceitas</p>
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
          
          {/* Security Seals */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="w-5 h-5 text-success" />
              <span className="text-sm">SSL Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-success" />
              <span className="text-sm">Site Protegido</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="w-5 h-5 text-success" />
              <span className="text-sm">Loja Verificada</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;