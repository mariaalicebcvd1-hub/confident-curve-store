import { Star, CheckCircle, Image, Filter, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import reviewCecilia1 from "@/assets/review-cecilia-1.jpeg";
import reviewCecilia2 from "@/assets/review-cecilia-2.jpeg";
import reviewCecilia3 from "@/assets/review-cecilia-3.jpeg";

const reviews = [
  { name: "Sulem Santos", verified: true, comment: "Amei é realmente de ótima qualidade, eu li os comentários e resolvi testar e amei. Ela realmente segura na barriga, o material é ótimo, muito resistente e vou comprar maiss!", productImage: "https://www.images.areviewsapp.com/admeliteshop.myshopify.com/p0K2XFu4fsPhIv8.jpg", productImages: null, rating: 5, helpful: 12, date: "02/01/2026" },
  { name: "Karine", verified: true, comment: "Gostei bastante a entrega foi bem rápida, indico, podem comprar!", productImage: "https://www.images.areviewsapp.com/admeliteshop.myshopify.com/Hq0TLJwGuAig4mX.jpg", productImages: null, rating: 5, helpful: 8, date: "28/12/2025" },
  { name: "Cecília", verified: true, comment: "Comprei a minha e simplesmente amei, a qualidade é impecável e realmente não enrola, levanta o bumbum e esconde a pochetinha que eu odeio rsrs comprem meninas, vcs não vão se arrepender!!", productImage: null, productImages: [reviewCecilia1, reviewCecilia2, reviewCecilia3], rating: 5, helpful: 15, date: "23/12/2025" },
  { name: "Virgínia", verified: true, comment: "Tamanho adequado, pedi meu número e coube perfeitamente, muito confortável, não marca nas roupas, principalmente nos vestidos.", productImage: "https://www.images.areviewsapp.com/admeliteshop.myshopify.com/6BJCH4sIUNgp2D5.jpg", rating: 5, helpful: 6, date: "19/12/2025" },
  { name: "Hilda Pontes", verified: true, comment: "Me surpreendeu, exatamente como anunciado. O produto é excelente, chegou antes do prazo e é muito confortável, perfeito de usar, muito linda e ótima de usar", productImage: "https://www.images.areviewsapp.com/admeliteshop.myshopify.com/omQeSyXFq5BwHLz.jpg", rating: 5, helpful: 9, date: "15/12/2025" },
  { name: "Ana Paula", verified: true, comment: "Adorei! Veste super bem, é confortável e realmente modela o corpo. Já quero comprar mais!", productImage: null, rating: 4, helpful: 4, date: "12/12/2025" },
  { name: "Mariana Silva", verified: true, comment: "Produto maravilhoso! Superou todas as expectativas. O tecido é de altíssima qualidade e muito confortável.", productImage: null, rating: 5, helpful: 7, date: "08/12/2025" },
  { name: "Juliana Costa", verified: true, comment: "Melhor calcinha que já comprei na vida! Uso todos os dias e não largo mais. Super recomendo!", productImage: null, rating: 5, helpful: 11, date: "03/12/2025" },
  { name: "Fernanda Oliveira", verified: true, comment: "Entrega super rápida, produto de qualidade. Já estou pensando em comprar mais para presentear minhas amigas.", productImage: null, rating: 5, helpful: 5, date: "28/11/2025" },
  { name: "Camila Rodrigues", verified: true, comment: "Amei demais! O efeito empina bumbum é real, não é propaganda enganosa. Vale cada centavo!", productImage: null, rating: 5, helpful: 14, date: "24/11/2025" },
  { name: "Beatriz Santos", verified: true, comment: "Comprei com receio mas me surpreendi positivamente. Qualidade excelente e muito confortável.", productImage: null, rating: 5, helpful: 3, date: "19/11/2025" },
  { name: "Larissa Mendes", verified: true, comment: "Perfeita! Não marca na roupa, é confortável e bonita. Já virou minha favorita!", productImage: null, rating: 5, helpful: 8, date: "14/11/2025" },
  { name: "Patrícia Lima", verified: true, comment: "Adorei o produto, chegou antes do prazo. A qualidade é muito boa, recomendo!", productImage: null, rating: 5, helpful: 6, date: "09/11/2025" },
  { name: "Amanda Ferreira", verified: true, comment: "Sensacional! Modelou certinho meu corpo. Vou comprar de todas as cores!", productImage: null, rating: 5, helpful: 10, date: "04/11/2025" },
  { name: "Gabriela Souza", verified: true, comment: "Produto de excelente qualidade. Entrega rápida e bem embalado. Super satisfeita!", productImage: null, rating: 5, helpful: 4, date: "30/10/2025" },
  { name: "Isabela Martins", verified: true, comment: "Muito boa! Confortável, bonita e faz o que promete. Já indiquei para todas as amigas.", productImage: null, rating: 5, helpful: 9, date: "25/10/2025" },
  { name: "Rafaela Alves", verified: true, comment: "Comprei 2 kits e amei! A qualidade é incrível, vale muito a pena.", productImage: null, rating: 5, helpful: 7, date: "20/10/2025" },
  { name: "Thais Barbosa", verified: true, comment: "Perfeita para usar com vestidos! Não marca e é super confortável.", productImage: null, rating: 5, helpful: 5, date: "15/10/2025" },
  { name: "Priscila Carvalho", verified: true, comment: "Amei! Produto de qualidade, entrega rápida. Nota 10!", productImage: null, rating: 5, helpful: 8, date: "10/10/2025" },
  { name: "Vanessa Ribeiro", verified: true, comment: "Excelente! O tecido é macio e não esquenta. Perfeita para o dia a dia.", productImage: null, rating: 5, helpful: 6, date: "05/10/2025" },
  { name: "Renata Gomes", verified: true, comment: "Maravilhosa! Veste muito bem e é super confortável. Já virou essencial!", productImage: null, rating: 5, helpful: 11, date: "30/09/2025" },
  { name: "Carolina Dias", verified: true, comment: "Produto incrível! Realmente empina o bumbum e é muito confortável.", productImage: null, rating: 5, helpful: 9, date: "25/09/2025" },
  { name: "Letícia Moura", verified: true, comment: "Super satisfeita com a compra! Qualidade excepcional.", productImage: null, rating: 5, helpful: 4, date: "20/09/2025" },
  { name: "Débora Castro", verified: true, comment: "Adorei! Chegou rápido e o produto é exatamente como nas fotos.", productImage: null, rating: 5, helpful: 7, date: "15/09/2025" },
  { name: "Jéssica Pereira", verified: true, comment: "Melhor compra que fiz! Confortável e bonita. Recomendo demais!", productImage: null, rating: 5, helpful: 13, date: "10/09/2025" },
  { name: "Michele Araujo", verified: true, comment: "Produto de qualidade! Veste perfeitamente e não deforma com as lavagens.", productImage: null, rating: 5, helpful: 5, date: "05/09/2025" },
  { name: "Aline Nascimento", verified: true, comment: "Simplesmente perfeita! O efeito modelador é real e muito natural.", productImage: null, rating: 5, helpful: 10, date: "31/08/2025" },
  { name: "Tatiane Freitas", verified: true, comment: "Amei a qualidade! Tecido macio, não aperta e valoriza o corpo.", productImage: null, rating: 5, helpful: 6, date: "26/08/2025" },
  { name: "Viviane Lopes", verified: true, comment: "Excelente produto! Já comprei 3 vezes e sempre me surpreendo.", productImage: null, rating: 5, helpful: 8, date: "21/08/2025" },
  { name: "Daniele Correia", verified: true, comment: "Maravilhosa! Super confortável e bonita. Não fico sem!", productImage: null, rating: 5, helpful: 4, date: "16/08/2025" },
  { name: "Eliane Teixeira", verified: true, comment: "Produto top! Entrega rápida e qualidade excelente. Recomendo!", productImage: null, rating: 5, helpful: 7, date: "11/08/2025" },
  { name: "Fabiana Rocha", verified: true, comment: "Adorei! Veste muito bem, não aperta e é super confortável.", productImage: null, rating: 5, helpful: 9, date: "06/08/2025" },
  { name: "Helena Cardoso", verified: true, comment: "Comprei para testar e amei! Já virou minha calcinha preferida.", productImage: null, rating: 5, helpful: 11, date: "01/08/2025" },
  { name: "Ingrid Monteiro", verified: true, comment: "Perfeita! Qualidade impecável e muito confortável para usar o dia todo.", productImage: null, rating: 5, helpful: 5, date: "27/07/2025" },
  { name: "Joana Pinto", verified: true, comment: "Sensacional! O tecido é de primeira e o acabamento é perfeito.", productImage: null, rating: 5, helpful: 8, date: "22/07/2025" },
  { name: "Karen Vieira", verified: true, comment: "Muito boa! Modela bem o corpo sem apertar. Super recomendo!", productImage: null, rating: 5, helpful: 6, date: "17/07/2025" },
  { name: "Luciana Campos", verified: true, comment: "Excelente qualidade! Produto muito bem feito e confortável.", productImage: null, rating: 5, helpful: 10, date: "12/07/2025" },
  { name: "Natalia Ramos", verified: true, comment: "Adorei demais! Chegou antes do prazo e a qualidade surpreendeu.", productImage: null, rating: 5, helpful: 4, date: "07/07/2025" },
  { name: "Olívia Machado", verified: true, comment: "Produto maravilhoso! Confortável, bonita e funcional.", productImage: null, rating: 5, helpful: 7, date: "02/07/2025" },
  { name: "Paula Duarte", verified: true, comment: "Simplesmente amei! A melhor calcinha que já tive.", productImage: null, rating: 5, helpful: 12, date: "27/06/2025" },
  { name: "Quitéria Melo", verified: true, comment: "Super satisfeita! Qualidade excelente e entrega rápida.", productImage: null, rating: 5, helpful: 5, date: "22/06/2025" },
  { name: "Rosa Andrade", verified: true, comment: "Produto de primeira! Veste perfeitamente e é muito confortável.", productImage: null, rating: 5, helpful: 8, date: "17/06/2025" },
  { name: "Sandra Cunha", verified: true, comment: "Maravilhosa! Não marca na roupa e valoriza muito o corpo.", productImage: null, rating: 5, helpful: 6, date: "12/06/2025" },
  { name: "Teresa Moraes", verified: true, comment: "Excelente! Comprei com receio mas superou todas as expectativas.", productImage: null, rating: 5, helpful: 9, date: "07/06/2025" },
  { name: "Úrsula Fonseca", verified: true, comment: "Adorei o produto! Qualidade top e muito confortável.", productImage: null, rating: 5, helpful: 4, date: "02/06/2025" },
  { name: "Valéria Cruz", verified: true, comment: "Perfeita para o dia a dia! Confortável e bonita.", productImage: null, rating: 5, helpful: 7, date: "28/05/2025" },
  { name: "Wanda Azevedo", verified: true, comment: "Produto sensacional! Recomendo para todas as mulheres.", productImage: null, rating: 5, helpful: 11, date: "23/05/2025" },
  { name: "Ximena Barros", verified: true, comment: "Muito boa! O tecido é de qualidade e o acabamento é perfeito.", productImage: null, rating: 5, helpful: 5, date: "18/05/2025" },
  { name: "Yara Nogueira", verified: true, comment: "Amei! Veste super bem e é muito confortável. Nota 10!", productImage: null, rating: 5, helpful: 8, date: "13/05/2025" },
  { name: "Zélia Sampaio", verified: true, comment: "Excelente qualidade! Produto muito bem feito. Recomendo!", productImage: null, rating: 5, helpful: 6, date: "08/05/2025" },
  { name: "Ana Beatriz", verified: true, comment: "Adorei! Chegou rápido e o produto é maravilhoso.", productImage: null, rating: 5, helpful: 10, date: "03/05/2025" },
  { name: "Bruna Vasconcelos", verified: true, comment: "Produto top! Super confortável e bonita. Já virou favorita!", productImage: null, rating: 5, helpful: 4, date: "28/04/2025" },
  { name: "Cláudia Neves", verified: true, comment: "Maravilhosa! Qualidade excelente e entrega super rápida.", productImage: null, rating: 5, helpful: 7, date: "23/04/2025" },
  { name: "Denise Xavier", verified: true, comment: "Simplesmente perfeita! O efeito empina bumbum é incrível.", productImage: null, rating: 5, helpful: 13, date: "18/04/2025" },
  { name: "Eduarda Pires", verified: true, comment: "Muito satisfeita! Produto de qualidade e muito confortável.", productImage: null, rating: 4, helpful: 5, date: "13/04/2025" },
  { name: "Flávia Borges", verified: true, comment: "Adorei! Veste muito bem e não marca na roupa. Recomendo!", productImage: null, rating: 5, helpful: 8, date: "08/04/2025" },
  { name: "Gisele Medeiros", verified: true, comment: "Excelente! Comprei 2 kits e amei. Qualidade impecável!", productImage: null, rating: 5, helpful: 9, date: "03/04/2025" },
];

const ratingBreakdown = [
  { stars: 5, count: 2563 },
  { stars: 4, count: 227 },
  { stars: 3, count: 43 },
  { stars: 2, count: 11 },
  { stars: 1, count: 3 },
];

const Reviews = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "with-photo">("all");
  const [showAll, setShowAll] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<number[]>([]);
  
  const totalReviews = 2847;
  const averageRating = 4.9;

  const filteredReviews = reviews.filter((review) => {
    if (filter === "with-photo") return review.productImage !== null || (review.productImages && review.productImages.length > 0);
    return true;
  });

  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 4);
  const photosCount = reviews.filter(r => r.productImage || (r.productImages && r.productImages.length > 0)).length;

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
            Avaliações de Clientes
          </h2>
          <p className="text-muted-foreground">Veja o que nossas clientes estão dizendo</p>
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
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Baseado em <span className="font-semibold text-foreground">{totalReviews}</span> avaliações
                </p>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-24 bg-border" />

              {/* Right: Rating Breakdown */}
              <div className="flex-1 w-full max-w-sm">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3 mb-2 group cursor-pointer">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium">{item.stars}</span>
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    </div>
                    <div className="flex-1 h-2.5 bg-border/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-500 group-hover:opacity-80"
                        style={{ width: `${(item.count / totalReviews) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">{item.count}</span>
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
                className="bg-secondary/50 hover:bg-secondary rounded-2xl p-5 md:p-6 transition-all duration-300 animate-slide-up border border-transparent hover:border-border/50 hover:shadow-soft"
                style={{ animationDelay: `${index * 0.05}s` }}
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
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 bg-success/10 text-success text-xs px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Verificado
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">{review.date}</span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating 
                              ? "fill-accent text-accent" 
                              : "fill-border text-border"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-foreground/80 leading-relaxed mb-4">{review.comment}</p>

                    {/* Product Image(s) */}
                    {(review.productImage || review.productImages) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.productImage && (
                          <div 
                            className="cursor-pointer group inline-block"
                            onClick={() => setSelectedImage(review.productImage)}
                          >
                            <div className="relative overflow-hidden rounded-xl">
                              <img
                                src={review.productImage}
                                alt={`Foto do produto de ${review.name}`}
                                className="w-28 h-28 object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                                decoding="async"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                  Ampliar
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        {review.productImages && review.productImages.map((img, imgIndex) => (
                          <div 
                            key={imgIndex}
                            className="cursor-pointer group inline-block"
                            onClick={() => setSelectedImage(img)}
                          >
                            <div className="relative overflow-hidden rounded-xl">
                              <img
                                src={img}
                                alt={`Foto ${imgIndex + 1} do produto de ${review.name}`}
                                className="w-28 h-28 object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                                decoding="async"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                  Ampliar
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Helpful Button */}
                    <button 
                      onClick={() => handleHelpful(index)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        helpfulClicked.includes(index) 
                          ? "text-primary font-medium" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${helpfulClicked.includes(index) ? "fill-primary" : ""}`} />
                      <span>
                        Útil ({review.helpful + (helpfulClicked.includes(index) ? 1 : 0)})
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {filteredReviews.length > 4 && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="rounded-full px-8"
              >
                {showAll ? "Mostrar menos" : `Ver todas as ${filteredReviews.length} avaliações`}
              </Button>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-2xl w-full animate-scale-in">
              <img
                src={selectedImage}
                alt="Foto ampliada"
                className="w-full max-h-[85vh] object-contain rounded-2xl"
              />
              <button 
                className="absolute -top-12 right-0 text-white/80 hover:text-white text-sm font-medium"
                onClick={() => setSelectedImage(null)}
              >
                Fechar ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;