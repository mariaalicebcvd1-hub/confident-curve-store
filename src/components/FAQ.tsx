import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "🤔 Será que funciona mesmo ou é só marketing?",
    answer: "Entendemos sua dúvida! Mais de 47.000 mulheres já compraram e 96% ficaram satisfeitas (veja os depoimentos acima!). O segredo está na tecnologia E-SLEEP com compressão estratégica que levanta o bumbum e esconde a pochete instantaneamente. Se não funcionar pra você, devolvemos 100% do seu dinheiro em até 30 dias. Zero risco!",
  },
  {
    question: "💸 Por que está tão barato? É produto de qualidade?",
    answer: "Ótima pergunta! Normalmente vendemos a R$ 289,99, mas estamos em promoção de queima de estoque. O produto é EXATAMENTE o mesmo - tecido premium antibacteriano, costuras invisíveis e acabamento impecável. Aproveitamos para conquistar novas clientes que voltam a comprar pelo preço cheio. É sua chance de testar com 70% OFF!",
  },
  {
    question: "📦 Quanto tempo demora pra chegar?",
    answer: "Enviamos em até 24h após a confirmação do pagamento! Prazo médio: 5-12 dias úteis dependendo da região. Você recebe código de rastreio por e-mail e WhatsApp para acompanhar cada etapa. E o FRETE É GRÁTIS para todo o Brasil!",
  },
  {
    question: "👗 E se o tamanho não servir?",
    answer: "Sem stress! Temos tabela de medidas precisa: P (cintura 60-68cm), M (68-76cm), G (76-84cm), GG (84-92cm), XG (92-100cm). Dica: se estiver entre dois tamanhos, escolha o maior. E se mesmo assim não servir, trocamos sem custo adicional!",
  },
  {
    question: "🔒 É seguro comprar aqui?",
    answer: "100% seguro! Usamos a mesma tecnologia de segurança dos grandes bancos. Seus dados são criptografados e NUNCA compartilhados. Aceitamos PIX, cartão de crédito (até 12x) e boleto. Mais de 47.000 pedidos entregues com sucesso!",
  },
  {
    question: "😰 E se eu não gostar do produto?",
    answer: "Oferecemos GARANTIA INCONDICIONAL de 30 dias! Se não amar sua calcinha modeladora, devolvemos 100% do valor. Sem perguntas, sem burocracia. Basta entrar em contato pelo WhatsApp que resolvemos tudo rapidinho. Seu dinheiro de volta ou troca grátis!",
  },
  {
    question: "🎁 Como funciona o 'Pague 1 Leve 3'?",
    answer: "É simples: você paga apenas R$ 87,00 (com 70% OFF) e recebe 3 calcinhas modeladoras! Pode escolher cores iguais ou o Kit Misto com Preto + Rose + Bege. É o melhor custo-benefício do mercado - cada calcinha sai por menos de R$ 29!",
  },
];

const FAQ = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8">
          Perguntas Frequentes
        </h2>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card rounded-xl border border-border px-5 shadow-soft"
            >
              <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
