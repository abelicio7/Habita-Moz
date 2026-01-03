import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PublicProperty {
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
  created_at: string;
  updated_at: string;
  property_images: {
    id: string;
    image_url: string;
    is_primary: boolean | null;
    display_order: number | null;
  }[];
  owner_profile?: {
    full_name: string;
    phone: string | null;
  } | null;
}

export const usePublicProperties = () => {
  return useQuery({
    queryKey: ['public-properties'],
    queryFn: async () => {
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
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch owner profiles separately
      const ownerIds = [...new Set(data?.map(p => p.owner_id) || [])];
      
      let profilesMap: Record<string, { full_name: string; phone: string | null }> = {};
      
      if (ownerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, phone')
          .in('id', ownerIds);
        
        profiles?.forEach(p => {
          profilesMap[p.id] = { full_name: p.full_name, phone: p.phone };
        });
      }
      
      // Combine data
      return (data || []).map(property => ({
        ...property,
        owner_profile: profilesMap[property.owner_id] || null
      })) as PublicProperty[];
    }
  });
};

export const usePropertyById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) return null;

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
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      // Fetch owner profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', data.owner_id)
        .maybeSingle();
      
      return {
        ...data,
        owner_profile: profile || null
      } as PublicProperty;
    },
    enabled: !!id
  });
};

// Helper to get primary image or first image
export const getPrimaryImage = (images: PublicProperty['property_images']): string => {
  if (!images || images.length === 0) {
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';
  }
  const primary = images.find(img => img.is_primary);
  return primary?.image_url || images[0]?.image_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';
};

// Helper to get all images sorted
export const getSortedImages = (images: PublicProperty['property_images']): string[] => {
  if (!images || images.length === 0) {
    return ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'];
  }
  return [...images]
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    .map(img => img.image_url);
};

// Type labels for display
export const propertyTypeLabels: Record<string, string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  studio: 'Estúdio',
  room: 'Quarto'
};
