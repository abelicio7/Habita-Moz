import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TrialBannerProps {
  daysRemaining: number;
}

export function TrialBanner({ daysRemaining }: TrialBannerProps) {
  if (daysRemaining > 7) return null;

  return (
    <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
      <Clock className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-700">
        {daysRemaining === 0 
          ? 'Último dia de trial!' 
          : `${daysRemaining} dias restantes de trial`}
      </AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-yellow-700">
          Assine agora para garantir acesso contínuo às funcionalidades premium.
        </span>
        <Button asChild size="sm" variant="outline" className="w-fit border-yellow-600 text-yellow-700 hover:bg-yellow-100">
          <Link to="/planos">
            Ver planos
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
