<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="overflow-x-auto">
      <div class="min-w-[1200px]">
        <div class="grid grid-cols-8 border-b">
          <div class="p-3 bg-gray-50 border-r">
            <div class="text-xs text-gray-500">Time</div>
          </div>
          <button
            v-for="date in weekDates"
            :key="date.toISOString()"
            class="p-3 text-center bg-gray-50 border-r cursor-pointer"
            @click="$emit('open-day-view', date)"
          >
            <div class="text-sm font-semibold text-gray-800">
              {{ formatDayDisplay(date) }}
            </div>
          </button>
        </div>

        <div class="grid grid-cols-8">
          <div class="border-r">
            <div
              v-for="time in timeSlots"
              :key="time"
              class="time-slot p-2 text-xs text-gray-500 bg-gray-50"
            >
              {{ time }}
            </div>
          </div>

          <div
            v-for="date in weekDates"
            :key="date.toISOString()"
            class="border-r"
          >
            <div
              class="grid"
              :style="{ gridTemplateColumns: `repeat(${masters.length}, 1fr)` }"
            >
              <div v-for="master in masters" :key="master.id" class="border-r">
                <div
                  v-for="time in timeSlots"
                  :key="time"
                  class="time-slot relative"
                  @dragover.prevent="handleDragOver"
                  @drop="handleDrop($event, master.id, date, time)"
                  @dragleave="handleDragLeave"
                >
                  <AppointmentCard
                    v-for="apt in getAppointmentsForSlot(master.id, date, time)"
                    :key="apt.id"
                    :appointment="apt"
                    :master-color="master.color"
                    @edit="$emit('edit-appointment', apt)"
                    @dragstart="$emit('drag-start', apt)"
                    @dragend="$emit('drag-end')"
                  />
                </div>
              </div>
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
import AppointmentCard from "./AppointmentCard.vue";

const props = defineProps({
  masters: Array,
  appointments: Array,
  timeSlots: Array,
  weekDates: Array,
  formatDayDisplay: Function,
});

const emit = defineEmits([
  "open-day-view",
  "edit-appointment",
  "move-appointment",
  "drag-start",
  "drag-end",
]);

const getAppointmentsForSlot = (masterId, date, time) => {
  const dateStr = date.toISOString().split("T")[0];
  return props.appointments.filter((apt) => {
    return (
      apt.masterId === masterId &&
      apt.date === dateStr &&
      apt.startTime === time
    );
  });
};

const handleDragOver = (e) => {
  e.currentTarget.classList.add("drag-over");
};

const handleDragLeave = (e) => {
  e.currentTarget.classList.remove("drag-over");
};

const handleDrop = (e, masterId, date, time) => {
  e.currentTarget.classList.remove("drag-over");
  const appointmentId = parseInt(e.dataTransfer.getData("appointmentId"));
  const dateStr = date.toISOString().split("T")[0];

  emit("move-appointment", {
    appointmentId,
    masterId,
    date: dateStr,
    startTime: time,
  });
};
</script>
