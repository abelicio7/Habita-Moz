import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CallbackPayload {
  transaction_id: string;
  reference: string;
  status: string;
  amount: string;
  phone: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: CallbackPayload = await req.json();
    console.log('Promotion callback received:', payload);

    const { transaction_id, reference, status, amount, phone } = payload;

    // Verificar se é uma referência de destaque
    if (!reference.startsWith('destaque')) {
      console.log('Not a promotion reference:', reference);
      return new Response(
        JSON.stringify({ success: false, message: 'Not a promotion payment' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (status === 'success' || status === 'completed') {
      // Buscar a promoção pendente pelo telefone e referência
      const { data: promotions, error: searchError } = await supabase
        .from('property_promotions')
        .select('*')
        .eq('phone', phone)
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

      if (searchError || !promotions || promotions.length === 0) {
        console.error('Promotion not found for phone:', phone);
        return new Response(
          JSON.stringify({ success: false, message: 'Promotion not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const promotion = promotions[0];
      const { property_id, days_purchased, amount_paid } = promotion;

      // Atualizar status da promoção
      const { error: updatePromotionError } = await supabase
        .from('property_promotions')
        .update({
          payment_status: 'completed',
          transaction_id: transaction_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', promotion.id);

      if (updatePromotionError) {
        console.error('Error updating promotion:', updatePromotionError);
      }

      // Buscar imóvel atual para verificar se já está destacado
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('is_featured, featured_until, featured_total_paid')
        .eq('id', property_id)
        .single();

      if (propertyError) {
        console.error('Error fetching property:', propertyError);
        return new Response(
          JSON.stringify({ success: false, message: 'Property not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Calcular nova data de expiração (acumula dias)
      let newFeaturedUntil: Date;
      if (property.is_featured && property.featured_until) {
        // Se já está destacado, adiciona dias ao período existente
        const currentEnd = new Date(property.featured_until);
        const now = new Date();
        const baseDate = currentEnd > now ? currentEnd : now;
        newFeaturedUntil = new Date(baseDate.getTime() + (days_purchased * 24 * 60 * 60 * 1000));
      } else {
        // Se não está destacado, começa a partir de agora
        newFeaturedUntil = new Date(Date.now() + (days_purchased * 24 * 60 * 60 * 1000));
      }

      // Calcular total pago (acumulativo)
      const currentTotalPaid = property.featured_total_paid || 0;
      const newTotalPaid = Number(currentTotalPaid) + Number(amount_paid);

      // Atualizar imóvel
      const { error: updatePropertyError } = await supabase
        .from('properties')
        .update({
          is_featured: true,
          featured_until: newFeaturedUntil.toISOString(),
          featured_total_paid: newTotalPaid,
          updated_at: new Date().toISOString()
        })
        .eq('id', property_id);

      if (updatePropertyError) {
        console.error('Error updating property:', updatePropertyError);
        return new Response(
          JSON.stringify({ success: false, message: 'Error updating property' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Property featured successfully:', property_id, 'until:', newFeaturedUntil);

      return new Response(
        JSON.stringify({ success: true, message: 'Property featured successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log('Payment not successful:', status);
      return new Response(
        JSON.stringify({ success: false, message: 'Payment not successful' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing promotion callback:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
