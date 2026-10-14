import {computed} from "vue";
import {rows} from "../sync/rows.js";

const now = () => Date.now() / 1000;

export const connectedPhones = computed(() =>
    rows("phone").filter((phone) => phone.data.key && !phone.completed && !phone.deleted && phone.data.expires > now())
);

export const phoneTime = (seconds) =>
    new Date(seconds * 1000).toLocaleString(undefined, {day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"});
