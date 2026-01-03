import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Credenciais E2Payments
const CLIENT_ID = "1747855017805";
const API_TOKEN = "bWFpbHRvLmNvbnRhLjAxQGdtYWlsLmNvbTpMb3ZhYmxlQDIwMjU=";
const MPESA_WALLET = "960840";
const EMOLA_WALLET = "1016847";

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

    // Configurar wallet baseado no método de pagamento
    const wallet = paymentMethod === 'mpesa' ? MPESA_WALLET : EMOLA_WALLET;
    const endpoint = paymentMethod === 'mpesa' 
      ? 'https://e2payments.explicador.co.mz/v1/c2b/mpesa-payment/' 
      : 'https://e2payments.explicador.co.mz/v1/c2b/emola-payment/';

    // Gerar referência única
    const reference = `SUB-${userId.slice(0, 8)}-${Date.now()}`;

    // Preparar payload para E2Payments
    const paymentPayload = {
      client_id: CLIENT_ID,
      amount: amount.toString(),
      phone: phone,
      reference: reference,
      wallet_id: wallet,
    };

    console.log('Sending to E2Payments:', paymentPayload);

    // Chamar API E2Payments
    const paymentResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const paymentResult = await paymentResponse.json();
    console.log('E2Payments response:', paymentResult);

    if (paymentResponse.ok && paymentResult.success) {
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
          message: 'Pagamento iniciado',
          reference: reference,
          transactionId: paymentResult.transaction_id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: paymentResult.message || 'Erro ao processar pagamento',
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
