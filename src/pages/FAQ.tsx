import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqItems = [
  {
    question: 'Como posso anunciar meu imóvel na Habita Moz?',
    answer: 'Para anunciar seu imóvel, primeiro crie uma conta como anunciante. Após o cadastro, acesse o seu painel e clique em "Novo Anúncio". Preencha os detalhes do imóvel, adicione fotos de qualidade e publique. Seu anúncio passará por uma breve revisão antes de ficar disponível.'
  },
  {
    question: 'Quanto custa anunciar na plataforma?',
    answer: 'Oferecemos um período de teste gratuito de 14 dias para novos anunciantes. Após esse período, você pode escolher entre o plano mensal (297 MT) ou anual (997 MT). Também oferecemos destaque pago para seus anúncios aparecerem no topo das buscas por 197 MT/dia.'
  },
  {
    question: 'Como funciona o período de teste gratuito?',
    answer: 'Ao se cadastrar como anunciante, você recebe automaticamente 14 dias de acesso completo a todas as funcionalidades da plataforma. Durante este período, pode criar anúncios, gerenciar seus imóveis e acompanhar estatísticas sem nenhum custo.'
  },
  {
    question: 'Quais métodos de pagamento são aceitos?',
    answer: 'Aceitamos pagamentos via M-Pesa (números 84/85) e E-mola (números 86/87). Os pagamentos são processados de forma segura através do gateway E2Payments.'
  },
  {
    question: 'Como posso entrar em contato com um anunciante?',
    answer: 'Ao visualizar um imóvel de interesse, clique no botão "Tenho Interesse". Você será redirecionado para o WhatsApp do anunciante para um contato direto. Seus dados de contato também serão enviados ao anunciante.'
  },
  {
    question: 'Posso editar ou remover meu anúncio depois de publicado?',
    answer: 'Sim! Acesse seu painel de anunciante, encontre o imóvel que deseja modificar e clique em "Editar". Você pode atualizar informações, adicionar ou remover fotos, alterar o preço ou desativar o anúncio a qualquer momento.'
  },
  {
    question: 'Quantas fotos posso adicionar ao meu anúncio?',
    answer: 'Cada anúncio pode ter até 8 fotos. Recomendamos usar imagens de boa qualidade que mostrem todos os cômodos e características importantes do imóvel. O tamanho máximo por imagem é de 5MB.'
  },
  {
    question: 'O que significa "Imóvel em Destaque"?',
    answer: 'Imóveis em destaque aparecem no topo das listagens e na seção de destaques da página inicial. É uma forma de dar mais visibilidade ao seu anúncio. O destaque custa 197 MT por dia e os dias são cumulativos.'
  },
  {
    question: 'Como sei que meu anúncio está sendo visualizado?',
    answer: 'No seu painel de anunciante, você tem acesso a estatísticas detalhadas de cada imóvel, incluindo número de visualizações e manifestações de interesse recebidas.'
  },
  {
    question: 'É seguro utilizar a plataforma?',
    answer: 'Sim! Todos os anunciantes passam por verificação e os anúncios são revisados antes da publicação. Utilizamos criptografia para proteger seus dados e não compartilhamos informações pessoais sem consentimento.'
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-muted-foreground text-lg">
              Encontre respostas para as dúvidas mais comuns sobre a Habita Moz
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 overflow-hidden"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-semibold text-foreground">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact CTA */}
          <div className="max-w-3xl mx-auto mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Não encontrou o que procurava?
            </p>
            <a
              href="/contato"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Entre em contato conosco →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
