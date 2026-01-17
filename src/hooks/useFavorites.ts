import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's favorite property IDs
  const { data: favoriteIds = [], isLoading } = useQuery({
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

  // Add favorite mutation
  const addFavorite = useMutation({
    mutationFn: async (propertyId: string) => {
      if (!user) throw new Error('Não autenticado');
      
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, property_id: propertyId });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      toast.success('Imóvel adicionado aos favoritos');
    },
    onError: () => {
      toast.error('Erro ao adicionar favorito');
    }
  });

  // Remove favorite mutation
  const removeFavorite = useMutation({
    mutationFn: async (propertyId: string) => {
      if (!user) throw new Error('Não autenticado');
      
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      toast.success('Imóvel removido dos favoritos');
    },
    onError: () => {
      toast.error('Erro ao remover favorito');
    }
  });

  // Toggle favorite
  const toggleFavorite = (propertyId: string) => {
    if (!user) {
      toast.error('Faça login para salvar favoritos');
      return;
    }
    
    if (favoriteIds.includes(propertyId)) {
      removeFavorite.mutate(propertyId);
    } else {
      addFavorite.mutate(propertyId);
    }
  };

  // Check if a property is a favorite
  const isFavorite = (propertyId: string) => favoriteIds.includes(propertyId);

  return {
    favoriteIds,
    isLoading,
    toggleFavorite,
    isFavorite,
    isPending: addFavorite.isPending || removeFavorite.isPending
  };
};
