import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/button';
import { usePublicProperties } from '@/hooks/usePublicProperties';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Heart, Search, ArrowRight, Loader2 } from 'lucide-react';

const Favorites = () => {
  const { user } = useAuth();
  const { data: allProperties } = usePublicProperties();
  
  // Fetch user's favorites
  const { data: favoriteIds, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(f => f.property_id);
    },
    enabled: !!user
  });
  
  // Filter properties to only show favorites
  const favoriteProperties = allProperties?.filter(p => favoriteIds?.includes(p.id)) || [];
  const hasFavorites = favoriteProperties.length > 0;

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
              {isLoading 
                ? 'Carregando...'
                : hasFavorites 
                  ? `${favoriteProperties.length} imóveis salvos`
                  : 'Você ainda não salvou nenhum imóvel'}
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && hasFavorites && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((property, index) => (
                <div 
                  key={property.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !hasFavorites && (
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
