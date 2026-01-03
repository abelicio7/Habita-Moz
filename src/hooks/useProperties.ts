import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface PropertyWithImages {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  price: number;
  property_type: 'house' | 'apartment' | 'studio' | 'room';
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  province: string;
  city: string;
  neighborhood: string | null;
  address: string | null;
  advance_months: number | null;
  amenities: string[] | null;
  status: 'pending' | 'active' | 'inactive' | 'expired' | null;
  views_count: number | null;
  is_featured: boolean | null;
  featured_until: string | null;
  featured_total_paid: number | null;
  created_at: string;
  updated_at: string;
  property_images: {
    id: string;
    image_url: string;
    is_primary: boolean | null;
    display_order: number | null;
  }[];
  profiles?: {
    full_name: string;
    phone: string | null;
  };
  interest_count?: number;
}

export const useMyProperties = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-properties', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (
            id,
            image_url,
            is_primary,
            display_order
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PropertyWithImages[];
    },
    enabled: !!user
  });
};

export const usePropertyStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['property-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get properties count and views
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('id, views_count, status')
        .eq('owner_id', user.id);

      if (propError) throw propError;

      // Get interest manifestations count
      const propertyIds = properties?.map(p => p.id) || [];
      let interestCount = 0;

      if (propertyIds.length > 0) {
        const { count, error: intError } = await supabase
          .from('interest_manifestations')
          .select('*', { count: 'exact', head: true })
          .in('property_id', propertyIds);

        if (intError) throw intError;
        interestCount = count || 0;
      }

      const totalViews = properties?.reduce((acc, p) => acc + (p.views_count || 0), 0) || 0;
      const activeProperties = properties?.filter(p => p.status === 'active').length || 0;
      const totalProperties = properties?.length || 0;

      return {
        totalProperties,
        activeProperties,
        totalViews,
        totalInterests: interestCount
      };
    },
    enabled: !!user
  });
};

export const useRecentInterests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recent-interests', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First get user's property IDs
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('id, title')
        .eq('owner_id', user.id);

      if (propError) throw propError;

      const propertyIds = properties?.map(p => p.id) || [];
      if (propertyIds.length === 0) return [];

      const { data, error } = await supabase
        .from('interest_manifestations')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Enrich with property titles
      return data.map(interest => ({
        ...interest,
        property_title: properties?.find(p => p.id === interest.property_id)?.title || 'Imóvel'
      }));
    },
    enabled: !!user
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      // First delete images from storage
      const { data: images } = await supabase
        .from('property_images')
        .select('image_url')
        .eq('property_id', propertyId);

      if (images && images.length > 0) {
        const filePaths = images.map(img => {
          const url = new URL(img.image_url);
          const path = url.pathname.split('/property-images/')[1];
          return path;
        }).filter(Boolean);

        if (filePaths.length > 0) {
          await supabase.storage.from('property-images').remove(filePaths);
        }
      }

      // Then delete the property (images will cascade)
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['property-stats', user?.id] });
      toast.success('Imóvel removido com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao remover imóvel: ' + error.message);
    }
  });
};
