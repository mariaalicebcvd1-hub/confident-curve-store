import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LogOut, TrendingUp, Users, ShoppingCart, Target, Sparkles, RefreshCw, Plus, BarChart3 } from 'lucide-react';
import FunnelOverview from '@/components/admin/FunnelOverview';
import MetricsManager from '@/components/admin/MetricsManager';
import AISuggestions from '@/components/admin/AISuggestions';
import GoalsManager from '@/components/admin/GoalsManager';

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login');
    }
  }, [isLoading, user, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const generateInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-funnel-insights');
      
      if (error) throw error;
      
      toast({
        title: 'Insights gerados!',
        description: `${data.suggestions?.length || 0} novas sugestões criadas pela IA.`,
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: 'Erro ao gerar insights',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">BellaShape Dashboard</h1>
              <p className="text-xs text-muted-foreground">Gestão do Funil de Vendas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={generateInsights}
              disabled={isGeneratingInsights}
              variant="outline"
              className="gap-2"
            >
              {isGeneratingInsights ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Gerar Insights IA
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-xs text-muted-foreground">Visitantes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-xs text-muted-foreground">Taxa Conv.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-xs text-muted-foreground">Vendas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-xs text-muted-foreground">Meta</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4 hidden sm:block" />
              Funil
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="gap-2">
              <Sparkles className="w-4 h-4 hidden sm:block" />
              Sugestões IA
            </TabsTrigger>
            <TabsTrigger value="metrics" className="gap-2">
              <Plus className="w-4 h-4 hidden sm:block" />
              Métricas
            </TabsTrigger>
            <TabsTrigger value="goals" className="gap-2">
              <Target className="w-4 h-4 hidden sm:block" />
              Metas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <FunnelOverview />
          </TabsContent>

          <TabsContent value="suggestions">
            <AISuggestions />
          </TabsContent>

          <TabsContent value="metrics">
            <MetricsManager />
          </TabsContent>

          <TabsContent value="goals">
            <GoalsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
