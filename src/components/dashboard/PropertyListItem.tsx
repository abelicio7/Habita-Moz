import { Link } from 'react-router-dom';
import { Eye, MessageSquare, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatPrice } from '@/lib/mockData';
import { PropertyWithImages, useDeleteProperty } from '@/hooks/useProperties';

interface PropertyListItemProps {
  property: PropertyWithImages;
}

const propertyTypeLabels: Record<string, string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  studio: 'Estúdio',
  room: 'Quarto'
};

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Ativo', variant: 'default' },
  pending: { label: 'Pendente', variant: 'secondary' },
  inactive: { label: 'Inativo', variant: 'outline' },
  expired: { label: 'Expirado', variant: 'destructive' }
};

const PropertyListItem = ({ property }: PropertyListItemProps) => {
  const deleteProperty = useDeleteProperty();
  const primaryImage = property.property_images?.find(img => img.is_primary) || property.property_images?.[0];
  const status = statusLabels[property.status || 'pending'];

  return (
    <div className="flex gap-4 p-4 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors">
      {/* Image */}
      <div className="w-24 h-24 md:w-32 md:h-24 rounded-lg overflow-hidden bg-muted shrink-0">
        {primaryImage ? (
          <img 
            src={primaryImage.image_url} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sem foto
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link 
              to={`/imovel/${property.id}`}
              className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {property.title}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {property.city}, {property.province}
            </p>
          </div>
          <Badge variant={status.variant} className="shrink-0">
            {status.label}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <span className="font-bold text-primary">
            {formatPrice(property.price)}/mês
          </span>
          <span className="text-xs text-muted-foreground">
            {propertyTypeLabels[property.property_type]} • {property.bedrooms || 0} quartos
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {property.views_count || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/anunciar/${property.id}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
            </Link>
            
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/imovel/${property.id}`}>Ver anúncio</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/anunciar/${property.id}`}>Editar</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover imóvel?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. O imóvel "{property.title}" será removido permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteProperty.mutate(property.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteProperty.isPending ? 'Removendo...' : 'Remover'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListItem;
