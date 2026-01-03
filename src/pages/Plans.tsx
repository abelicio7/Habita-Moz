import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const plans = [
  {
    id: 'monthly',
    name: 'Mensal',
    price: 297,
    period: '/mês',
    description: 'Perfeito para começar',
    features: [
      'Anúncios ilimitados',
      'Estatísticas detalhadas',
      'Suporte prioritário',
      'Destaque nos resultados',
    ],
    popular: false,
  },
  {
    id: 'annual',
    name: 'Anual',
    price: 997,
    period: '/ano',
    description: 'Melhor custo-benefício',
    features: [
      'Tudo do plano mensal',
      'Economize mais de 70%',
      'Badge de anunciante premium',
      'Acesso antecipado a novidades',
    ],
    popular: true,
    savings: 'Economize 2.567 MT',
  },
];

export default function Plans() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola'>('mpesa');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  const handlePayment = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para assinar');
      navigate('/auth');
      return;
    }

    const validMpesa = /^8[45]\d{7}$/.test(phone);
    const validEmola = /^8[67]\d{7}$/.test(phone);

    if (!phone || phone.length !== 9 || !phone.startsWith('8')) {
      toast.error('Digite um número válido no formato 8XXXXXXXX');
      return;
    }

    if ((paymentMethod === 'mpesa' && !validMpesa) || (paymentMethod === 'emola' && !validEmola)) {
      toast.error(`Número inválido para ${paymentMethod === 'mpesa' ? 'M-Pesa (84/85)' : 'E-Mola (86/87)'}`);
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('process-subscription-payment', {
        body: {
          userId: user.id,
          planId: selectedPlan,
          amount: selectedPlanData?.price,
          // E2Payments valida telefone com 9 dígitos (ex: 84xxxxxxx), sem +258
          phone,
          paymentMethod,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Pagamento iniciado! Confirme no seu telefone.');
        // Redirecionar para página de aguardando confirmação
        navigate('/obrigado?type=subscription&plan=' + selectedPlan);
      } else {
        toast.error(data.message || 'Erro ao processar pagamento');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isTrialActive = profile?.trial_ends_at && new Date(profile.trial_ends_at) > new Date();
  const daysLeft = profile?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Crown className="h-3 w-3 mr-1" />
            Planos de Assinatura
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Anuncie seus imóveis e alcance milhares de clientes em Moçambique
          </p>
          
          {isTrialActive && (
            <div className="mt-6 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
              <Zap className="h-4 w-4" />
              <span className="font-medium">
                Você tem {daysLeft} dias restantes de trial gratuito
              </span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative cursor-pointer transition-all ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price} MT</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                  {plan.savings && (
                    <Badge variant="secondary" className="ml-2">
                      {plan.savings}
                    </Badge>
                  )}
                </div>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPlan === plan.id 
                    ? 'border-primary bg-primary' 
                    : 'border-muted-foreground'
                }`} />
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Pagamento Seguro
            </CardTitle>
            <CardDescription>
              Pague com M-Pesa ou E-Mola
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">Método de pagamento</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as 'mpesa' | 'emola')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mpesa" id="mpesa" />
                  <Label htmlFor="mpesa" className="cursor-pointer">M-Pesa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emola" id="emola" />
                  <Label htmlFor="emola" className="cursor-pointer">E-Mola</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="phone">Número de telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="84/85/86/87..."
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Número {paymentMethod === 'mpesa' ? 'M-Pesa (84/85)' : 'E-Mola (86/87)'}
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Plano {selectedPlanData?.name}</span>
                <span className="font-semibold">{selectedPlanData?.price} MT</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{selectedPlanData?.price} MT</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full" 
              size="lg"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Pagar {selectedPlanData?.price} MT
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
