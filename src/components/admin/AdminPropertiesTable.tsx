import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Trash2, 
  Edit, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2,
  Image,
  MessageSquare
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
} from '@/components/ui/alert-dialog';
import { useAdminProperties, useUpdatePropertyStatus, useDeletePropertyAdmin } from '@/hooks/useAdmin';
import { formatPrice } from '@/lib/mockData';

interface AdminPropertiesTableProps {
  searchTerm: string;
}

const statusConfig = {
  active: { label: 'Ativo', variant: 'default' as const, icon: CheckCircle, color: 'text-green-500' },
  pending: { label: 'Pendente', variant: 'secondary' as const, icon: Clock, color: 'text-amber-500' },
  inactive: { label: 'Inativo', variant: 'outline' as const, icon: XCircle, color: 'text-muted-foreground' },
  expired: { label: 'Expirado', variant: 'destructive' as const, icon: XCircle, color: 'text-destructive' }
};

const AdminPropertiesTable = ({ searchTerm }: AdminPropertiesTableProps) => {
  const { data: properties, isLoading } = useAdminProperties();
  const updateStatus = useUpdatePropertyStatus();
  const deleteProperty = useDeletePropertyAdmin();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredProperties = properties?.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.owner.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (propertyId: string, status: 'active' | 'inactive' | 'pending' | 'expired') => {
    updateStatus.mutate({ propertyId, status });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProperty.mutate(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!filteredProperties || filteredProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum imóvel encontrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imóvel</TableHead>
              <TableHead>Anunciante</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-center">Fotos</TableHead>
              <TableHead className="text-center">Interesses</TableHead>
              <TableHead className="text-center">Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.map((property) => {
              const status = statusConfig[property.status as keyof typeof statusConfig] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="font-medium text-foreground truncate">{property.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{property.property_type}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{property.owner.full_name}</p>
                      {property.owner.phone && (
                        <a 
                          href={`tel:${property.owner.phone}`}
                          className="text-xs text-primary hover:underline"
                        >
                          {property.owner.phone}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-foreground">{property.city}</p>
                    <p className="text-xs text-muted-foreground">{property.province}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{formatPrice(property.price)}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Image className="w-4 h-4" />
                      <span className="text-sm">{property.images_count}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">{property.interests_count}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{property.views_count || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant} className="gap-1">
                      <StatusIcon className={`w-3 h-3 ${status.color}`} />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/imovel/${property.id}`} className="gap-2">
                            <Eye className="w-4 h-4" />
                            Ver Detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/anunciar/${property.id}`} className="gap-2">
                            <Edit className="w-4 h-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(property.id, 'active' as const)}
                          disabled={property.status === 'active'}
                          className="gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Aprovar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(property.id, 'inactive' as const)}
                          disabled={property.status === 'inactive'}
                          className="gap-2"
                        >
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                          Desativar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setDeleteId(property.id)}
                          className="gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir imóvel?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O imóvel e todas as suas imagens serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminPropertiesTable;
