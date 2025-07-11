'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ProductRow } from './ProductRow';
import type { Produto } from '@/types';
import { Loader2 } from 'lucide-react';

type ContagemItem = Produto & {
  quantidade: string;
  isCounted: boolean;
};

interface CategoryAccordionProps {
  categoryName: string;
  items: ContagemItem[];
  onQuantityChange: (itemName: string, newQuantity: string) => void;
  onSaveCategory: (categoryName: string) => void;
  isSaving: boolean;
}

export function CategoryAccordion({
  categoryName,
  items,
  onQuantityChange,
  onSaveCategory,
  isSaving,
}: CategoryAccordionProps) {
  const countedItems = items.filter((item) => item.isCounted).length;
  const totalItems = items.length;
  const hasUnsavedChanges = items.some(item => item.quantidade && !item.isCounted);

  return (
    <Accordion type="single" collapsible className="w-full border rounded-md">
      <AccordionItem value={categoryName} className="border-b-0">
        <AccordionTrigger className="p-4 hover:no-underline">
          <div className="flex justify-between w-full">
            <span className="font-bold text-lg">{categoryName}</span>
            <span className="text-sm text-muted-foreground">
              {countedItems} / {totalItems}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 pt-0">
          <div className="space-y-3">
            {items.map((item) => (
              <ProductRow
                key={item.nome}
                item={item}
                onQuantityChange={onQuantityChange}
                disabled={isSaving}
              />
            ))}
            {hasUnsavedChanges && (
              <div className="pt-4 flex justify-end">
                <Button onClick={() => onSaveCategory(categoryName)} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Categoria'
                  )}
                </Button>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
} 