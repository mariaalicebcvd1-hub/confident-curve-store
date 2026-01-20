import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Funciona mesmo ou é exagero de propaganda?",
    answer: "Funciona, mas não é mágica. O design da calcinha — o corte e o tecido — foi pensado pra levantar o bumbum e suavizar a barriga. É um efeito real, mas sutil. Você vai notar diferença no espelho e no caimento da roupa. Se não gostar do resultado, você tem 30 dias pra trocar ou devolver.",
  },
  {
    question: "Por que o preço tá mais baixo que o normal?",
    answer: "O kit com 3 calcinhas permite um preço melhor por unidade (menos de R$ 30 cada). É uma forma de você testar o produto pagando menos. Não tem pegadinha — o produto é o mesmo.",
  },
  {
    question: "Quanto tempo demora pra chegar?",
    answer: "Enviamos em até 24h após a confirmação do pagamento. O prazo de entrega varia de 5 a 12 dias úteis dependendo da região. Você recebe o código de rastreio por e-mail e WhatsApp pra acompanhar a entrega. Frete grátis pra todo o Brasil.",
  },
  {
    question: "E se o tamanho não servir?",
    answer: "A gente tem uma tabela de medidas bem detalhada (P: 60-68cm, M: 68-76cm, G: 76-84cm, GG: 84-92cm, XG: 92-100cm de cintura). Dica: se você estiver entre dois tamanhos, peça o maior. E se mesmo assim não servir, a troca é por nossa conta — você só paga o frete de retorno.",
  },
  {
    question: "Como funciona a garantia?",
    answer: "Você tem 30 dias pra decidir se gostou. Se não gostar ou o tamanho não servir, entre em contato pelo WhatsApp e a gente resolve. Troca grátis ou devolução do dinheiro. Sem perguntas chatas.",
  },
  {
    question: "É seguro comprar nesse site?",
    answer: "Sim. O site usa criptografia SSL (o cadeado no navegador), a mesma tecnologia de segurança de bancos. Aceitamos PIX, cartão de crédito (até 12x) e boleto. Somos uma empresa brasileira com CNPJ e emitimos nota fiscal em todos os pedidos.",
  },
  {
    question: "Como é o 'Pague 1 Leve 3'?",
    answer: "É simples: você paga R$ 87,90 e recebe 3 calcinhas. Pode escolher uma cor só ou o kit misto (preto, bege e rosé). Cada calcinha sai por menos de R$ 30 — um bom custo-benefício pra testar o produto.",
  },
  {
    question: "Posso falar com alguém antes de comprar?",
    answer: "Pode. A gente atende pelo WhatsApp pra tirar dúvidas sobre tamanho, cores, entrega ou qualquer outra coisa. O atendimento é de segunda a sexta, das 9h às 18h.",
  },
];

const FAQ = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-3">
          Dúvidas Frequentes
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Respondemos as perguntas que você provavelmente quer fazer
        </p>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card rounded-xl border border-border px-5"
            >
              <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
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
