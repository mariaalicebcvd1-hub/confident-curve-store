import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Users, Eye, MousePointer, ShoppingCart, CreditCard } from 'lucide-react';

interface TrackingEvent {
  event_type: string;
  created_at: string;
}

const stages = [
  { key: 'attraction', label: 'Atração', icon: Users, color: 'bg-blue-500' },
  { key: 'engagement', label: 'Engajamento', icon: Eye, color: 'bg-purple-500' },
  { key: 'consideration', label: 'Consideração', icon: MousePointer, color: 'bg-orange-500' },
  { key: 'conversion', label: 'Conversão', icon: ShoppingCart, color: 'bg-green-500' },
  { key: 'retention', label: 'Retenção', icon: CreditCard, color: 'bg-pink-500' },
];

const FunnelOverview = () => {
  const [eventStats, setEventStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('tracking_events')
        .select('event_type, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;

      const stats: Record<string, number> = {};
      (data as TrackingEvent[])?.forEach((event) => {
        stats[event.event_type] = (stats[event.event_type] || 0) + 1;
      });
      setEventStats(stats);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Map event types to funnel stages
  const getFunnelData = () => {
    return [
      { stage: 'Visitantes', value: eventStats['page_view'] || 0, percentage: 100 },
      { stage: 'Engajados', value: eventStats['scroll'] || 0, percentage: eventStats['page_view'] ? Math.round((eventStats['scroll'] || 0) / eventStats['page_view'] * 100) : 0 },
      { stage: 'Interessados', value: eventStats['click'] || 0, percentage: eventStats['page_view'] ? Math.round((eventStats['click'] || 0) / eventStats['page_view'] * 100) : 0 },
      { stage: 'Carrinho', value: eventStats['add_to_cart'] || 0, percentage: eventStats['page_view'] ? Math.round((eventStats['add_to_cart'] || 0) / eventStats['page_view'] * 100) : 0 },
      { stage: 'Checkout', value: eventStats['checkout_start'] || 0, percentage: eventStats['page_view'] ? Math.round((eventStats['checkout_start'] || 0) / eventStats['page_view'] * 100) : 0 },
    ];
  };

  const funnelData = getFunnelData();
  const maxValue = Math.max(...funnelData.map(d => d.value), 1);

  return (
    <div className="space-y-6">
      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Visualização do Funil</CardTitle>
          <CardDescription>Últimos 30 dias - Dados coletados automaticamente</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Carregando dados...
            </div>
          ) : funnelData.every(d => d.value === 0) ? (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
              <p className="text-lg mb-2">Nenhum dado coletado ainda</p>
              <p className="text-sm">Os eventos serão registrados automaticamente conforme os usuários navegam no site.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {funnelData.map((item, index) => (
                <div key={item.stage} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-right">{item.stage}</div>
                  <div className="flex-1 relative">
                    <div 
                      className="h-10 rounded-lg transition-all duration-500"
                      style={{ 
                        width: `${Math.max((item.value / maxValue) * 100, 5)}%`,
                        background: `linear-gradient(90deg, hsl(${220 + index * 30}, 70%, 50%), hsl(${220 + index * 30}, 70%, 60%))`,
                      }}
                    />
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white font-bold text-sm">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-16 text-right text-sm text-muted-foreground">
                    {item.percentage}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stage Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <Card key={stage.key} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${stage.color}`} />
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{stage.label}</span>
                </div>
                <p className="text-2xl font-bold">-</p>
                <p className="text-xs text-muted-foreground">Adicione métricas</p>
                {index < stages.length - 1 && (
                  <ArrowRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 hidden md:block" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FunnelOverview;
