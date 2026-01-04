import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Target, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type FunnelStage = Database['public']['Enums']['funnel_stage'];
type Goal = Database['public']['Tables']['funnel_goals']['Row'];

const stageOptions: { value: FunnelStage; label: string }[] = [
  { value: 'attraction', label: 'Atração' },
  { value: 'engagement', label: 'Engajamento' },
  { value: 'consideration', label: 'Consideração' },
  { value: 'conversion', label: 'Conversão' },
  { value: 'retention', label: 'Retenção' },
];

const GoalsManager = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [stage, setStage] = useState<FunnelStage>('conversion');
  const [goalName, setGoalName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('funnel_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStage('conversion');
    setGoalName('');
    setTargetValue('');
    setCurrentValue('');
    setDeadline('');
    setEditingId(null);
    setShowForm(false);
  };

  const saveGoal = async () => {
    if (!goalName || !targetValue) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o nome e o valor da meta.',
        variant: 'destructive',
      });
      return;
    }

    setIsAdding(true);
    try {
      const goalData = {
        stage,
        goal_name: goalName,
        target_value: parseFloat(targetValue),
        current_value: currentValue ? parseFloat(currentValue) : 0,
        deadline: deadline || null,
      };

      if (editingId) {
        const { data, error } = await supabase
          .from('funnel_goals')
          .update(goalData)
          .eq('id', editingId)
          .select()
          .single();

        if (error) throw error;
        setGoals(prev => prev.map(g => g.id === editingId ? data : g));
        toast({ title: 'Meta atualizada!' });
      } else {
        const { data, error } = await supabase
          .from('funnel_goals')
          .insert(goalData)
          .select()
          .single();

        if (error) throw error;
        setGoals(prev => [data, ...prev]);
        toast({ title: 'Meta criada!' });
      }

      resetForm();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a meta.',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const editGoal = (goal: Goal) => {
    setEditingId(goal.id);
    setStage(goal.stage);
    setGoalName(goal.goal_name);
    setTargetValue(String(goal.target_value));
    setCurrentValue(String(goal.current_value || 0));
    setDeadline(goal.deadline || '');
    setShowForm(true);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('funnel_goals')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      setGoals(prev => prev.map(g => g.id === id ? { ...g, is_active: !isActive } : g));
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  };

  const updateCurrentValue = async (id: string, value: number) => {
    try {
      const { error } = await supabase
        .from('funnel_goals')
        .update({ current_value: value })
        .eq('id', id);

      if (error) throw error;
      setGoals(prev => prev.map(g => g.id === id ? { ...g, current_value: value } : g));
      toast({ title: 'Progresso atualizado!' });
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('funnel_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGoals(prev => prev.filter(g => g.id !== id));
      toast({ title: 'Meta removida' });
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Meta' : 'Nova Meta'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Etapa do Funil</Label>
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
                <Label>Nome da Meta</Label>
                <Input
                  placeholder="Ex: Vendas mensais"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor Alvo</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Prazo (opcional)</Label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={saveGoal} disabled={isAdding}>
                {isAdding ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar Meta'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Meta
        </Button>
      )}

      {/* Goals List */}
      <div className="grid md:grid-cols-2 gap-4">
        {isLoading ? (
          <p className="text-muted-foreground col-span-2 text-center py-8">Carregando...</p>
        ) : goals.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="py-12 text-center">
              <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma meta definida</h3>
              <p className="text-muted-foreground mb-4">
                Crie metas para acompanhar o progresso do seu funil de vendas.
              </p>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = goal.target_value > 0 
              ? Math.min(((goal.current_value || 0) / goal.target_value) * 100, 100)
              : 0;
            
            return (
              <Card key={goal.id} className={!goal.is_active ? 'opacity-50' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{goal.goal_name}</CardTitle>
                      <CardDescription>
                        {stageOptions.find(s => s.value === goal.stage)?.label}
                        {goal.deadline && ` • Prazo: ${new Date(goal.deadline).toLocaleDateString('pt-BR')}`}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={goal.is_active ?? true}
                        onCheckedChange={() => toggleActive(goal.id, goal.is_active ?? true)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-bold">
                        {Number(goal.current_value || 0).toLocaleString()} / {Number(goal.target_value).toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-right text-xs text-muted-foreground mt-1">
                      {progress.toFixed(1)}%
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Atualizar valor atual"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const value = parseFloat((e.target as HTMLInputElement).value);
                          if (!isNaN(value)) {
                            updateCurrentValue(goal.id, value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <Button size="icon" variant="outline" onClick={() => editGoal(goal)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="text-destructive" onClick={() => deleteGoal(goal.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalsManager;
