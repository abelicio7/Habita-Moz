-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'advertiser', 'client');

-- Criar enum para tipo de imóvel
CREATE TYPE public.property_type AS ENUM ('house', 'apartment', 'studio', 'room');

-- Criar enum para status do anúncio
CREATE TYPE public.property_status AS ENUM ('pending', 'active', 'inactive', 'expired');

-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_advertiser BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  subscription_status TEXT DEFAULT 'trial',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabela de roles de usuário (separada para segurança)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Tabela de imóveis
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  property_type property_type NOT NULL DEFAULT 'house',
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  area_sqm DECIMAL(10,2),
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  advance_months INTEGER DEFAULT 1,
  amenities TEXT[],
  status property_status DEFAULT 'active',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabela de imagens de imóveis
CREATE TABLE public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabela de manifestações de interesse
CREATE TABLE public.interest_manifestations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabela de favoritos
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, property_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_manifestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Função para verificar role (security definer para evitar recursão)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Função para criar perfil automaticamente no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_adv BOOLEAN;
BEGIN
  is_adv := COALESCE((NEW.raw_user_meta_data->>'is_advertiser')::boolean, false);
  
  INSERT INTO public.profiles (id, full_name, phone, is_advertiser, trial_ends_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone',
    is_adv,
    CASE WHEN is_adv THEN now() + INTERVAL '21 days' ELSE NULL END
  );
  
  -- Adicionar role baseado no tipo de usuário
  IF is_adv THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'advertiser');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil no signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies para profiles
CREATE POLICY "Perfis são visíveis publicamente"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies para user_roles
CREATE POLICY "Usuários podem ver próprios roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem gerenciar roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies para properties
CREATE POLICY "Imóveis ativos são visíveis publicamente"
  ON public.properties FOR SELECT
  USING (status = 'active' OR owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anunciantes podem criar imóveis"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'advertiser'));

CREATE POLICY "Anunciantes podem atualizar próprios imóveis"
  ON public.properties FOR UPDATE
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anunciantes podem deletar próprios imóveis"
  ON public.properties FOR DELETE
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies para property_images
CREATE POLICY "Imagens são visíveis publicamente"
  ON public.property_images FOR SELECT
  USING (true);

CREATE POLICY "Donos podem gerenciar imagens"
  ON public.property_images FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Donos podem atualizar imagens"
  ON public.property_images FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Donos podem deletar imagens"
  ON public.property_images FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_id AND owner_id = auth.uid()
  ));

-- RLS Policies para interest_manifestations
CREATE POLICY "Clientes podem criar manifestações"
  ON public.interest_manifestations FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clientes veem próprias manifestações"
  ON public.interest_manifestations FOR SELECT
  USING (
    auth.uid() = client_id OR 
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND owner_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies para favorites
CREATE POLICY "Usuários podem ver próprios favoritos"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem adicionar favoritos"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover favoritos"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);