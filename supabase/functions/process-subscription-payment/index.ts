import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  userId: string;
  planId: string;
  amount: number;
  phone: string;
  paymentMethod: 'mpesa' | 'emola';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, planId, amount, phone, paymentMethod }: PaymentRequest = await req.json();

    console.log('Processing subscription payment:', { userId, planId, amount, phone, paymentMethod });

    // Validar dados
    if (!userId || !planId || !amount || !phone) {
      return new Response(
        JSON.stringify({ success: false, message: 'Dados incompletos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Passo 1: Obter token OAuth (igual ao código original)
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
    console.log('Token response:', tokenData);

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

    // Gerar referência única
    const reference = `SUB-${userId.slice(0, 8)}-${Date.now()}`;

    console.log('Sending payment request to:', endpoint);
    console.log('Payment data:', { amount, phone, reference });

    // Passo 2: Fazer pagamento (igual ao código original - usando URLSearchParams)
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

    // Verificar sucesso (igual ao código original)
    if (paymentResult.success && paymentResult.success.includes("sucesso")) {
      // Salvar transação pendente no banco
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Atualizar perfil com transação pendente
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Pagamento iniciado com sucesso!',
          reference: reference,
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
    console.error('Error processing payment:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
