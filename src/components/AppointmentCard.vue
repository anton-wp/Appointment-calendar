<template>
  <div
    :class="[
      'appointment-card text-sm z-20 overflow-hidden flex flex-col justify-center',
      { dragging: isDragging },
    ]"
    :style="{
      backgroundColor: masterColor + '20',
      borderLeft: `4px solid ${masterColor}`,
      height: heightSize,
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @click="$emit('edit', appointment)"
  >
    <!-- top: topPosition, -->
    <div
      class="font-semibold text-gray-800 whitespace-nowrap overflow-hidden ellipsis"
    >
      {{ appointment.clientName }}
    </div>
    <div
      class="text-gray-600 text-xs whitespace-nowrap overflow-hidden ellipsis"
    >
      {{ appointment.service }}
    </div>
    <div
      class="text-gray-500 text-xs whitespace-nowrap overflow-hidden ellipsis"
    >
      {{ appointment.startTime }} - {{ appointment.endTime }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  appointment: Object,
  masterColor: String,
});

const emit = defineEmits(["dragstart", "dragend", "edit"]);

const isDragging = ref(false);

// const topPosition = computed(() => {
//   const [hours, minutes] = props.appointment.startTime.split(":").map(Number);
//   const totalMinutes = hours * 60 + minutes - 9 * 60;
//   return `${totalMinutes}px`;
// });

const heightSize = computed(() => {
  const [startHours, startMinutes] = props.appointment.startTime
    .split(":")
    .map(Number);
  const [endHours, endMinutes] = props.appointment.endTime
    .split(":")
    .map(Number);
  const coefficient = 60;
  const duration =
    endHours * coefficient +
    endMinutes -
    (startHours * coefficient + startMinutes);
  return `${duration * 2}px`;
});

const handleDragStart = (e) => {
  isDragging.value = true;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("appointmentId", props.appointment.id.toString());
  emit("dragstart", props.appointment);
};

const handleDragEnd = () => {
  isDragging.value = false;
  emit("dragend");
};
</script>
