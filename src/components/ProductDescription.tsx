import { Heart, Shirt, Shield, Leaf, Hand, CheckCircle } from "lucide-react";
import featureGif1 from "@/assets/feature-gif-1.webp";
import featureGif2 from "@/assets/feature-gif-2.webp";
import featureSilhueta from "@/assets/feature-silhueta.webp";
import featureFrescor from "@/assets/feature-frescor.jpg";
import featureCores from "@/assets/feature-cores.webp";
import featureConfiante from "@/assets/feature-confiante.webp";
import featureEspelho from "@/assets/feature-espelho.webp";
import featureDetalhe from "@/assets/feature-detalhe.webp";
import { CHECKOUT_URL } from "@/lib/constants";

const features = [
  {
    icon: Heart,
    title: "Empina o Bumbum de Verdade",
    description: "O corte traseiro foi desenhado pra erguer e sustentar. Não é enchimento, não é mágica — é o formato do tecido que abraça e levanta. O resultado você vê na hora que veste.",
    image: featureEspelho,
  },
  {
    icon: Shirt,
    title: "Segura a Barriga Sem Apertar",
    description: "O cós alto vai até a cintura e suaviza toda a região abdominal. Mas não é cinta — você respira, senta e trabalha normalmente. Zero desconforto.",
    image: featureGif2,
  },
  {
    icon: Shield,
    title: "Zero Marca na Roupa",
    description: "Costura fina + tecido liso = nada de marquinha no vestido justo ou na calça de alfaiataria. Invisível por baixo de qualquer roupa.",
    image: featureConfiante,
  },
  {
    icon: Leaf,
    title: "Tecido que Respira",
    description: "O material deixa a pele respirar o dia inteiro. Sem abafar, sem esquentar. Ideal pra quem trabalha fora ou fica muito tempo sentada.",
    image: featureFrescor,
  },
  {
    icon: Hand,
    title: "Conforto Real",
    description: "Não rola, não sobe, não aperta. É o tipo de calcinha que você esquece que tá usando — mas continua modelando.",
    image: featureDetalhe,
  },
  {
    icon: CheckCircle,
    title: "Silhueta Mais Definida",
    description: "Cintura mais marcada, bumbum mais arredondado, barriga mais plana. É um efeito sutil, mas que faz diferença no caimento de qualquer roupa.",
    image: featureSilhueta,
  },
];

const ProductDescription = () => {
  return (
    <section id="product-description" className="py-12 lg:py-16 bg-gradient-to-b from-secondary/50 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 leading-tight">
            Por Que Funciona (Sem Ser Milagre)?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Não é enchimento, não é compressão exagerada. O segredo está no <strong className="text-foreground">corte estratégico</strong> que abraça e levanta, e no <strong className="text-foreground">tecido de alta elasticidade</strong> que modela sem sufocar. Resultado real no espelho, conforto real no dia a dia.
          </p>
        </div>

        {/* Main Feature Highlight */}
        <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border mb-12 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">O que diferencia das outras</span>
              <h3 className="text-xl lg:text-2xl font-bold text-foreground">
                Cós Alto que Modela Sem Sufocar
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                O cós vai até embaixo do sutiã e suaviza toda a região da barriga. 
                <strong className="text-foreground"> Não é cinta desconfortável</strong> — você consegue sentar, trabalhar e fazer suas atividades normalmente. 
                E diferente de cintas caras, essa não enrola, não desce e não marca.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-secondary text-foreground px-3 py-1.5 rounded-full text-sm">
                  Barriga mais lisa
                </span>
                <span className="bg-secondary text-foreground px-3 py-1.5 rounded-full text-sm">
                  Não enrola
                </span>
                <span className="bg-secondary text-foreground px-3 py-1.5 rounded-full text-sm">
                  Usa o dia todo
                </span>
              </div>
            </div>
            <div className="relative">
              <img
                src={featureGif1}
                alt="Calcinha modeladora com cós alto"
                className="w-full max-w-lg mx-auto rounded-xl shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>

        {/* Cores disponíveis */}
        <div className="mb-12 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">3 Cores que Combinam com Tudo</h3>
          <p className="text-sm text-muted-foreground mb-6">Preto, bege e rosé — ou escolha o kit misto pra ter as três</p>
          <img
            src={featureCores}
            alt="Cores disponíveis: preto, bege e rosé"
            className="w-full max-w-lg mx-auto rounded-xl shadow-sm"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground leading-tight pt-1">
                  {feature.title}
                </h3>
              </div>
              
              <div className="relative mb-4 rounded-lg overflow-hidden bg-secondary/30">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center bg-card rounded-2xl p-8 border border-border">
          <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">
            3 Calcinhas por R$ 69,90
          </h3>
          <p className="text-muted-foreground mb-2 max-w-2xl mx-auto">
            Cada uma sai por <strong className="text-foreground">R$ 23,30</strong> — menos que metade do preço de modeladoras comuns.
          </p>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl mx-auto">
            E você tem <strong className="text-foreground">30 dias pra testar</strong>. Não gostou? Troca ou devolução sem burocracia.
          </p>
          <button 
            onClick={() => {
              const productOptions = document.getElementById('product-options');
              if (productOptions) {
                productOptions.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="btn-compra inline-flex items-center gap-2 bg-success text-white px-6 py-3 rounded-lg font-bold hover:bg-success/90 transition-colors"
          >
            Escolher Minha Cor e Tamanho
          </button>
          <p className="text-xs text-muted-foreground mt-3">Frete grátis • Loja com CNPJ • Rastreio por WhatsApp</p>
        </div>
      </div>
    </section>
  );
};

export default ProductDescription;
