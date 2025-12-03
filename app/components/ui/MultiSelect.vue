<script setup lang="ts">
import { Check, ChevronDown, X, Search } from 'lucide-vue-next';
import { cn } from '~/utils';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  modelValue?: string[];
  placeholder?: string;
  maxCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: 'Select...',
  maxCount: 3,
});

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const isOpen = ref(false);
const searchQuery = ref('');
const triggerRef = ref<HTMLElement | null>(null);

const selectedValues = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const query = searchQuery.value.toLowerCase();
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(query)
  );
});

const selectedLabels = computed(() => {
  return props.options
    .filter(opt => selectedValues.value.includes(opt.value))
    .map(opt => opt.label);
});

function toggleOption(value: string) {
  const current = [...selectedValues.value];
  const index = current.indexOf(value);
  
  if (index === -1) {
    current.push(value);
  } else {
    current.splice(index, 1);
  }
  
  selectedValues.value = current;
}

function removeOption(value: string) {
  selectedValues.value = selectedValues.value.filter(v => v !== value);
}

function selectAll() {
  if (selectedValues.value.length === props.options.length) {
    selectedValues.value = [];
  } else {
    selectedValues.value = props.options.map(opt => opt.value);
  }
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
        'ring-offset-background placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-1 focus:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50'
      )"
      @click="isOpen = !isOpen"
    >
      <div class="flex flex-wrap gap-1 flex-1 text-left">
        <template v-if="selectedValues.length === 0">
          <span class="text-muted-foreground">{{ placeholder }}</span>
        </template>
        <template v-else-if="selectedValues.length <= maxCount">
          <span
            v-for="label in selectedLabels"
            :key="label"
            class="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-xs"
          >
            {{ label }}
            <X
              class="h-3 w-3 cursor-pointer hover:text-destructive"
              @click.stop="removeOption(options.find(o => o.label === label)?.value || '')"
            />
          </span>
        </template>
        <template v-else>
          <span class="text-sm">{{ selectedValues.length }} selected</span>
        </template>
      </div>
      <ChevronDown :class="cn('h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')" />
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md"
    >
      <!-- Search -->
      <div class="flex items-center border-b px-3">
        <Search class="h-4 w-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="flex h-9 w-full bg-transparent py-2 px-2 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <!-- Select All -->
      <div
        class="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent border-b"
        @click="selectAll"
      >
        <div
          :class="cn(
            'h-4 w-4 rounded border flex items-center justify-center',
            selectedValues.length === options.length
              ? 'bg-primary border-primary'
              : 'border-input'
          )"
        >
          <Check v-if="selectedValues.length === options.length" class="h-3 w-3 text-primary-foreground" />
        </div>
        <span class="text-sm font-medium">Select All</span>
      </div>

      <!-- Options List -->
      <div class="max-h-[200px] overflow-y-auto">
        <div
          v-for="option in filteredOptions"
          :key="option.value"
          class="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent"
          @click="toggleOption(option.value)"
        >
          <div
            :class="cn(
              'h-4 w-4 rounded border flex items-center justify-center',
              selectedValues.includes(option.value)
                ? 'bg-primary border-primary'
                : 'border-input'
            )"
          >
            <Check v-if="selectedValues.includes(option.value)" class="h-3 w-3 text-primary-foreground" />
          </div>
          <span class="text-sm">{{ option.label }}</span>
        </div>

        <div v-if="filteredOptions.length === 0" class="px-3 py-2 text-sm text-muted-foreground">
          No results found
        </div>
      </div>
    </div>
  </div>
</template>
