import {computed, ref} from "vue";

export const runsAllowed = ref(false);
export const RUNS_OFF = "This phone or browser cannot ask for Face ID or a passcode, so commands run only on your computer.";
export const runsOff = computed(() => (runsAllowed.value ? "" : RUNS_OFF));
