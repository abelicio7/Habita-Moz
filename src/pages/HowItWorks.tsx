import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HowItWorksSection from '@/components/home/HowItWorks';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Home, Users, Shield, Clock, HeartHandshake } from 'lucide-react';

const HowItWorks = () => {
  const forTenants = [
    {
      icon: Search,
      title: 'Pesquisa Simplificada',
      description: 'Use filtros avançados para encontrar imóveis por localização, preço, tipo e características específicas.'
    },
    {
      icon: HeartHandshake,
      title: 'Contacto Directo',
      description: 'Comunique directamente com os proprietários via WhatsApp, sem intermediários.'
    },
    {
      icon: Shield,
      title: 'Imóveis Verificados',
      description: 'Todos os anúncios passam por verificação para garantir informações precisas.'
    }
  ];

  const forOwners = [
    {
      icon: Home,
      title: 'Anuncie Grátis',
      description: 'Publique o seu imóvel gratuitamente e alcance milhares de potenciais inquilinos.'
    },
    {
      icon: Users,
      title: 'Gestão de Interessados',
      description: 'Receba e gerencie manifestações de interesse directamente no seu painel.'
    },
    {
      icon: Clock,
      title: 'Alugue Rapidamente',
      description: 'Com a maior visibilidade em Moçambique, encontre inquilinos em tempo recorde.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Como Funciona a <span className="text-primary">Habita Moz</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              A forma mais simples de encontrar ou anunciar imóveis para aluguel em Moçambique. 
              Conectamos proprietários e inquilinos de forma directa e segura.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <HowItWorksSection />

      {/* For Tenants */}
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Para Quem Procura Imóvel
            </h2>
            <p className="text-muted-foreground text-lg">
              Encontre o seu novo lar com facilidade e segurança
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {forTenants.map((item, index) => (
              <div key={index} className="p-6 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link to="/imoveis">Buscar Imóveis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Owners */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Para Proprietários
            </h2>
            <p className="text-muted-foreground text-lg">
              Anuncie o seu imóvel e encontre inquilinos rapidamente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {forOwners.map((item, index) => (
              <div key={index} className="p-6 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild size="lg" variant="secondary">
              <Link to="/anunciar">Anunciar Imóvel</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <div className="bg-primary rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Pronto para começar?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Junte-se a milhares de moçambicanos que já encontraram o seu lar ideal através da Habita Moz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/imoveis">Ver Imóveis</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/auth">Criar Conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
