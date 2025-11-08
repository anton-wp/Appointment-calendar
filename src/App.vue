<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <CalendarHeader
      :view-mode="viewMode"
      :current-date="currentDate"
      :salons="salons"
      :selected-salon-id="selectedSalonId"
      :display-text="displayText"
      @prev="prevPeriod"
      @next="nextPeriod"
      @today="goToToday"
      @view-change="viewMode = $event"
      @update:selected-salon-id="selectedSalonId = $event"
    />

    <div class="mb-4 flex justify-end">
      <button @click="openAddModal" class="btn-primary">
        + Add Appointment
      </button>
    </div>

    <DayView
      v-if="viewMode === 'day'"
      :masters="selectedSalon?.masters || []"
      :appointments="currentAppointments"
      :time-slots="timeSlots"
      :current-date="currentDate"
      @edit-appointment="openEditModal"
      @move-appointment="moveAppointment"
    />

    <WeekView
      v-else-if="viewMode === 'week'"
      :masters="selectedSalon?.masters || []"
      :appointments="currentAppointments"
      :time-slots="timeSlots"
      :week-dates="weekDates"
      :format-day-display="formatDayDisplay"
      @open-day-view="openDayView"
      @edit-appointment="openEditModal"
      @move-appointment="moveAppointment"
    />

    <MonthView
      v-else
      :masters="selectedSalon?.masters || []"
      :appointments="currentAppointments"
      :month-dates="monthDates"
      @open-day-view="openDayView"
      @edit-appointment="openEditModal"
      @move-appointment="moveAppointment"
    />

    <AppointmentModal
      :is-open="isModalOpen"
      :appointment="editingAppointment"
      :masters="selectedSalon?.masters || []"
      :salon-id="selectedSalonId"
      @close="closeModal"
      @save="saveAppointment"
      @delete="deleteAppointment"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSalonData } from "./composables/useSalonData";
import { useCalendar } from "./composables/useCalendar";
import CalendarHeader from "./components/CalendarHeader.vue";
import DayView from "./components/DayView.vue";
import WeekView from "./components/WeekView.vue";
import MonthView from "./components/MonthView.vue";
import AppointmentModal from "./components/AppointmentModal.vue";
import { ref } from "vue";

const {
  salons,
  appointments,
  selectedSalonId,
  selectedSalon,
  getSalonAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment: removeAppointment,
} = useSalonData();

const {
  viewMode,
  currentDate,
  timeSlots,
  weekDates,
  monthDates,
  formatDate,
  formatDateDisplay,
  formatDayDisplay,
  nextPeriod,
  prevPeriod,
  goToToday,
} = useCalendar();

const isModalOpen = ref(false);
const editingAppointment = ref(null);

const openDayView = (date) => {
  currentDate.value = date;
  viewMode.value = "day";
};

const currentAppointments = computed(() => {
  if (viewMode.value === "day") {
    return getSalonAppointments(
      selectedSalonId.value,
      formatDate(currentDate.value)
    );
  } else if (viewMode.value === "week") {
    return appointments.value.filter((apt) => {
      if (apt.salonId !== selectedSalonId.value) return false;
      const aptDate = new Date(apt.date);
      return weekDates.value.some((d) => formatDate(d) === formatDate(aptDate));
    });
  } else {
    return appointments.value.filter((apt) => {
      if (apt.salonId !== selectedSalonId.value) return false;
      const aptDate = new Date(apt.date);
      return (
        aptDate.getMonth() === currentDate.value.getMonth() &&
        aptDate.getFullYear() === currentDate.value.getFullYear()
      );
    });
  }
});

const displayText = computed(() => {
  if (viewMode.value === "day") {
    return formatDateDisplay(currentDate.value);
  } else if (viewMode.value === "week") {
    const start = weekDates.value[0];
    const end = weekDates.value[6];
    return `${start.getDate()} ${start.toLocaleString("en-US", {
      month: "short",
    })} - ${end.getDate()} ${end.toLocaleString("en-US", {
      month: "short",
    })} ${end.getFullYear()}`;
  } else {
    return currentDate.value.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  }
});

const openAddModal = () => {
  editingAppointment.value = null;
  isModalOpen.value = true;
};

const openEditModal = (appointment) => {
  editingAppointment.value = appointment;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingAppointment.value = null;
};

const saveAppointment = (appointmentData) => {
  if (appointmentData.id) {
    updateAppointment(appointmentData.id, appointmentData);
  } else {
    addAppointment(appointmentData);
  }
  closeModal();
};

const deleteAppointment = (id) => {
  removeAppointment(id);
  closeModal();
};

const moveAppointment = ({ appointmentId, masterId, date, startTime }) => {
  const appointment = appointments.value.find((a) => a.id === appointmentId);
  if (!appointment) return;

  const updates = {
    masterId,
    date,
    salonId: selectedSalonId.value,
  };

  if (startTime) {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [oldStartHours, oldStartMinutes] = appointment.startTime
      .split(":")
      .map(Number);
    const [oldEndHours, oldEndMinutes] = appointment.endTime
      .split(":")
      .map(Number);

    const duration =
      oldEndHours * 60 + oldEndMinutes - (oldStartHours * 60 + oldStartMinutes);
    const newEndMinutes = startHours * 60 + startMinutes + duration;
    const endHours = Math.floor(newEndMinutes / 60);
    const endMinutes = newEndMinutes % 60;

    updates.startTime = startTime;
    updates.endTime = `${endHours
      .toString()
      .padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
  }

  updateAppointment(appointmentId, updates);
};
</script>
