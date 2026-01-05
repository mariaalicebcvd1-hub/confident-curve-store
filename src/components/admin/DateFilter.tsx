import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

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

export const getDateRange = (filter: FilterOption): { start: Date; end: Date } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  switch (filter) {
    case 'today':
      return { start: today, end: tomorrow };
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: yesterday, end: today };
    case '7days':
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return { start: sevenDaysAgo, end: tomorrow };
    case 'month':
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return { start: monthAgo, end: tomorrow };
    case 'year':
      const yearAgo = new Date(today);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return { start: yearAgo, end: tomorrow };
    case 'all':
    default:
      const allTime = new Date('2020-01-01');
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
