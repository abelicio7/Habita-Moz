import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Square, Eye, Star } from 'lucide-react';
import { PublicProperty, getPrimaryImage, propertyTypeLabels } from '@/hooks/usePublicProperties';
import { formatPrice } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PropertyCardProps {
  property: PublicProperty;
  className?: string;
}

const PropertyCard = ({ property, className }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = getPrimaryImage(property.property_images);
  const typeLabel = propertyTypeLabels[property.property_type] || property.property_type;
  const isFeatured = property.is_featured && property.featured_until && new Date(property.featured_until) > new Date();

  return (
    <Link
      to={`/imovel/${property.id}`}
      className={cn(
        "group block bg-card rounded-2xl overflow-hidden shadow-card property-card",
        isFeatured && "ring-2 ring-yellow-500/50",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={property.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex gap-2 flex-wrap">
            {isFeatured && (
              <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-500 font-medium">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Destaque
              </Badge>
            )}
            <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-foreground font-medium">
              {typeLabel}
            </Badge>
          </div>
          
          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
              isFavorite
                ? "bg-primary text-primary-foreground"
                : "bg-card/90 backdrop-blur-sm text-foreground hover:bg-card"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </button>
        </div>

        {/* Advance months badge */}
        {property.advance_months && property.advance_months > 1 && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="outline" className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground border-0">
              {property.advance_months} meses adiantados
            </Badge>
          </div>
        )}

        {/* Views counter */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs text-card bg-foreground/70 backdrop-blur-sm px-2 py-1 rounded-full">
          <Eye className="w-3.5 h-3.5" />
          {property.views_count || 0}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(property.price)}
          </span>
          <span className="text-sm text-muted-foreground">/mês</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{property.city}, {property.province}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms || 0} quartos</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms || 0} WC</span>
          </div>
          {property.area_sqm && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Square className="w-4 h-4" />
              <span>{property.area_sqm} m²</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
