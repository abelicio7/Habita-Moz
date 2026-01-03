import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  Building2,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { usePropertyStats, useMyProperties, useRecentInterests } from '@/hooks/useProperties';
import { formatPrice } from '@/lib/mockData';
import PropertyListItem from '@/components/dashboard/PropertyListItem';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { TrialExpiredBanner } from '@/components/subscription/TrialExpiredBanner';
import { TrialBanner } from '@/components/subscription/TrialBanner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, isAdvertiser, isLoading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = usePropertyStats();
  const { data: properties, isLoading: propertiesLoading } = useMyProperties();
  const { data: recentInterests, isLoading: interestsLoading } = useRecentInterests();
  const { isExpired, isTrialActive, daysRemaining, canAccessPremium } = useSubscriptionStatus();

  // Redirect if not logged in or not an advertiser
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdvertiser) {
        navigate('/');
      }
    }
  }, [user, isAdvertiser, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdvertiser) return null;


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Olá, {profile?.full_name?.split(' ')[0] || 'Anunciante'}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie seus imóveis e acompanhe o desempenho
              </p>
            </div>
            <Link to="/anunciar">
              <Button variant="hero" size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Novo Anúncio
              </Button>
            </Link>
          </div>

          {/* Subscription Banners */}
          {isExpired && <TrialExpiredBanner />}
          {isTrialActive && <TrialBanner daysRemaining={daysRemaining} />}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Imóveis</p>
                    <p className="text-2xl font-bold text-foreground">
                      {statsLoading ? '-' : stats?.totalProperties || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ativos</p>
                    <p className="text-2xl font-bold text-foreground">
                      {statsLoading ? '-' : stats?.activeProperties || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-ocean" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Visualizações</p>
                    <p className="text-2xl font-bold text-foreground">
                      {statsLoading ? '-' : stats?.totalViews || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interesses</p>
                    <p className="text-2xl font-bold text-foreground">
                      {statsLoading ? '-' : stats?.totalInterests || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Properties List */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Meus Imóveis</CardTitle>
                  <Link to="/anunciar">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {propertiesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : properties && properties.length > 0 ? (
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <PropertyListItem key={property.id} property={property} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">
                        Nenhum imóvel cadastrado
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Comece a anunciar seus imóveis agora mesmo
                      </p>
                      <Link to="/anunciar">
                        <Button variant="hero" className="gap-2">
                          <Plus className="w-4 h-4" />
                          Criar Primeiro Anúncio
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Interests */}
            <div>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Interesses Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {interestsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : recentInterests && recentInterests.length > 0 ? (
                    <div className="space-y-4">
                      {recentInterests.slice(0, 5).map((interest) => (
                        <div key={interest.id} className="p-3 rounded-lg bg-muted/50">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-medium text-sm text-foreground truncate">
                              {interest.client_name}
                            </p>
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {interest.status === 'pending' ? 'Novo' : interest.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mb-2">
                            {interest.property_title}
                          </p>
                          <a 
                            href={`https://wa.me/${interest.client_phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            {interest.client_phone}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Nenhum interesse recebido ainda
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
