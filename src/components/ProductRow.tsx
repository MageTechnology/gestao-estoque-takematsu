'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Produto } from '@/types';

type ContagemItem = Produto & {
  quantidade: string;
  isCounted: boolean;
};

interface ProductRowProps {
  item: ContagemItem;
  onQuantityChange: (itemName: string, newQuantity: string) => void;
  disabled?: boolean;
}

export function ProductRow({ item, onQuantityChange, disabled }: ProductRowProps) {
  return (
    <div className={cn(
        "flex flex-col sm:flex-row items-center gap-2 p-2 rounded-md transition-colors",
        item.isCounted ? 'bg-green-100' : 'bg-transparent'
    )}>
      <div className="flex-1 text-sm font-medium w-full">{item.nome}</div>
      <div className="text-xs text-muted-foreground w-full sm:w-auto">{item.unidade}</div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Input
          type="number"
          placeholder="0.00"
          className="w-full sm:w-24 text-center"
          value={item.quantidade}
          onChange={(e) => onQuantityChange(item.nome, e.target.value)}
          disabled={disabled || item.isCounted}
        />
      </div>
    </div>
  );
} 