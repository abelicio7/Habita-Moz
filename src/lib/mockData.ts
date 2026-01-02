// Mock data for properties in Mozambique
export interface Property {
  id: string;
  title: string;
  address: string;
  province: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'casa' | 'apartamento' | 'estudio' | 'vivenda';
  contractType: 'normal' | 'adiantado';
  description: string;
  images: string[];
  features: string[];
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
  views: number;
  interests: number;
  isFeatured?: boolean;
}

export const provinces = [
  'Maputo Cidade',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa'
];

export const cities: Record<string, string[]> = {
  'Maputo Cidade': ['Maputo Centro', 'Polana', 'Sommerschield', 'Matola', 'Costa do Sol'],
  'Maputo Província': ['Matola', 'Boane', 'Marracuene', 'Manhiça'],
  'Gaza': ['Xai-Xai', 'Chokwe', 'Chibuto'],
  'Inhambane': ['Inhambane', 'Maxixe', 'Vilankulo', 'Tofo'],
  'Sofala': ['Beira', 'Dondo', 'Gorongosa'],
  'Manica': ['Chimoio', 'Manica', 'Gondola'],
  'Tete': ['Tete', 'Moatize', 'Cahora Bassa'],
  'Zambézia': ['Quelimane', 'Mocuba', 'Gurué'],
  'Nampula': ['Nampula', 'Nacala', 'Angoche', 'Ilha de Moçambique'],
  'Cabo Delgado': ['Pemba', 'Montepuez', 'Mocímboa da Praia'],
  'Niassa': ['Lichinga', 'Cuamba', 'Marrupa']
};

export const propertyTypes = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'estudio', label: 'Estúdio' },
  { value: 'vivenda', label: 'Vivenda' }
];

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento Moderno em Polana',
    address: 'Av. Julius Nyerere, 1234',
    province: 'Maputo Cidade',
    city: 'Polana',
    price: 45000,
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    type: 'apartamento',
    contractType: 'normal',
    description: 'Lindo apartamento moderno com vista para o mar. Totalmente mobiliado, com cozinha americana, varanda espaçosa e estacionamento privativo. Localização privilegiada próximo a restaurantes e supermercados.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
    ],
    features: ['Piscina', 'Segurança 24h', 'Estacionamento', 'Varanda', 'Ar Condicionado'],
    ownerId: 'owner1',
    ownerName: 'João Silva',
    ownerPhone: '258841234567',
    createdAt: '2024-01-15',
    views: 245,
    interests: 12,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Casa Espaçosa em Sommerschield',
    address: 'Rua da Paz, 567',
    province: 'Maputo Cidade',
    city: 'Sommerschield',
    price: 85000,
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    type: 'vivenda',
    contractType: 'adiantado',
    description: 'Vivenda de alto padrão com jardim amplo, piscina privativa e dependência de empregada. Ideal para famílias. Bairro residencial tranquilo com excelente vizinhança.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
    ],
    features: ['Piscina', 'Jardim', 'Churrasqueira', 'Segurança 24h', 'Garagem 2 carros'],
    ownerId: 'owner2',
    ownerName: 'Maria Santos',
    ownerPhone: '258849876543',
    createdAt: '2024-01-10',
    views: 189,
    interests: 8,
    isFeatured: true
  },
  {
    id: '3',
    title: 'Estúdio Aconchegante na Costa do Sol',
    address: 'Av. Marginal, 890',
    province: 'Maputo Cidade',
    city: 'Costa do Sol',
    price: 18000,
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    type: 'estudio',
    contractType: 'normal',
    description: 'Estúdio moderno e funcional, perfeito para jovens profissionais. A poucos metros da praia, com vista parcial para o mar. Mobiliado e pronto para morar.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    features: ['Mobiliado', 'Vista Mar', 'Internet', 'Ar Condicionado'],
    ownerId: 'owner3',
    ownerName: 'Carlos Nhaca',
    ownerPhone: '258865432109',
    createdAt: '2024-01-20',
    views: 312,
    interests: 24
  },
  {
    id: '4',
    title: 'Apartamento T2 em Matola',
    address: 'Bairro da Liberdade, 456',
    province: 'Maputo Província',
    city: 'Matola',
    price: 22000,
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    type: 'apartamento',
    contractType: 'normal',
    description: 'Apartamento bem localizado, próximo ao centro comercial. Condomínio com segurança e área de lazer. Ideal para casais ou pequenas famílias.',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ],
    features: ['Condomínio Fechado', 'Playground', 'Estacionamento'],
    ownerId: 'owner4',
    ownerName: 'Ana Mondlane',
    ownerPhone: '258871234567',
    createdAt: '2024-01-18',
    views: 156,
    interests: 15
  },
  {
    id: '5',
    title: 'Vivenda com Piscina na Beira',
    address: 'Bairro Esturro, 123',
    province: 'Sofala',
    city: 'Beira',
    price: 55000,
    bedrooms: 4,
    bathrooms: 2,
    area: 200,
    type: 'vivenda',
    contractType: 'adiantado',
    description: 'Excelente vivenda com amplo quintal e piscina. Localizada em bairro residencial, próximo às melhores escolas da cidade. Casa reformada recentemente.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'
    ],
    features: ['Piscina', 'Quintal Grande', 'Garagem', 'Churrasqueira'],
    ownerId: 'owner5',
    ownerName: 'Pedro Macuácua',
    ownerPhone: '258829876543',
    createdAt: '2024-01-05',
    views: 98,
    interests: 5
  },
  {
    id: '6',
    title: 'Casa de Praia em Vilankulo',
    address: 'Av. Beira Mar, 789',
    province: 'Inhambane',
    city: 'Vilankulo',
    price: 35000,
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    type: 'casa',
    contractType: 'normal',
    description: 'Casa encantadora em frente ao mar, perfeita para quem busca tranquilidade. Vista deslumbrante para o Arquipélago de Bazaruto. Ideal para férias ou moradia.',
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ],
    features: ['Beira-mar', 'Terraço', 'Vista Mar', 'Cozinha Equipada'],
    ownerId: 'owner6',
    ownerName: 'Rosa Tembe',
    ownerPhone: '258843210987',
    createdAt: '2024-01-12',
    views: 421,
    interests: 32,
    isFeatured: true
  }
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
