<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="overflow-x-auto">
      <div class="min-w-[800px]">
        <div
          class="grid"
          :style="{
            gridTemplateColumns: `80px repeat(${masters.length}, 1fr)`,
          }"
        >
          <div class="sticky top-0 bg-gray-50 border-b border-r p-3">
            <div class="text-xs text-gray-500">Time</div>
          </div>
          <div
            v-for="master in masters"
            :key="master.id"
            class="sticky top-0 bg-gray-50 border-b border-r p-3 text-center"
          >
            <div class="font-semibold text-gray-800">{{ master.name }}</div>
          </div>

          <template v-for="time in timeSlots" :key="time">
            <div class="border-r border-t p-2 text-xs text-gray-500 bg-gray-50">
              {{ time }}
            </div>
            <div
              v-for="master in masters"
              :key="`${master.id}-${time}`"
              class="time-slot border-r relative"
              @dragover.prevent="handleDragOver"
              @drop="handleDrop($event, master.id, currentDate, time)"
              @dragleave="handleDragLeave"
            >
              <AppointmentCard
                v-for="apt in getAppointmentsForSlot(master.id, time)"
                :key="apt.id"
                :appointment="apt"
                :master-color="master.color"
                @edit="$emit('edit-appointment', apt)"
                @dragstart="$emit('drag-start', apt)"
                @dragend="$emit('drag-end')"
              />
            </div>
          </template>
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
  currentDate: Date,
});

const emit = defineEmits([
  "edit-appointment",
  "move-appointment",
  "drag-start",
  "drag-end",
]);

const getAppointmentsForSlot = (masterId, time) => {
  const dateStr = props.currentDate.toISOString().split("T")[0];
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
