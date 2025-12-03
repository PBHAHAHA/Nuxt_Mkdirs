<script setup lang="ts">
import { Search, RefreshCw } from 'lucide-vue-next';
import type { DateRange } from 'radix-vue';

interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  tags?: FilterOption[];
  categories?: FilterOption[];
  urlPrefix?: string;
  showDatePicker?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tags: () => [],
  categories: () => [],
  urlPrefix: '/',
  showDatePicker: true,
});

const route = useRoute();
const router = useRouter();

const searchQuery = ref((route.query.q as string) || '');
const selectedFilter = computed({
  get: () => (route.query.f as string) || '',
  set: (val: string) => handleFilterChange('f', val),
});
const selectedSort = computed({
  get: () => (route.query.sort as string) || '',
  set: (val: string) => handleFilterChange('sort', val),
});

const sortOptions: FilterOption[] = [
  { value: '', label: 'Default (featured, time dsc)' },
  { value: 'time-asc', label: 'Time (asc)' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
];

// Date range state - sync with URL
const selectedDateRange = ref<DateRange>();

// Format date to YYYY-MM-DD string
function formatDateToString(date: any): string {
  const d = date.toDate(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Watch date range changes and update URL
watch(selectedDateRange, (newRange) => {
  const newQuery = { ...route.query };
  
  if (newRange?.start && newRange?.end) {
    newQuery.dateFrom = formatDateToString(newRange.start);
    newQuery.dateTo = formatDateToString(newRange.end);
  } else {
    delete newQuery.dateFrom;
    delete newQuery.dateTo;
  }
  
  delete newQuery.page;
  router.push({ path: props.urlPrefix, query: newQuery });
}, { deep: true });

const filterOptions: FilterOption[] = [
  { value: '', label: 'All' },
  { value: 'featured', label: 'Featured' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

function handleSearch() {
  handleFilterChange('q', searchQuery.value);
}

function handleFilterChange(type: string, value: string) {
  const newQuery = { ...route.query };
  
  if (!value) {
    delete newQuery[type];
  } else {
    newQuery[type] = value;
  }
  
  delete newQuery.page;
  
  router.push({ path: props.urlPrefix, query: newQuery });
}

function handleReset() {
  searchQuery.value = '';
  selectedDateRange.value = undefined;
  router.push(props.urlPrefix);
}
</script>

<template>
  <div :class="[
    'grid grid-cols-1 gap-4 z-10 items-center',
    showDatePicker ? 'md:grid-cols-[1fr_0.6fr_0.8fr_0.6fr_auto]' : 'md:grid-cols-[1fr_0.6fr_0.8fr_auto]'
  ]">
    <!-- Search Input -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="w-full h-10 rounded-lg border border-input bg-background px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pr-10"
        @keydown.enter="handleSearch"
      />
      <Search class="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
    </div>

    <!-- Filter Select (Featured/Free/Paid) -->
    <UiComboBox
      :options="filterOptions"
      :model-value="selectedFilter"
      placeholder="Featured"
      @update:model-value="handleFilterChange('f', $event)"
      class="w-full rounded-lg shadow-none"
    />

    <!-- Sort Select (Default/Time/Name) -->
    <UiComboBox
      :options="sortOptions"
      :model-value="selectedSort"
      placeholder="Default (featured, time dsc)"
      @update:model-value="handleFilterChange('sort', $event)"
      class="w-full rounded-lg shadow-none"
    />

    <!-- Date Range Picker -->
    <UiDateRangePicker
      v-if="showDatePicker"
      v-model="selectedDateRange"
      placeholder="Select Date"
      class="w-full"
    />

    <!-- Reset Button -->
    <UiButton
      variant="outline"
      class="h-10 w-10 rounded-lg p-0 shadow-none"
      @click="handleReset"
    >
      <RefreshCw class="h-4 w-4" />
      <span class="sr-only">Reset</span>
    </UiButton>
  </div>
</template>
