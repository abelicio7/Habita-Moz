import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminStats {
  totalUsers: number;
  totalAdvertisers: number;
  totalClients: number;
  totalProperties: number;
  activeProperties: number;
  pendingProperties: number;
  totalInterests: number;
}

export interface UserWithRole {
  id: string;
  full_name: string;
  phone: string | null;
  is_advertiser: boolean;
  subscription_status: string | null;
  trial_ends_at: string | null;
  created_at: string;
  roles: string[];
  properties_count: number;
}

export interface PropertyAdmin {
  id: string;
  title: string;
  price: number;
  property_type: string;
  province: string;
  city: string;
  status: string | null;
  views_count: number | null;
  created_at: string;
  owner: {
    id: string;
    full_name: string;
    phone: string | null;
  };
  images_count: number;
  interests_count: number;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get advertisers count
      const { count: totalAdvertisers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_advertiser', true);

      // Get properties by status
      const { data: properties } = await supabase
        .from('properties')
        .select('status');

      const totalProperties = properties?.length || 0;
      const activeProperties = properties?.filter(p => p.status === 'active').length || 0;
      const pendingProperties = properties?.filter(p => p.status === 'pending').length || 0;

      // Get total interests
      const { count: totalInterests } = await supabase
        .from('interest_manifestations')
        .select('*', { count: 'exact', head: true });

      return {
        totalUsers: totalUsers || 0,
        totalAdvertisers: totalAdvertisers || 0,
        totalClients: (totalUsers || 0) - (totalAdvertisers || 0),
        totalProperties,
        activeProperties,
        pendingProperties,
        totalInterests: totalInterests || 0
      } as AdminStats;
    }
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get properties count per user
      const { data: properties } = await supabase
        .from('properties')
        .select('owner_id');

      const propertiesCount = properties?.reduce((acc, p) => {
        acc[p.owner_id] = (acc[p.owner_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Combine data
      return profiles?.map(profile => ({
        id: profile.id,
        full_name: profile.full_name,
        phone: profile.phone,
        is_advertiser: profile.is_advertiser || false,
        subscription_status: profile.subscription_status,
        trial_ends_at: profile.trial_ends_at,
        created_at: profile.created_at,
        roles: roles?.filter(r => r.user_id === profile.id).map(r => r.role) || [],
        properties_count: propertiesCount[profile.id] || 0
      })) as UserWithRole[];
    }
  });
};

export const useAdminProperties = () => {
  return useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data: properties, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          price,
          property_type,
          province,
          city,
          status,
          views_count,
          created_at,
          owner_id,
          profiles!properties_owner_id_fkey (
            id,
            full_name,
            phone
          ),
          property_images (id),
          interest_manifestations (id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return properties?.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        property_type: p.property_type,
        province: p.province,
        city: p.city,
        status: p.status,
        views_count: p.views_count,
        created_at: p.created_at,
        owner: p.profiles || { id: p.owner_id, full_name: 'Desconhecido', phone: null },
        images_count: p.property_images?.length || 0,
        interests_count: p.interest_manifestations?.length || 0
      })) as PropertyAdmin[];
    }
  });
};

export const useUpdatePropertyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, status }: { propertyId: string; status: 'active' | 'inactive' | 'pending' | 'expired' }) => {
      const { error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', propertyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Status atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar status: ' + error.message);
    }
  });
};

export const useDeletePropertyAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      // First delete images from storage
      const { data: images } = await supabase
        .from('property_images')
        .select('image_url')
        .eq('property_id', propertyId);

      if (images && images.length > 0) {
        const filePaths = images.map(img => {
          try {
            const url = new URL(img.image_url);
            const path = url.pathname.split('/property-images/')[1];
            return path;
          } catch {
            return null;
          }
        }).filter(Boolean) as string[];

        if (filePaths.length > 0) {
          await supabase.storage.from('property-images').remove(filePaths);
        }
      }

      // Delete property
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Imóvel removido com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao remover imóvel: ' + error.message);
    }
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role, action }: { userId: string; role: 'admin' | 'advertiser' | 'client'; action: 'add' | 'remove' }) => {
      if (action === 'add') {
        const { error } = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role }]);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Permissão atualizada com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar permissão: ' + error.message);
    }
  });
};
