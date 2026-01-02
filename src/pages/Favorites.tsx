import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/button';
import { mockProperties } from '@/lib/mockData';
import { Heart, Search, ArrowRight } from 'lucide-react';

const Favorites = () => {
  // Mock: In a real app, this would come from user state/database
  const [favorites] = useState(mockProperties.slice(0, 2));
  const hasFavorites = favorites.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container px-4">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-primary font-medium mb-2">
              <Heart className="w-5 h-5" />
              Meus Favoritos
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Imóveis Salvos
            </h1>
            <p className="text-muted-foreground mt-1">
              {hasFavorites 
                ? `${favorites.length} imóveis salvos`
                : 'Você ainda não salvou nenhum imóvel'}
            </p>
          </div>

          {hasFavorites ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property, index) => (
                <div 
                  key={property.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum favorito ainda
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Explore nossos imóveis e clique no coração para salvar os que mais gostar.
              </p>
              <Link to="/imoveis">
                <Button variant="hero" size="lg" className="gap-2">
                  <Search className="w-5 h-5" />
                  Explorar Imóveis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
