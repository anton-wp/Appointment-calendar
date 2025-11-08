import { ref, computed } from "vue";

export function useSalonData() {
  const salons = ref([
    {
      id: 1,
      name: "Elegant",
      masters: [
        { id: 1, name: "Anna Ivanova", color: "#FF6B6B" },
        { id: 2, name: "Maria Sidorova", color: "#4ECDC4" },
        { id: 3, name: "Elena Petrova", color: "#95E1D3" },
      ],
    },
    {
      id: 2,
      name: "Style",
      masters: [
        { id: 4, name: "Olga Volkova", color: "#FFD93D" },
        { id: 5, name: "Tatyana Smirnova", color: "#6BCB77" },
      ],
    },
    {
      id: 3,
      name: "Beauty",
      masters: [
        { id: 6, name: "Natalia Kozlova", color: "#C77DFF" },
        { id: 7, name: "Svetlana Morozova", color: "#FF6B9D" },
        { id: 8, name: "Irina Novikova", color: "#FFA07A" },
        { id: 9, name: "Victoria Pavlova", color: "#87CEEB" },
      ],
    },
  ]);

  const selectedSalonId = ref(1);
  const selectedSalon = computed(() =>
    salons.value.find((s) => s.id === selectedSalonId.value)
  );

  const getSalonAppointments = (salonId, date) => {
    return appointments.value.filter(
      (apt) => apt.salonId === salonId && apt.date === date
    );
  };

  const addAppointment = (appointment) => {
    const newId = Math.max(...appointments.value.map((a) => a.id), 0) + 1;
    appointments.value.push({ ...appointment, id: newId });
  };

  const updateAppointment = (id, updates) => {
    const index = appointments.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      appointments.value[index] = { ...appointments.value[index], ...updates };
    }
  };

  const deleteAppointment = (id) => {
    appointments.value = appointments.value.filter((a) => a.id !== id);
  };

  const masters = [1, 2, 3];
  const services = [
    "Haircut",
    "Hair Coloring",
    "Beard Trim",
    "Manicure",
    "Hair Styling",
    "Pedicure",
    "Facial",
  ];
  const clients = [
    "Alex Smith",
    "Emily Johnson",
    "Michael Brown",
    "Sarah Davis",
    "James Wilson",
    "Olivia Martinez",
    "Daniel Anderson",
    "Sophia Thomas",
    "Liam Jackson",
    "Emma White",
    "Noah Harris",
    "Ava Martin",
    "Lucas Thompson",
    "Mia Garcia",
    "Ethan Robinson",
    "Isabella Clark",
    "Mason Lewis",
    "Charlotte Lee",
    "Logan Walker",
    "Amelia Hall",
  ];

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Adds minutes to a given time string "HH:MM"
  function addMinutes(time, minsToAdd) {
    const [h, m] = time.split(":").map(Number);
    const totalMins = h * 60 + m + minsToAdd;
    const newH = Math.floor(totalMins / 60);
    const newM = totalMins % 60;
    return `${newH.toString().padStart(2, "0")}:${newM
      .toString()
      .padStart(2, "0")}`;
  }

  // Round minutes to the nearest 30
  function roundTo30(min) {
    return min % 30 === 0 ? min : min + (30 - (min % 30));
  }

  // Generate appointments for a single day
  function generateAppointmentsForDay(date, startId) {
    const result = [];
    const masterSchedules = {};

    // Initialize each master's schedule starting at 09:00
    masters.forEach((masterId) => {
      masterSchedules[masterId] = "09:00";
    });

    for (let i = 0; i < 40; i++) {
      // Randomly pick a master
      const masterId = masters[randomInt(0, masters.length - 1)];
      let startTime = masterSchedules[masterId];

      // Skip if the master has finished work for the day
      const [hour, minute] = startTime.split(":").map(Number);
      if (hour >= 20 && minute > 0) continue;

      // Duration is multiple of 30 minutes (30, 60, 90)
      let duration = 30 * randomInt(1, 3);

      // Ensure it does not exceed working hours
      const endTimeCandidate = addMinutes(startTime, duration);
      const [endHour, endMinute] = endTimeCandidate.split(":").map(Number);
      if (endHour > 20 || (endHour === 20 && endMinute > 30)) {
        duration = 20 * 60 + 30 - (hour * 60 + minute);
        duration = Math.floor(duration / 30) * 30; // round down to nearest 30
        if (duration <= 0) continue; // skip if no time left
      }
      const endTime = addMinutes(startTime, duration);

      // Push appointment object
      result.push({
        id: startId++,
        salonId: salons.value[0].id,
        masterId,
        clientName: clients[randomInt(0, clients.length - 1)],
        service: services[randomInt(0, services.length - 1)],
        phone: `+1 (555) ${randomInt(100, 999)}-${randomInt(
          10,
          99
        )}-${randomInt(10, 99)}`,
        date: date.toISOString().split("T")[0],
        startTime,
        endTime,
      });

      // Update master's next available start time
      masterSchedules[masterId] = endTime;
    }

    return result;
  }

  function generateAppointments() {
    const appointments = [];
    let idCounter = 1;
    const today = new Date();

    // Generate appointments for 8 days before, today, and 8 days after
    for (let offset = -8; offset <= 8; offset++) {
      const day = new Date(today);
      day.setDate(today.getDate() + offset);
      const dayAppointments = generateAppointmentsForDay(day, idCounter);
      appointments.push(...dayAppointments);
      idCounter += dayAppointments.length;
    }

    return appointments;
  }

  const appointments = ref(generateAppointments());

  return {
    salons,
    appointments,
    selectedSalonId,
    selectedSalon,
    getSalonAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  };
}
