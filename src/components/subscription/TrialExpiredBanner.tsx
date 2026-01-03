import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function TrialExpiredBanner() {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Seu período gratuito acabou</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span>
          Para continuar anunciando e acessando todas as funcionalidades, assine um dos nossos planos.
        </span>
        <Button asChild size="sm" variant="outline" className="w-fit">
          <Link to="/planos">
            Assinar agora
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
