import { useState } from 'react';
import { Star, Phone, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/mockData';

const PRICE_PER_DAY = 197;

interface PromotionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyTitle: string;
  userId: string;
  currentFeaturedUntil?: string | null;
}

const PromotionModal = ({
  open,
  onOpenChange,
  propertyId,
  propertyTitle,
  userId,
  currentFeaturedUntil
}: PromotionModalProps) => {
  const [days, setDays] = useState(7);
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola'>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = days * PRICE_PER_DAY;

  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 9) return false;
    
    if (paymentMethod === 'mpesa') {
      return cleaned.startsWith('84') || cleaned.startsWith('85');
    } else {
      return cleaned.startsWith('86') || cleaned.startsWith('87');
    }
  };

  const handleSubmit = async () => {
    if (!isValidPhone(phone)) {
      toast.error(
        paymentMethod === 'mpesa'
          ? 'Número M-Pesa deve começar com 84 ou 85'
          : 'Número E-mola deve começar com 86 ou 87'
      );
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('process-promotion-payment', {
        body: {
          propertyId,
          userId,
          days,
          phone: phone.replace(/\D/g, ''),
          paymentMethod
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Pagamento iniciado! Confirme no seu telemóvel.');
        onOpenChange(false);
      } else {
        toast.error(data.message || 'Erro ao processar pagamento');
      }
    } catch (error) {
      console.error('Error processing promotion:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isCurrentlyFeatured = currentFeaturedUntil && new Date(currentFeaturedUntil) > new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Destacar Imóvel
          </DialogTitle>
          <DialogDescription>
            Destaque "{propertyTitle}" e apareça no topo das buscas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isCurrentlyFeatured && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm">
              <p className="text-yellow-600 dark:text-yellow-400">
                Este imóvel já está destacado até {new Date(currentFeaturedUntil!).toLocaleDateString('pt-PT')}.
                Os dias adicionais serão acumulados.
              </p>
            </div>
          )}

          {/* Days Selector */}
          <div className="space-y-3">
            <Label>Dias de destaque: <span className="font-bold text-primary">{days} dias</span></Label>
            <Slider
              value={[days]}
              onValueChange={(value) => setDays(value[0])}
              min={1}
              max={30}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 dia</span>
              <span>30 dias</span>
            </div>
          </div>

          {/* Price Display */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa por dia</p>
                <p className="font-medium">{formatPrice(PRICE_PER_DAY)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total a pagar</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Método de Pagamento</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as 'mpesa' | 'emola')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mpesa" id="mpesa" />
                <Label htmlFor="mpesa" className="cursor-pointer font-normal">M-Pesa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emola" id="emola" />
                <Label htmlFor="emola" className="cursor-pointer font-normal">E-mola</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="phone">Número de Telefone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder={paymentMethod === 'mpesa' ? '84/85 XXX XXXX' : '86/87 XXX XXXX'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
                maxLength={12}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {paymentMethod === 'mpesa'
                ? 'Use um número M-Pesa (84 ou 85)'
                : 'Use um número E-mola (86 ou 87)'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isProcessing || !phone}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                Pagar {formatPrice(totalAmount)}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionModal;
