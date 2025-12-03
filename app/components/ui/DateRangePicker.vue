<script setup lang="ts">
import { Calendar, RefreshCcw } from 'lucide-vue-next';
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
} from 'radix-vue';
import type { DateRange } from 'radix-vue';
import { cn } from '~/utils';

interface Props {
  modelValue?: DateRange;
  placeholder?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select Date',
});

const emit = defineEmits<{
  'update:modelValue': [value: DateRange | undefined];
}>();

const isOpen = ref(false);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const displayValue = computed(() => {
  if (!value.value?.start) return props.placeholder;
  
  const formatDate = (date: any) => {
    const d = date.toDate(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  if (value.value.end) {
    return `${formatDate(value.value.start)} - ${formatDate(value.value.end)}`;
  }
  return formatDate(value.value.start);
});

function handleClear() {
  emit('update:modelValue', undefined);
}
</script>

<template>
  <PopoverRoot v-model:open="isOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        :class="cn(
          'flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:outline-none focus:ring-1 focus:ring-ring',
          props.class
        )"
      >
        <span :class="cn(!value?.start && 'text-muted-foreground')">
          {{ displayValue }}
        </span>
        <Calendar class="h-4 w-4 opacity-50" />
      </button>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        :side-offset="4"
        align="start"
        :class="cn(
          'z-50 rounded-md border bg-popover p-0 text-popover-foreground shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
        )"
      >
        <div class="flex items-center justify-between border-b px-3 py-2">
          <span class="text-sm font-medium">{{ displayValue }}</span>
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
            @click="handleClear"
          >
            <RefreshCcw class="h-4 w-4 opacity-50" />
          </button>
        </div>
        <UiRangeCalendar v-model="value" :number-of-months="2" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
