import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Eye, 
  ShoppingCart, 
  CheckCircle, 
  TrendingUp, 
  MousePointer,
  Package,
  Gift,
  DollarSign
} from 'lucide-react';
import DateFilter, { FilterOption, getDateRange } from './DateFilter';

interface DashboardMetricsProps {
  dateFilter: FilterOption;
}

interface Metrics {
  pageViews: number;
  checkoutViews: number;
  approvedSales: number;
  conversionRate: number;
  clicksPerSalePage: number;
  clicksPerSaleCheckout: number;
  mainProductSales: number;
  mainProductRevenue: number;
  orderBumpSales: number;
  orderBumpRevenue: number;
}

const DashboardMetrics = ({ dateFilter }: DashboardMetricsProps) => {
  const [metrics, setMetrics] = useState<Metrics>({
    pageViews: 0,
    checkoutViews: 0,
    approvedSales: 0,
    conversionRate: 0,
    clicksPerSalePage: 0,
    clicksPerSaleCheckout: 0,
    mainProductSales: 0,
    mainProductRevenue: 0,
    orderBumpSales: 0,
    orderBumpRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [dateFilter]);

  const fetchMetrics = async () => {
    try {
      const { start, end } = getDateRange(dateFilter);

      // Fetch tracking events
      const { data: events } = await supabase
        .from('tracking_events')
        .select('event_type, element_id')
        .gte('created_at', start.toISOString())
        .lt('created_at', end.toISOString());

      // Fetch sales
      const { data: sales } = await supabase
        .from('sales')
        .select('amount, product_name, status')
        .gte('created_at', start.toISOString())
        .lt('created_at', end.toISOString());

      const pageViews = events?.filter(e => e.event_type === 'page_view').length || 0;
      const checkoutViews = events?.filter(e => e.event_type === 'checkout_start').length || 0;
      const clicks = events?.filter(e => e.event_type === 'click').length || 0;
      
      const approvedSales = sales?.filter(s => s.status === 'approved') || [];
      const approvedCount = approvedSales.length;
      
      // Separate main product from order bumps (assuming order bumps have specific naming)
      const mainProductSales = approvedSales.filter(s => 
        !s.product_name?.toLowerCase().includes('bump') && 
        !s.product_name?.toLowerCase().includes('extra')
      );
      const orderBumps = approvedSales.filter(s => 
        s.product_name?.toLowerCase().includes('bump') || 
        s.product_name?.toLowerCase().includes('extra')
      );

      const mainProductRevenue = mainProductSales.reduce((sum, s) => sum + Number(s.amount), 0);
      const orderBumpRevenue = orderBumps.reduce((sum, s) => sum + Number(s.amount), 0);

      const conversionRate = pageViews > 0 ? (approvedCount / pageViews) * 100 : 0;
      const clicksPerSalePage = approvedCount > 0 ? Math.round(clicks / approvedCount) : 0;
      const clicksPerSaleCheckout = approvedCount > 0 && checkoutViews > 0 
        ? Math.round(checkoutViews / approvedCount) 
        : 0;

      setMetrics({
        pageViews,
        checkoutViews,
        approvedSales: approvedCount,
        conversionRate,
        clicksPerSalePage,
        clicksPerSaleCheckout,
        mainProductSales: mainProductSales.length,
        mainProductRevenue,
        orderBumpSales: orderBumps.length,
        orderBumpRevenue,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const MetricCard = ({ 
    icon: Icon, 
    label, 
    value, 
    subLabel,
    subValue,
    iconColor 
  }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number;
    subLabel?: string;
    subValue?: string;
    iconColor: string;
  }) => (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold truncate">{isLoading ? '...' : value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            {subLabel && subValue && (
              <p className="text-xs text-muted-foreground mt-1">
                {subLabel}: <span className="font-medium text-foreground">{subValue}</span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Main Funnel Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Eye}
          label="Olhos na Oferta"
          value={metrics.pageViews.toLocaleString()}
          iconColor="bg-blue-500/10 text-blue-500"
        />
        <MetricCard
          icon={ShoppingCart}
          label="Chegaram no Checkout"
          value={metrics.checkoutViews.toLocaleString()}
          subLabel="Taxa de Interesse"
          subValue={metrics.pageViews > 0 
            ? `${((metrics.checkoutViews / metrics.pageViews) * 100).toFixed(1)}%` 
            : '0%'
          }
          iconColor="bg-purple-500/10 text-purple-500"
        />
        <MetricCard
          icon={CheckCircle}
          label="Vendas Aprovadas 💰"
          value={metrics.approvedSales}
          subLabel="Taxa de Fechamento"
          subValue={metrics.checkoutViews > 0 
            ? `${((metrics.approvedSales / metrics.checkoutViews) * 100).toFixed(1)}%` 
            : '0%'
          }
          iconColor="bg-green-500/10 text-green-500"
        />
        <MetricCard
          icon={TrendingUp}
          label="Conversão Geral"
          value={`${metrics.conversionRate.toFixed(2)}%`}
          iconColor="bg-orange-500/10 text-orange-500"
        />
      </div>

      {/* Clicks per Sale */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          icon={MousePointer}
          label="Cliques p/ Fechar 1 Venda (Página)"
          value={metrics.clicksPerSalePage || '—'}
          iconColor="bg-indigo-500/10 text-indigo-500"
        />
        <MetricCard
          icon={MousePointer}
          label="Checkouts p/ Fechar 1 Venda"
          value={metrics.clicksPerSaleCheckout || '—'}
          iconColor="bg-pink-500/10 text-pink-500"
        />
      </div>

      {/* Sales Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Package className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">Produto Principal</p>
                <p className="text-4xl font-bold mt-1">{isLoading ? '...' : metrics.mainProductSales}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Faturado: <span className="font-bold text-foreground text-base">
                    {formatCurrency(metrics.mainProductRevenue)}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Gift className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">Order Bumps</p>
                <p className="text-4xl font-bold mt-1">{isLoading ? '...' : metrics.orderBumpSales}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Lucro Extra: <span className="font-bold text-foreground text-base">
                    {formatCurrency(metrics.orderBumpRevenue)}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Revenue Card */}
      <Card className="border-green-500/30 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-transparent">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Faturamento Total</p>
                <p className="text-4xl font-bold mt-1">
                  {isLoading ? '...' : formatCurrency(metrics.mainProductRevenue + metrics.orderBumpRevenue)}
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">Ticket Médio</p>
              <p className="text-2xl font-bold">
                {metrics.mainProductSales + metrics.orderBumpSales > 0 
                  ? formatCurrency((metrics.mainProductRevenue + metrics.orderBumpRevenue) / (metrics.mainProductSales + metrics.orderBumpSales))
                  : 'R$ 0,00'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
