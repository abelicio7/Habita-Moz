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
    console.log('Payment callback received:', payload);

    const { transaction_id, reference, status, amount } = payload;

    // Extrair userId da referência (formato: SUB-{userId}-{timestamp})
    const parts = reference.split('-');
    if (parts.length < 2 || parts[0] !== 'SUB') {
      console.log('Invalid reference format:', reference);
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid reference' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (status === 'success' || status === 'completed') {
      // Determinar duração da assinatura baseado no valor
      const amountNum = parseFloat(amount);
      const isAnnual = amountNum >= 900; // 997 MT = anual
      const subscriptionEndDate = new Date();
      
      if (isAnnual) {
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
      } else {
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
      }

      // Buscar o usuário pela referência parcial do ID
      const userIdPartial = parts[1];
      const { data: profiles, error: searchError } = await supabase
        .from('profiles')
        .select('id')
        .ilike('id', `${userIdPartial}%`);

      if (searchError || !profiles || profiles.length === 0) {
        console.error('User not found:', userIdPartial);
        return new Response(
          JSON.stringify({ success: false, message: 'User not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const userId = profiles[0].id;

      // Atualizar perfil para ativo
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          trial_ends_at: subscriptionEndDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return new Response(
          JSON.stringify({ success: false, message: 'Error updating profile' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Subscription activated for user:', userId);

      return new Response(
        JSON.stringify({ success: true, message: 'Subscription activated' }),
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
    console.error('Error processing callback:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
