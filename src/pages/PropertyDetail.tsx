import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePropertyById, getSortedImages, propertyTypeLabels } from '@/hooks/usePublicProperties';
import { formatPrice } from '@/lib/mockData';
import { formatMozambiquePhone } from '@/lib/utils';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart,
  Share2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  Eye,
  Calendar,
  User,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useFavorites } from '@/hooks/useFavorites';

const PropertyDetail = () => {
  const { id } = useParams();
  const { data: property, isLoading, error } = usePropertyById(id);
  const { isFavorite, toggleFavorite, isPending } = useFavorites();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isPropertyFavorite = id ? isFavorite(id) : false;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error or not found
  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
          <Link to="/imoveis">
            <Button variant="default">Voltar aos Imóveis</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = getSortedImages(property.property_images);
  const typeLabel = propertyTypeLabels[property.property_type] || property.property_type;
  const ownerPhone = property.owner_profile?.phone || '';
  const ownerName = property.owner_profile?.full_name || 'Anunciante';

  const handleInterest = () => {
    if (!ownerPhone) {
      toast.error('Contacto do proprietário não disponível');
      return;
    }
    
    // Generate WhatsApp message
    const message = encodeURIComponent(
      `Olá! Tenho interesse no imóvel "${property.title}" anunciado no Habita Moz.\n\nLink: ${window.location.href}\n\nPor favor, entre em contacto comigo.`
    );
    const whatsappUrl = `https://wa.me/${formatMozambiquePhone(ownerPhone)}?text=${message}`;
    
    // Show success message
    toast.success('Interesse manifestado!', {
      description: 'O proprietário entrará em contacto consigo via WhatsApp.'
    });

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Back Button */}
        <div className="container px-4 py-4">
          <Link 
            to="/imoveis" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Imóveis
          </Link>
        </div>

        {/* Image Gallery */}
        <div className="container px-4 mb-8">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-muted">
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Image Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        index === currentImageIndex 
                          ? "bg-primary-foreground w-6" 
                          : "bg-primary-foreground/50 hover:bg-primary-foreground/70"
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => id && toggleFavorite(id)}
                disabled={isPending}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg",
                  isPropertyFavorite
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/90 backdrop-blur-sm text-foreground hover:bg-card"
                )}
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Heart className={cn("w-5 h-5", isPropertyFavorite && "fill-current")} />
                )}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copiado!');
                }}
                className="w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-lg"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-card/90 backdrop-blur-sm text-foreground">
                {typeLabel}
              </Badge>
              {property.advance_months && property.advance_months > 1 && (
                <Badge className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground">
                  {property.advance_months} meses adiantados
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                    index === currentImageIndex 
                      ? "border-primary" 
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="container px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Location */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>
                    {[property.address, property.neighborhood, property.city, property.province]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-xl text-center">
                  <Bed className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{property.bedrooms || 0}</div>
                  <div className="text-sm text-muted-foreground">Quartos</div>
                </div>
                <div className="p-4 bg-muted rounded-xl text-center">
                  <Bath className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{property.bathrooms || 0}</div>
                  <div className="text-sm text-muted-foreground">Casas de Banho</div>
                </div>
                <div className="p-4 bg-muted rounded-xl text-center">
                  <Square className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{property.area_sqm || '-'}</div>
                  <div className="text-sm text-muted-foreground">m²</div>
                </div>
                <div className="p-4 bg-muted rounded-xl text-center">
                  <Eye className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{property.views_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Visualizações</div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">Descrição</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Features / Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">Características</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                      >
                        <Check className="w-5 h-5 text-secondary" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Contact Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-card space-y-6">
                {/* Price */}
                <div>
                  <div className="text-sm text-muted-foreground">Preço mensal</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(property.price)}
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{ownerName}</div>
                    <div className="text-sm text-muted-foreground">Anunciante</div>
                  </div>
                </div>

                {/* Post Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Publicado em {new Date(property.created_at).toLocaleDateString('pt-MZ')}</span>
                </div>

                {/* Interest Button */}
                <Button 
                  variant="whatsapp" 
                  size="xl" 
                  className="w-full gap-2"
                  onClick={handleInterest}
                  disabled={!ownerPhone}
                >
                  <MessageCircle className="w-5 h-5" />
                  Manifestar Interesse
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Ao clicar, você será redirecionado para o WhatsApp do anunciante.
                </p>

                {/* Stats */}
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Visualizações</span>
                    <span className="font-medium">{property.views_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
