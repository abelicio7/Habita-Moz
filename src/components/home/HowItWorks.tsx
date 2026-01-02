import { Search, MessageSquare, Home, CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Busque',
      description: 'Navegue por centenas de imóveis e use filtros para encontrar exatamente o que procura.',
      color: 'bg-primary/10 text-primary'
    },
    {
      icon: MessageSquare,
      title: 'Contacte',
      description: 'Manifeste interesse e receba contacto directo do proprietário via WhatsApp.',
      color: 'bg-secondary/10 text-secondary'
    },
    {
      icon: Home,
      title: 'Visite',
      description: 'Agende uma visita com o proprietário e conheça o imóvel pessoalmente.',
      color: 'bg-accent/10 text-accent-foreground'
    },
    {
      icon: CheckCircle2,
      title: 'Alugue',
      description: 'Feche o negócio diretamente com o proprietário de forma segura.',
      color: 'bg-primary/10 text-primary'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como Funciona
          </h2>
          <p className="text-muted-foreground text-lg">
            Encontre seu novo lar em apenas 4 passos simples
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border z-0" />
              )}
              
              <div className="relative z-10 p-6 bg-card rounded-2xl shadow-card group-hover:shadow-card-hover transition-all duration-300">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
