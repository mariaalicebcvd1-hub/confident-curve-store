import { Sparkles, Heart, Wind, Shield, Shirt, Leaf, Hand, Zap } from "lucide-react";
import featureGif1 from "@/assets/feature-gif-1.webp";
import featureGif2 from "@/assets/feature-gif-2.webp";
import featureSilhueta from "@/assets/feature-silhueta.webp";
import featureFrescor from "@/assets/feature-frescor.jpg";
import featureCores from "@/assets/feature-cores.webp";
import featureConfiante from "@/assets/feature-confiante.webp";
import featureEspelho from "@/assets/feature-espelho.webp";
import featureDetalhe from "@/assets/feature-detalhe.webp";

const features = [
  {
    icon: Sparkles,
    title: "Bumbum na Lua em 3 Segundos",
    description: "Esqueça exercícios dolorosos. Nossa calcinha foi desenvolvida por especialistas para levantar e empinar seu bumbum instantaneamente. Vista e sinta a diferença na hora!",
    image: featureEspelho,
    isGif: false
  },
  {
    icon: Heart,
    title: "Barriga Chapada Sem Sofrimento",
    description: "Aquela pochete que te incomoda? Suavemente comprimida e disfarçada. Você vai parecer 3kg mais magra em qualquer roupa. Resultado imediato, conforto o dia todo.",
    image: featureGif2,
    isGif: true
  },
  {
    icon: Shirt,
    title: "100% Invisível Sob Qualquer Roupa",
    description: "Vestido justo, legging, calça branca... pode usar sem medo! Costuras ultra-finas e tecido que desaparece. Ninguém vai saber seu segredo.",
    image: featureConfiante,
    isGif: false
  },
  {
    icon: Shield,
    title: "Silhueta dos Sonhos Sem Academia",
    description: "Curvas perfeitas, cintura marcada, bumbum empinado. O corpo que você sempre quis, pronto pra usar. Transformação instantânea toda vez que você veste.",
    image: featureSilhueta,
    isGif: false
  },
  {
    icon: Leaf,
    title: "Fresca e Protegida o Dia Inteiro",
    description: "Tecnologia antibacteriana que elimina odores e mantém você fresca por 12+ horas. Pode usar no trabalho, festa ou academia. Confiança total!",
    image: featureFrescor,
    isGif: false
  },
  {
    icon: Hand,
    title: "Tão Macia Que Você Esquece",
    description: "Tecido premium que abraça seu corpo como uma segunda pele. Zero aperto, zero incômodo. Clientes relatam: 'É como não usar nada, mas com resultado de cinema!'",
    image: featureDetalhe,
    isGif: false
  },
];

const ProductDescription = () => {
  return (
    <section id="product-description" className="py-12 lg:py-16 bg-gradient-to-b from-secondary/50 to-background">
      <div className="container mx-auto px-4">
        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <a 
            href="https://seguro.caminhodasaude.com/api/public/shopify?product=2586328866196&store=25863"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse hover:bg-destructive/20 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            MAIS DE 47.000 MULHERES JÁ TRANSFORMARAM SEUS CORPOS
          </a>
          
          <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
            O Segredo Para Ter <span className="text-primary">Bumbum Empinado</span> e <span className="text-primary">Barriga Chapada</span> em 3 Segundos
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Sem academia. Sem dieta. Sem cirurgia. Apenas vista nossa calcinha modeladora com <strong className="text-foreground">Tecnologia E-SLEEP</strong> e veja a transformação instantânea. <strong className="text-success">Resultado garantido ou seu dinheiro de volta!</strong>
          </p>
        </div>

        {/* Main Feature Highlight with GIF */}
        <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-lg border-2 border-primary/30 mb-12 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <a href="https://seguro.caminhodasaude.com/api/public/shopify?product=2586328866196&store=25863" target="_blank" rel="noopener noreferrer" className="inline-block bg-destructive/10 text-destructive px-3 py-1 rounded-full text-xs font-bold hover:bg-destructive/20 transition-colors">MAIS VENDIDO 🏆</a>
              <h3 className="text-xl lg:text-2xl font-bold text-foreground">
                Cós Alto Que Esconde TUDO
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Aquela gordurinha que aparece por cima da calça? <strong className="text-foreground">Desapareceu.</strong> O cós alto vai até embaixo do sutiã, modelando toda a região abdominal. E o melhor: <strong className="text-success">não enrola e não desce!</strong>
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-success/10 text-success px-3 py-1.5 rounded-full text-sm font-medium">
                  ✓ Esconde a pochete
                </span>
                <span className="bg-success/10 text-success px-3 py-1.5 rounded-full text-sm font-medium">
                  ✓ Não enrola nunca
                </span>
                <span className="bg-success/10 text-success px-3 py-1.5 rounded-full text-sm font-medium">
                  ✓ Afina a cintura
                </span>
              </div>
            </div>
            <div className="relative">
              <img
                src={featureGif1}
                alt="Calcinha Modeladora - Cós Alto"
                className="w-full max-w-lg mx-auto rounded-xl shadow-md"
                loading="lazy"
                decoding="async"
              />
              <a href="https://seguro.caminhodasaude.com/api/public/shopify?product=2586328866196&store=25863" target="_blank" rel="noopener noreferrer" className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold animate-pulse hover:bg-destructive/90 transition-colors">
                #1 BRASIL
              </a>
            </div>
          </div>
        </div>

        {/* Cores disponíveis - Destaque visual */}
        <div className="mb-12 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Escolha Suas Cores Favoritas</h3>
          <p className="text-sm text-muted-foreground mb-6">Combine com qualquer roupa do seu guarda-roupa</p>
          <img
            src={featureCores}
            alt="Cores disponíveis"
            className="w-full max-w-lg mx-auto rounded-xl shadow-lg"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground leading-tight pt-1">
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
        <div className="mt-12 text-center bg-gradient-to-r from-destructive/10 via-primary/10 to-destructive/10 rounded-2xl p-8 border-2 border-primary/30">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wind className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">
            Chega de se sentir insegura com seu corpo!
          </h3>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
            Milhares de mulheres já transformaram sua autoestima com nossa calcinha modeladora. <strong className="text-primary">Hoje é sua vez!</strong>
          </p>
          <div className="space-y-3">
            <a 
              href="https://seguro.caminhodasaude.com/api/public/shopify?product=2586328866196&store=25863"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-5 py-2.5 rounded-full text-sm font-bold animate-pulse hover:bg-destructive/90 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              🔥 ÚLTIMAS 23 UNIDADES COM 70% OFF
            </a>
            <p className="text-xs text-muted-foreground">⏰ Oferta válida apenas enquanto durar o estoque</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDescription;
