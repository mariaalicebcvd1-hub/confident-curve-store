import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Check, X, MessageSquare, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Suggestion = Database['public']['Tables']['ai_suggestions']['Row'];

const priorityColors: Record<string, string> = {
  high: 'bg-red-500/10 text-red-500 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const typeIcons: Record<string, React.ElementType> = {
  urgente: AlertTriangle,
  otimização: TrendingUp,
  oportunidade: Lightbulb,
  alerta: AlertTriangle,
};

const stageLabels: Record<string, string> = {
  attraction: 'Atração',
  engagement: 'Engajamento',
  consideration: 'Consideração',
  conversion: 'Conversão',
  retention: 'Retenção',
};

const AISuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionNotes, setActionNotes] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_suggestions')
        .select('*')
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsActioned = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_suggestions')
        .update({ 
          action_taken: true, 
          action_notes: actionNotes[id] || '',
          is_read: true 
        })
        .eq('id', id);

      if (error) throw error;

      setSuggestions(prev => prev.map(s => 
        s.id === id ? { ...s, action_taken: true, is_read: true } : s
      ));

      toast({
        title: 'Ação registrada!',
        description: 'A sugestão foi marcada como implementada.',
      });
    } catch (error) {
      console.error('Error updating suggestion:', error);
    }
  };

  const dismissSuggestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_suggestions')
        .update({ is_dismissed: true })
        .eq('id', id);

      if (error) throw error;

      setSuggestions(prev => prev.filter(s => s.id !== id));

      toast({
        title: 'Sugestão descartada',
        description: 'A sugestão foi removida da lista.',
      });
    } catch (error) {
      console.error('Error dismissing suggestion:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Carregando sugestões...
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma sugestão disponível</h3>
          <p className="text-muted-foreground mb-4">
            Clique em "Gerar Insights IA" para receber sugestões personalizadas baseadas nos dados do seu funil.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Sugestões da IA</h2>
          <p className="text-sm text-muted-foreground">
            {suggestions.filter(s => !s.is_read).length} novas sugestões
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {suggestions.map((suggestion) => {
          const TypeIcon = typeIcons[suggestion.suggestion_type] || Lightbulb;
          
          return (
            <Card 
              key={suggestion.id} 
              className={`transition-all ${!suggestion.is_read ? 'border-primary/50 bg-primary/5' : ''} ${suggestion.action_taken ? 'opacity-60' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">{suggestion.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {suggestion.stage && (
                      <Badge variant="outline" className="text-xs">
                        {stageLabels[suggestion.stage] || suggestion.stage}
                      </Badge>
                    )}
                    <Badge className={priorityColors[suggestion.priority || 'medium']}>
                      {suggestion.priority === 'high' ? 'Alta' : suggestion.priority === 'low' ? 'Baixa' : 'Média'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                
                {!suggestion.action_taken && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Notas sobre a ação (opcional)
                      </label>
                      <Textarea
                        placeholder="Descreva o que foi feito..."
                        value={actionNotes[suggestion.id] || ''}
                        onChange={(e) => setActionNotes(prev => ({ ...prev, [suggestion.id]: e.target.value }))}
                        className="h-20 text-sm"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => markAsActioned(suggestion.id)}
                        className="gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Marcar como feito
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => dismissSuggestion(suggestion.id)}
                        className="gap-1"
                      >
                        <X className="w-4 h-4" />
                        Descartar
                      </Button>
                    </div>
                  </>
                )}

                {suggestion.action_taken && suggestion.action_notes && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-medium mb-1">✓ Ação realizada</p>
                    <p className="text-sm">{suggestion.action_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AISuggestions;
