import { Star, CheckCircle, Image, Filter, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import reviewCecilia1 from "@/assets/review-cecilia-1.jpeg";
import reviewCecilia2 from "@/assets/review-cecilia-2.jpeg";
import reviewCecilia3 from "@/assets/review-cecilia-3.jpeg";
import reviewKarine1 from "@/assets/review-karine-1.webp";
import reviewKarine2 from "@/assets/review-karine-2.webp";
import reviewMariana from "@/assets/review-mariana.webp";
import reviewSulem1 from "@/assets/review-sulem-1.webp";
import reviewSulem2 from "@/assets/review-sulem-2.webp";
import reviewSulem3 from "@/assets/review-sulem-3.webp";

// Depoimentos com contexto real: idade, cidade, situação de uso
const reviews = [
  { 
    name: "Cecília R.", 
    age: 34,
    city: "Belo Horizonte, MG",
    verified: true, 
    comment: "Comprei com bastante desconfiança porque já tinha me decepcionado com outras. Mas essa realmente funciona. Uso no trabalho (fico 8h sentada) e não incomoda nada. No casamento da minha prima usei com vestido justo e recebi elogios. Já pedi mais um kit.", 
    productImages: [reviewCecilia1, reviewCecilia2, reviewCecilia3], 
    rating: 5, 
    helpful: 23, 
    date: "12/01/2026" 
  },
  { 
    name: "Sulem S.", 
    age: 28,
    city: "Rio de Janeiro, RJ",
    verified: true, 
    comment: "Sou professora e fico muito tempo em pé. Precisava de algo confortável mas que desse uma ajudinha no visual. Essa calcinha é perfeita — segura a barriga sem apertar e o bumbum fica mais empinado. Uso praticamente todo dia.", 
    productImages: [reviewSulem1, reviewSulem2], 
    rating: 5, 
    helpful: 18, 
    date: "08/01/2026" 
  },
  { 
    name: "Karine M.", 
    age: 31,
    city: "São Paulo, SP",
    verified: true, 
    comment: "Entrega rápida (chegou em 6 dias). O tecido é bom, não esquenta. Uso com calça de alfaiataria no escritório e com vestido nos finais de semana. O tamanho veio certinho (pedi G, uso 42/44).", 
    productImages: [reviewKarine1, reviewKarine2], 
    rating: 5, 
    helpful: 15, 
    date: "03/01/2026" 
  },
  { 
    name: "Mariana O.", 
    age: 42,
    city: "Curitiba, PR",
    verified: true, 
    comment: "Depois dos 40 ficou mais difícil achar lingerie que valorize o corpo sem ser desconfortável. Essa calcinha me surpreendeu — suaviza a barriga, levanta o bumbum e dá pra usar o dia todo. Já indiquei pra minha irmã.", 
    productImages: [reviewMariana], 
    rating: 5, 
    helpful: 21, 
    date: "28/12/2025" 
  },
  { 
    name: "Amanda F.", 
    age: 26,
    city: "Salvador, BA",
    verified: true, 
    comment: "Comprei pra usar numa festa de fim de ano. O vestido era bem justo e não marcou nada. Gostei tanto que virou minha calcinha favorita do dia a dia também.", 
    productImages: null, 
    rating: 5, 
    helpful: 12, 
    date: "22/12/2025" 
  },
  { 
    name: "Patrícia L.", 
    age: 38,
    city: "Brasília, DF",
    verified: true, 
    comment: "Fiquei em dúvida no tamanho e mandei mensagem no WhatsApp. Responderam rápido e me ajudaram a escolher. Veio certinho. O atendimento me deu confiança de que a loja é séria.", 
    productImages: null, 
    rating: 5, 
    helpful: 14, 
    date: "18/12/2025" 
  },
  { 
    name: "Fernanda C.", 
    age: 29,
    city: "Recife, PE",
    verified: true, 
    comment: "Não é aquele efeito exagerado que parece falso. É um resultado sutil que faz diferença no caimento da roupa. Uso no trabalho e em ocasiões especiais. Muito satisfeita.", 
    productImages: null, 
    rating: 5, 
    helpful: 9, 
    date: "14/12/2025" 
  },
  { 
    name: "Juliana R.", 
    age: 35,
    city: "Porto Alegre, RS",
    verified: true, 
    comment: "Comprei o kit misto pra ter as 3 cores. A preta uso mais no dia a dia, a bege com roupa clara. Qualidade é a mesma das 3. Bem acabadas.", 
    productImages: null, 
    rating: 5, 
    helpful: 11, 
    date: "10/12/2025" 
  },
  { 
    name: "Renata G.", 
    age: 33,
    city: "Goiânia, GO",
    verified: true, 
    comment: "Lavei várias vezes e não deformou. O elástico continua bom. Era minha maior preocupação porque já tive calcinha modeladora que estragou rápido.", 
    productImages: null, 
    rating: 5, 
    helpful: 16, 
    date: "05/12/2025" 
  },
  { 
    name: "Beatriz N.", 
    age: 27,
    city: "Fortaleza, CE",
    verified: true, 
    comment: "Sinceramente, o efeito empina bumbum é real. Não é exagero. Meu namorado notou a diferença sem eu falar nada haha. Recomendo.", 
    productImages: null, 
    rating: 5, 
    helpful: 19, 
    date: "01/12/2025" 
  },
  { 
    name: "Camila D.", 
    age: 40,
    city: "Campinas, SP",
    verified: true, 
    comment: "Minha dúvida era se ia apertar demais. Não aperta. É firme mas confortável. Uso com jeans e vestido sem problema.", 
    productImages: null, 
    rating: 4, 
    helpful: 8, 
    date: "26/11/2025" 
  },
  { 
    name: "Aline M.", 
    age: 30,
    city: "Florianópolis, SC",
    verified: true, 
    comment: "Chegou bem embalado, com rastreio certinho. O produto é exatamente como nas fotos. Sem surpresas negativas.", 
    productImages: null, 
    rating: 5, 
    helpful: 7, 
    date: "20/11/2025" 
  },
];

const ratingBreakdown = [
  { stars: 5, count: 1987 },
  { stars: 4, count: 284 },
  { stars: 3, count: 52 },
  { stars: 2, count: 14 },
  { stars: 1, count: 4 },
];

const Reviews = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "with-photo">("all");
  const [showAll, setShowAll] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<number[]>([]);
  
  const totalReviews = 2341;
  const averageRating = 4.8;

  const filteredReviews = reviews.filter((review) => {
    if (filter === "with-photo") return review.productImages !== null && review.productImages.length > 0;
    return true;
  });

  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 4);
  const photosCount = reviews.filter(r => r.productImages && r.productImages.length > 0).length;

  const handleHelpful = (index: number) => {
    if (!helpfulClicked.includes(index)) {
      setHelpfulClicked([...helpfulClicked, index]);
    }
  };

  return (
    <section className="py-12 bg-card" id="avaliacoes">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">
            O Que Nossas Clientes Dizem
          </h2>
          <p className="text-muted-foreground">Avaliações verificadas de quem já comprou</p>
        </div>

        {/* Rating Summary Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl p-6 md:p-8 shadow-soft">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left: Big Rating */}
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-foreground mb-2">{averageRating}</div>
                <div className="flex items-center gap-1 justify-center md:justify-start mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'fill-accent text-accent' : 'fill-accent/30 text-accent/30'}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Baseado em <span className="font-semibold text-foreground">{totalReviews.toLocaleString('pt-BR')}</span> avaliações
                </p>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-24 bg-border" />

              {/* Right: Rating Breakdown */}
              <div className="flex-1 w-full max-w-sm">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium">{item.stars}</span>
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    </div>
                    <div className="flex-1 h-2.5 bg-border/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full"
                        style={{ width: `${(item.count / totalReviews) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Filtrar:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="rounded-full"
              >
                Todas ({totalReviews.toLocaleString('pt-BR')})
              </Button>
              <Button
                variant={filter === "with-photo" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("with-photo")}
                className="rounded-full gap-1.5"
              >
                <Image className="w-3.5 h-3.5" />
                Com foto ({photosCount})
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4">
            {displayedReviews.map((review, index) => (
              <div
                key={index}
                className="bg-secondary/50 hover:bg-secondary rounded-2xl p-5 md:p-6 transition-all duration-300 border border-transparent hover:border-border/50"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/10">
                      <span className="text-primary font-bold text-lg">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold">{review.name}</span>
                      <span className="text-xs text-muted-foreground">{review.age} anos • {review.city}</span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 bg-success/10 text-success text-xs px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Compra verificada
                        </span>
                      )}
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "fill-accent text-accent" : "fill-muted text-muted"}`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-foreground mb-3 leading-relaxed">{review.comment}</p>

                    {/* Product Images */}
                    {review.productImages && review.productImages.length > 0 && (
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {review.productImages.map((img, imgIndex) => (
                          <button
                            key={imgIndex}
                            onClick={() => setSelectedImage(img)}
                            className="relative group"
                          >
                            <img
                              src={img}
                              alt={`Foto de ${review.name}`}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-border hover:border-primary transition-colors"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Helpful Button */}
                    <button
                      onClick={() => handleHelpful(index)}
                      className={`inline-flex items-center gap-1.5 text-xs transition-colors ${
                        helpfulClicked.includes(index)
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Útil ({review.helpful + (helpfulClicked.includes(index) ? 1 : 0)})</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {!showAll && filteredReviews.length > 4 && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAll(true)}
                className="rounded-full px-8"
              >
                Ver mais avaliações
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Foto ampliada"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
};

export default Reviews;
