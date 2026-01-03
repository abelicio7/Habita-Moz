import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRICE_PER_DAY = 197; // MT por dia

interface PromotionPaymentRequest {
  propertyId: string;
  userId: string;
  days: number;
  phone: string;
  paymentMethod: 'mpesa' | 'emola';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyId, userId, days, phone, paymentMethod }: PromotionPaymentRequest = await req.json();

    console.log('Processing promotion payment:', { propertyId, userId, days, phone, paymentMethod });

    // Validar dados
    if (!propertyId || !userId || !days || !phone) {
      return new Response(
        JSON.stringify({ success: false, message: 'Dados incompletos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (days < 1 || days > 90) {
      return new Response(
        JSON.stringify({ success: false, message: 'Dias deve ser entre 1 e 90' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const amount = days * PRICE_PER_DAY;

    // Obter credenciais do ambiente
    const clientId = Deno.env.get('E2PAYMENTS_CLIENT_ID');
    const clientSecret = Deno.env.get('E2PAYMENTS_CLIENT_SECRET');
    const mpesaWalletId = Deno.env.get('E2PAYMENTS_MPESA_WALLET_ID');
    const emolaWalletId = Deno.env.get('E2PAYMENTS_EMOLA_WALLET_ID');

    if (!clientId || !clientSecret) {
      console.error('Missing E2Payments credentials');
      return new Response(
        JSON.stringify({ success: false, message: 'Configuração de pagamento incompleta' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Passo 1: Obter token OAuth
    console.log('Getting OAuth token...');
    const tokenResponse = await fetch("https://e2payments.explicador.co.mz/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret
      })
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response status:', tokenResponse.status);

    if (!tokenData.access_token) {
      console.error('Failed to get access token:', tokenData);
      return new Response(
        JSON.stringify({ success: false, message: 'Erro de autenticação com gateway de pagamento' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = tokenData.access_token;

    // Configurar wallet baseado no método de pagamento
    const walletId = paymentMethod === 'mpesa' ? mpesaWalletId : emolaWalletId;
    const endpoint = paymentMethod === 'mpesa'
      ? `https://e2payments.explicador.co.mz/v1/c2b/mpesa-payment/${walletId}`
      : `https://e2payments.explicador.co.mz/v1/c2b/emola-payment/${walletId}`;

    // Gerar referência para destaque
    const reference = `destaque${days}d`;

    console.log('Sending payment request to:', endpoint);
    console.log('Payment data:', { amount, phone, reference });

    // Passo 2: Fazer pagamento
    const paymentResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: new URLSearchParams({
        client_id: clientId,
        amount: amount.toString(),
        reference: reference,
        phone: phone
      })
    });

    const paymentResult = await paymentResponse.json();
    console.log('Payment response status:', paymentResponse.status);
    console.log('Payment response:', paymentResult);

    // Verificar sucesso
    if (paymentResult.success && paymentResult.success.includes("sucesso")) {
      // Salvar promoção pendente no banco
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Criar registro de promoção
      const { error: insertError } = await supabase
        .from('property_promotions')
        .insert({
          property_id: propertyId,
          user_id: userId,
          days_purchased: days,
          amount_paid: amount,
          payment_status: 'pending',
          payment_reference: reference,
          payment_method: paymentMethod,
          phone: phone
        });

      if (insertError) {
        console.error('Error inserting promotion:', insertError);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Pagamento iniciado com sucesso!',
          reference: reference,
          amount: amount,
          days: days
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log('Payment not successful:', paymentResult);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: paymentResult.error || paymentResult.message || 'Pagamento não concluído',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing promotion payment:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
