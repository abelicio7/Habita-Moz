import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const emailSchema = z.string().email('Email inválido');

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    try {
      emailSchema.parse(email);
      setError('');
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsEmailSent(true);
      toast.success('Email de recuperação enviado!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-md">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">Habita</span>
              <span className="text-xl font-bold text-gradient-hero"> Moz</span>
            </div>
          </Link>

          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">Verifique seu email</h1>
            <p className="text-muted-foreground mt-3">
              Enviamos um link de recuperação para <strong className="text-foreground">{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Verifique também sua pasta de spam caso não encontre o email.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsEmailSent(false)}
            >
              Enviar novamente
            </Button>
            
            <Link to="/auth" className="block">
              <Button variant="ghost" className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-md">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-xl font-bold text-foreground">Habita</span>
            <span className="text-xl font-bold text-gradient-hero"> Moz</span>
          </div>
        </Link>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Esqueceu a senha?
          </h1>
          <p className="text-muted-foreground mt-2">
            Digite seu email para receber um link de recuperação
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className={cn("pl-10 h-12 rounded-xl", error && "border-destructive")}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button 
            type="submit" 
            variant="hero" 
            size="xl" 
            className="w-full gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Enviar link de recuperação
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>

        {/* Back to login */}
        <div className="text-center">
          <Link 
            to="/auth" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
