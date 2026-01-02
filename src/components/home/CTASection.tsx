import { Link } from 'react-router-dom';
import { ArrowRight, Building, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  const benefits = [
    { icon: Building, text: 'Anuncie ilimitadamente' },
    { icon: Users, text: 'Alcance milhares de clientes' },
    { icon: TrendingUp, text: 'Acompanhe estatísticas' }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
            É proprietário ou comissionista?<br />
            Anuncie seus imóveis agora!
          </h2>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Experimente 21 dias grátis e alcance milhares de potenciais inquilinos 
            em toda Moçambique.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 py-4">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-primary-foreground/90"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <benefit.icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/anunciar">
              <Button 
                size="xl" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 shadow-lg"
              >
                Começar Grátis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/planos">
              <Button 
                variant="outline" 
                size="xl"
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Ver Planos
              </Button>
            </Link>
          </div>

          {/* Pricing Info */}
          <p className="text-sm text-primary-foreground/70">
            Após período grátis: Mensal 297 MT | Anual 997 MT
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
