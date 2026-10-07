import {computed, ref} from "vue";

export const runsAllowed = ref(false);
export const RUNS_OFF = "Running commands from the phone is off. Do it on your computer.";
export const runsOff = computed(() => (runsAllowed.value ? "" : RUNS_OFF));
