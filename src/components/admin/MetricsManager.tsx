import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type FunnelStage = Database['public']['Enums']['funnel_stage'];
type Metric = Database['public']['Tables']['funnel_metrics']['Row'];

const stageOptions: { value: FunnelStage; label: string }[] = [
  { value: 'attraction', label: 'Atração' },
  { value: 'engagement', label: 'Engajamento' },
  { value: 'consideration', label: 'Consideração' },
  { value: 'conversion', label: 'Conversão' },
  { value: 'retention', label: 'Retenção' },
];

const MetricsManager = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [stage, setStage] = useState<FunnelStage>('conversion');
  const [metricName, setMetricName] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('funnel_metrics')
        .select('*')
        .order('date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMetric = async () => {
    if (!metricName || !metricValue) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o nome e valor da métrica.',
        variant: 'destructive',
      });
      return;
    }

    setIsAdding(true);
    try {
      const { data, error } = await supabase
        .from('funnel_metrics')
        .upsert({
          date,
          stage,
          metric_name: metricName,
          metric_value: parseFloat(metricValue),
          notes: notes || null,
        }, {
          onConflict: 'date,stage,metric_name'
        })
        .select()
        .single();

      if (error) throw error;

      setMetrics(prev => [data, ...prev.filter(m => m.id !== data.id)]);
      setMetricName('');
      setMetricValue('');
      setNotes('');

      toast({
        title: 'Métrica adicionada!',
        description: 'Os dados foram salvos com sucesso.',
      });
    } catch (error) {
      console.error('Error adding metric:', error);
      toast({
        title: 'Erro ao adicionar',
        description: 'Não foi possível salvar a métrica.',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const deleteMetric = async (id: string) => {
    try {
      const { error } = await supabase
        .from('funnel_metrics')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMetrics(prev => prev.filter(m => m.id !== id));
      toast({
        title: 'Métrica removida',
      });
    } catch (error) {
      console.error('Error deleting metric:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Metric Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Métrica Manual
          </CardTitle>
          <CardDescription>
            Importe dados de vendas, checkout ou outras métricas externas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage">Etapa do Funil</Label>
              <Select value={stage} onValueChange={(v) => setStage(v as FunnelStage)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metricName">Nome da Métrica</Label>
              <Input
                id="metricName"
                placeholder="Ex: Vendas, Leads, Cliques..."
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metricValue">Valor</Label>
              <Input
                id="metricValue"
                type="number"
                placeholder="0"
                value={metricValue}
                onChange={(e) => setMetricValue(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addMetric} disabled={isAdding} className="w-full gap-2">
                <Upload className="w-4 h-4" />
                {isAdding ? 'Salvando...' : 'Adicionar'}
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Observações sobre esta métrica..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 h-20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Registradas</CardTitle>
          <CardDescription>Histórico de dados importados manualmente</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : metrics.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma métrica registrada ainda. Adicione dados acima.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Métrica</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Notas</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(metric.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {stageOptions.find(s => s.value === metric.stage)?.label}
                      </TableCell>
                      <TableCell>{metric.metric_name}</TableCell>
                      <TableCell className="text-right font-bold">
                        {Number(metric.metric_value).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                        {metric.notes || '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMetric(metric.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsManager;
