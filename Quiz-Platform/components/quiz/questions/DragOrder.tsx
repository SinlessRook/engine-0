'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/lib/types';
import { GripVertical } from 'lucide-react';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

interface DragOrderProps {
  question: Question;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

interface NormalizedOrderItem {
  id: string; // Animation token identifier for @dnd-kit
  text: string; // The pure human-readable text string
}

function SortableItem({ id, text }: { id: string; text: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border border-border/70 rounded-xl p-4 flex items-center gap-3 select-none transition-all duration-200 ${
        isDragging ? 'shadow-xl border-primary/40 bg-accent/30 scale-[1.02]' : 'hover:border-border-hover'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="p-1.5 hover:bg-secondary/80 rounded-md cursor-grab active:cursor-grabbing flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <span className="text-sm font-medium leading-relaxed text-foreground flex-1 whitespace-normal break-words">
        {text}
      </span>
    </div>
  );
}

export function DragOrder({ question, value, onChange }: DragOrderProps) {
  const [items, setItems] = useState<NormalizedOrderItem[]>([]);

  // Robust extractor identifying either schema variation cleanly
  const rawOrderSource = question.items_to_order || (question as any).orderItems || [];

  useEffect(() => {
    // Transform incoming questions cleanly to structured item descriptors
    const normalizedList: NormalizedOrderItem[] = rawOrderSource.map((item: any, idx: number) => {
      if (typeof item === 'string') {
        return { id: `seq-item-${idx}`, text: item };
      }
      return { id: item.id || `seq-item-${idx}`, text: item.text || String(item) };
    });

    if (!value) {
      // Pre-seed default tracking baseline up to your evaluation engine state hook
      setItems(normalizedList);
      onChange(normalizedList.map(item => item.text));
    } else {
      // Re-order our state to match where the user left off if value changes externally
      const mappedValueOrder = value
        .map((textStr) => normalizedList.find((norm) => norm.text === textStr))
        .filter((item): item is NormalizedOrderItem => Boolean(item));

      // Fallback fallback verification step if client arrays out of sync
      if (mappedValueOrder.length === normalizedList.length) {
        setItems(mappedValueOrder);
      } else {
        setItems(normalizedList);
      }
    }
  }, [question, value]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 6,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reorderedItems = Array.from(items);
      const [movedItem] = reorderedItems.splice(oldIndex, 1);
      reorderedItems.splice(newIndex, 0, movedItem);

      setItems(reorderedItems);
      
      // 🔥 CRITICAL FIX: Push up the rearranged pure text array items, NOT internal layout keys!
      onChange(reorderedItems.map((item) => item.text));
    }
  };

  if (rawOrderSource.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2.5 w-full">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} text={item.text} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}