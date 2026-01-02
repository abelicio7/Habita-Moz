import { useState } from 'react';
import { 
  MoreHorizontal, 
  Shield, 
  ShieldOff, 
  User, 
  Building2,
  Loader2,
  Phone,
  Calendar
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
import { useAdminUsers, useUpdateUserRole } from '@/hooks/useAdmin';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminUsersTableProps {
  searchTerm: string;
}

const AdminUsersTable = ({ searchTerm }: AdminUsersTableProps) => {
  const { data: users, isLoading } = useAdminUsers();
  const updateRole = useUpdateUserRole();
  const [roleAction, setRoleAction] = useState<{
    userId: string;
    role: 'admin' | 'advertiser' | 'client';
    action: 'add' | 'remove';
    userName: string;
  } | null>(null);

  const filteredUsers = users?.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleConfirm = () => {
    if (roleAction) {
      updateRole.mutate({
        userId: roleAction.userId,
        role: roleAction.role,
        action: roleAction.action
      });
      setRoleAction(null);
    }
  };

  const getRoleBadges = (roles: string[]) => {
    return roles.map(role => {
      switch (role) {
        case 'admin':
          return (
            <Badge key={role} variant="destructive" className="gap-1">
              <Shield className="w-3 h-3" />
              Admin
            </Badge>
          );
        case 'advertiser':
          return (
            <Badge key={role} variant="default" className="gap-1">
              <Building2 className="w-3 h-3" />
              Anunciante
            </Badge>
          );
        case 'client':
          return (
            <Badge key={role} variant="secondary" className="gap-1">
              <User className="w-3 h-3" />
              Cliente
            </Badge>
          );
        default:
          return (
            <Badge key={role} variant="outline">
              {role}
            </Badge>
          );
      }
    });
  };

  const getSubscriptionBadge = (status: string | null, trialEndsAt: string | null) => {
    if (status === 'active') {
      return <Badge variant="default" className="bg-green-500">Ativo</Badge>;
    }
    if (status === 'trial' && trialEndsAt) {
      const trialEnd = new Date(trialEndsAt);
      const now = new Date();
      const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      
      if (daysLeft > 0) {
        return <Badge variant="secondary">{daysLeft}d restantes</Badge>;
      }
      return <Badge variant="outline">Expirado</Badge>;
    }
    return <Badge variant="outline">-</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!filteredUsers || filteredUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum usuário encontrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Permissões</TableHead>
              <TableHead className="text-center">Imóveis</TableHead>
              <TableHead>Assinatura</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{user.full_name || 'Sem nome'}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.is_advertiser ? 'Anunciante' : 'Cliente'}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {user.phone ? (
                    <a 
                      href={`tel:${user.phone}`}
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      {user.phone}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {getRoleBadges(user.roles)}
                    {user.roles.length === 0 && (
                      <Badge variant="outline">Nenhuma</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{user.properties_count}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.is_advertiser ? (
                    getSubscriptionBadge(user.subscription_status, user.trial_ends_at)
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(user.created_at), "dd/MM/yy", { locale: ptBR })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!user.roles.includes('admin') ? (
                        <DropdownMenuItem 
                          onClick={() => setRoleAction({
                            userId: user.id,
                            role: 'admin',
                            action: 'add',
                            userName: user.full_name
                          })}
                          className="gap-2"
                        >
                          <Shield className="w-4 h-4 text-destructive" />
                          Tornar Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => setRoleAction({
                            userId: user.id,
                            role: 'admin',
                            action: 'remove',
                            userName: user.full_name
                          })}
                          className="gap-2"
                        >
                          <ShieldOff className="w-4 h-4" />
                          Remover Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {!user.roles.includes('advertiser') ? (
                        <DropdownMenuItem 
                          onClick={() => setRoleAction({
                            userId: user.id,
                            role: 'advertiser',
                            action: 'add',
                            userName: user.full_name
                          })}
                          className="gap-2"
                        >
                          <Building2 className="w-4 h-4 text-primary" />
                          Tornar Anunciante
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => setRoleAction({
                            userId: user.id,
                            role: 'advertiser',
                            action: 'remove',
                            userName: user.full_name
                          })}
                          className="gap-2"
                        >
                          <User className="w-4 h-4" />
                          Remover Anunciante
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!roleAction} onOpenChange={() => setRoleAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {roleAction?.action === 'add' ? 'Adicionar' : 'Remover'} permissão?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {roleAction?.action === 'add' 
                ? `Você está prestes a conceder a permissão de ${roleAction?.role} para ${roleAction?.userName}.`
                : `Você está prestes a remover a permissão de ${roleAction?.role} de ${roleAction?.userName}.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleConfirm}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminUsersTable;
