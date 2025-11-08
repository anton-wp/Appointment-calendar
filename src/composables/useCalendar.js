import { ref, computed } from "vue";

export function useCalendar() {
  const viewMode = ref("week");
  const currentDate = ref(new Date());

  const workingHours = { start: 9, end: 21 };

  const timeSlots = computed(() => {
    const slots = [];
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  });

  const getWeekDates = (date) => {
    const week = [];
    const current = new Date(date);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);

    current.setDate(diff);

    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return week;
  };

  const getMonthDates = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const dates = [];
    const startDay = firstDay.getDay();
    const adjustedStart = startDay === 0 ? 6 : startDay - 1;

    const prevMonthLastDay = new Date(year, month, 0);
    for (let i = adjustedStart - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay.getDate() - i);
      dates.push({ date, isCurrentMonth: false });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      dates.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    const remainingDays = 42 - dates.length;
    for (let day = 1; day <= remainingDays; day++) {
      dates.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    return dates;
  };

  const weekDates = computed(() => getWeekDates(currentDate.value));
  const monthDates = computed(() => getMonthDates(currentDate.value));

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDateDisplay = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatDayDisplay = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const nextPeriod = () => {
    const date = new Date(currentDate.value);
    if (viewMode.value === "day") {
      date.setDate(date.getDate() + 1);
    } else if (viewMode.value === "week") {
      date.setDate(date.getDate() + 7);
    } else if (viewMode.value === "month") {
      date.setMonth(date.getMonth() + 1);
    }
    currentDate.value = date;
  };

  const prevPeriod = () => {
    const date = new Date(currentDate.value);
    if (viewMode.value === "day") {
      date.setDate(date.getDate() - 1);
    } else if (viewMode.value === "week") {
      date.setDate(date.getDate() - 7);
    } else if (viewMode.value === "month") {
      date.setMonth(date.getMonth() - 1);
    }
    currentDate.value = date;
  };

  const goToToday = () => {
    currentDate.value = new Date();
  };

  return {
    viewMode,
    currentDate,
    timeSlots,
    weekDates,
    monthDates,
    workingHours,
    formatDate,
    formatDateDisplay,
    formatDayDisplay,
    nextPeriod,
    prevPeriod,
    goToToday,
  };
}
