import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';

type AuthMode = 'login' | 'register' | 'register-owner';
type UserType = 'client' | 'owner';

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'Senha deve ter pelo menos 6 caracteres');
const nameSchema = z.string().min(2, 'Nome deve ter pelo menos 2 caracteres');
const phoneSchema = z.string().min(9, 'Telefone inválido');

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, isLoading: authLoading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [userType, setUserType] = useState<UserType>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    try {
      emailSchema.parse(formData.email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(formData.password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    if (mode !== 'login') {
      try {
        nameSchema.parse(formData.name);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.name = e.errors[0].message;
        }
      }

      try {
        phoneSchema.parse(formData.phone);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.phone = e.errors[0].message;
        }
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success('Sessão iniciada com sucesso!');
        navigate('/');
      } else {
        const isAdvertiser = userType === 'owner';
        const { error } = await signUp(
          formData.email, 
          formData.password, 
          formData.name, 
          formData.phone, 
          isAdvertiser
        );
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email já está registrado');
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success('Conta criada com sucesso!');
        navigate('/');
      }
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
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-md">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">Lar</span>
              <span className="text-xl font-bold text-gradient-hero"> Moçambique</span>
            </div>
          </Link>

          {/* Header */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {mode === 'login' 
                ? 'Entre com seus dados para continuar' 
                : 'Preencha os dados para começar'}
            </p>
          </div>

          {/* User Type Selector (for registration) */}
          {mode !== 'login' && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setUserType('client');
                  setMode('register');
                }}
                className={cn(
                  "flex-1 p-4 rounded-xl border-2 transition-all text-left",
                  userType === 'client'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <User className="w-6 h-6 text-primary mb-2" />
                <div className="font-semibold text-foreground">Cliente</div>
                <div className="text-xs text-muted-foreground">Procuro imóvel</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserType('owner');
                  setMode('register-owner');
                }}
                className={cn(
                  "flex-1 p-4 rounded-xl border-2 transition-all text-left",
                  userType === 'owner'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Home className="w-6 h-6 text-primary mb-2" />
                <div className="font-semibold text-foreground">Anunciante</div>
                <div className="text-xs text-muted-foreground">Quero anunciar</div>
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode !== 'login' && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={handleChange}
                    className={cn("pl-10 h-12 rounded-xl", errors.name && "border-destructive")}
                    required
                  />
                </div>
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn("pl-10 h-12 rounded-xl", errors.email && "border-destructive")}
                  required
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {mode !== 'login' && (
              <div className="space-y-2">
                <Label htmlFor="phone">Celular</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+258 84 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className={cn("pl-10 h-12 rounded-xl", errors.phone && "border-destructive")}
                    required
                  />
                </div>
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
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

            {mode !== 'login' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
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
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </button>
              </div>
            )}

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
                  {mode === 'login' ? 'Entrar' : 'Criar Conta'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center">
            {mode === 'login' ? (
              <p className="text-muted-foreground">
                Não tem conta?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-primary font-semibold hover:underline"
                >
                  Cadastre-se
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Já tem conta?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-primary font-semibold hover:underline"
                >
                  Entrar
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Image/Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-hero items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>

        <div className="relative z-10 text-center text-primary-foreground max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <Home className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Encontre o seu lar perfeito em Moçambique
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            A plataforma que conecta proprietários e inquilinos de forma simples, rápida e segura.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
