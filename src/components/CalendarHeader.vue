<template>
  <div class="bg-white shadow-md rounded-lg p-4 mb-4">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold text-gray-800">Appointment Calendar</h1>
        <select
          v-model="localSelectedSalonId"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="salon in salons" :key="salon.id" :value="salon.id">
            {{ salon.name }}
          </option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="emit('prev')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div class="text-lg font-semibold min-w-[200px] text-center">
          {{ displayText }}
        </div>
        <button
          @click="emit('next')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <button @click="emit('today')" class="btn-secondary ml-2">
          Today
        </button>
      </div>

      <div class="flex gap-2">
        <button
          v-for="mode in ['day', 'week', 'month']"
          :key="mode"
          @click="emit('view-change', mode)"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer',
            viewMode === mode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          {{ mode === "day" ? "Day" : mode === "week" ? "Week" : "Month" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  viewMode: String,
  currentDate: Date,
  salons: Array,
  selectedSalonId: Number,
  displayText: String,
});

const emit = defineEmits([
  "prev",
  "next",
  "today",
  "view-change",
  "update:selectedSalonId",
]);

const localSelectedSalonId = computed({
  get: () => props.selectedSalonId,
  set: (value) => emit("update:selectedSalonId", value),
});
</script>
