import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Loader2, 
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Plus
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { provinces, cities } from '@/lib/mockData';

const amenitiesList = [
  'Piscina',
  'Jardim',
  'Churrasqueira',
  'Segurança 24h',
  'Estacionamento',
  'Garagem',
  'Varanda',
  'Ar Condicionado',
  'Mobiliado',
  'Vista Mar',
  'Internet',
  'Água Quente',
  'Gerador',
  'Dependência de Empregada'
];

const propertyTypeOptions = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'studio', label: 'Estúdio' },
  { value: 'room', label: 'Quarto' }
];

const formSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres').max(100),
  description: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres').max(2000),
  price: z.coerce.number().min(1000, 'Preço mínimo é 1.000 MT'),
  property_type: z.enum(['house', 'apartment', 'studio', 'room']),
  bedrooms: z.coerce.number().min(0).max(20),
  bathrooms: z.coerce.number().min(0).max(10),
  area_sqm: z.coerce.number().min(1).max(10000).optional(),
  province: z.string().min(1, 'Selecione uma província'),
  city: z.string().min(1, 'Selecione uma cidade'),
  neighborhood: z.string().optional(),
  address: z.string().optional(),
  advance_months: z.coerce.number().min(1).max(12).default(1),
  amenities: z.array(z.string()).default([])
});

type FormData = z.infer<typeof formSchema>;

interface UploadedImage {
  file?: File;
  url: string;
  isPrimary: boolean;
  id?: string;
}

const CreateProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdvertiser, isLoading: authLoading } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');

  const isEditing = !!id;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      property_type: 'house',
      bedrooms: 1,
      bathrooms: 1,
      area_sqm: undefined,
      province: '',
      city: '',
      neighborhood: '',
      address: '',
      advance_months: 1,
      amenities: []
    }
  });

  // Redirect if not logged in or not an advertiser
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdvertiser) {
        navigate('/');
      }
    }
  }, [user, isAdvertiser, authLoading, navigate]);

  // Load property data if editing
  useEffect(() => {
    if (id && user) {
      loadProperty();
    }
  }, [id, user]);

  const loadProperty = async () => {
    setIsLoadingProperty(true);
    try {
      const { data: property, error } = await supabase
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
        .eq('id', id!)
        .eq('owner_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!property) {
        toast.error('Imóvel não encontrado');
        navigate('/painel');
        return;
      }

      // Set form values
      form.reset({
        title: property.title,
        description: property.description || '',
        price: property.price,
        property_type: property.property_type,
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        area_sqm: property.area_sqm || undefined,
        province: property.province,
        city: property.city,
        neighborhood: property.neighborhood || '',
        address: property.address || '',
        advance_months: property.advance_months || 1,
        amenities: property.amenities || []
      });

      setSelectedProvince(property.province);

      // Set images
      if (property.property_images) {
        setImages(property.property_images.map((img: any) => ({
          url: img.image_url,
          isPrimary: img.is_primary || false,
          id: img.id
        })));
      }
    } catch (error: any) {
      toast.error('Erro ao carregar imóvel: ' + error.message);
    } finally {
      setIsLoadingProperty(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 8) {
      toast.error('Máximo de 8 imagens permitidas');
      return;
    }

    const newImages: UploadedImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} é muito grande. Máximo 5MB.`);
        continue;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} não é uma imagem válida.`);
        continue;
      }

      newImages.push({
        file,
        url: URL.createObjectURL(file),
        isPrimary: images.length === 0 && i === 0
      });
    }

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // If removed image was primary, make first one primary
      if (prev[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      return newImages;
    });
  };

  const setPrimaryImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })));
  };

  const uploadImages = async (propertyId: string): Promise<string[]> => {
    const uploadedUrls: { url: string; isPrimary: boolean; order: number }[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      
      if (image.file) {
        // New image - upload to storage
        const fileExt = image.file.name.split('.').pop();
        const fileName = `${user!.id}/${propertyId}/${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, image.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        uploadedUrls.push({ url: publicUrl, isPrimary: image.isPrimary, order: i });
      } else {
        // Existing image - keep URL
        uploadedUrls.push({ url: image.url, isPrimary: image.isPrimary, order: i });
      }
    }

    return uploadedUrls.map(u => u.url);
  };

  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      toast.error('Adicione pelo menos uma foto do imóvel');
      return;
    }

    setIsSubmitting(true);

    try {
      let propertyId = id;

      if (isEditing) {
        // Update property
        const { error } = await supabase
          .from('properties')
          .update({
            title: data.title,
            description: data.description,
            price: data.price,
            property_type: data.property_type,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            area_sqm: data.area_sqm,
            province: data.province,
            city: data.city,
            neighborhood: data.neighborhood,
            address: data.address,
            advance_months: data.advance_months,
            amenities: data.amenities
          })
          .eq('id', id!)
          .eq('owner_id', user!.id);

        if (error) throw error;
      } else {
        // Create property
        const { data: newProperty, error } = await supabase
          .from('properties')
          .insert({
            owner_id: user!.id,
            title: data.title,
            description: data.description,
            price: data.price,
            property_type: data.property_type,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            area_sqm: data.area_sqm,
            province: data.province,
            city: data.city,
            neighborhood: data.neighborhood,
            address: data.address,
            advance_months: data.advance_months,
            amenities: data.amenities,
            status: 'active'
          })
          .select('id')
          .single();

        if (error) throw error;
        propertyId = newProperty.id;
      }

      // Handle images
      // First, delete old images if editing
      if (isEditing) {
        const { data: oldImages } = await supabase
          .from('property_images')
          .select('id, image_url')
          .eq('property_id', id!);

        // Delete images that are no longer in the list
        const currentUrls = images.filter(img => !img.file).map(img => img.url);
        const imagesToDelete = oldImages?.filter(img => !currentUrls.includes(img.image_url)) || [];
        
        for (const img of imagesToDelete) {
          await supabase.from('property_images').delete().eq('id', img.id);
        }
      }

      // Upload new images and save to database
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        if (image.file) {
          // New image - upload
          const fileExt = image.file.name.split('.').pop();
          const fileName = `${user!.id}/${propertyId}/${Date.now()}-${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, image.file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          await supabase.from('property_images').insert({
            property_id: propertyId!,
            image_url: publicUrl,
            is_primary: image.isPrimary,
            display_order: i
          });
        } else if (image.id) {
          // Existing image - update primary/order if needed
          await supabase.from('property_images').update({
            is_primary: image.isPrimary,
            display_order: i
          }).eq('id', image.id);
        }
      }

      toast.success(isEditing ? 'Imóvel atualizado com sucesso!' : 'Imóvel criado com sucesso!');
      navigate('/painel');
    } catch (error: any) {
      toast.error('Erro ao salvar imóvel: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoadingProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdvertiser) return null;

  const availableCities = selectedProvince ? cities[selectedProvince] || [] : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/painel')}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {isEditing ? 'Editar Imóvel' : 'Novo Anúncio'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Atualize as informações do seu imóvel' : 'Preencha os dados do seu imóvel'}
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Images */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Fotos do Imóvel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div 
                        key={index} 
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 ${
                          image.isPrimary ? 'border-primary' : 'border-border'
                        }`}
                      >
                        <img 
                          src={image.url} 
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!image.isPrimary && (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => setPrimaryImage(index)}
                            >
                              Principal
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {image.isPrimary && (
                          <span className="absolute top-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}
                    
                    {images.length < 8 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary">
                        <Plus className="w-8 h-8" />
                        <span className="text-sm">Adicionar</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Adicione até 8 fotos. A primeira será a foto principal. Máximo 5MB por foto.
                  </p>
                </CardContent>
              </Card>

              {/* Basic Info */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do anúncio</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Apartamento moderno no centro" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva seu imóvel em detalhes..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="property_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de imóvel</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {propertyTypeOptions.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço mensal (MT)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input 
                                type="number" 
                                placeholder="25000"
                                className="pl-9"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            Quartos
                          </FormLabel>
                          <FormControl>
                            <Input type="number" min={0} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            Banheiros
                          </FormLabel>
                          <FormControl>
                            <Input type="number" min={0} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="area_sqm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Square className="w-4 h-4" />
                            Área (m²)
                          </FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="advance_months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meses adiantados exigidos</FormLabel>
                        <Select 
                          onValueChange={(val) => field.onChange(parseInt(val))} 
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 12].map(months => (
                              <SelectItem key={months} value={months.toString()}>
                                {months} {months === 1 ? 'mês' : 'meses'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Província</FormLabel>
                          <Select 
                            onValueChange={(val) => {
                              field.onChange(val);
                              setSelectedProvince(val);
                              form.setValue('city', '');
                            }} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.map(province => (
                                <SelectItem key={province} value={province}>
                                  {province}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade/Distrito</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={!selectedProvince}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableCities.map(city => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Polana Cimento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Av. Julius Nyerere, 1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Comodidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {amenitiesList.map((amenity) => (
                            <div key={amenity} className="flex items-center space-x-2">
                              <Checkbox
                                id={amenity}
                                checked={field.value?.includes(amenity)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, amenity]);
                                  } else {
                                    field.onChange(field.value.filter((a) => a !== amenity));
                                  }
                                }}
                              />
                              <label
                                htmlFor={amenity}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {amenity}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/painel')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="hero" 
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    isEditing ? 'Salvar Alterações' : 'Publicar Anúncio'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateProperty;
