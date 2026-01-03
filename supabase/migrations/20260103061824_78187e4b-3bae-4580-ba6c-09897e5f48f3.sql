-- Add featured columns to properties table
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS featured_until timestamp with time zone;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS featured_total_paid numeric DEFAULT 0;

-- Create property_promotions table for payment history
CREATE TABLE public.property_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  days_purchased integer NOT NULL,
  amount_paid numeric NOT NULL,
  payment_status text DEFAULT 'pending',
  payment_reference text,
  transaction_id text,
  payment_method text,
  phone text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.property_promotions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_promotions
CREATE POLICY "Anunciantes podem criar promoções para seus imóveis"
ON public.property_promotions
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_id AND owner_id = auth.uid()
  )
);

CREATE POLICY "Anunciantes podem ver promoções de seus imóveis"
ON public.property_promotions
FOR SELECT
USING (
  auth.uid() = user_id OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- Trigger for updated_at
CREATE TRIGGER update_property_promotions_updated_at
BEFORE UPDATE ON public.property_promotions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();