import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/property/PropertyCard';
import { mockProperties } from '@/lib/mockData';

const FeaturedProperties = () => {
  const featuredProperties = mockProperties.filter(p => p.isFeatured).slice(0, 3);

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-primary font-medium">
              <Sparkles className="w-5 h-5" />
              Imóveis em Destaque
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Os melhores imóveis<br className="hidden sm:block" /> selecionados para você
            </h2>
          </div>
          <Link to="/imoveis">
            <Button variant="outline" size="lg" className="gap-2">
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property, index) => (
            <div 
              key={property.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
