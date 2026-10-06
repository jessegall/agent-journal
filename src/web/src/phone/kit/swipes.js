import {ref} from "vue";

export const EDGE = 24;
export const START = 6;
export const ARMED_AT = 110;
export const OPEN_AT = 50;
export const LEAD_MOST = 240;
export const OVERSHOOT = 30;
export const ACTION_WIDTH = 84;

export const opened = ref(null);

export function closeOpened(except = null) {
    if (opened.value && opened.value !== except) opened.value.shut();
}
