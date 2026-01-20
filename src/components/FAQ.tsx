import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Funciona mesmo ou é propaganda exagerada?",
    answer: "Funciona, mas não é milagre. O corte estratégico + tecido de alta elasticidade ergue o bumbum e suaviza a barriga de verdade. É sutil, não exagerado — você nota no espelho e no caimento da roupa. Se não ficar satisfeita, tem 30 dias pra devolver e receber o dinheiro de volta.",
  },
  {
    question: "R$ 69,90 por 3 calcinhas? Qual é a pegadinha?",
    answer: "Nenhuma. O kit com 3 permite preço menor por unidade — cada calcinha sai por R$ 23,30. Compare com modeladoras comuns que custam R$ 89+ a unidade. A gente trabalha com margem menor pra você comprar, testar e voltar. Produto é exatamente o mesmo.",
  },
  {
    question: "Quanto tempo demora pra chegar?",
    answer: "Enviamos em até 24h após confirmação do pagamento. Entrega de 5 a 12 dias úteis dependendo da região. Você recebe rastreio por e-mail e WhatsApp. Frete grátis pra todo Brasil.",
  },
  {
    question: "E se o tamanho não servir?",
    answer: "Temos tabela de medidas detalhada (P: 60-68cm, M: 68-76cm, G: 76-84cm, GG: 84-92cm, XG: 92-100cm). Na dúvida, peça o maior. Se ainda assim não servir, a troca é por nossa conta — enviamos o novo tamanho sem custo.",
  },
  {
    question: "Como funciona a garantia de 30 dias?",
    answer: "Você tem 30 dias pra testar. Não gostou, não serviu, mudou de ideia — entra em contato no WhatsApp e a gente resolve. Troca grátis ou devolução do dinheiro. Sem burocracia.",
  },
  {
    question: "Como sei que não é golpe?",
    answer: "Empresa brasileira com CNPJ ativo, nota fiscal em todos os pedidos, atendimento via WhatsApp, site com SSL (cadeado no navegador). E se der qualquer problema: 30 dias pra devolver e receber seu dinheiro de volta.",
  },
  {
    question: "Por que é mais barato que cinta modeladora?",
    answer: "Cintas custam R$ 150+ porque usam materiais pesados e complexos. Nossa calcinha usa design inteligente — o corte e o tecido fazem o trabalho, não camadas de compressão desconfortáveis. Resultado parecido, preço muito menor, conforto muito maior.",
  },
  {
    question: "Posso falar com alguém antes de comprar?",
    answer: "Pode. Atendimento via WhatsApp, de segunda a sexta, das 9h às 18h. Tire dúvidas sobre tamanho, cores, entrega. É só clicar no ícone do WhatsApp.",
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
