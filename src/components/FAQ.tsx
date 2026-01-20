import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Funciona mesmo ou é propaganda exagerada?",
    answer: "Funciona, mas não é milagre. O design da calcinha — corte estratégico + tecido de alta elasticidade — foi projetado pra erguer o bumbum e suavizar a barriga. É um efeito real e visível, mas sutil. Você vai notar diferença no espelho e no caimento da roupa. Se não gostar do resultado, você tem 30 dias pra devolver e receber o dinheiro de volta.",
  },
  {
    question: "Por que tá tão barato? Tem alguma pegadinha?",
    answer: "Não tem pegadinha. O kit com 3 calcinhas permite um preço melhor por unidade — cada uma sai por menos de R$ 30. É uma forma de você testar o produto pagando menos e ter opções de cores pro dia a dia. O produto é exatamente o mesmo que vendemos unitariamente.",
  },
  {
    question: "Quanto tempo demora pra chegar?",
    answer: "Enviamos em até 24h após confirmação do pagamento (pedidos feitos até às 14h). O prazo de entrega varia de 5 a 12 dias úteis dependendo da sua região. Você recebe o código de rastreio por e-mail e WhatsApp pra acompanhar cada passo. Frete grátis pra todo o Brasil.",
  },
  {
    question: "E se o tamanho não servir?",
    answer: "A gente tem uma tabela de medidas detalhada (P: 60-68cm, M: 68-76cm, G: 76-84cm, GG: 84-92cm, XG: 92-100cm de cintura). Dica: se você estiver entre dois tamanhos, peça o maior. E se mesmo assim não servir, a troca é por nossa conta — a gente envia o novo tamanho sem custo adicional.",
  },
  {
    question: "Como funciona a garantia de 30 dias?",
    answer: "Você tem 30 dias pra decidir se gostou. Se não gostar, se o tamanho não servir, ou se simplesmente mudar de ideia — entra em contato pelo WhatsApp e a gente resolve. Troca grátis ou devolução do dinheiro. Sem perguntas chatas, sem burocracia.",
  },
  {
    question: "É seguro comprar nesse site? Como sei que não é golpe?",
    answer: "Entendemos a desconfiança — tem muito golpe por aí mesmo. Mas somos uma empresa brasileira real, com CNPJ ativo (você pode consultar), atendimento via WhatsApp, e emitimos nota fiscal em todos os pedidos. O site usa criptografia SSL (o cadeado no navegador), a mesma segurança de bancos. E se der qualquer problema, você tem 30 dias pra devolver e receber seu dinheiro de volta.",
  },
  {
    question: "Como funciona o 'Pague 1 Leve 3'?",
    answer: "É simples e direto: você paga R$ 87,90 e recebe 3 calcinhas. Pode escolher uma cor só (preto, bege ou rosé) ou o kit misto com as três cores. Cada calcinha sai por menos de R$ 30 — muito mais em conta do que cintas modeladoras que custam R$ 150+ e são desconfortáveis.",
  },
  {
    question: "Posso falar com alguém antes de comprar?",
    answer: "Pode sim. A gente atende pelo WhatsApp pra tirar dúvidas sobre tamanho, cores, entrega ou qualquer outra coisa. Atendimento humanizado, de segunda a sexta, das 9h às 18h. É só clicar no ícone do WhatsApp ou mandar mensagem diretamente.",
  },
];

const FAQ = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-3">
          Perguntas que Você Quer Fazer
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Respondemos as dúvidas mais comuns — inclusive as sobre segurança
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
