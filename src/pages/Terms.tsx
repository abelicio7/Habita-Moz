import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Termos de Uso
            </h1>
            <p className="text-muted-foreground">
              Última atualização: Janeiro de 2026
            </p>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">1. Aceitação dos Termos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ao acessar e utilizar a plataforma Habita Moz, você concorda com estes Termos de Uso. 
                  Se não concordar com qualquer parte destes termos, não deve utilizar nossos serviços. 
                  Estes termos aplicam-se a todos os visitantes, usuários e anunciantes da plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">2. Descrição do Serviço</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Habita Moz é uma plataforma online que conecta proprietários de imóveis, comissionistas 
                  e potenciais inquilinos em Moçambique. Fornecemos ferramentas para publicação de anúncios 
                  de imóveis para arrendamento e facilitamos o contato entre as partes interessadas.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">3. Cadastro e Conta</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Para utilizar determinadas funcionalidades, é necessário criar uma conta. Ao se cadastrar, você declara que:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>As informações fornecidas são verdadeiras e completas</li>
                  <li>Manterá suas informações atualizadas</li>
                  <li>É responsável pela segurança de sua conta e senha</li>
                  <li>Notificará imediatamente sobre qualquer uso não autorizado</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">4. Regras para Anunciantes</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Os anunciantes comprometem-se a:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Publicar apenas imóveis dos quais são proprietários ou têm autorização para anunciar</li>
                  <li>Fornecer informações precisas sobre os imóveis</li>
                  <li>Manter fotos atualizadas e representativas</li>
                  <li>Responder às manifestações de interesse em tempo razoável</li>
                  <li>Não publicar conteúdo ilegal, ofensivo ou enganoso</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">5. Pagamentos e Assinaturas</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Os pagamentos são processados através de M-Pesa e E-mola. Os preços estão sujeitos a 
                  alterações, sendo que alterações não afetarão assinaturas já ativas. O período de teste 
                  gratuito é oferecido apenas uma vez por usuário. Não há reembolsos para pagamentos já processados.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">6. Propriedade Intelectual</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Todo o conteúdo da plataforma, incluindo logotipos, textos, imagens e código, é propriedade 
                  da Habita Moz ou de seus licenciantes. Os usuários mantêm os direitos sobre o conteúdo que 
                  publicam, mas concedem à plataforma uma licença para exibir e distribuir esse conteúdo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">7. Limitação de Responsabilidade</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Habita Moz atua apenas como intermediária entre anunciantes e interessados. Não somos 
                  responsáveis por negociações, acordos ou disputas entre as partes. Recomendamos que todas 
                  as transações sejam feitas com cautela e que os imóveis sejam visitados pessoalmente antes 
                  de qualquer compromisso.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">8. Modificações dos Termos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações 
                  significativas serão comunicadas por email ou através da plataforma. O uso continuado 
                  dos serviços após as alterações constitui aceitação dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">9. Contato</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Para questões sobre estes Termos de Uso, entre em contato através do email 
                  <a href="mailto:suporte@habitamoz.com" className="text-primary hover:underline ml-1">
                    suporte@habitamoz.com
                  </a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
