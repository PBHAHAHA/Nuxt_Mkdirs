<script setup lang="ts">
import { Check, ChevronDown } from 'lucide-vue-next';
import { cn } from '~/utils';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  modelValue?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Select...',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);

const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const selectedLabel = computed(() => {
  const option = props.options.find(opt => opt.value === selectedValue.value);
  return option?.label || props.placeholder;
});

function selectOption(value: string) {
  selectedValue.value = value;
  isOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (triggerRef.value && !triggerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="triggerRef" class="relative">
    <!-- Trigger Button -->
    <button
      type="button"
      :class="cn(
        'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
        'ring-offset-background',
        'focus:outline-none focus:ring-1 focus:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50'
      )"
      @click="isOpen = !isOpen"
    >
      <span :class="cn(!selectedValue && 'text-muted-foreground')">
        {{ selectedLabel }}
      </span>
      <ChevronDown :class="cn('h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')" />
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground"
    >
      <div class="max-h-[200px] overflow-y-auto py-1">
        <div
          v-for="option in options"
          :key="option.value"
          :class="cn(
            'flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent',
            selectedValue === option.value && 'bg-accent'
          )"
          @click="selectOption(option.value)"
        >
          <span class="text-sm">{{ option.label }}</span>
          <Check v-if="selectedValue === option.value" class="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  </div>
</template>
