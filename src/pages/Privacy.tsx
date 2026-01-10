import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Política de Privacidade
            </h1>
            <p className="text-muted-foreground">
              Última atualização: Janeiro de 2026
            </p>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">1. Introdução</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Habita Moz está comprometida em proteger a privacidade dos seus usuários. Esta 
                  Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos 
                  suas informações pessoais quando você utiliza nossa plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">2. Informações que Coletamos</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Coletamos as seguintes categorias de informações:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Dados de cadastro:</strong> nome completo, email, telefone</li>
                  <li><strong>Dados de anúncios:</strong> informações sobre imóveis, fotos, localização</li>
                  <li><strong>Dados de uso:</strong> páginas visitadas, interações, preferências</li>
                  <li><strong>Dados de pagamento:</strong> número de telefone para M-Pesa/E-mola</li>
                  <li><strong>Dados técnicos:</strong> endereço IP, tipo de navegador, dispositivo</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">3. Como Usamos suas Informações</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Fornecer e manter nossos serviços</li>
                  <li>Processar transações e pagamentos</li>
                  <li>Conectar anunciantes e interessados</li>
                  <li>Enviar notificações sobre sua conta e anúncios</li>
                  <li>Melhorar a experiência do usuário</li>
                  <li>Prevenir fraudes e garantir a segurança</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">4. Compartilhamento de Dados</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Suas informações podem ser compartilhadas com:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Outros usuários:</strong> informações de contato são compartilhadas quando você manifesta interesse em um imóvel</li>
                  <li><strong>Processadores de pagamento:</strong> para processar transações via M-Pesa e E-mola</li>
                  <li><strong>Prestadores de serviço:</strong> que nos auxiliam na operação da plataforma</li>
                  <li><strong>Autoridades:</strong> quando exigido por lei ou ordem judicial</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Não vendemos suas informações pessoais a terceiros.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">5. Segurança dos Dados</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger suas 
                  informações, incluindo criptografia de dados, controle de acesso e monitoramento 
                  de segurança. No entanto, nenhum sistema é 100% seguro, e não podemos garantir 
                  segurança absoluta.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">6. Seus Direitos</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Você tem o direito de:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir dados incorretos ou desatualizados</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Retirar consentimento para processamento</li>
                  <li>Exportar seus dados em formato legível</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Para exercer esses direitos, entre em contato conosco através do email fornecido abaixo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">7. Cookies e Tecnologias Similares</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência, lembrar 
                  suas preferências e analisar o uso da plataforma. Você pode configurar seu navegador 
                  para recusar cookies, mas isso pode afetar algumas funcionalidades.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">8. Retenção de Dados</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Mantemos suas informações pelo tempo necessário para fornecer nossos serviços ou 
                  conforme exigido por lei. Após o encerramento da sua conta, podemos reter alguns 
                  dados para fins legais, de auditoria ou prevenção de fraudes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">9. Alterações nesta Política</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre 
                  alterações significativas por email ou através da plataforma. Recomendamos revisar 
                  esta política regularmente.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">10. Contato</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Para questões sobre esta Política de Privacidade ou sobre seus dados pessoais, 
                  entre em contato através do email 
                  <a href="mailto:info@habitamoz.co.mz" className="text-primary hover:underline ml-1">
                    info@habitamoz.co.mz
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

export default Privacy;
