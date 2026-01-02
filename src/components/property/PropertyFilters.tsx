import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { provinces, cities, propertyTypes } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterState {
  search: string;
  province: string;
  city: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

interface PropertyFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
  compact?: boolean;
}

const PropertyFilters = ({
  filters,
  onFilterChange,
  className,
  compact = false
}: PropertyFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    if (filters.province && cities[filters.province]) {
      setAvailableCities(cities[filters.province]);
    } else {
      setAvailableCities([]);
    }
  }, [filters.province]);

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset city when province changes
    if (key === 'province') {
      newFilters.city = '';
    }
    
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      province: '',
      city: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  const bedroomOptions = [
    { value: '1', label: '1 quarto' },
    { value: '2', label: '2 quartos' },
    { value: '3', label: '3 quartos' },
    { value: '4', label: '4+ quartos' }
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por localização, tipo de imóvel..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-10 h-12 rounded-xl bg-card border-border"
          />
        </div>

        {/* Province Select */}
        <Select value={filters.province} onValueChange={(v) => handleChange('province', v)}>
          <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
            <SelectValue placeholder="Província" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Select */}
        <Select value={filters.type} onValueChange={(v) => handleChange('type', v)}>
          <SelectTrigger className="w-full sm:w-44 h-12 rounded-xl">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Button
          variant={showAdvanced ? "default" : "outline"}
          size="default"
          className="h-12 rounded-xl gap-2"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {!compact && <span className="hidden sm:inline">Filtros</span>}
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-primary-foreground text-primary text-xs flex items-center justify-center font-bold">
              {Object.values(filters).filter(v => v !== '').length}
            </span>
          )}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="p-4 bg-card rounded-2xl border border-border animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Cidade/Distrito</label>
              <Select 
                value={filters.city} 
                onValueChange={(v) => handleChange('city', v)}
                disabled={!filters.province}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder={filters.province ? "Selecione" : "Escolha província primeiro"} />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Quartos</label>
              <Select value={filters.bedrooms} onValueChange={(v) => handleChange('bedrooms', v)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Qualquer" />
                </SelectTrigger>
                <SelectContent>
                  {bedroomOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Min Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Preço Mínimo (MT)</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>

            {/* Max Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Preço Máximo (MT)</label>
              <Input
                type="number"
                placeholder="Sem limite"
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-end mt-4 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-destructive gap-2"
              >
                <X className="w-4 h-4" />
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;
