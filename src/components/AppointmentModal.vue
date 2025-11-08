<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="close"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ appointment?.id ? "Edit Appointment" : "New Appointment" }}
        </h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Master
          </label>
          <select
            v-model="form.masterId"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option
              v-for="master in masters"
              :key="master.id"
              :value="master.id"
            >
              {{ master.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Client Name
          </label>
          <input
            v-model="form.clientName"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ivan Petrov"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Service
          </label>
          <input
            v-model="form.service"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Haircut"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            v-model="form.phone"
            type="tel"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            v-model="form.date"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Start
            </label>
            <input
              v-model="form.startTime"
              type="time"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              End
            </label>
            <input
              v-model="form.endTime"
              type="time"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button type="submit" class="btn-primary flex-1">
            Save
          </button>
          <button
            v-if="appointment?.id"
            type="button"
            @click="deleteAppointment"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Remove
          </button>
          <button type="button" @click="close" class="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  isOpen: Boolean,
  appointment: Object,
  masters: Array,
  salonId: Number,
});

const emit = defineEmits(["close", "save", "delete"]);

const form = ref({
  masterId: null,
  clientName: "",
  service: "",
  phone: "",
  date: new Date().toISOString().split("T")[0],
  startTime: "10:00",
  endTime: "11:00",
});

watch(
  () => props.appointment,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    } else {
      form.value = {
        masterId: props.masters?.[0]?.id || null,
        clientName: "",
        service: "",
        phone: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "10:00",
        endTime: "11:00",
      };
    }
  },
  { immediate: true }
);

const save = () => {
  emit("save", { ...form.value, salonId: props.salonId });
};

const deleteAppointment = () => {
  if (confirm("Вы уверены, что хотите удалить эту запись?")) {
    emit("delete", props.appointment.id);
  }
};

const close = () => {
  emit("close");
};
</script>
