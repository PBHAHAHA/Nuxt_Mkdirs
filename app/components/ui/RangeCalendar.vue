<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
} from 'radix-vue';
import type { DateRange } from 'radix-vue';
import { cn } from '~/utils';

interface Props {
  modelValue?: DateRange;
  numberOfMonths?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  numberOfMonths: 2,
});

const emit = defineEmits<{
  'update:modelValue': [value: DateRange];
}>();

const value = computed({
  get: () => props.modelValue,
  set: (val) => val && emit('update:modelValue', val),
});
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ weekDays, grid }"
    v-model="value"
    :number-of-months="numberOfMonths"
    :class="cn('p-3', props.class)"
    weekday-format="short"
  >
    <RangeCalendarHeader class="flex items-center justify-between">
      <RangeCalendarPrev
        :class="cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium',
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          'hover:bg-accent hover:text-accent-foreground',
          'disabled:pointer-events-none'
        )"
      >
        <ChevronLeft class="h-4 w-4" />
      </RangeCalendarPrev>

      <RangeCalendarHeading class="flex items-center justify-center gap-12">
        <template v-for="(month, index) in grid" :key="index">
          <div class="text-sm font-medium">
            {{ month.value.toDate(Intl.DateTimeFormat().resolvedOptions().timeZone).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}
          </div>
        </template>
      </RangeCalendarHeading>

      <RangeCalendarNext
        :class="cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium',
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          'hover:bg-accent hover:text-accent-foreground',
          'disabled:pointer-events-none'
        )"
      >
        <ChevronRight class="h-4 w-4" />
      </RangeCalendarNext>
    </RangeCalendarHeader>

    <div class="flex gap-4 mt-4">
      <RangeCalendarGrid v-for="(month, index) in grid" :key="index" class="w-full border-collapse space-y-1">
        <RangeCalendarGridHead>
          <RangeCalendarGridRow class="flex">
            <RangeCalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground"
            >
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow
            v-for="(weekDates, weekIndex) in month.rows"
            :key="`week-${weekIndex}`"
            class="flex mt-2"
          >
            <RangeCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              :class="cn(
                'relative h-8 w-8 p-0 text-center text-sm focus-within:relative focus-within:z-20',
                '[&:has([data-selected])]:bg-muted',
                '[&:has([data-selection-start])]:rounded-l-full',
                '[&:has([data-selection-end])]:rounded-r-full'
              )"
            >
              <RangeCalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                :class="cn(
                  'inline-flex h-8 w-8 items-center justify-center p-0 text-sm font-normal',
                  'rounded-full',
                  'hover:bg-muted hover:text-foreground',
                  'focus:outline-none',
                  'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
                  'data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50',
                  'data-[selected]:bg-transparent data-[selected]:text-foreground',
                  'data-[selection-start]:bg-foreground data-[selection-start]:text-background data-[selection-start]:rounded-full',
                  'data-[selection-end]:bg-foreground data-[selection-end]:text-background data-[selection-end]:rounded-full',
                  'data-[highlighted]:bg-transparent',
                  'data-[today]:text-primary data-[today]:font-semibold'
                )"
              />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>
