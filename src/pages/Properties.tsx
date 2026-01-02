import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters, { FilterState } from '@/components/property/PropertyFilters';
import { mockProperties, Property } from '@/lib/mockData';
import { Home, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    province: searchParams.get('province') || '',
    city: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  });

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property: Property) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          property.title.toLowerCase().includes(searchLower) ||
          property.address.toLowerCase().includes(searchLower) ||
          property.city.toLowerCase().includes(searchLower) ||
          property.province.toLowerCase().includes(searchLower) ||
          property.type.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Province filter
      if (filters.province && property.province !== filters.province) {
        return false;
      }

      // City filter
      if (filters.city && property.city !== filters.city) {
        return false;
      }

      // Type filter
      if (filters.type && property.type !== filters.type) {
        return false;
      }

      // Price filters
      if (filters.minPrice && property.price < parseInt(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms) {
        const bedroomCount = parseInt(filters.bedrooms);
        if (bedroomCount === 4) {
          if (property.bedrooms < 4) return false;
        } else {
          if (property.bedrooms !== bedroomCount) return false;
        }
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container px-4">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-primary font-medium mb-2">
              <Home className="w-5 h-5" />
              Marketplace
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Imóveis para Alugar
                </h1>
                <p className="text-muted-foreground mt-1">
                  {filteredProperties.length} imóveis encontrados
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="gap-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  Lista
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <PropertyFilters 
            filters={filters} 
            onFilterChange={setFilters}
            className="mb-8"
          />

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1 max-w-3xl"
            )}>
              {filteredProperties.map((property, index) => (
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
                <Home className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros para encontrar mais resultados.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;
