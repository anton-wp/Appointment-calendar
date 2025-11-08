<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="grid grid-cols-7 border-b">
      <div
        v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
        :key="day"
        class="p-3 text-center font-semibold text-gray-700 bg-gray-50 border-r last:border-r-0"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7">
      <div
        v-for="(dateObj, index) in monthDates"
        :key="index"
        :class="[
          'min-h-[120px] p-2 border-r border-b relative',
          !dateObj.isCurrentMonth && 'bg-gray-50',
          index % 7 === 6 && 'border-r-0',
        ]"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop($event, dateObj.date)"
        @dragleave="handleDragLeave"
      >
        <button
          class="cursor-pointer"
          :class="[
            'text-sm font-semibold mb-1',
            !dateObj.isCurrentMonth && 'text-gray-400',
          ]"
          @click="$emit('open-day-view', dateObj.date)"
        >
          {{ dateObj.date.getDate() }}
        </button>

        <div class="space-y-1 overflow-y-auto max-h-[90px]">
          <div
            v-for="apt in getDayAppointments(dateObj.date)"
            :key="apt.id"
            :style="{
              backgroundColor: getMasterColor(apt.masterId) + '40',
              borderLeft: `3px solid ${getMasterColor(apt.masterId)}`,
            }"
            class="p-1 rounded text-xs cursor-pointer hover:shadow-md transition-shadow"
            draggable="true"
            @dragstart="handleDragStart($event, apt)"
            @click="$emit('edit-appointment', apt)"
          >
            <div class="font-semibold truncate">{{ apt.clientName }}</div>
            <div class="text-gray-600 text-[10px]">
              {{ apt.startTime }} {{ getMasterName(apt.masterId) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t p-3 bg-gray-50">
      <div class="flex gap-4 justify-center flex-wrap">
        <div
          v-for="master in masters"
          :key="master.id"
          class="flex items-center gap-2"
        >
          <div
            class="w-4 h-4 rounded"
            :style="{ backgroundColor: master.color }"
          ></div>
          <span class="text-sm text-gray-700">{{ master.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  masters: Array,
  appointments: Array,
  monthDates: Array,
});

const emit = defineEmits([
  "open-day-view",
  "edit-appointment",
  "move-appointment",
  "drag-start",
  "drag-end",
]);

const getDayAppointments = (date) => {
  const dateStr = date.toISOString().split("T")[0];
  return props.appointments
    .filter((apt) => apt.date === dateStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
};

const getMasterColor = (masterId) => {
  return props.masters.find((m) => m.id === masterId)?.color || "#999";
};

const getMasterName = (masterId) => {
  return props.masters.find((m) => m.id === masterId)?.name || "";
};

const handleDragOver = (e) => {
  e.currentTarget.classList.add("drag-over");
};

const handleDragLeave = (e) => {
  e.currentTarget.classList.remove("drag-over");
};

const handleDragStart = (e, apt) => {
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("appointmentId", apt.id.toString());
  emit("drag-start", apt);
};

const handleDrop = (e, date) => {
  e.currentTarget.classList.remove("drag-over");
  const appointmentId = parseInt(e.dataTransfer.getData("appointmentId"));
  const dateStr = date.toISOString().split("T")[0];

  emit("move-appointment", {
    appointmentId,
    date: dateStr,
  });
  emit("drag-end");
};
</script>
