import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { toZonedTime } from 'date-fns-tz';
import { startOfDay, addDays, subDays, subMonths, subYears } from 'date-fns';

type FilterOption = 'today' | 'yesterday' | '7days' | 'month' | 'year' | 'all';

interface DateFilterProps {
  value: FilterOption;
  onChange: (value: FilterOption) => void;
}

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: 'today', label: 'Hoje' },
  { value: 'yesterday', label: 'Ontem' },
  { value: '7days', label: '7 dias' },
  { value: 'month', label: 'Mês' },
  { value: 'year', label: 'Ano' },
  { value: 'all', label: 'Todo Período' },
];

const BRASILIA_TZ = 'America/Sao_Paulo';

export const getDateRange = (filter: FilterOption): { start: Date; end: Date } => {
  // Get current time in Brasília timezone
  const nowInBrasilia = toZonedTime(new Date(), BRASILIA_TZ);
  const todayStart = startOfDay(nowInBrasilia);
  const tomorrow = addDays(todayStart, 1);
  
  switch (filter) {
    case 'today':
      return { start: todayStart, end: tomorrow };
    case 'yesterday':
      const yesterday = subDays(todayStart, 1);
      return { start: yesterday, end: todayStart };
    case '7days':
      const sevenDaysAgo = subDays(todayStart, 7);
      return { start: sevenDaysAgo, end: tomorrow };
    case 'month':
      const monthAgo = subMonths(todayStart, 1);
      return { start: monthAgo, end: tomorrow };
    case 'year':
      const yearAgo = subYears(todayStart, 1);
      return { start: yearAgo, end: tomorrow };
    case 'all':
    default:
      const allTime = new Date('2020-01-01T00:00:00-03:00');
      return { start: allTime, end: tomorrow };
  }
};

const DateFilter = ({ value, onChange }: DateFilterProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span>Filtrar por:</span>
      </div>
      <div className="flex gap-1 flex-wrap">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(option.value)}
            className="text-xs h-8"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export type { FilterOption };
export default DateFilter;
