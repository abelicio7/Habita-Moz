import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const passwordSchema = z.string().min(6, 'Senha deve ter pelo menos 6 caracteres');

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if we have a valid session from the reset link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Link de recuperação inválido ou expirado');
        navigate('/auth');
      }
    };
    checkSession();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    try {
      passwordSchema.parse(formData.password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsSuccess(true);
      toast.success('Senha alterada com sucesso!');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Senha alterada!</h1>
          <p className="text-muted-foreground">
            Sua senha foi alterada com sucesso. Você será redirecionado em instantes...
          </p>
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
            Nova senha
          </h1>
          <p className="text-muted-foreground mt-2">
            Digite sua nova senha abaixo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={cn("pl-10 pr-10 h-12 rounded-xl", errors.password && "border-destructive")}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={cn("pl-10 h-12 rounded-xl", errors.confirmPassword && "border-destructive")}
                required
              />
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
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
                Alterar senha
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

export default ResetPassword;
