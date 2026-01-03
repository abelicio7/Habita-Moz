import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Home, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const type = searchParams.get('type');
  const plan = searchParams.get('plan');

  useEffect(() => {
    // Aguardar confirmação do pagamento
    const checkPayment = async () => {
      // Simular verificação - na prática, o callback da API atualiza o banco
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Atualizar perfil para pegar novo status
      await refreshProfile();
      
      setIsVerifying(false);
      setIsConfirmed(true);
    };

    if (type === 'subscription') {
      checkPayment();
    } else {
      setIsVerifying(false);
      setIsConfirmed(true);
    }
  }, [type, refreshProfile]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            {isVerifying ? (
              <>
                <Loader2 className="h-16 w-16 mx-auto text-primary animate-spin mb-4" />
                <CardTitle>Aguardando confirmação</CardTitle>
                <CardDescription>
                  Confirme o pagamento no seu telefone...
                </CardDescription>
              </>
            ) : isConfirmed ? (
              <>
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <CardTitle>Pagamento Confirmado!</CardTitle>
                <CardDescription>
                  {type === 'subscription' 
                    ? `Sua assinatura ${plan === 'annual' ? 'anual' : 'mensal'} foi ativada com sucesso.`
                    : 'Obrigado pela sua compra!'
                  }
                </CardDescription>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <CardTitle>Obrigado!</CardTitle>
                <CardDescription>
                  Sua operação foi processada com sucesso.
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isConfirmed && type === 'subscription' && (
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm">
                  Agora você tem acesso completo a todas as funcionalidades premium!
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4 mr-2" />
                Página Inicial
              </Button>
              <Button 
                className="flex-1"
                onClick={() => navigate('/dashboard')}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Meu Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
