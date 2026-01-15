import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, Eye, MessageSquare, BarChart3 } from 'lucide-react';
import { usePropertyAnalytics, DailyAnalytics, PropertyPerformance } from '@/hooks/usePropertyAnalytics';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AnalyticsCharts = () => {
  const [period, setPeriod] = useState<7 | 14 | 30>(30);
  const { data: analytics, isLoading } = usePropertyAnalytics(period);

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!analytics || analytics.dailyData.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="py-12 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Sem dados suficientes</h3>
          <p className="text-sm text-muted-foreground">
            Os relatórios aparecerão quando você tiver imóveis cadastrados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-ocean/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-ocean" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Visualizações</p>
                <p className="text-xl font-bold text-foreground">{analytics.totals.views}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Interesses</p>
                <p className="text-xl font-bold text-foreground">{analytics.totals.interests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Média/Dia</p>
                <p className="text-xl font-bold text-foreground">{analytics.totals.avgViewsPerDay}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Int./Dia</p>
                <p className="text-xl font-bold text-foreground">{analytics.totals.avgInterestsPerDay}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector and Main Chart */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Desempenho ao Longo do Tempo</CardTitle>
          <div className="flex gap-1">
            {[7, 14, 30].map((days) => (
              <Button
                key={days}
                variant={period === days ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPeriod(days as 7 | 14 | 30)}
                className="text-xs px-3"
              >
                {days}d
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics.dailyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--ocean))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--ocean))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInterests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="dateLabel"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Visualizações"
                  stroke="hsl(var(--ocean))"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="interests"
                  name="Interesses"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorInterests)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Property Performance Chart */}
      {analytics.propertyPerformance.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Desempenho por Imóvel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.propertyPerformance}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="title"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    width={120}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="views"
                    name="Visualizações"
                    fill="hsl(var(--ocean))"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="interests"
                    name="Interesses"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
